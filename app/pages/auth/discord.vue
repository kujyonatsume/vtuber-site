<template>
  <code>{{ info }}</code>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false });

useI18nPageSeo({ pageKey: "authDiscordPage", noindex: true });

const info = ref("");
const route = useRoute();
const router = useRouter();
const { refresh } = useAuth();

function resolveSafePath(raw?: unknown) {
  if (typeof raw !== "string") return null;

  const value = raw.trim();
  if (!value) return null;

  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) return decoded;
  } catch {
    if (value.startsWith("/") && !value.startsWith("//")) return value;
  }

  return null;
}

// pages/auth/discord.vue
onMounted(async () => {
  const code = route.query.code as string | undefined;
  const state = Array.isArray(route.query.state)
    ? route.query.state[0]
    : route.query.state;
  const next = resolveSafePath(state);
  if (!code) {
    info.value = "missing code";
    return;
  }
  info.value = "signing in...";
  await router.replace({ path: route.path, query: {} });
  try {
    const data = await $fetch<{ requirePassword?: boolean }>("/api/auth/discord", {
      method: "POST",
      body: { code },
    });
    await refresh();
    if (data?.requirePassword) return navigateTo("/user/account#password");
    await navigateTo(next || "/");
  } catch (e: any) {
    info.value = e?.data?.statusMessage || e?.message || "discord login failed";
  }
});
</script>
