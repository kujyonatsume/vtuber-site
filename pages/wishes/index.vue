<template>
  <section class="layout-container section-shell">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">祝福牆</h1>
      <NuxtLink to="/wishes/new" class="btn-accent">我要投稿</NuxtLink>
    </div>

    <div
      ref="masonryRef"
      class="relative w-full"
      :style="{ height: containerHeight + 'px' }"
    >
      <div
        v-for="(it, index) in list ?? []"
        :key="it.id"
        :ref="(el) => setItemRef(el, index)"
        class="absolute transition-all duration-300"
        :style="itemStyles[index]"
      >
        <BlessingCard :item="it" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

type BoardItem = {
  id: number | string;
  isAnonymous: boolean;
  displayName?: string;
  nickname?: string;
  category: string;
  message: string;
  assetUrl?: string | null;
  createdAt: string | Date;
};

const route = useRoute();
const router = useRouter();
const { data: list } = await useFetch<BoardItem[]>("/api/public/list");

const masonryRef = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const itemStyles = ref<Record<number, Record<string, string>>>({});
const containerHeight = ref(0);

const columnCount = 4;
const gap = 16;

function setItemRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (!el) return;
  itemRefs.value[index] = el as HTMLElement;
}

function layoutMasonry() {
  const container = masonryRef.value;
  const items = itemRefs.value.filter(Boolean);

  if (!container || !items.length) {
    containerHeight.value = 0;
    return;
  }

  const containerWidth = container.clientWidth;
  const itemWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

  const columnHeights = new Array(columnCount).fill(0);
  const nextStyles: Record<number, Record<string, string>> = {};

  items.forEach((el, index) => {
    el.style.width = `${itemWidth}px`;

    const height = el.offsetHeight;

    let targetCol = 0;
    for (let i = 1; i < columnCount; i++) {
      if (columnHeights[i] < columnHeights[targetCol]) {
        targetCol = i;
      }
    }

    const left = targetCol * (itemWidth + gap);
    const top = columnHeights[targetCol];

    nextStyles[index] = {
      width: `${itemWidth}px`,
      transform: `translate(${left}px, ${top}px)`,
    };

    columnHeights[targetCol] += height + gap;
  });

  itemStyles.value = nextStyles;
  containerHeight.value = Math.max(...columnHeights, 0);
}

let resizeObserver: ResizeObserver | null = null;
let relayoutTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleLayout() {
  if (relayoutTimer) clearTimeout(relayoutTimer);

  relayoutTimer = setTimeout(async () => {
    await nextTick();
    layoutMasonry();
  }, 30);
}

onMounted(async () => {
  const rawSubmitted = route.query.submitted;
  const submitted =
    rawSubmitted === "1" ||
    rawSubmitted === "true" ||
    (Array.isArray(rawSubmitted) &&
      (rawSubmitted.includes("1") || rawSubmitted.includes("true")));
  if (submitted) {
    toast.success("已經送出成功，請等待審核");
    const nextQuery = { ...route.query };
    delete nextQuery.submitted;
    router.replace({ path: route.path, query: nextQuery });
  }

  await nextTick();
  layoutMasonry();

  if (masonryRef.value) {
    resizeObserver = new ResizeObserver(() => {
      scheduleLayout();
    });
    resizeObserver.observe(masonryRef.value);
  }

  window.addEventListener("resize", scheduleLayout);
});

watch(
  () => list.value,
  async () => {
    itemRefs.value = [];
    await nextTick();
    scheduleLayout();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", scheduleLayout);
  if (relayoutTimer) clearTimeout(relayoutTimer);
});
</script>

<style scoped lang="scss">
.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}

.section-shell {
  @apply py-10 sm:py-12;
}

.btn-accent {
  @apply inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white;
  background-image: linear-gradient(135deg, #3f82f8, #2e66d6);
  box-shadow: 0 12px 24px -14px rgb(37 79 175 / 0.75);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.btn-accent:hover {
  filter: brightness(1.05);
  box-shadow: 0 16px 28px -16px rgb(37 79 175 / 0.8);
}
</style>
