<template>
  <section class="max-w-3xl mx-auto section-shell">
    <div v-if="!user"
      class="space-y-4 rounded-2xl border border-neutral-200/80 bg-white/95 p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
    >
      <h1 class="text-3xl font-black tracking-tight text-primary-900">
        我要投稿
      </h1>
      <p class="text-base text-neutral-700">要登入之後才可以投稿唷!!</p>
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <VBtn @click="openDialog()" color="primary" rounded="lg">點我登入</VBtn>
        <VBtn to="/wishes" color="secondary" rounded="lg">先看投稿</VBtn>
      </div>
    </div>

    <template v-else-if="submitId == 0">
      <form
        class="space-y-5 rounded-2xl border border-neutral-200/80 bg-white/95 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
        @submit.prevent="submit"
      >
        <div class="mb-6 space-y-2">
          <h1 class="text-3xl font-black tracking-tight text-primary-900">
            我要投稿
          </h1>
          <p class="text-sm text-neutral-700">
            留下祝福文字，並可附上作品或外部連結。
          </p>
        </div>
        <VTextarea
          v-model="form.message"
          label="祝福訊息"
          rows="8"
          counter="300"
          :maxlength="300"
          color="primary"
          variant="outlined"
        />
        <div
          class="flex items-center rounded-xl border border-neutral-300 bg-neutral-50 px-2 py-1 transition-colors duration-200 hover:border-neutral-400 focus-within:border-primary focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
        >
          <VBtn
            icon="mdi-paperclip"
            variant="text"
            color="primary"
            :title="form.file ? `已選擇：${form.file.name}` : '選擇附件'"
            class="rounded-lg"
            @click="pickFile"
          />
          <div class="w-px h-6 mx-1 bg-neutral-200" />
          <input
            v-model="form.assetUrl"
            type="url"
            class="w-full px-1 py-2 text-sm bg-transparent outline-none text-neutral-900 placeholder:text-neutral-500"
            :placeholder="
              form.file ? form.file.name : '貼上外部連結（可選，支援 YouTube）'
            "
            :readonly="!!form.file"
            aria-label="外部連結"
          />
          <div class="w-px h-6 mx-1 bg-neutral-200" />
          <VBtn
            icon="mdi-close"
            variant="text"
            color="red"
            class="rounded-lg"
            @click="clearFile"
          />
        </div>
        <input
          ref="fileInputEl"
          type="file"
          class="hidden"
          accept="image/*,video/*,audio/*"
          @change="onFileChange"
        />
        <VCheckbox
          v-model="form.isAnonymous"
          :label="'匿名顯示'"
          color="primary"
          hide-details
          class="px-3 py-2 rounded-xl bg-neutral-50"
        />

        <div class="max-w-3xl mx-auto space-y-6">
          <h1 class="text-2xl font-black tracking-tight text-primary-900">
            投稿規範與授權聲明
          </h1>
          <ol class="pl-6 space-y-2 text-sm list-decimal text-neutral-800">
            <li>僅上傳本人原創作品；已取得授權之作品，需標示作者。</li>
            <li>附件不接受 AI 生成內容。</li>
            <li>禁止個資、攻擊、仇恨、未成年不宜內容；違者刪除且取消資格。</li>
            <li>授權主催於本企劃中非商用展示與合輯收錄，並保留作者署名。</li>
            <li>截稿日期：2026/10/01 00:00:00 GMT+0800 (台北標準時間)</li>
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
    </template>
    <div v-else
      class="space-y-4 rounded-2xl border border-neutral-200/80 bg-white/95 p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
    >
      <h1 class="flex items-center justify-center gap-2 text-3xl font-black leading-none tracking-tight text-primary-900">
        <VIcon icon="mdi-check-circle" color="green" size="36" class="shrink-0" />
        送出成功！
      </h1>
      <p class="text-base text-neutral-700">
        <span>恭喜你已成功提交祝福，管理員將會盡快審核，</br>
        通過之後將會透過 Email 同步通知。</span>
      </p>
       <p class="text-sm text-neutral-500">
        （如果有任何問題，歡迎聯繫我們！）
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <VBtn to="/wishes" color="secondary" rounded="lg">先看投稿</VBtn>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { user, openDialog } = useLogin();

const form = reactive({
  isAnonymous: false,
  category: "none",
  message: "",
  file: null as File | null,
  assetUrl: "",
  license: false,
});

const fileInputEl = ref<HTMLInputElement>();
const submitting = ref(false);
const submitId = ref(0);
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
    form.assetUrl = "";
  }
}

async function submit() {
  if (!user.value) {
    toast.error("請先登入後再投稿");
    return;
  }

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
    submitId.value = (await $fetch<{ id: number }>("/api/submit", {
      method: "POST",
      body,
    })).id;

    toast.success("已經送出成功，請等待審核");
    // await navigateTo("/wishes?submitted=1");
  } catch (err: any) {
    toast.error(err?.data?.message || "提交失敗");
  } finally {
    submitting.value = false;
  }
}

</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.section-shell {
  @apply py-10 sm:py-12;
}
</style>
