<template>
  <section class="mx-auto max-w-6xl space-y-6 py-8 sm:py-10">
    <header class="card hero-shell">
      <div aria-hidden class="hero-cover" />
      <div class="relative z-10 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
        <div class="flex items-center gap-4">
          <img
            :src="user?.avatar || '/favicon.ico'"
            class="h-20 w-20 rounded-2xl border border-white/70 object-cover shadow-md"
          />
          <div class="space-y-1">
            <p class="text-xs font-semibold tracking-[0.22em] text-primary-800/80">
              {{ t("userAccount.badge") }}
            </p>
            <h1 class="text-2xl font-black tracking-tight text-primary-950 sm:text-3xl">
              {{ user?.name || user?.email }}
            </h1>
            <p class="text-sm text-neutral-900">{{ user?.email }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <VChip size="small" color="primary" variant="tonal">
            {{ t("userAccount.summary.totalPosts", { total: postTotal }) }}
          </VChip>
          <VChip size="small" color="teal" variant="tonal">
            {{ t("userAccount.summary.linked", { total: linkedCount }) }}
          </VChip>
          <VChip
            size="small"
            :color="user?.hasPassword ? 'green' : 'amber'"
            variant="tonal"
          >
            {{
              user?.hasPassword
                ? t("userAccount.summary.passwordSet")
                : t("userAccount.summary.passwordUnset")
            }}
          </VChip>
        </div>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside class="card space-y-4 p-5">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-neutral-700">
          {{ t("userAccount.summary.title") }}
        </h2>

        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">{{ t("userAccount.summary.posts") }}</span>
            <strong class="summary-value">{{ postTotal }}</strong>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ t("userAccount.summary.social") }}</span>
            <strong class="summary-value">{{ linkedCount }}</strong>
          </div>
        </div>

        <div class="space-y-2">
          <VBtn
            block
            rounded="lg"
            :variant="activePanel === 'home' ? 'flat' : 'tonal'"
            :color="activePanel === 'home' ? 'primary' : undefined"
            @click="activePanel = 'home'"
          >
            {{ t("userAccount.tabs.home") }}
          </VBtn>
          <VBtn
            block
            rounded="lg"
            :variant="activePanel === 'settings' ? 'flat' : 'tonal'"
            :color="activePanel === 'settings' ? 'primary' : undefined"
            @click="activePanel = 'settings'"
          >
            {{ t("userAccount.tabs.settings") }}
          </VBtn>
          <VBtn
            v-if="!user?.hasPassword"
            block
            rounded="lg"
            color="amber"
            variant="flat"
            @click="openPasswordPanel"
          >
            {{ t("userAccount.summary.setupPassword") }}
          </VBtn>
        </div>
      </aside>

      <div class="space-y-6">
        <div v-if="activePanel === 'settings'" class="card space-y-4 p-6">
          <h2 class="font-semibold">{{ t("userAccount.settings.title") }}</h2>
          <p class="text-sm text-neutral-800">{{ t("userAccount.settings.subtitle") }}</p>

          <VDivider class="my-2" />

          <h3 class="font-semibold">{{ t("userAccount.profile.title") }}</h3>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-[180px_1fr] sm:items-start">
            <div class="space-y-3">
              <button
                type="button"
                class="avatar-trigger"
                :disabled="savingProfile"
                @click="triggerAvatarInput"
              >
                <img
                  :src="profileAvatarSrc"
                  class="avatar-image"
                />
                <span class="avatar-mask">
                  <VIcon icon="mdi-camera-outline" size="18" />
                  <span>{{ t("userAccount.profile.clickToChange") }}</span>
                </span>
              </button>
              <input
                ref="avatarInputRef"
                type="file"
                class="hidden"
                accept="image/*"
                :disabled="savingProfile"
                @change="onAvatarInputChange"
              />

              <div class="flex flex-wrap items-center gap-2">
                <VBtn
                  size="small"
                  rounded="lg"
                  variant="tonal"
                  prepend-icon="mdi-image-edit-outline"
                  :disabled="savingProfile"
                  @click="triggerAvatarInput"
                >
                  {{ t("userAccount.profile.changeAvatar") }}
                </VBtn>
                <VBtn
                  v-if="avatarFile"
                  size="small"
                  rounded="lg"
                  variant="text"
                  color="red"
                  :disabled="savingProfile"
                  @click="clearAvatarSelection"
                >
                  {{ t("userAccount.profile.cancelAvatarChange") }}
                </VBtn>
              </div>
              <p class="text-xs text-neutral-800">{{ t("userAccount.profile.avatarHint") }}</p>
            </div>
            <div class="space-y-3">
              <VTextField
                v-model="profileName"
                :label="t('userAccount.profile.displayName')"
                density="comfortable"
                hide-details
                :disabled="savingProfile"
                maxlength="40"
                counter="40"
              />
              <VChip
                v-if="avatarFile"
                size="small"
                color="primary"
                variant="tonal"
              >
                {{ t("userAccount.profile.newAvatarSelected") }}
              </VChip>

              <div class="flex items-center gap-2">
                <VBtn
                  color="primary"
                  rounded="lg"
                  :loading="savingProfile"
                  @click="saveProfile"
                >
                  {{ t("userAccount.profile.save") }}
                </VBtn>
              </div>
            </div>
          </div>

          <VDivider class="my-2" />

          <h3 class="font-semibold">{{ t("userAccount.social.title") }}</h3>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
              v-for="app in apps"
              :key="app"
              class="card flex items-center justify-between p-4"
            >
              <div>
                <div class="font-medium">{{ providerLabel(app) }}</div>
                <div class="text-xs text-neutral-900">
                  {{ isLinked(app) ? t("userAccount.social.linked") : t("userAccount.social.unlinked") }}
                </div>
              </div>
              <div class="flex gap-2">
                <VBtn
                  v-if="!isLinked(app)"
                  @click="link(app)"
                  rounded="lg"
                  variant="flat"
                >
                  {{ t("userAccount.social.link") }}
                </VBtn>
                <VBtn
                  v-else
                  color="red"
                  variant="tonal"
                  rounded="lg"
                  @click="unlink(app)"
                >
                  {{ t("userAccount.social.unlink") }}
                </VBtn>
              </div>
            </div>
          </div>

          <VDivider class="my-2" />

          <section id="password" class="space-y-3">
            <h3 class="font-semibold">{{ t("userAccount.password.title") }}</h3>
            <p class="text-sm text-neutral-800">
              {{
                user?.hasPassword
                  ? t("userAccount.password.descriptionUpdate")
                  : t("userAccount.password.descriptionCreate")
              }}
            </p>

            <VForm
              v-model="passwordValid"
              class="grid grid-cols-1 gap-3 sm:grid-cols-2"
              @submit.prevent="savePassword"
            >
              <VTextField
                v-model="password"
                :label="t('userAccount.password.newPassword')"
                density="comfortable"
                type="password"
                :rules="[passwordRules.required, passwordRules.min]"
                :disabled="savingPassword"
                autocomplete="new-password"
              />
              <VTextField
                v-model="passwordConfirm"
                :label="t('userAccount.password.confirmPassword')"
                density="comfortable"
                type="password"
                :rules="[passwordRules.required, passwordRules.match]"
                :disabled="savingPassword"
                autocomplete="new-password"
              />

              <div class="flex items-center gap-2 sm:col-span-2">
                <VBtn
                  type="submit"
                  color="primary"
                  rounded="lg"
                  :loading="savingPassword"
                >
                  {{
                    user?.hasPassword
                      ? t("userAccount.password.update")
                      : t("userAccount.password.save")
                  }}
                </VBtn>
                <span class="text-xs text-neutral-800">
                  {{ t("userAccount.password.hint") }}
                </span>
              </div>
            </VForm>
          </section>
        </div>

        <div v-else class="card space-y-4 p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="font-semibold">{{ t("userAccount.home.title") }}</h2>
            <div class="flex items-center gap-2 text-sm text-neutral-800">
              <span>{{ t("userAccount.posts.total", { total: postTotal }) }}</span>
              <VBtn
                variant="text"
                size="small"
                :loading="postsPending"
                @click="refreshPosts"
              >
                {{ t("userAccount.posts.refresh") }}
              </VBtn>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <VSelect
              v-model="postStatus"
              :items="postStatusItems"
              :label="t('userAccount.posts.statusFilter')"
              density="comfortable"
              hide-details
              style="max-width: 220px"
            />
          </div>

          <div class="space-y-3">
            <article
              v-for="post in myPosts"
              :key="post.id"
              class="card p-4"
            >
              <header class="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div class="text-sm text-neutral-800">
                  {{ new Date(post.createdAt).toLocaleString() }}
                </div>
                <div class="flex items-center gap-2">
                  <VChip size="x-small" color="primary">{{ post.category }}</VChip>
                  <VChip size="x-small" :color="statusColor(post.status)" variant="tonal">
                    {{ statusText(post.status) }}
                  </VChip>
                </div>
              </header>

              <div class="space-y-1">
                <p class="wrap-break-word whitespace-pre-wrap text-sm leading-relaxed text-neutral-900">
                  {{ displayMessage(post.id, post.message) }}
                </p>
              </div>

              <img
                v-if="post.category === PostCategoryEnum.Image"
                :src="post.assetUrl || ''"
                class="mt-3 max-h-56 w-full rounded-lg object-cover"
              />

              <a
                :href="localePath(`/wishes#post-${post.id}`)"
                class="mt-3 inline-flex text-sm text-primary-700 hover:underline"
              >
                {{ t("userAccount.posts.view") }}
              </a>

              <footer class="mt-3 flex items-center justify-end">
                <VBtn
                  v-if="post.status !== PostStatusEnum.Approve"
                  size="small"
                  color="red"
                  variant="tonal"
                  :loading="withdrawingId === post.id"
                  @click="withdrawPost(post.id)"
                >
                  {{ t("userAccount.posts.withdraw") }}
                </VBtn>
              </footer>
            </article>

            <p
              v-if="!postsPending && !myPosts?.length"
              class="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-700"
            >
              {{ t("userAccount.posts.empty") }}
            </p>
          </div>

          <div class="flex items-center justify-center gap-2 pt-2">
            <VBtn :disabled="postPage <= 1" @click="postPage--">{{ t("pagination.prev") }}</VBtn>
            <span class="text-sm text-neutral-800">
              {{ t("pagination.pageWithTotal", { page: postPage, total: postMaxPage }) }}
            </span>
            <VBtn :disabled="postPage >= postMaxPage" @click="postPage++">{{ t("pagination.next") }}</VBtn>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PostCategoryEnum, PostStatusEnum } from "#shared/Enum";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();
const { user, refresh } = useAuth();
useAuthRequiredSeo("userAccount");

const activePanel = ref<"home" | "settings">("home");
const profileName = ref("");
const avatarFile = ref<File | null>(null);
const avatarInputRef = ref<HTMLInputElement | null>(null);
const avatarPreviewUrl = ref<string | null>(null);
const savingProfile = ref(false);
const password = ref("");
const passwordConfirm = ref("");
const passwordValid = ref(false);
const savingPassword = ref(false);
const postStatus = ref<"all" | "pending" | "approve" | "reject">("all");
const postPage = ref(1);
const withdrawingId = ref<number | null>(null);
const expandedPostIds = ref<number[]>([]);
const apps = ref(["google", "discord"] as const);

const linked = computed(() => user.value?.linked || []);
const linkedCount = computed(() => linked.value.length);
const profileAvatarSrc = computed(() => avatarPreviewUrl.value || user.value?.avatar || "/favicon.ico");

const postStatusItems = computed(() => [
  { title: t("userAccount.status.all"), value: "all" },
  { title: t("userAccount.status.pending"), value: "pending" },
  { title: t("userAccount.status.approve"), value: "approve" },
  { title: t("userAccount.status.reject"), value: "reject" },
]);

const passwordRules = {
  required: (v: unknown) => !!v || t("userAccount.password.validation.required"),
  min: (v: string) => v?.length >= 8 || t("userAccount.password.validation.min"),
  match: (v: string) => v === password.value || t("userAccount.password.validation.match"),
};

const { data: postsData, pending: postsPending, refresh: refreshPosts } = await useFetch(
  "/api/user/posts",
  {
    query: computed(() => ({
      status: postStatus.value === "all" ? undefined : postStatus.value,
      page: postPage.value,
    })),
    watch: [postStatus, postPage],
  },
);

const myPosts = computed(() => postsData.value?.items);
const postTotal = computed(() => Number(postsData.value?.total || 0));
const postMaxPage = computed(() => Math.max(1, Math.ceil(postTotal.value / 10)));

watch(
  () => user.value?.name,
  (name) => {
    profileName.value = name || "";
  },
  { immediate: true },
);

watch(postStatus, () => {
  postPage.value = 1;
});

watch(
  () => route.hash,
  (hash) => {
    if (hash !== "#password") return;
    activePanel.value = "settings";

    if (!import.meta.client) return;
    nextTick(() => {
      document.getElementById("password")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  },
  { immediate: true },
);

function providerLabel(provider: "google" | "discord") {
  return provider === "google" ? "Google" : "Discord";
}

function isLinked(provider: "google" | "discord") {
  return linked.value.includes(provider);
}

function openPasswordPanel() {
  activePanel.value = "settings";
  navigateTo(`${localePath("/user/account")}#password`);
}

function triggerAvatarInput() {
  if (savingProfile.value) return;
  avatarInputRef.value?.click();
}

function onAvatarInputChange(event: Event) {
  const target = event.target as HTMLInputElement | null;
  const file = target?.files?.[0] || null;
  setAvatarFile(file);
}

function setAvatarFile(file: File | null) {
  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
    avatarPreviewUrl.value = null;
  }

  if (!file) {
    avatarFile.value = null;
    if (avatarInputRef.value) avatarInputRef.value.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error(t("userAccount.toast.avatarTooLarge"));
    avatarFile.value = null;
    if (avatarInputRef.value) avatarInputRef.value.value = "";
    return;
  }

  avatarFile.value = file;
  avatarPreviewUrl.value = URL.createObjectURL(file);
}

function clearAvatarSelection() {
  setAvatarFile(null);
}

async function link(provider: "google" | "discord") {
  const { url } = await $fetch<{ url: string }>(`/api/auth/${provider}`, {
    method: "GET",
  });
  window.location.href = url;
}

async function unlink(provider: "google" | "discord") {
  await $fetch(`/api/auth/unlink/${provider}`, { method: "POST" });
  await refresh();
  toast.success(t("userAccount.toast.unlinkSuccess"));
}

async function saveProfile() {
  const name = profileName.value.trim();
  if (!name) {
    toast.error(t("userAccount.toast.nameRequired"));
    return;
  }

  savingProfile.value = true;
  try {
    const file = avatarFile.value;

    const form = new FormData();
    form.append("name", name);
    if (file) form.append("avatar", file);

    await $fetch("/api/user/profile", {
      method: "POST",
      body: form,
    });

    await refresh();
    clearAvatarSelection();
    toast.success(t("userAccount.toast.profileUpdated"));
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || t("userAccount.toast.updateFailed"));
  } finally {
    savingProfile.value = false;
  }
}

onBeforeUnmount(() => {
  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
  }
});

async function savePassword() {
  if (!passwordValid.value) return;

  savingPassword.value = true;
  try {
    await $fetch("/api/user/password", {
      method: "POST",
      body: { password: password.value },
    });

    password.value = "";
    passwordConfirm.value = "";
    await refresh();
    toast.success(t("userAccount.toast.passwordSaved"));
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || t("userAccount.toast.passwordFailed"));
  } finally {
    savingPassword.value = false;
  }
}

function statusText(status: PostStatusEnum) {
  if (status === PostStatusEnum.Approve) return t("userAccount.postStatus.approve");
  if (status === PostStatusEnum.Reject) return t("userAccount.postStatus.reject");
  return t("userAccount.postStatus.pending");
}

function statusColor(status: PostStatusEnum) {
  if (status === PostStatusEnum.Approve) return "green";
  if (status === PostStatusEnum.Reject) return "red";
  return "amber";
}

function fullText(message: string) {
  return (message || "").trim();

}

function normalizeText(message: string) {
  return (message || "").replace(/\s+/g, " ").trim();
}

function displayMessage(id: number, message: string) {
  if (isPostExpanded(id)) return fullText(message);

  const normalized = normalizeText(message);

  return normalized.length > 180 ? `${normalized.slice(0, 180)}...` : normalized;
}

function isPostExpanded(id: number) {
  return expandedPostIds.value.includes(id);
}

async function withdrawPost(id: number) {
  const ok = await toast.confirm(t("userAccount.toast.confirmWithdraw"));
  if (!ok) return;

  withdrawingId.value = id;
  try {
    await $fetch("/api/user/withdraw", {
      method: "POST",
      body: { id },
    });

    expandedPostIds.value = expandedPostIds.value.filter((item) => item !== id);
    toast.success(t("userAccount.toast.withdrawSuccess"));

    await refreshPosts();
    if (!myPosts.value?.length && postPage.value > 1) {
      postPage.value -= 1;
      await refreshPosts();
    }
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || t("userAccount.toast.withdrawFailed"));
  } finally {
    withdrawingId.value = null;
  }
}
</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.card {
  @apply rounded-3xl border border-primary-200/70 bg-white/90 backdrop-blur-sm;
  box-shadow: 0 10px 30px -16px rgb(var(--v-theme-on-surface) / 0.26);
}

.hero-shell {
  @apply relative overflow-hidden;
}

.hero-cover {
  @apply absolute inset-0;
  background:
    radial-gradient(circle at 12% 20%, rgb(var(--v-theme-primary) / 0.24), transparent 52%),
    radial-gradient(circle at 85% 78%, rgb(var(--v-theme-secondary) / 0.2), transparent 48%),
    linear-gradient(135deg, rgb(255 255 255 / 0.88), rgb(248 251 255 / 0.95));
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

@media (max-width: 380px) {
  .summary-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.summary-item {
  @apply rounded-2xl border border-primary-100/80 bg-primary-50/70 px-3 py-3;
}

.summary-label {
  @apply block text-xs text-neutral-700;
}

.summary-value {
  @apply mt-1 block text-lg font-bold text-primary-900;
}

.avatar-trigger {
  @apply relative block overflow-hidden rounded-3xl border border-primary-200/80 bg-white;
  width: 8rem;
  height: 8rem;
  cursor: pointer;
  box-shadow: 0 8px 20px -14px rgb(var(--v-theme-on-surface) / 0.38);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

@media (min-width: 640px) {
  .avatar-trigger {
    width: 10rem;
    height: 10rem;
  }
}

.avatar-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 26px -18px rgb(var(--v-theme-on-surface) / 0.46);
}

.avatar-trigger:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgb(var(--v-theme-primary) / 0.45),
    0 16px 26px -18px rgb(var(--v-theme-on-surface) / 0.46);
}

.avatar-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.8;
  transform: none;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-mask {
  @apply pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center text-xs font-medium text-white;
  opacity: 0;
  transition: opacity 0.2s ease;
  background: linear-gradient(to top, rgb(15 23 42 / 0.78), rgb(15 23 42 / 0.2));
}

.avatar-trigger:hover .avatar-mask,
.avatar-trigger:focus-visible .avatar-mask,
.avatar-trigger:active .avatar-mask {
  opacity: 1;
}

@media (hover: none) {
  .avatar-mask {
    opacity: 1;
    background: linear-gradient(to top, rgb(15 23 42 / 0.62), rgb(15 23 42 / 0.18));
  }
}
</style>
