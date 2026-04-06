<template>
  <header
    :class="[
      'sticky top-0 z-40 border-b text-primary-900 backdrop-blur',
      headerClass,
    ]"
  >
    <div class="flex items-center justify-between py-3 layout-container">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <img src="/favicon.ico" alt="logo" class="w-8 h-8 animate-float" />
        <span class="font-bold tracking-wide">VTuber Project</span>
      </NuxtLink>

      <nav class="items-center hidden gap-2 text-sm text-primary-900 sm:flex">
        <NuxtLink
          to="/"
          class="rounded-full px-3 py-1.5 hover:bg-secondary-100/80"
          active-class="font-semibold text-primary-700"
        >
          首頁
        </NuxtLink>
        <NuxtLink
          to="/event"
          class="rounded-full px-3 py-1.5 hover:bg-secondary-100/80"
          active-class="font-semibold text-primary-700"
        >
          活動
        </NuxtLink>
        <NuxtLink
          to="/clips"
          class="rounded-full px-3 py-1.5 hover:bg-secondary-100/80"
          active-class="font-semibold text-primary-700"
        >
          剪輯
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="rounded-full px-3 py-1.5 hover:bg-secondary-100/80"
          active-class="font-semibold text-primary-700"
        >
          關於
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <template v-if="!user && !loading">
          <VBtn color="primary" rounded="lg" @click="openDialog()"
            >登入</VBtn
          >
        </template>

        <template v-else-if="user">
          <VChip
            size="small"
            color="secondary"
            variant="flat"
            class="hidden mr-1 font-semibold tracking-wide sm:inline-flex"
          >
            已登入
          </VChip>
          <VMenu>
            <template #activator="{ props }">
              <VBtn v-bind="props" variant="text" class="px-2">
                <img
                  :src="user.avatar || '/favicon.ico'"
                  class="object-cover w-8 h-8 rounded-full"
                  alt="avatar"
                />
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
        </template>

        <VBtn class="sm:hidden" variant="tonal" @click="drawer = true">
          <VIcon icon="mdi-menu" />
        </VBtn>
      </div>
    </div>
  </header>

  <VNavigationDrawer
    v-model="drawer"
    temporary
    location="right"
    class="bg-white text-primary-900"
  >
    <VList density="compact">
      <VListItem to="/" title="首頁" @click="drawer = false" />
      <VListItem to="/event" title="活動" @click="drawer = false" />

      <VListItem to="/clips" title="剪輯" @click="drawer = false" />
      <VListItem to="/about" title="關於" @click="drawer = false" />
      <VDivider class="my-2" />
      <VListItem v-if="!user" title="登入" @click="openDialog()" />
      <template v-else>
        <VListItem :title="user.email" />
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
  </VNavigationDrawer>

  <ClientOnly>
    <LoginDialog v-model="loginOpen" />
  </ClientOnly>
</template>
<script setup lang="ts">
const { user, loading, loginOpen, drawer, logout, openDialog } = useLogin();
const isLoggedIn = computed(() => !!user.value);
const headerClass = computed(() =>
  isLoggedIn.value
    ? "border-primary-200/80 bg-primary-50/85"
    : "border-neutral-300/70 bg-white/80",
);

async function confirmLogout() {
  if (!import.meta.client) return;
  const ok = window.confirm("確定要登出嗎？");
  if (!ok) return;
  drawer.value = false;
  await logout();
}

</script>

<style scoped lang="scss">
.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}
</style>
