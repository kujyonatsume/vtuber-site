import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const current = event.context.user
  if (!current) throw createError({ statusCode: 401, statusMessage: "unauthorized" });

  const form = await readMultipartFormData(event);

  let name = "";
  let avatarFile:
    | { filename?: string; type?: string; data: Buffer }
    | undefined;

  if (form) {
    name = (form.find((i) => i.name === "name")?.data?.toString() || "").trim();
    avatarFile = form.find(
      (i) => i.name === "avatar" && i.filename && i.type && i.data
    ) as any;
  } else {
    const body = await readBody<{ name?: string }>(event);
    name = (body?.name || "").trim();
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "name required" });
  }
  if (name.length > 40) {
    throw createError({ statusCode: 400, statusMessage: "name too long" });
  }

  const patch: { name: string; avatar?: string } = { name };

  if (avatarFile) {
    if (!avatarFile.type?.startsWith("image/")) {
      throw createError({ statusCode: 400, statusMessage: "avatar must be image" });
    }
    if (avatarFile.data.length > 5 * 1024 * 1024) {
      throw createError({ statusCode: 400, statusMessage: "avatar too large" });
    }

    const ext = (avatarFile.filename || "avatar.png").split(".").pop() || "png";
    const key = `/avatar_${current.index}_${Date.now()}_${randomUUID()}.${ext}`;

    await useStorage("static").setItemRaw(key, avatarFile.data);
    const { uploadBase } = useRuntimeConfig().public;
    patch.avatar = `${uploadBase}${key}`;
  }

  await db.User.update({ index: current.index }, patch);

  return { ok: true, ...patch };
});
