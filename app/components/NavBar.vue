<template>
  <header
    :class="[
      'sticky top-0 z-40 border-b border-primary-200/80 bg-primary-50/85 backdrop-blur',
    ]"
  >
    <div
      class="relative flex items-center justify-between py-3 layout-container"
    >
      <nav class="flex h-10 items-center justify-center text-primary-900">
        <NuxtLink
          :to="localePath('/')"
          class="group flex h-10 items-center gap-2 pr-5"
        >
          <img src="/favicon.ico" alt="logo" class="h-8 w-8 animate-float" />
          <span class="hidden font-bold leading-none tracking-wide md:block">
            {{ t("common.projectName") }}
          </span>
        </NuxtLink>

        <NuxtLink
          v-for="link in pageLinks"
          :key="link.to"
          :to="link.to"
          class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-3 leading-none hover:bg-secondary-100/80"
          active-class="font-semibold text-primary-700"
        >
          {{ link.title }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <div class="hidden md:block">
          <button
            type="button"
            class="locale-pill"
            :class="{ 'is-en': locale === 'en' }"
            :aria-label="t('common.language')"
            :aria-pressed="locale === 'en'"
            @click="changeLocale(locale === 'en' ? 'zh' : 'en')"
          >
            <span class="locale-pill-thumb" aria-hidden="true" />
            <span
              class="locale-pill-item"
              :class="{ 'is-active': locale !== 'en' }"
            >
              ZH
            </span>
            <span
              class="locale-pill-item"
              :class="{ 'is-active': locale === 'en' }"
            >
              EN
            </span>
          </button>
        </div>
        <VBtn
          v-if="!user && !isCompact"
          @click="openDialog()"
          variant="text"
          class="px-2"
        >
          <img
            :src="'/favicon.ico'"
            class="h-8 w-8 rounded-full object-cover"
            alt="avatar"
          />
          <template v-if="width >= 640">
            <span class="ml-2 hidden sm:inline">{{ "未登入" }}</span>
          </template>
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
    to: localePath("/news"),
    title: t("nav.news"),
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
  //  {
  //    to: localePath("/search"),
  //    title: t("nav.search"),
  //    icon: "mdi-magnify",
  //  },
  {
    to: localePath("/about"),
    title: t("nav.about"),
    icon: "mdi-information-outline",
  },
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
.locale-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  width: 124px;
  border-radius: 999px;
  border: 1px solid rgb(var(--v-theme-on-surface) / 0.14);
  background-color: rgb(var(--v-theme-on-surface) / 0.08);
  overflow: hidden;
  transition:
    border-color 0.24s ease,
    background-color 0.24s ease;
}

.locale-pill:hover {
  border-color: rgb(var(--v-theme-primary) / 0.4);
  background-color: rgb(var(--v-theme-on-surface) / 0.12);
}

.locale-pill:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary) / 0.55);
  outline-offset: 2px;
}

.locale-pill-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 999px;
  background-image: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    color-mix(in srgb, rgb(var(--v-theme-primary)) 70%, white)
  );
  box-shadow: 0 6px 14px -8px rgb(var(--v-theme-primary) / 0.9);
  transform: translateX(0);
  transition: transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);
  z-index: 0;
}

.locale-pill.is-en .locale-pill-thumb {
  transform: translateX(100%);
}

.locale-pill-item {
  position: relative;
  z-index: 1;
  flex: 1 1 50%;
  min-width: 54px;
  padding: 9px 14px;
  border-radius: 999px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;
  color: rgb(var(--v-theme-on-surface) / 0.78);
  transition: color 0.22s ease;
}

.locale-pill-item.is-active {
  color: rgb(var(--v-theme-on-primary, 255 255 255));
}

@media (prefers-reduced-motion: reduce) {
  .locale-pill,
  .locale-pill-thumb,
  .locale-pill-item {
    transition: none !important;
  }
}
</style>
