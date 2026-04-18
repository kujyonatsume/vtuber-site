<template>
  <header
    :class="[
      'sticky top-0 z-40 border-b text-primary-900 backdrop-blur',
      headerClass,
    ]"
  >
    <div class="relative flex items-center justify-between py-3 layout-container">
      <VBtn v-if="width < 640" class="sm:hidden" variant="tonal" @click="drawer = true">
        <VIcon icon="mdi-menu" />
      </VBtn>

      <NuxtLink to="/" class="flex items-center gap-2 group">
        <img src="/favicon.ico" alt="logo" class="w-8 h-8 animate-float" />
        <span class="font-bold tracking-wide">VTuber Project</span>
      </NuxtLink>

      <nav class="items-center hidden gap-2 text-sm text-primary-900 sm:flex">
        <NuxtLink v-for="link in pageLinks" :key="link.to" :to="link.to" class="rounded-full px-3 py-1.5 hover:bg-secondary-100/80" active-class="font-semibold text-primary-700">
          {{ link.title }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
          <VBtn v-if="!user && !loading" color="primary" rounded="lg" @click="openDialog()"
            >登入</VBtn
          >
          <VMenu v-else-if="user">
            <template #activator="{ props }">
              <VBtn v-bind="props" variant="text" class="px-2">
                <img
                  :src="user.avatar || '/favicon.ico'"
                  class="object-cover w-8 h-8 rounded-full"
                  alt="avatar"
                />
                <template v-if="width >= 640">
                <span class="hidden ml-2 sm:inline">{{
                  user.name || user.email
                }}</span>
                <VChip
                  size="x-small"
                  class="ml-2"
                  color="primary"
                  variant="flat"
                  >{{ user.role }}</VChip
                >
                </template>
              </VBtn>
            </template>
            <VList density="compact">
              <VListItem :title="user.email" />
              <VDivider />
              <VListItem to="/wishes/new" title="我要投稿" />
              <VListItem
                v-if="user.role != 'user'"
                to="/admin/contribute"
                title="投稿審核"
              />
              <VListItem
                v-if="user.role != 'user'"
                to="/admin/users"
                title="使用者管理"
              />
              <VListItem to="/user/account" title="帳號設定" />
              <VDivider />
              <VListItem title="登出" @click="confirmLogout()" />
            </VList>
          </VMenu>
      </div>
    </div>
  </header>

  <VNavigationDrawer
    v-model="drawer"
    temporary
    location="start"
    class="bg-white text-primary-900"
  >
    <div class="flex flex-col h-full">
      <VList density="compact">
        <VListItem v-for="link in pageLinks" :key="link.to" :to="link.to" :title="link.title" @click="drawer = false" />
        <VDivider class="my-2" />
        <VListItem v-if="!user" title="登入" @click="openDialog()" />
        <template v-else>
          <VListItem
            to="/wishes/new"
            title="我要投稿"
            @click="drawer = false"
          />
          <VListItem
            to="/user/account"
            title="帳號設定"
            @click="drawer = false"
          />
          <VListItem
            v-if="user.role != 'user'"
            to="/admin/contribute"
            title="投稿審核"
            @click="drawer = false"
          />
          <VListItem
            v-if="user.role != 'owner'"
            to="/admin/users"
            title="使用者管理"
            @click="drawer = false"
          />

          <VListItem title="登出" @click="confirmLogout()" />
        </template>
      </VList>

      <VList
        v-if="user"
        density="compact"
        class="pt-2 mt-auto border-t border-neutral-200"
      >

      </VList>
    </div>
  </VNavigationDrawer>

  <ClientOnly>
    <LoginDialog v-model="loginOpen" />
  </ClientOnly>
</template>
<script setup lang="ts">
const { width } = useDisplay();
const { user, loading, loginOpen, drawer, logout, openDialog } = useLogin();
const pageLinks = [
  { to: "/", title: "首頁", icon: "mdi-home-outline" },
  { to: "/event", title: "活動", icon: "mdi-calendar-star" },
  { to: "/clips", title: "剪輯", icon: "mdi-movie-open-outline" },
  { to: "/about", title: "關於", icon: "mdi-information-outline" },
];
const isLoggedIn = computed(() => !!user.value);
const headerClass = computed(() =>
  isLoggedIn.value
    ? "border-primary-200/80 bg-primary-50/85"
    : "border-neutral-300/70 bg-white/80",
);

async function confirmLogout() {
  if (!import.meta.client) return;
  const ok = await toast.confirm("確定要登出嗎？");
  if (!ok) return;
  drawer.value = false;
  await logout();
}

</script>

<style scoped lang="scss">
@reference "../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 lg:px-8 sm:px-6;
}
</style>
