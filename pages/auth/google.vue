<template>
  <code>{{ info }}</code>
</template>

<script setup lang="tsx">
definePageMeta({ ssr: false }); // 避免 SSR 環境取用 window

const info = ref("");
const route = useRoute();
const router = useRouter();
const { refresh } = useAuth();

// pages/auth/google.vue
onMounted(async () => {
  const code = route.query.code as string | undefined;
  if (!code) {
    info.value = "missing code";
    return;
  }
  info.value = "signing in...";
  await router.replace({ path: route.path, query: {} });
  try {
    const data = await $fetch<{ requirePassword?: boolean }>("/api/auth/google", {
      method: "POST",
      body: { code },
    });
    await refresh();
    if (data?.requirePassword) return navigateTo("/user/password");
    await navigateTo("/");
  } catch (e: any) {
    info.value = e?.data?.statusMessage || e?.message || "google login failed";
  }
});
</script>
