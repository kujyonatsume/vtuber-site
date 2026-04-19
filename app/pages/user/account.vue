<template>
  <section class="mx-auto max-w-3xl space-y-6 py-10">
    <h1 class="text-2xl font-bold">{{ t("userAccount.title") }}</h1>

    <div class="card space-y-4 p-6">
      <div class="flex items-center gap-3">
        <img
          :src="user?.avatar || '/favicon.ico'"
          class="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <div class="font-semibold">{{ user?.name || user?.email }}</div>
          <div class="text-sm text-neutral-900">{{ user?.email }}</div>
        </div>
      </div>

      <VDivider class="my-2" />

      <h2 class="font-semibold">{{ t("userAccount.profile.title") }}</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <img
          :src="user?.avatar || '/favicon.ico'"
          class="h-16 w-16 rounded-full border border-neutral-300/70 object-cover"
        />
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

          <VFileInput
            v-model="avatarFile"
            :label="t('userAccount.profile.avatar')"
            density="comfortable"
            hide-details
            prepend-icon="mdi-image-outline"
            accept="image/*"
            :disabled="savingProfile"
          />

          <div class="flex items-center gap-2">
            <VBtn
              color="primary"
              rounded="lg"
              :loading="savingProfile"
              @click="saveProfile"
            >
              {{ t("userAccount.profile.save") }}
            </VBtn>
            <span class="text-xs text-neutral-800">{{ t("userAccount.profile.avatarHint") }}</span>
          </div>
        </div>
      </div>

      <VDivider class="my-2" />

      <h2 class="font-semibold">{{ t("userAccount.social.title") }}</h2>
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
    </div>

    <div class="card space-y-4 p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-semibold">{{ t("userAccount.posts.title") }}</h2>
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
              <VChip v-if="post.isAnonymous" size="x-small" color="grey" variant="tonal">
                {{ t("userAccount.posts.anonymous") }}
              </VChip>
              <VChip size="x-small" :color="statusColor(post.status)" variant="tonal">
                {{ statusText(post.status) }}
              </VChip>
            </div>
          </header>

          <div class="space-y-1">
            <p class="break-words whitespace-pre-wrap text-sm leading-relaxed text-neutral-900">
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
  </section>
</template>

<script setup lang="ts">
import { PostCategoryEnum, PostStatusEnum } from "#shared/Enum";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const localePath = useLocalePath();
const { user, refresh } = useAuth();
useAuthRequiredSeo("userAccount");

const profileName = ref("");
const avatarFile = ref<File | File[] | null>(null);
const savingProfile = ref(false);
const postStatus = ref<"all" | "pending" | "approve" | "reject">("all");
const postPage = ref(1);
const withdrawingId = ref<number | null>(null);
const expandedPostIds = ref<number[]>([]);
const apps = ref(["google", "discord"] as const);

const linked = computed(() => user.value?.linked);

const postStatusItems = computed(() => [
  { title: t("userAccount.status.all"), value: "all" },
  { title: t("userAccount.status.pending"), value: "pending" },
  { title: t("userAccount.status.approve"), value: "approve" },
  { title: t("userAccount.status.reject"), value: "reject" },
]);

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

function providerLabel(provider: "google" | "discord") {
  return provider === "google" ? "Google" : "Discord";
}

function isLinked(provider: "google" | "discord") {
  return (linked.value || []).some((item) => item === provider);
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
    const file = Array.isArray(avatarFile.value) ? avatarFile.value[0] : avatarFile.value;

    const form = new FormData();
    form.append("name", name);
    if (file) form.append("avatar", file);

    await $fetch("/api/user/profile", {
      method: "POST",
      body: form,
    });

    await refresh();
    avatarFile.value = null;
    toast.success(t("userAccount.toast.profileUpdated"));
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || t("userAccount.toast.updateFailed"));
  } finally {
    savingProfile.value = false;
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
  const text = (message || "").trim();
  return text || t("blessingCard.empty");
}

function normalizeText(message: string) {
  return (message || "").replace(/\s+/g, " ").trim();
}

function displayMessage(id: number, message: string) {
  if (isPostExpanded(id)) return fullText(message);

  const normalized = normalizeText(message);
  if (!normalized) return t("blessingCard.empty");

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
</style>
