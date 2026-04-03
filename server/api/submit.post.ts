import { randomUUID } from "node:crypto";
import { PostCategoryEnum } from "../database/Enum";

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;
const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
const VALID_CATEGORIES = new Set(Object.values(PostCategoryEnum));
const YOUTUBE_URL_RE =
  /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|(?:m\.|music\.)?youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^\s#&]+&)*v=|shorts\/|embed\/|live\/|v\/))([A-Za-z0-9_-]{11})(?:[^\s]*)?/i;

type MultipartPart = {
  name?: string;
  filename?: string;
  type?: string;
  data: Buffer;
};

function isAllowedMediaType(type?: string) {
  return (
    !!type &&
    (type.startsWith("image/") ||
      type.startsWith("video/") ||
      type.startsWith("audio/"))
  );
}

function isAllowed(file?: { type?: string }) {
  return isAllowedMediaType(file?.type);
}

function normalizeSubmittedUrl(raw?: string | null): string | null {
  const value = (raw || "").trim();
  if (!value) return null;
  if (value.startsWith("/")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^www\./i.test(value)) return `https://${value}`;
  return null;
}

function normalizeExtension(raw?: string) {
  const ext = (raw || "")
    .trim()
    .toLowerCase()
    .replace(/^\./, "")
    .replace(/[^a-z0-9]/g, "");
  return ext || null;
}

function extensionFromFilename(filename?: string) {
  const raw = filename?.split(".").pop();
  return normalizeExtension(raw);
}

function extensionFromMime(type?: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "image/avif") return "avif";
  if (type === "image/svg+xml") return "svg";
  if (type === "video/mp4") return "mp4";
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";
  if (type === "audio/mpeg") return "mp3";
  if (type === "audio/wav") return "wav";
  if (type === "audio/ogg") return "ogg";
  if (type === "audio/mp4") return "m4a";
  return null;
}

function inferCategoryFromFileType(fileType?: string) {
  if (!fileType) return null;
  if (fileType.startsWith("image/")) return PostCategoryEnum.Image;
  if (fileType.startsWith("video/")) return PostCategoryEnum.Video;
  if (fileType.startsWith("audio/")) return PostCategoryEnum.Audio;
  return null;
}

function inferCategoryFromUrl(url?: string | null) {
  if (!url) return null;
  if (YOUTUBE_URL_RE.test(url)) return PostCategoryEnum.Embed;

  const normalized = url.split("?")[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|avif|svg)$/.test(normalized)) {
    return PostCategoryEnum.Image;
  }
  if (/\.(mp4|webm|mov|m4v|m3u8)$/.test(normalized)) {
    return PostCategoryEnum.Video;
  }
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(normalized)) {
    return PostCategoryEnum.Audio;
  }
  return PostCategoryEnum.Link;
}

function resolveCategory(opts: {
  rawCategory?: string;
  fileType?: string;
  externalUrl?: string | null;
}) {
  const normalizedRaw = (opts.rawCategory || "").trim().toLowerCase();
  if (VALID_CATEGORIES.has(normalizedRaw as PostCategoryEnum)) {
    return normalizedRaw as PostCategoryEnum;
  }

  const byFile = inferCategoryFromFileType(opts.fileType);
  if (byFile) return byFile;

  const byUrl = inferCategoryFromUrl(opts.externalUrl);
  if (byUrl) return byUrl;

  return PostCategoryEnum.None;
}

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  if (!form || form.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "bad form" });
  }

  const fieldMap = new Map<string, string>();
  let file: MultipartPart | undefined;
  for (const part of form as MultipartPart[]) {
    if (!part?.name) continue;
    if (part.name === "file" && part.filename) {
      file = part;
      continue;
    }
    if (!fieldMap.has(part.name)) {
      fieldMap.set(part.name, part.data.toString());
    }
  }

  const get = (key: string) => fieldMap.get(key);

  const asBool = (value?: string) =>
    TRUE_VALUES.has((value || "").trim().toLowerCase());

  const isAnonymous = asBool(get("isAnonymous") || get("isnick"));
  const message = (get("message") || "").trim();

  if (file && file.data.length > MAX_UPLOAD_SIZE) {
    throw createError({ statusCode: 400, statusMessage: "檔案大小超過 15MB" });
  }

  if (file && !isAllowed(file)) {
    throw createError({
      statusCode: 400,
      statusMessage: "僅支援圖片、影片或音訊檔案",
    });
  }

  const externalUrl = normalizeSubmittedUrl(get("assetUrl"));
  if (!message && !file && !externalUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: "請至少提供文字、附件或外部連結其中一項",
    });
  }

  let assetUrl: string | undefined;
  if (file) {
    const id = `${Date.now()}_${randomUUID()}`;
    const ext =
      extensionFromFilename(file.filename) || extensionFromMime(file.type);
    const key = ext ? `/${id}.${ext}` : `/${id}`;

    await useStorage("static").setItemRaw(key, file.data);
    const uploadBase = String(useRuntimeConfig().public.uploadBase || "/static")
      .trim()
      .replace(/\/+$/, "");
    assetUrl = `${uploadBase}${key}`;
  } else if (externalUrl) {
    assetUrl = externalUrl;
  }

  // @ts-ignore
  const current = event.context.user as InstanceType<typeof db.User> | null;

  const rec = db.Post.create({
    isAnonymous,
    category: resolveCategory({
      rawCategory: get("category"),
      fileType: file?.type,
      externalUrl,
    }),
    message,
    assetUrl,
    authorId: current?.index,
  });

  await rec.save();

  return { index: rec.index, assetUrl: rec.assetUrl, category: rec.category };
});
