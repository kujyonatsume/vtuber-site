<script setup lang="tsx">
const drawer = ref(false);
const loginOpen = ref(false);
const { user, loading, logout, refresh } = useAuth();

// SSR→CSR 首屏同步
onMounted(() => {
  if (!user.value) refresh();
});
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-neutral-300/70 bg-white/80 text-primary-900 backdrop-blur"
  >
    <div class="flex items-center justify-between py-3 layout-container">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <img src="/favicon.ico" alt="logo" class="w-8 h-8 animate-float" />
        <span class="font-bold tracking-wide">VTuber Project</span>
      </NuxtLink>

      <nav class="items-center hidden gap-2 text-sm text-primary-900 md:flex">
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
          <VBtn color="primary" rounded="lg" @click="loginOpen = true"
            >登入</VBtn
          >
        </template>

        <template v-else-if="user">
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
              <VListItem to="/event/submit" title="我要投稿" />
              <VListItem v-if="user.role != 'user'" to="/admin" title="後台" />
              <VListItem
                v-if="user.role != 'user'"
                to="/admin/users"
                title="使用者管理"
              />
              <VListItem to="/user/account" title="帳號設定" />
              <VDivider />
              <VListItem title="登出" @click="logout()" />
            </VList>
          </VMenu>
        </template>

        <VBtn class="md:hidden" variant="tonal" @click="drawer = true">
          <VIcon icon="mdi-menu" />
        </VBtn>
      </div>
    </div>
  </header>

  <VNavigationDrawer v-model="drawer" temporary location="right" class="bg-white text-primary-900">
    <VList density="compact">
      <VListItem to="/" title="首頁" @click="drawer = false" />
      <VListItem to="/event" title="活動" @click="drawer = false" />

      <VListItem to="/clips" title="剪輯" @click="drawer = false" />
      <VListItem to="/about" title="關於" @click="drawer = false" />
      <VDivider class="my-2" />
      <VListItem
        v-if="!user"
        title="登入"
        @click="
          drawer = false;
          loginOpen = true;
        "
      />
      <template v-else>
        <VListItem :title="user.email" />
        <VListItem
          v-if="user.role != 'user'"
          to="/admin/contribute"
          title="投稿審核"
          @click="drawer = false"
        />
        <VListItem
          v-if="user.role != 'user'"
          to="/admin/users"
          title="使用者管理"
          @click="drawer = false"
        />
        <VListItem
          title="登出"
          @click="
            drawer = false;
            logout();
          "
        />
      </template>
    </VList>
  </VNavigationDrawer>

  <ClientOnly>
    <LoginDialog v-model="loginOpen" />
  </ClientOnly>
</template>
