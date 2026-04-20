<template>
  <section class="mx-auto max-w-5xl space-y-6 py-8 sm:py-10">
    <header class="space-y-2">
      <h1 class="text-3xl font-black tracking-tight text-primary-900">{{ t("searchPage.title") }}</h1>
      <p class="text-sm text-neutral-800">{{ t("searchPage.description") }}</p>
    </header>

    <div class="card space-y-4 p-5 sm:p-6">
      <div class="flex flex-wrap items-center gap-2">
        <VTextField
          v-model="keyword"
          :label="t('searchPage.keywordLabel')"
          :placeholder="t('searchPage.keywordPlaceholder')"
          density="comfortable"
          hide-details
          class="min-w-72 flex-1"
          @keydown.enter.prevent="runSearch({ resetPage: true })"
        />
        <VBtn
          rounded="lg"
          color="primary"
          :loading="searching"
          @click="runSearch({ resetPage: true })"
        >
          {{ t("searchPage.search") }}
        </VBtn>
      </div>

      <div class="flex items-center gap-2">
        <VBtn
          rounded="lg"
          :variant="activeTab === 'users' ? 'flat' : 'tonal'"
          :color="activeTab === 'users' ? 'primary' : undefined"
          @click="setActiveTab('users')"
        >
          {{ t("searchPage.tabs.users") }}
        </VBtn>
        <VBtn
          rounded="lg"
          :variant="activeTab === 'posts' ? 'flat' : 'tonal'"
          :color="activeTab === 'posts' ? 'primary' : undefined"
          @click="setActiveTab('posts')"
        >
          {{ t("searchPage.tabs.posts") }}
        </VBtn>
      </div>

      <p v-if="!hasSearched" class="text-sm text-neutral-800">{{ t("searchPage.hint") }}</p>

      <template v-else-if="activeTab === 'users'">
        <p class="text-sm text-neutral-800">{{ t("searchPage.userCount", { total: users.length }) }}</p>
        <div v-if="users.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            v-for="item in users"
            :key="item.id"
            type="button"
            class="result-user"
            @click="openUserProfile(item.id)"
          >
            <div class="flex min-w-0 items-center gap-3">
              <img
                :src="item.avatar || '/favicon.ico'"
                class="h-10 w-10 rounded-full border border-primary-100 object-cover"
              />
              <span class="truncate text-sm font-medium text-neutral-900">{{ item.name }}</span>
            </div>
            <VIcon icon="mdi-arrow-top-right" size="18" class="text-primary-700" />
          </button>
        </div>
        <p v-else class="text-sm text-neutral-800">{{ t("searchPage.emptyUsers") }}</p>
      </template>

      <template v-else>
        <p class="text-sm text-neutral-800">{{ t("searchPage.postCount", { total: postTotal }) }}</p>
        <div class="space-y-3">
          <article
            v-for="post in posts"
            :key="post.id"
            class="card p-4"
          >
            <header class="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2 text-sm text-neutral-800">
                <button
                  v-if="post.authorId"
                  type="button"
                  class="inline-flex items-center gap-1 text-primary-700 hover:underline"
                  @click="openUserProfile(post.authorId)"
                >
                  <img
                    v-if="post.authorAvatar"
                    :src="post.authorAvatar"
                    class="h-5 w-5 rounded-full object-cover"
                  />
                  <span>{{ post.authorName || t("searchPage.unknownUser") }}</span>
                </button>
                <span v-else>{{ t("searchPage.anonymous") }}</span>
                <span>·</span>
                <span>{{ formatTime(post.createdAt) }}</span>
              </div>
              <VChip size="x-small" color="primary">{{ post.category }}</VChip>
            </header>

            <p class="break-words whitespace-pre-wrap text-sm leading-relaxed text-neutral-900">
              {{ post.message || t("blessingCard.empty") }}
            </p>

            <img
              v-if="post.category === PostCategoryEnum.Image"
              :src="post.assetUrl || ''"
              class="mt-3 max-h-56 w-full rounded-lg object-cover"
            />

            <button
              type="button"
              class="mt-3 inline-flex text-sm text-primary-700 hover:underline"
              @click="openPost(post.id)"
            >
              {{ t("searchPage.viewPost") }}
            </button>
          </article>

          <p
            v-if="!posts.length"
            class="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-700"
          >
            {{ t("searchPage.emptyPosts") }}
          </p>
        </div>

        <div class="flex items-center justify-center gap-2 pt-1">
          <VBtn :disabled="postPage <= 1" @click="goPrevPage">{{ t("pagination.prev") }}</VBtn>
          <span class="text-sm text-neutral-800">
            {{ t("pagination.pageWithTotal", { page: postPage, total: postMaxPage }) }}
          </span>
          <VBtn :disabled="postPage >= postMaxPage" @click="goNextPage">{{ t("pagination.next") }}</VBtn>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PostCategoryEnum } from "#shared/Enum";

type ISearchUserItem = {
  id: number;
  name: string;
  avatar?: string | null;
};

type ISearchPostItem = {
  id: number;
  category: string;
  message: string;
  assetUrl?: string | null;
  createdAt: string | Date;
  isAnonymous: boolean;
  authorId?: number | null;
  authorName?: string | null;
  authorAvatar?: string | null;
};

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
useI18nPageSeo({ pageKey: "searchPage" });

const keyword = ref(typeof route.query.q === "string" ? route.query.q : "");
const activeTab = ref<"users" | "posts">(route.query.tab === "posts" ? "posts" : "users");
const postPage = ref(Math.max(1, parseInt(String(route.query.page || "1"), 10) || 1));
const searching = ref(false);
const hasSearched = ref(false);
const users = ref<ISearchUserItem[]>([]);
const posts = ref<ISearchPostItem[]>([]);
const postTotal = ref(0);
const postPageSize = ref(10);

const postMaxPage = computed(() => Math.max(1, Math.ceil(postTotal.value / postPageSize.value)));

onMounted(async () => {
  if (!keyword.value.trim()) return;
  hasSearched.value = true;
  await runSearch({ resetPage: false, syncQuery: false });
});

function setActiveTab(tab: "users" | "posts") {
  activeTab.value = tab;
  syncQuery();
}

async function runSearch(
  options: {
    resetPage?: boolean;
    syncQuery?: boolean;
  } = {},
) {
  if (options.resetPage) postPage.value = 1;
  if (options.syncQuery !== false) syncQuery();

  const q = keyword.value.trim();
  hasSearched.value = !!q;
  if (!q) {
    users.value = [];
    posts.value = [];
    postTotal.value = 0;
    return;
  }

  searching.value = true;
  try {
    const res = await $fetch<{
      users?: ISearchUserItem[];
      posts?: ISearchPostItem[];
      postTotal?: number;
      postPageSize?: number;
    }>("/api/public/search", {
      query: { q, page: postPage.value },
    });

    users.value = res.users || [];
    posts.value = res.posts || [];
    postTotal.value = Number(res.postTotal || 0);
    postPageSize.value = Math.max(1, Number(res.postPageSize || 10));

    if (postPage.value > postMaxPage.value) {
      postPage.value = postMaxPage.value;
      await runSearch({ resetPage: false, syncQuery: true });
      return;
    }
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || t("searchPage.toast.searchFailed"));
  } finally {
    searching.value = false;
  }
}

function syncQuery() {
  if (!import.meta.client) return;
  const q = keyword.value.trim();

  router.replace({
    query: {
      q: q || undefined,
      tab: activeTab.value,
      page: q ? String(postPage.value) : undefined,
    },
  });
}

async function goPrevPage() {
  if (postPage.value <= 1) return;
  postPage.value -= 1;
  await runSearch({ resetPage: false });
}

async function goNextPage() {
  if (postPage.value >= postMaxPage.value) return;
  postPage.value += 1;
  await runSearch({ resetPage: false });
}

function openUserProfile(id: number) {
  navigateTo(localePath(`/user/${id}`));
}

function openPost(id: number) {
  navigateTo(localePath(`/wishes#post-${id}`));
}

function formatTime(input: string | Date) {
  return new Date(input).toLocaleString();
}
</script>

<style scoped lang="scss">
@reference "../assets/styles/tailwind.css";

.card {
  @apply rounded-3xl border border-primary-200/70 bg-white/90 backdrop-blur-sm;
  box-shadow: 0 10px 30px -16px rgb(var(--v-theme-on-surface) / 0.26);
}

.result-user {
  @apply flex items-center justify-between rounded-xl border border-primary-100/80 bg-white px-3 py-2 text-left transition hover:border-primary-300 hover:bg-primary-50/60;
}
</style>
