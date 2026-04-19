<template>
  <header
    :class="['sticky top-0 z-40 border-b border-primary-200/80 bg-primary-50/85 backdrop-blur']"
  >
    <div class="relative flex items-center justify-between py-3 layout-container">
      <VBtn
        v-if="width < 640"
        class="sm:hidden"
        variant="tonal"
        @click="drawer = true"
      >
        <VIcon icon="mdi-menu" />
      </VBtn>

      <NuxtLink :to="localePath('/')" class="group flex items-center gap-2">
        <img src="/favicon.ico" alt="logo" class="h-8 w-8 animate-float" />
        <span class="font-bold tracking-wide">{{ t("common.projectName") }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-2 text-sm text-primary-900 sm:flex">
        <NuxtLink
          v-for="link in pageLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-3 py-1.5 hover:bg-secondary-100/80"
          active-class="font-semibold text-primary-700"
        >
          {{ link.title }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <VMenu>
          <template #activator="{ props }">
            <VBtn v-bind="props" variant="text" class="px-2" prepend-icon="mdi-translate">
              {{ currentLocaleLabel }}
            </VBtn>
          </template>
          <VList density="compact">
            <VListItem
              v-for="item in localeItems"
              :key="item.code"
              :title="item.label"
              :active="item.code === locale"
              @click="changeLocale(item.code)"
            />
          </VList>
        </VMenu>

        <VIcon
          v-if="isDark"
          icon="mdi-white-balance-sunny"
          class="cursor-pointer"
          :title="t('common.themeLight')"
          @click="changeTheme('light')"
        />
        <VIcon
          v-else
          icon="mdi-weather-night"
          class="cursor-pointer"
          :title="t('common.themeDark')"
          @click="changeTheme('dark')"
        />

        <VBtn
          v-if="!user && !loading"
          color="primary"
          rounded="lg"
          @click="openDialog()"
        >
          {{ t("common.login") }}
        </VBtn>

        <VMenu v-else-if="user">
          <template #activator="{ props }">
            <VBtn v-bind="props" variant="text" class="px-2">
              <img
                :src="user.avatar || '/favicon.ico'"
                class="h-8 w-8 rounded-full object-cover"
                alt="avatar"
              />
              <template v-if="width >= 640">
                <span class="ml-2 hidden sm:inline">{{ user.name }}</span>
              </template>
            </VBtn>
          </template>
          <VList density="compact">
            <VListItem :title="user.name" />
            <VDivider />
            <VListItem :to="localePath('/wishes/new')" :title="t('common.submitWish')" />
            <VListItem
              v-if="user.role !== 'user'"
              :to="localePath('/admin/contribute')"
              :title="t('common.manageWish')"
            />
            <VListItem
              v-if="user.role !== 'user'"
              :to="localePath('/admin/users')"
              :title="t('common.manageUsers')"
            />
            <VListItem :to="localePath('/user/account')" :title="t('common.account')" />
            <VDivider />
            <VListItem :title="t('common.logout')" @click="confirmLogout()" />
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
    <div class="flex h-full flex-col">
      <VList density="compact">
        <VListItem
          v-for="link in pageLinks"
          :key="link.to"
          :to="link.to"
          :title="link.title"
          @click="drawer = false"
        />

        <VDivider class="my-2" />

        <VListItem v-if="!user" :title="t('common.login')" @click="openDialog()" />
        <template v-else>
          <VListItem
            :to="localePath('/wishes/new')"
            :title="t('common.submitWish')"
            @click="drawer = false"
          />
          <VListItem
            :to="localePath('/user/account')"
            :title="t('common.account')"
            @click="drawer = false"
          />
          <VListItem
            v-if="user.role !== 'user'"
            :to="localePath('/admin/contribute')"
            :title="t('common.manageWish')"
            @click="drawer = false"
          />
          <VListItem
            v-if="user.role !== 'user'"
            :to="localePath('/admin/users')"
            :title="t('common.manageUsers')"
            @click="drawer = false"
          />
          <VListItem :title="t('common.logout')" @click="confirmLogout()" />
        </template>

        <VDivider class="my-2" />

        <VListSubheader>{{ t("common.language") }}</VListSubheader>
        <VListItem
          v-for="item in localeItems"
          :key="`drawer-${item.code}`"
          :title="item.label"
          :active="item.code === locale"
          @click="changeLocale(item.code)"
        />
      </VList>
    </div>
  </VNavigationDrawer>

  <ClientOnly>
    <LoginDialog v-model="loginOpen" />
  </ClientOnly>
</template>

<script setup lang="ts">
const { width } = useDisplay();
const theme = useTheme();
const localePath = useLocalePath();
const { t, locale, locales, setLocale } = useI18n();

const { user, loading, loginOpen, drawer, logout, openDialog } = useLogin();

const pageLinks = computed(() => [
  { to: localePath("/"), title: t("nav.home"), icon: "mdi-home-outline" },
  { to: localePath("/event"), title: t("nav.event"), icon: "mdi-calendar-star" },
  { to: localePath("/clips"), title: t("nav.clips"), icon: "mdi-movie-open-outline" },
  { to: localePath("/about"), title: t("nav.about"), icon: "mdi-information-outline" },
]);

const isDark = computed(() => theme.global.name.value === "dark");

const localeItems = computed(() =>
  locales.value.map((entry) => {
    if (typeof entry === "string") {
      return {
        code: entry,
        label: entry.toUpperCase(),
      };
    }

    return {
      code: entry.code,
      label: entry.name || entry.code.toUpperCase(),
    };
  }),
);

const currentLocaleLabel = computed(
  () => localeItems.value.find((item) => item.code === locale.value)?.label || locale.value.toUpperCase(),
);

function changeTheme(name: "light" | "dark") {
  theme.global.name.value = name;
}

async function changeLocale(code: string) {
  if (code === locale.value) return;
  await setLocale(code);
}

async function confirmLogout() {
  if (!import.meta.client) return;
  const ok = await toast.confirm(t("auth.confirmLogout"));
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
