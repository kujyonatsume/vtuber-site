<template>
  <header
    :class="[
      'sticky top-0 z-40 border-b border-primary-200/80 bg-primary-50/85 backdrop-blur',
    ]"
  >
    <div
      class="relative flex items-center justify-between py-3 layout-container"
    >
      <NuxtLink :to="localePath('/')" class="group flex items-center gap-2">
        <img src="/favicon.ico" alt="logo" class="h-8 w-8 animate-float" />
        <span class="font-bold tracking-wide md:block hidden">{{
          t("common.projectName")
        }}</span>
      </NuxtLink>

      <nav
        class="flex items-center gap-2 text-sm text-primary-900"
      >
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
            <VBtn
              v-bind="props"
              color="primary"
              rounded="lg"
              variant="tonal"
              class="hidden md:block"
            >
              <VIcon icon="mdi-translate" />
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
        <VBtn v-if="!isCompact" color="primary" rounded="lg" variant="tonal">
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
        </VBtn>
        <VBtn
          v-if="!user && !isCompact"
          color="primary"
          rounded="lg"
          variant="tonal"
          @click="openDialog()"
        >
          <VIcon icon="mdi-account" />
        </VBtn>
        <VMenu v-if="user && !isCompact">
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
            <VListItem
              :to="localePath('/wishes/new')"
              :title="t('common.submitWish')"
            />
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
            <VListItem
              :to="localePath('/user/account')"
              :title="t('common.account')"
            />
            <VDivider />
            <VListItem :title="t('common.logout')" @click="confirmLogout()" />
          </VList>
        </VMenu>
        <VMenu
          v-if="isCompact"
          v-model="drawer"
          location="bottom end"
          :close-on-content-click="false"
        >
          <template #activator="{ props }">
            <VBtn v-bind="props" variant="tonal">
              <VIcon icon="mdi-menu" />
            </VBtn>
          </template>
          <VList density="compact" min-width="260">
            <VListItem
              v-if="!user"
              :title="t('common.login')"
              @click="openDialog()"
            />
            <template v-else>
              <VListItem variant="text" class="px-2">
                <!-- 頭貼 -->
                <template #prepend>
                  <VListItemMedia>
                    <img
                      :src="user.avatar || '/favicon.ico'"
                      class="h-6 w-6 rounded-full object-cover"
                      alt="avatar"
                    />
                  </VListItemMedia>
                </template>

                <!-- 文字 -->
                <VListItemTitle>
                  {{ user.name }}
                </VListItemTitle>
              </VListItem>

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
            <VListItem
              :to="localePath('/search')"
              :title="t('nav.search')"
              @click="drawer = false"
            />
            <VDivider class="my-2" />
            <VListSubheader>{{ t("common.language") }}</VListSubheader>
            <VListItem
              v-for="item in localeItems"
              :key="`menu-${item.code}`"
              :title="item.label"
              :active="item.code === locale"
              @click="changeLocale(item.code)"
            />
          </VList>
        </VMenu>
      </div>
    </div>
  </header>
  <VBtn
    v-if="isCompact"
    class="theme-fab"
    color="primary"
    icon
    size="large"
    elevation="8"
    :title="isDark ? t('common.themeLight') : t('common.themeDark')"
    @click="changeTheme(isDark ? 'light' : 'dark')"
  >
    <VIcon
      :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
      size="22"
    />
  </VBtn>

  <ClientOnly>
    <LoginDialog v-model="loginOpen" />
  </ClientOnly>
</template>

<script setup lang="ts">
const theme = useTheme();
const { width } = useDisplay();
const localePath = useLocalePath();
const { t, locale, locales, setLocale } = useI18n();
type LocaleCode = Parameters<typeof setLocale>[0];
type ThemeName = "light" | "dark";
const { user, loginOpen, drawer, logout, openDialog } = useLogin();
const themePreference = useCookie<string>("theme", { sameSite: "lax" });
const pageLinks = computed(() => [
  {
    to: localePath("/"),
    title: t("nav.home"),
    icon: "mdi-home-outline"
  },
  {
    to: localePath("/event"),
    title: t("nav.event"),
    icon: "mdi-calendar-star",
  },
  {
    to: localePath("/clips"),
    title: t("nav.clips"),
    icon: "mdi-movie-open-outline",
  },
  {
    to: localePath("/wishes"),
    title: t("nav.wishes"),
    icon: "mdi-heart-multiple-outline",
  },
  {
    to: localePath("/search"),
    title: t("nav.search"),
    icon: "mdi-magnify",
  },
  {
    to: localePath("/about"),
    title: t("nav.about"),
    icon: "mdi-information-outline",
  }
]);

const isDark = computed(() => theme.global.name.value === "dark");
const isCompact = computed(() => width.value < 600);

const normalizeTheme = (name: string | null | undefined): ThemeName =>
  name === "dark" ? "dark" : "light";

theme.global.name.value = normalizeTheme(themePreference.value);

const localeItems = computed(() =>
  locales.value.map((entry) => {
    const normalized = entry as { code: LocaleCode; name?: string };
    return {
      code: normalized.code,
      label: normalized.name || normalized.code.toUpperCase(),
    };
  }),
);

function changeTheme(name: ThemeName) {
  theme.global.name.value = name;
  themePreference.value = name;
}

async function changeLocale(code: LocaleCode) {
  if (code === locale.value) return;
  await setLocale(code);
  drawer.value = false;
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

.theme-fab {
  @apply fixed bottom-4 right-4 z-70;
}
</style>
