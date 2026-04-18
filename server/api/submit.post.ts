import { randomUUID } from "node:crypto";
import { PostCategoryEnum } from "../../shared/Enum";

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;
const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
const YOUTUBE_URL_RE =
  /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|(?:m\.|music\.)?youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^\s#&]+&)*v=|shorts\/|embed\/|live\/|v\/))([A-Za-z0-9_-]{11})(?:[^\s]*)?/i;

type MultipartPart = {
  name?: string;
  filename?: string;
  type?: string;
  data: Buffer;
};

function postMediaTypeWithMIME(type?: string): PostCategoryEnum {
  return type?.startsWith("image/")
    ? PostCategoryEnum.Image
    : type?.startsWith("video/")
      ? PostCategoryEnum.Video
      : type?.startsWith("audio/")
        ? PostCategoryEnum.Audio
        : PostCategoryEnum.None;
}

async function postMediaTypeWithUrl(url: string): Promise<PostCategoryEnum> {
  if (YOUTUBE_URL_RE.test(url)) {
    return PostCategoryEnum.Embed;
  }

  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(3000),
    });

    const contentType = res.headers.get("content-type") || "";
    return postMediaTypeWithMIME(contentType);
  } catch {
    return PostCategoryEnum.None;
  }
}

function normalizeExternalUrl(url: string): string {
  const match = url.match(YOUTUBE_URL_RE);
  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

const map: Record<string, string> = {
  // ===== 圖片 =====
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/x-icon": "ico",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/tiff": "tiff",
  // ===== 影片 =====
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogv",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
  "video/x-matroska": "mkv",
  "video/mpeg": "mpeg",
  "video/3gpp": "3gp",
  "video/3gpp2": "3g2",
  // ===== 音訊 =====
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
  "audio/opus": "opus",
};

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

  const isAnonymous = asBool(get("isAnonymous"));
  const license = asBool(get("license"));
  const message = (get("message") || "").trim();
  const externalUrl = (get("assetUrl") || "").trim();

  if (!license) {
    throw createError({ statusCode: 400, statusMessage: "請勾選授權與規範" });
  }

  if (!message) {
    throw createError({ statusCode: 400, statusMessage: "請輸入內容" });
  }

  if (file && file.data.length > MAX_UPLOAD_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: "檔案大小超過 15MB",
    });
  }

  let category = PostCategoryEnum.None;
  let assetUrl = "";

  if (file) {
    category = postMediaTypeWithMIME(file.type);

    if (category === PostCategoryEnum.None) {
      throw createError({
        statusCode: 400,
        statusMessage: "不支援的檔案類型",
      });
    }

    const id = `${Date.now()}_${randomUUID()}`;
    const ext = map[`${file.type?.toLowerCase().split(";")[0]?.trim()}`] || "bin";
    const key = `/${id}.${ext}`;
    await useStorage("static").setItemRaw(key, file.data);

    const { uploadBase } = useRuntimeConfig().public;
    assetUrl = `${uploadBase}${key}`;
  } else if (externalUrl) {
    category = await postMediaTypeWithUrl(externalUrl);

    if (category === PostCategoryEnum.None) {
      throw createError({
        statusCode: 400,
        statusMessage: "無法辨識的媒體連結",
      });
    }

    assetUrl = normalizeExternalUrl(externalUrl);
  }

  const current = requireRole(event);

  const rec = db.Post.create({
    isAnonymous,
    category,
    message,
    assetUrl: assetUrl,
    authorId: current.index,
  });

  await rec.save();

  return { id: rec.index };
});
