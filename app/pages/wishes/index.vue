<template>
  <section class="layout-container section-shell">
    <div class="page-header">
      <h1 class="page-title">{{ t("wishes.title") }}</h1>

      <div class="header-actions">
        <form
          class="wish-search-pill"
          :aria-label="t('nav.search')"
          @submit.prevent="goSearch"
        >
          <input
            v-model.trim="searchKeyword"
            type="text"
            class="wish-search-input"
            :placeholder="t('searchPage.keywordPlaceholder')"
            :aria-label="t('searchPage.keywordLabel')"
          />

          <button
            type="submit"
            class="wish-search-icon-btn"
            :aria-label="t('searchPage.search')"
          >
            <VIcon icon="mdi-magnify" size="20" />
          </button>
        </form>

        <div
          class="wish-filter-popover"
          :class="{
            'is-dark': isAdvancedWishDarkTheme,
            'is-light': !isAdvancedWishDarkTheme,
          }"
        >
          <button
            type="button"
            class="wish-filter-btn"
            :aria-label="t('searchPage.advanced.toggle')"
            :class="{ 'is-active': showAdvancedFilters || hasAdvancedFilters }"
            @click="toggleAdvancedFilters"
          >
            <VIcon icon="mdi-tune-variant" size="20" />
          </button>

          <Transition name="wish-advanced-popover">
            <div
              v-if="showAdvancedFilters"
              class="wish-advanced-popover"
              role="dialog"
              aria-modal="false"
              :aria-label="t('searchPage.advanced.toggle')"
              @click.stop
            >
              <div class="wish-advanced-header">
                <strong class="wish-advanced-title">進階搜尋</strong>

                <button
                  type="button"
                  class="wish-filter-btn wish-filter-btn--icon"
                  aria-label="關閉進階搜尋"
                  @click="closeAdvancedFilters"
                >
                  <VIcon icon="mdi-close" size="18" />
                </button>
              </div>

              <div class="wish-advanced-body">
                <label class="wish-advanced-field">
                  <span class="wish-advanced-label">內容</span>
                  <input
                    v-model.trim="advancedFilters.content"
                    name="content"
                    type="search"
                    placeholder="搜尋願望內容"
                    class="wish-advanced-input"
                  />
                </label>

                <label class="wish-advanced-field">
                  <span class="wish-advanced-label">使用者</span>
                  <input
                    v-model.trim="advancedFilters.author"
                    name="author"
                    type="search"
                    placeholder="搜尋使用者名稱，可用 @name"
                    class="wish-advanced-input"
                  />
                </label>

                <div class="wish-advanced-grid wish-advanced-grid--half">
                  <label class="wish-advanced-field">
                    <span class="wish-advanced-label">標籤</span>
                    <input
                      v-model.trim="advancedFilters.tags"
                      name="tags"
                      type="search"
                      placeholder="以逗號、空白或 # 分隔"
                      class="wish-advanced-input"
                    />
                  </label>

                  <label class="wish-advanced-field">
                    <span class="wish-advanced-label">主題</span>
                    <input
                      v-model.trim="advancedFilters.topic"
                      name="topic"
                      type="search"
                      placeholder="搜尋主題"
                      class="wish-advanced-input"
                    />
                  </label>
                </div>

                <div class="wish-advanced-grid wish-advanced-grid--half">
                  <label class="wish-advanced-field">
                    <span class="wish-advanced-label">開始時間</span>
                    <input
                      v-model="advancedFilters.startDate"
                      name="startDate"
                      type="date"
                      class="wish-advanced-input"
                    />
                  </label>

                  <label class="wish-advanced-field">
                    <span class="wish-advanced-label">結束時間</span>
                    <input
                      v-model="advancedFilters.endDate"
                      name="endDate"
                      type="date"
                      class="wish-advanced-input"
                    />
                  </label>
                </div>
              </div>

              <div class="wish-advanced-actions">
                <button
                  type="button"
                  class="wish-filter-btn wish-filter-btn--text"
                  @click="clearAdvancedFilters"
                >
                  清除
                </button>

                <button
                  type="button"
                  class="wish-filter-btn is-active wish-filter-btn--text"
                  @click="applyAdvancedFilters"
                >
                  套用
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <NuxtLink :to="localePath('/wishes/new')" class="btn-accent">
          {{ t("wishes.create") }}
        </NuxtLink>
      </div>
    </div>

    <div
      v-if="activeFilterChips.length"
      class="wish-active-filters"
      :aria-label="t('searchPage.advanced.activeFilters')"
    >
      <span
        v-for="chip in activeFilterChips"
        :key="chip"
        class="wish-active-chip"
      >
        {{ chip }}
      </span>
    </div>

    <div
      ref="masonryRef"
      class="relative w-full"
      :style="{ height: `${containerHeight}px` }"
    >
      <div
        v-for="(item, index) in displayedList"
        :key="item.id"
        :ref="(el) => setItemRef(el, index)"
        class="absolute transition-all duration-300"
        :style="itemStyles[index]"
      >
        <BlessingCard :item="item" />
      </div>
    </div>

    <div
      v-if="hasMore"
      ref="loadMoreTrigger"
      class="h-2 w-full"
      aria-hidden="true"
    />
  </section>
</template>

<script setup lang="ts">
type BoardItem = {
  id: number | string;
  displayName?: string;
  nickname?: string;
  category: string;
  message: string;
  assetUrl?: string | null;
  createdAt: string | Date;
};

type ListCursor = {
  createdAt: string;
  id: number | string;
};

type ListResponse = {
  items: BoardItem[];
  hasMore: boolean;
  nextCursor?: ListCursor | null;
};

type ParsedSearch = {
  keywords: string[];
  authors: string[];
  tags: string[];
};

type AdvancedFilters = {
  content: string;
  author: string;
  tags: string;
  topic: string;
  startDate: string;
  endDate: string;
};

type AppliedFilters = {
  keyword: string;
  content: string;
  authors: string[];
  tags: string[];
  topic: string;
  startDate: string;
  endDate: string;
};

const { t } = useI18n();
const localePath = useLocalePath();
useI18nPageSeo({ pageKey: "wishes" });

const PAGE_SIZE = 30;
const GAP = 16;
const MIN_ITEM_WIDTH = 300;

const createEmptyAdvancedFilters = (): AdvancedFilters => ({
  content: "",
  author: "",
  tags: "",
  topic: "",
  startDate: "",
  endDate: "",
});

const createEmptyAppliedFilters = (): AppliedFilters => ({
  keyword: "",
  content: "",
  authors: [],
  tags: [],
  topic: "",
  startDate: "",
  endDate: "",
});

const searchKeyword = ref("");
const advancedFilters = ref<AdvancedFilters>(createEmptyAdvancedFilters());
const appliedFilters = ref<AppliedFilters>(createEmptyAppliedFilters());
const showAdvancedFilters = ref(false);
const isAdvancedWishDarkTheme = ref(false);

const displayedList = ref<BoardItem[]>([]);
const hasMore = ref(true);
const loadingMore = ref(false);
const nextCursor = ref<ListCursor | null>(null);

const masonryRef = ref<HTMLElement | null>(null);
const loadMoreTrigger = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const itemStyles = ref<Record<number, Record<string, string>>>({});
const containerHeight = ref(0);

let resizeObserver: ResizeObserver | null = null;
let loadMoreObserver: IntersectionObserver | null = null;
let relayoutTimer: ReturnType<typeof setTimeout> | null = null;
let themeObserver: MutationObserver | null = null;
let darkPreferenceQuery: MediaQueryList | null = null;
let requestVersion = 0;

const hasAdvancedFilters = computed(() =>
  Object.values(advancedFilters.value).some((value) => value.trim()),
);

const activeFilterChips = computed(() => {
  const filters = appliedFilters.value;

  return [
    ...(filters.keyword ? [filters.keyword] : []),
    ...(filters.content ? [`內容：${filters.content}`] : []),
    ...filters.authors.map((author) => `@${author}`),
    ...filters.tags.map((tag) => `#${tag}`),
    ...(filters.topic ? [`主題：${filters.topic}`] : []),
    ...(filters.startDate ? [`開始：${filters.startDate}`] : []),
    ...(filters.endDate ? [`結束：${filters.endDate}`] : []),
  ];
});

function uniqueTerms(values: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  values.forEach((value) => {
    const normalized = value.trim().toLowerCase();

    if (!normalized || seen.has(normalized)) return;

    seen.add(normalized);
    output.push(normalized);
  });

  return output;
}

function parseTerms(raw: string, marker?: "@" | "#") {
  return uniqueTerms(
    raw
      .split(/[\s,，、]+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => (marker && part.startsWith(marker) ? part.slice(1) : part))
      .filter(Boolean),
  );
}

function parseSearch(raw: string): ParsedSearch {
  const authors: string[] = [];
  const tags: string[] = [];
  const keywords: string[] = [];

  raw
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .forEach((token) => {
      if (token.startsWith("@") && token.length > 1) {
        authors.push(token.slice(1));
        return;
      }

      if (token.startsWith("#") && token.length > 1) {
        tags.push(token.slice(1));
        return;
      }

      keywords.push(token);
    });

  return {
    keywords: uniqueTerms(keywords),
    authors: uniqueTerms(authors),
    tags: uniqueTerms(tags),
  };
}

function buildAppliedFilters(): AppliedFilters {
  const parsed = parseSearch(searchKeyword.value);
  const draft = advancedFilters.value;

  return {
    keyword: parsed.keywords.join(" "),
    content: draft.content.trim(),
    authors: uniqueTerms([
      ...parsed.authors,
      ...parseTerms(draft.author, "@"),
    ]),
    tags: uniqueTerms([
      ...parsed.tags,
      ...parseTerms(draft.tags, "#"),
    ]),
    topic: draft.topic.trim(),
    startDate: draft.startDate.trim(),
    endDate: draft.endDate.trim(),
  };
}

function createListQuery(reset: boolean) {
  const filters = appliedFilters.value;

  return {
    limit: PAGE_SIZE,
    q: filters.keyword || undefined,
    content: filters.content || undefined,
    authors: filters.authors.length ? filters.authors.join(",") : undefined,
    tags: filters.tags.length ? filters.tags.join(",") : undefined,
    topic: filters.topic || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    cursorCreatedAt: !reset ? nextCursor.value?.createdAt : undefined,
    cursorId: !reset ? nextCursor.value?.id : undefined,
  };
}

async function fetchBatch(reset = false) {
  if (!reset && loadingMore.value) return;
  if (!reset && !hasMore.value) return;

  const currentVersion = reset ? ++requestVersion : requestVersion;
  loadingMore.value = true;

  try {
    const res = await $fetch<ListResponse>("/api/public/list", {
      query: createListQuery(reset),
    });

    if (currentVersion !== requestVersion) return;

    const rows = res.items ?? [];
    displayedList.value = reset ? rows : displayedList.value.concat(rows);
    hasMore.value = Boolean(res.hasMore);
    nextCursor.value = res.nextCursor ?? null;
  } finally {
    if (currentVersion === requestVersion) {
      loadingMore.value = false;
    }
  }
}

async function resetAndLoad() {
  displayedList.value = [];
  itemRefs.value = [];
  itemStyles.value = {};
  containerHeight.value = 0;
  hasMore.value = true;
  nextCursor.value = null;

  await fetchBatch(true);
}

function goSearch() {
  appliedFilters.value = buildAppliedFilters();
  void resetAndLoad();
}

function applyAdvancedFilters() {
  goSearch();
  closeAdvancedFilters();
}

function clearAdvancedFilters() {
  advancedFilters.value = createEmptyAdvancedFilters();
  appliedFilters.value = buildAppliedFilters();
  void resetAndLoad();
}

function toggleAdvancedFilters() {
  showAdvancedFilters.value = !showAdvancedFilters.value;

  if (!showAdvancedFilters.value) return;

  const parsed = parseSearch(searchKeyword.value);

  if (!advancedFilters.value.author.trim() && parsed.authors.length) {
    advancedFilters.value.author = parsed.authors.map((author) => `@${author}`).join(" ");
  }

  if (!advancedFilters.value.tags.trim() && parsed.tags.length) {
    advancedFilters.value.tags = parsed.tags.map((tag) => `#${tag}`).join(" ");
  }
}

function closeAdvancedFilters() {
  showAdvancedFilters.value = false;
}

function loadMore() {
  void fetchBatch(false);
}

function setItemRef(el: any, index: number) {
  if (el instanceof HTMLElement) {
    itemRefs.value[index] = el;
  }
}

function layoutMasonry() {
  const container = masonryRef.value;
  const items = itemRefs.value.filter(Boolean);

  if (!container || !items.length) {
    containerHeight.value = 0;
    return;
  }

  const containerWidth = container.clientWidth;
  const columnCount = Math.max(
    1,
    Math.floor((containerWidth + GAP) / (MIN_ITEM_WIDTH + GAP)),
  );
  const itemWidth =
    columnCount === 1
      ? containerWidth
      : (containerWidth - GAP * (columnCount - 1)) / columnCount;
  const columnHeights = new Array<number>(columnCount).fill(0);
  const nextStyles: Record<number, Record<string, string>> = {};

  items.forEach((el, index) => {
    el.style.width = `${itemWidth}px`;

    const height = el.offsetHeight;
    let targetColumn = 0;

    for (let i = 1; i < columnCount; i += 1) {
      if (columnHeights[i]! < columnHeights[targetColumn]!) {
        targetColumn = i;
      }
    }

    const left = targetColumn * (itemWidth + GAP);
    const top = columnHeights[targetColumn];

    nextStyles[index] = {
      width: `${itemWidth}px`,
      transform: `translate(${left}px, ${top}px)`,
    };

    columnHeights[targetColumn]! += height + GAP;
  });

  itemStyles.value = nextStyles;
  containerHeight.value = Math.max(...columnHeights, 0);
}

function scheduleLayout() {
  if (relayoutTimer) clearTimeout(relayoutTimer);

  relayoutTimer = setTimeout(async () => {
    await nextTick();
    layoutMasonry();
  }, 30);
}

function observeLoadMoreTrigger() {
  loadMoreObserver?.disconnect();

  if (loadMoreTrigger.value && hasMore.value) {
    loadMoreObserver?.observe(loadMoreTrigger.value);
  }
}

function getThemeRoots() {
  return [
    document.documentElement,
    document.body,
    document.querySelector(".v-application"),
    document.querySelector("[data-v-app]"),
  ].filter((root): root is Element => Boolean(root));
}

function refreshAdvancedWishTheme() {
  if (typeof window === "undefined") return;

  const roots = getThemeRoots();
  const hasDarkTheme = roots.some((root) =>
    root.matches(
      '.v-theme--dark, .theme-dark, .dark, .dark-mode, [data-theme="dark"], [data-bs-theme="dark"]',
    ),
  );
  const hasLightTheme = roots.some((root) =>
    root.matches(
      '.v-theme--light, .theme-light, .light, .light-mode, [data-theme="light"], [data-bs-theme="light"]',
    ),
  );

  isAdvancedWishDarkTheme.value =
    hasDarkTheme ||
    (!hasLightTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

onMounted(async () => {
  refreshAdvancedWishTheme();

  themeObserver = new MutationObserver(refreshAdvancedWishTheme);
  getThemeRoots().forEach((root) => {
    themeObserver?.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-bs-theme"],
    });
  });

  darkPreferenceQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkPreferenceQuery.addEventListener("change", refreshAdvancedWishTheme);

  if (masonryRef.value) {
    resizeObserver = new ResizeObserver(scheduleLayout);
    resizeObserver.observe(masonryRef.value);
  }

  loadMoreObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMore();
      }
    },
    { root: null, rootMargin: "120px 0px", threshold: 0 },
  );

  window.addEventListener("resize", scheduleLayout);

  appliedFilters.value = buildAppliedFilters();
  await resetAndLoad();
  await nextTick();
  layoutMasonry();
  observeLoadMoreTrigger();
});

watch(
  () => [displayedList.value.length, hasMore.value],
  async () => {
    itemRefs.value = [];
    await nextTick();
    scheduleLayout();
    observeLoadMoreTrigger();
  },
);

onBeforeUnmount(() => {
  themeObserver?.disconnect();
  resizeObserver?.disconnect();
  loadMoreObserver?.disconnect();
  darkPreferenceQuery?.removeEventListener("change", refreshAdvancedWishTheme);
  window.removeEventListener("resize", scheduleLayout);

  if (relayoutTimer) clearTimeout(relayoutTimer);
});
</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto px-4 sm:px-6 lg:px-8;
  width: min(85%, 1440px);
}

.section-shell {
  @apply py-10 sm:py-12;
}

.page-header {
  @apply mb-6 flex flex-wrap items-center justify-between gap-4;
}

.page-title {
  @apply text-3xl font-bold;
}

.header-actions {
  @apply flex flex-wrap items-center justify-end gap-2 sm:gap-3;
}

.wish-search-pill {
  @apply inline-flex items-center justify-between rounded-full border px-4 text-sm;
  width: min(220px, 42vw);
  height: 40px;
  gap: 6px;
  padding-right: 6px;
  border-color: rgb(var(--v-theme-on-surface) / 0.08);
  background-color: rgb(var(--v-theme-on-surface) / 0.06);
  color: rgb(var(--v-theme-on-surface));
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.wish-search-pill:hover {
  border-color: rgb(var(--v-theme-primary) / 0.35);
  background-color: rgb(var(--v-theme-on-surface) / 0.1);
}

.wish-search-input {
  @apply w-full min-w-0 bg-transparent text-sm;
  border: 0;
  color: rgb(var(--v-theme-on-surface));
  outline: none;
}

.wish-search-input::placeholder {
  color: rgb(var(--v-theme-on-surface) / 0.52);
}

.wish-search-icon-btn,
.wish-filter-btn {
  @apply inline-flex items-center justify-center rounded-full;
  border: 0;
  color: rgb(var(--v-theme-on-surface) / 0.86);
  background: transparent;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.wish-search-icon-btn {
  width: 30px;
  height: 30px;
}

.wish-filter-btn {
  width: 36px;
  height: 36px;
}

.wish-search-icon-btn:hover,
.wish-filter-btn:hover {
  background-color: rgb(var(--v-theme-on-surface) / 0.08);
  color: rgb(var(--v-theme-primary));
}

.wish-filter-btn.is-active {
  background-color: rgb(var(--v-theme-primary) / 0.12);
  color: rgb(var(--v-theme-primary));
}

.wish-filter-btn--icon {
  width: 34px;
  height: 34px;
}

.wish-filter-btn--text {
  width: auto;
  padding: 0 14px;
}

.wish-filter-popover {
  position: relative;
  display: inline-flex;
  --wish-advanced-surface: rgba(255, 255, 255, 0.96);
  --wish-advanced-input: rgba(248, 250, 252, 0.92);
  --wish-advanced-border: rgba(15, 23, 42, 0.12);
  --wish-advanced-text: #0f172a;
  --wish-advanced-muted: rgba(51, 65, 85, 0.78);
  --wish-advanced-focus: rgba(14, 165, 233, 0.28);
  --wish-advanced-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
}

.wish-filter-popover.is-dark {
  --wish-advanced-surface: rgba(15, 23, 42, 0.96);
  --wish-advanced-input: rgba(30, 41, 59, 0.74);
  --wish-advanced-border: rgba(148, 163, 184, 0.24);
  --wish-advanced-text: #f8fafc;
  --wish-advanced-muted: rgba(226, 232, 240, 0.72);
  --wish-advanced-focus: rgba(125, 211, 252, 0.24);
  --wish-advanced-shadow: 0 24px 60px rgba(15, 23, 42, 0.34);
}

.wish-advanced-popover {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 30;
  width: min(520px, calc(100vw - 32px));
  padding: 18px;
  border: 1px solid var(--wish-advanced-border);
  border-radius: 22px;
  background: var(--wish-advanced-surface);
  color: var(--wish-advanced-text);
  box-shadow: var(--wish-advanced-shadow);
  backdrop-filter: blur(18px);
}

.wish-advanced-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.wish-advanced-title {
  font-size: 15px;
  letter-spacing: 0.04em;
  color: var(--wish-advanced-text);
}

.wish-advanced-body,
.wish-advanced-grid,
.wish-advanced-field {
  display: grid;
}

.wish-advanced-body,
.wish-advanced-grid {
  gap: 12px;
}

.wish-advanced-field {
  gap: 6px;
}

.wish-advanced-grid--half {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wish-advanced-label {
  font-size: 12px;
  color: var(--wish-advanced-muted);
}

.wish-advanced-input {
  width: 100%;
  border: 1px solid var(--wish-advanced-border);
  border-radius: 14px;
  background: var(--wish-advanced-input);
  color: var(--wish-advanced-text);
  padding: 10px 12px;
  outline: none;
}

.wish-advanced-input::placeholder {
  color: var(--wish-advanced-muted);
}

.wish-advanced-input:focus {
  border-color: var(--wish-advanced-focus);
  box-shadow: 0 0 0 3px var(--wish-advanced-focus);
}

.wish-advanced-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.wish-active-filters {
  @apply mb-4 flex flex-wrap items-center gap-2;
}

.wish-active-chip {
  @apply rounded-full px-3 py-1 text-xs font-medium;
  background-color: rgb(var(--v-theme-primary) / 0.14);
  color: rgb(var(--v-theme-primary));
}

.btn-accent {
  @apply inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white;
  background-image: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    color-mix(in srgb, rgb(var(--v-theme-primary)) 76%, black)
  );
  box-shadow: 0 12px 24px -14px rgb(var(--v-theme-primary) / 0.66);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.btn-accent:hover {
  filter: brightness(1.05);
  box-shadow: 0 16px 28px -16px rgb(var(--v-theme-primary) / 0.74);
}

.wish-advanced-popover-enter-active,
.wish-advanced-popover-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.wish-advanced-popover-enter-from,
.wish-advanced-popover-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 640px) {
  .layout-container {
    width: 100%;
  }

  .page-header {
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .wish-search-pill {
    width: min(100%, 260px);
  }

  .wish-advanced-popover {
    right: -8px;
    width: min(360px, calc(100vw - 24px));
  }

  .wish-advanced-grid--half {
    grid-template-columns: 1fr;
  }
}
</style>
