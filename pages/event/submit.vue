<template>
  <section class="mx-auto max-w-3xl py-10">
    <h1 class="text-3xl font-bold mb-6">我要投稿</h1>
    <form class="card p-6 space-y-4" @submit.prevent="submit">
      <VCheckbox v-model="form.isnick" :label="'匿名'" required />
      <VTextField
        v-model="form.displayname"
        label="暱稱"
        :disabled="form.isnick"
        :required="!form.isnick"
      />
      <VSelect
        v-model="form.category"
        :items="['插畫', '訊息', '影片連結', '其他']"
        label="類別"
        required
      />
      <VTextarea
        v-model="form.message"
        label="祝福訊息"
        rows="4"
        counter="300"
        :maxlength="300"
      />
      <VFileInput
        v-model="form.file"
        label="上傳作品（可選，jpg/png/mp4 ≤ 15MB）"
        accept="image/*,video/mp4"
      />
      <VTextField
        v-model="form.videoUrl"
        label="影片連結（YouTube/X 可擇一）"
      />
      <div class="mx-auto max-w-3xl py-10 space-y-6">
        <h1 class="text-3xl font-bold">投稿規範與授權聲明</h1>
        <ol class="list-decimal pl-6 space-y-2 text-neutral-800">
          <li>僅上傳本人原創或已取得授權之作品；若為 AI 生成須明確標註。</li>
          <li>禁止個資、攻擊、仇恨、未成年不宜內容；違者刪除且取消資格。</li>
          <li>授權主催於本企劃中非商用展示與合輯收錄，並保留作者署名。</li>
          <li>截稿：活動日前 1 天 23:59（UTC+8）。</li>
        </ol>
      </div>
      <VCheckbox
        v-model="form.license"
        :label="'我同意投稿規範與非商用展示授權'"
        required
      />
      <div class="flex items-center gap-3">
        <VBtn type="submit" color="primary" :loading="submitting"
          >送出投稿</VBtn
        >
      </div>
    </form>
  </section>
</template>

<script setup lang="tsx">
import { toast } from "vuetify-sonner";

const { user } = useAuth();
if (!user.value) {
  navigateTo("/login?next=" + useRoute().fullPath);
}

const form = reactive({
  isnick: false,
  nickname: user.value.name,
  displayname: user.value.name,
  contact: "",
  category: "",
  message: "",
  file: null as File | null,
  videoUrl: "",
  license: false,
});

const submitting = ref(false);

async function submit() {
  if (!form.license) {
    toast.error("請勾選授權與規範");
    return;
  }
  submitting.value = true;
  const body = new FormData();
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
