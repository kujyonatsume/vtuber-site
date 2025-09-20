<!-- pages/events/submit.vue -->
<template>
  <section class="mx-auto max-w-3xl py-10">
    <h1 class="text-3xl font-bold mb-6">我要投稿</h1>
    <form class="card p-6 space-y-4" @submit.prevent="submit">
      <VTextField v-model="form.nickname" label="暱稱" required />
      <VTextField
        v-model="form.contact"
        label="聯絡 Email 或 Discord"
        type="email"
        required
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
      <VCheckbox
        v-model="form.license"
        :label="'我同意投稿規範與非商用展示授權'"
        required
      />
      <div class="flex items-center gap-3">
        <NuxtLink to="/event/rules" class="text-primary hover:underline"
          >查看投稿規範</NuxtLink
        >
        <VBtn type="submit" color="primary" :loading="loading">送出投稿</VBtn>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { toast } from "vuetify-sonner";

const loading = ref(false);
const form = reactive({
  nickname: "",
  contact: "",
  category: "",
  message: "",
  file: null as File | null,
  videoUrl: "",
  license: false,
});
async function submit() {
  loading.value = true;
  const body = new FormData();
  Object.entries(form).forEach(([k, v]) => {
    if (v !== null) body.append(k, v as any);
  });
  try {
    const res = await $fetch<{ id: string }>("/api/submit", {
      method: "POST",
      body,
    });
    toast.success("提交成功")
    navigateTo(`/event/submit?ok=1&id=${res.id}`);
  } catch (err) {
    toast.error("提交失敗");
  } finally {
    loading.value = false;
  }
}
</script>
