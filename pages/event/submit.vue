<template>
  <section class="max-w-3xl mx-auto section-shell">
    <div class="mb-6 space-y-2">
      <h1 class="text-3xl font-black tracking-tight text-primary-900">
        我要投稿
      </h1>
      <p class="text-sm text-neutral-700">
        留下祝福文字，並可附上作品或外部連結。
      </p>
    </div>

    <form
      class="space-y-5 rounded-2xl border border-neutral-200/80 bg-white/95 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
      @submit.prevent="submit"
    >
      <VTextarea
        v-model="form.message"
        label="祝福訊息"
        rows="4"
        counter="300"
        :maxlength="300"
        color="primary"
        variant="outlined"
      />
      <div class="space-y-2">
        <label class="text-sm font-medium text-neutral-700">附件或連結</label>
        <div
          class="flex items-center rounded-xl border border-neutral-300 bg-neutral-50 px-2 py-1 transition-colors duration-200 hover:border-neutral-400 focus-within:border-primary focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
        >
          <VBtn
            icon="mdi-paperclip"
            variant="text"
            color="primary"
            :title="form.file ? `已選擇：${form.file.name}` : '選擇附件'"
            class="rounded-lg"
            @click.prevent="pickFile"
          />
          <div class="w-px h-6 mx-1 bg-neutral-200" />
          <input
            v-model="form.assetUrl"
            type="url"
            class="w-full px-1 py-2 text-sm bg-transparent outline-none text-neutral-900 placeholder:text-neutral-500"
            placeholder="貼上外部連結（可選，支援 YouTube）"
            aria-label="外部連結"
          />
        </div>
        <div class="flex items-center gap-2 text-sm text-neutral-700">
          <span>附件：</span>
          <span v-if="form.file" class="max-w-[420px] truncate">{{
            form.file.name
          }}</span>
          <span v-else class="text-neutral-500">未選擇檔案</span>
          <VBtn
            v-if="form.file"
            size="x-small"
            variant="text"
            color="red"
            @click.prevent="clearFile"
          >
            移除
          </VBtn>
        </div>
        <input
          ref="fileInputEl"
          type="file"
          class="hidden"
          accept="image/*,video/*,audio/*"
          @change="onFileChange"
        />
      </div>
      <VCheckbox
        v-model="form.isAnonymous"
        :label="'匿名顯示'"
        color="primary"
        hide-details
        class="px-3 py-2 rounded-xl bg-neutral-50"
      />
      <div class="max-w-3xl py-10 mx-auto space-y-6">
        <h1 class="text-2xl font-black tracking-tight text-primary-900">
          投稿規範與授權聲明
        </h1>
        <ol class="pl-6 space-y-2 text-sm list-decimal text-neutral-800">
          <li>僅上傳本人原創或已取得授權之作品；若為 AI 生成須明確標註。</li>
          <li>禁止個資、攻擊、仇恨、未成年不宜內容；違者刪除且取消資格。</li>
          <li>授權主催於本企劃中非商用展示與合輯收錄，並保留作者署名。</li>
          <li>截稿：活動日前 1 天。</li>
        </ol>
      </div>
      <VCheckbox
        v-model="form.license"
        :label="'我同意投稿規範與非商用展示授權'"
        color="primary"
        hide-details
        class="px-3 py-2 rounded-xl bg-neutral-50"
        required
      />
      <div class="flex items-center gap-3">
        <VBtn
          type="submit"
          color="primary"
          rounded="lg"
          size="large"
          :loading="submitting"
          class="font-bold tracking-wide"
        >
          送出投稿
        </VBtn>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { toast } from "vuetify-sonner";

type PostMediaKind = "none" | "image" | "video" | "embed" | "audio";

const ytRegex =
  /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|(?:m\.|music\.)?youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^\s#&]+&)*v=|shorts\/|embed\/|live\/|v\/))([A-Za-z0-9_-]{11})(?:[^\s]*)?/i;

async function postMediaTypeWithUrl(url?: string | null) {
  return ytRegex.test(url)
    ? "embed"
    : await $fetch
        .raw(url || "", { method: "HEAD" })
        .then((res) =>
          postMediaTypeWithMIME(res.headers.get("content-type") || ""),
        )
        .catch(() => "none");
}

function postMediaTypeWithMIME(type?: string): PostMediaKind {
  return type?.startsWith("image/")
    ? "image"
    : type?.startsWith("video/")
      ? "video"
      : type?.startsWith("audio/")
        ? "audio"
        : "none";
}

const { user } = useAuth();
if (!user.value) {
  navigateTo("/login?next=" + useRoute().fullPath);
}

const form = reactive({
  isAnonymous: false,
  category: "none",
  message: "",
  file: null as File | null,
  assetUrl: "",
  license: false,
});

const fileInputEl = ref<HTMLInputElement | null>(null);
const submitting = ref(false);

function pickFile() {
  fileInputEl.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement | null;
  form.file = target?.files?.[0] || null;

  // 允許重複選擇相同檔案時仍觸發 change 事件。
  if (target) {
    target.value = "";
  }
}

function clearFile() {
  form.file = null;
  if (fileInputEl.value) {
    fileInputEl.value.value = "";
  }
}

async function submit() {
  if (!form.license) {
    toast.error("請勾選授權與規範");
    return;
  }
  submitting.value = true;
  const body = new FormData();

  if (form.file) form.category = postMediaTypeWithMIME(form.file.type);
  else if (form.assetUrl)
    form.category = await postMediaTypeWithUrl(form.assetUrl);
  else form.category = "none";

  Object.entries(form).forEach(([k, v]) => {
    if (v !== null) body.append(k, v as any);
  });
  try {
    const res = await $fetch<{ index: string }>("/api/submit", {
      method: "POST",
      body,
    });
    toast.success("提交成功");
    navigateTo(`/event/submit?ok=1&id=${res.index}`);
  } catch (err: any) {
    toast.error(err?.data?.message || "提交失敗");
  } finally {
    submitting.value = false;
  }
}
</script>
