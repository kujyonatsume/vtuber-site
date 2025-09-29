<template>
  <code>{{ info }}</code>
</template>

<script setup lang="tsx">
definePageMeta({ ssr: false });

const info = ref("");
const route = useRoute();
const router = useRouter();
const { refresh } = useAuth();

// pages/auth/discord.vue
onMounted(async () => {
  const code = route.query.code as string | undefined;
  if (!code) return;
  await router.replace({ path: route.path, query: {} });
  const { data } = await useFetch<{ requirePassword?: boolean }>(
    "/api/auth/discord",
    { method: "POST", body: { code } }
  );
  await refresh();
  if (data.value?.requirePassword) return navigateTo("/user/password");
  await navigateTo("/");
});
</script>
