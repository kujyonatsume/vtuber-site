<template>
  <section class="mx-auto max-w-md py-10">
    <h1 class="mb-4 text-2xl font-bold">{{ t("userPasswordPage.title") }}</h1>

    <VForm v-model="valid" class="card space-y-4 p-6" @submit.prevent="submit">
      <VTextField
        v-model="pw"
        :label="t('userPasswordPage.newPassword')"
        type="password"
        :rules="[r.required, r.min]"
      />

      <VTextField
        v-model="pw2"
        :label="t('userPasswordPage.confirmPassword')"
        type="password"
        :rules="[r.required, r.match]"
      />

      <VBtn type="submit" color="primary" :loading="busy">
        {{ t("userPasswordPage.save") }}
      </VBtn>

      <VAlert v-if="err" type="error" class="mt-2" variant="tonal">
        {{ err }}
      </VAlert>
    </VForm>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const { refresh } = useAuth();
useAuthRequiredSeo("userPasswordPage");

const pw = ref("");
const pw2 = ref("");
const busy = ref(false);
const valid = ref(false);
const err = ref("");

const r = {
  required: (v: unknown) => !!v || t("userPasswordPage.validation.required"),
  min: (v: string) => v?.length >= 8 || t("userPasswordPage.validation.min"),
  match: (v: string) => v === pw.value || t("userPasswordPage.validation.match"),
};

async function submit() {
  if (!valid.value) return;

  busy.value = true;
  err.value = "";

  try {
    await $fetch("/api/user/password", {
      method: "POST",
      body: { password: pw.value },
    });
    await refresh();
    toast.success(t("userPasswordPage.toast.saved"));
    navigateTo("/");
  } catch (e: any) {
    err.value = e?.data?.statusMessage || e?.message || t("userPasswordPage.toast.failed");
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.card {
  @apply rounded-3xl border border-primary-200/70 bg-white/90 backdrop-blur-sm;
  box-shadow: 0 10px 30px -16px rgb(var(--v-theme-on-surface) / 0.26);
}
</style>
