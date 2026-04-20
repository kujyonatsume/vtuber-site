<template>
  <section class="mx-auto max-w-4xl space-y-6 py-8 sm:py-10">
    <div v-if="error" class="card space-y-4 p-8 text-center">
      <h1 class="text-xl font-bold">{{ t("userProfilePage.notFoundTitle") }}</h1>
      <p class="text-sm text-neutral-800">{{ t("userProfilePage.notFoundDescription") }}</p>
      <div>
        <VBtn rounded="lg" color="primary" @click="navigateTo(localePath('/'))">
          {{ t("userProfilePage.backHome") }}
        </VBtn>
      </div>
    </div>

    <template v-else>
      <header class="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div class="flex items-center gap-4">
          <img
            :src="profile?.avatar || '/favicon.ico'"
            class="h-16 w-16 rounded-2xl border border-primary-200/70 object-cover sm:h-20 sm:w-20"
          />
          <div>
            <h1 class="text-2xl font-black tracking-tight text-primary-900">
              {{ profile?.name || t("userProfilePage.unknown") }}
            </h1>
            <p class="text-sm text-neutral-800">{{ t("userProfilePage.subtitle") }}</p>
          </div>
        </div>

        <VBtn variant="tonal" rounded="lg" @click="navigateTo(localePath('/wishes'))">
          {{ t("userProfilePage.viewWishes") }}
        </VBtn>
      </header>

      <div class="card space-y-4 p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-semibold">{{ t("userProfilePage.postsTitle") }}</h2>
          <div class="flex items-center gap-2 text-sm text-neutral-800">
            <span>{{ t("userProfilePage.postsTotal", { total }) }}</span>
            <VBtn
              variant="text"
              size="small"
              :loading="pending"
              @click="refresh"
            >
              {{ t("userProfilePage.refresh") }}
            </VBtn>
          </div>
        </div>

        <div class="space-y-3">
          <article
            v-for="post in posts"
            :key="post.id"
            class="card p-4"
          >
            <header class="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div class="text-sm text-neutral-800">
                {{ formatTime(post.createdAt) }}
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

            <a
              :href="localePath(`/wishes#post-${post.id}`)"
              class="mt-3 inline-flex text-sm text-primary-700 hover:underline"
            >
              {{ t("userProfilePage.viewPost") }}
            </a>
          </article>

          <p
            v-if="!pending && !posts.length"
            class="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-700"
          >
            {{ t("userProfilePage.empty") }}
          </p>
        </div>

        <div class="flex items-center justify-center gap-2 pt-2">
          <VBtn :disabled="page <= 1" @click="page--">{{ t("pagination.prev") }}</VBtn>
          <span class="text-sm text-neutral-800">
            {{ t("pagination.pageWithTotal", { page, total: maxPage }) }}
          </span>
          <VBtn :disabled="page >= maxPage" @click="page++">{{ t("pagination.next") }}</VBtn>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { PostCategoryEnum } from "#shared/Enum";

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const page = ref(1);
const profileId = computed(() => Number(route.params.id || 0));

watch(
  () => route.params.id,
  () => {
    page.value = 1;
  },
);

const { data, pending, error, refresh } = await useFetch(
  () => `/api/public/user/${profileId.value}`,
  {
    query: computed(() => ({ page: page.value })),
    watch: [profileId, page],
  },
);

const profile = computed(() => data.value?.profile);
const posts = computed(() => data.value?.items || []);
const total = computed(() => Number(data.value?.total || 0));
const maxPage = computed(() => Math.max(1, Math.ceil(total.value / 10)));

watch(maxPage, (max) => {
  if (page.value > max) page.value = max;
});

useHead(() => ({
  title: `${profile.value?.name || t("userProfilePage.unknown")} | ${t("userProfilePage.title")}`,
}));

function formatTime(input: string | Date) {
  return new Date(input).toLocaleString();
}
</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.card {
  @apply rounded-3xl border border-primary-200/70 bg-white/90 backdrop-blur-sm;
  box-shadow: 0 10px 30px -16px rgb(var(--v-theme-on-surface) / 0.26);
}
</style>
