<template>
  <section class="mx-auto max-w-md py-10">
    <h1 class="text-2xl font-bold mb-4">設定密碼</h1>
    <VForm @submit.prevent="submit" v-model="valid" class="card p-6 space-y-4">
      <VTextField
        v-model="pw"
        label="新密碼（至少 8 碼）"
        type="password"
        :rules="[r.required, r.min]"
      />
      <VTextField
        v-model="pw2"
        label="再次輸入"
        type="password"
        :rules="[r.required, r.match]"
      />
      <VBtn type="submit" color="primary" :loading="busy">儲存</VBtn>
      <VAlert v-if="err" type="error" class="mt-2" variant="tonal">{{
        err
      }}</VAlert>
    </VForm>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const { refresh } = useAuth();

const pw = ref("");
const pw2 = ref("");
const busy = ref(false);
const valid = ref(false);
const err = ref("");
const r = {
  required: (v: any) => !!v || "必填",
  min: (v: string) => v?.length >= 8 || "至少 8 碼",
  match: (v: string) => v === pw.value || "兩次輸入不一致",
};
async function submit() {
  if (!valid.value) return;
  busy.value = true;
  err.value = "";
  try {
    await $fetch("/api/auth/password", {
      method: "POST",
      body: { password: pw.value },
    });
    await refresh();
    toast.success("密碼已設定");
    navigateTo("/");
  } catch (e: any) {
    err.value = e?.data?.statusMessage || e?.message || "失敗";
  } finally {
    busy.value = false;
  }
}
</script>
