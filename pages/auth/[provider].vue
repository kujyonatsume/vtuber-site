<template>
  <code>{{ info }}</code>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false });

type Provider = "google" | "discord";

const info = ref("");
const route = useRoute();
const router = useRouter();
const { refresh } = useAuth();

onMounted(async () => {
  const provider = String(route.params.provider).toLowerCase();
  if (provider != "google" && provider != "discord") {
    info.value = "invalid provider";
    return;
  }

  const code = route.query.code as string | undefined;
  if (!code) return;

  await router.replace({ path: route.path, query: {} });

  const { data, error } = await useFetch<{ requirePassword?: boolean }>(
    `/api/auth/${provider}`,
    { method: "POST", body: { code } }
  );

  if (error.value) {
    info.value = String(error.value.statusMessage || "auth failed");
    return;
  }

  await refresh();
  if (data.value?.requirePassword) {
    await navigateTo("/user/password");
    return;
  }
  await navigateTo("/");
});
</script>
