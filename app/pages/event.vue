<template>
  <section class="space-y-10 layout-container section-shell">
    <header class="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
      <div class="space-y-6 reveal-up">
        <h1 class="text-3xl font-extrabold sm:text-5xl">周年／生日應援企劃</h1>
        <p class="text-neutral-800">
          投稿祝福、上傳作品，一起在當天用彈幕與投票為她應援。
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/wishes/new" class="btn-accent">我要投稿</NuxtLink>
          <NuxtLink to="/wishes" class="btn-secondary">祝福牆</NuxtLink>
        </div>
      </div>
      <div class="relative reveal-up reveal-delay-1">
        <img
          src="/hero.png"
          alt="event"
          class="w-full rounded-3xl drop-shadow-2xl animate-float"
        />
      </div>
    </header>

    <Countdown :target="flowStep.target" :title="flowStep.title" />

    <section class="p-6 card sm:p-8">
      <div class="mb-5 space-y-2">
        <h2 class="text-2xl font-black tracking-tight text-primary-900">
          活動流程圖
        </h2>
        <p class="text-sm text-neutral-700">
          依照下列流程依序進行，並以公告時間為準。
        </p>
      </div>

      <ol :class="flowListClass">
        <template v-for="(step, idx) in flowSteps" :key="step.title">
          <li
            class="flex-1 rounded-2xl border border-primary-200/80 bg-white/90 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35)]"
          >
            <p class="text-xs font-semibold tracking-wider text-primary-700">
              STEP {{ idx + 1 }}
            </p>
            <p class="mt-1 text-sm font-semibold leading-snug text-neutral-900">
              {{ step.title }}
            </p>
          </li>

          <li
            v-if="idx < flowSteps.length - 1"
            aria-hidden="true"
            class="flex items-center justify-center py-1 text-primary-400"
          >
            <VIcon :icon="isRwdMobile ? 'mdi-arrow-down' : 'mdi-arrow-right'" />
          </li>
        </template>
      </ol>
    </section>
  </section>
</template>

<script setup lang="ts">
const { width } = useWindowSize();
const isRwdMobile = computed(() => width.value < 768);
const flowListClass = computed(() =>
  isRwdMobile.value
    ? "flex flex-col gap-2"
    : "flex flex-row items-stretch gap-1",
);

const flowSteps = [
  { target: "2026-05-10T00:00:00+08:00", title: "網站正式上線" },

  { target: "2026-09-01T00:00:00+08:00", title: "投稿募集" },
  { target: "2026-10-01T00:00:00+08:00", title: "截稿期間" },
  { target: "2026-10-04T00:00:00+08:00", title: "管理員審核" },
  { target: "2026-10-03T00:00:00+08:00", title: "祝福牆展示" },
  { target: "2026-10-04T00:00:00+08:00", title: "活動正式上線 / 公開" },
];

const flowStep = computed(() => {
  const now = new Date();
  for (const step of flowSteps) {
    const stepDate = new Date(step.target);
    if (now < stepDate) return step;
  }
  return flowSteps[flowSteps.length - 1];
});
</script>

<style scoped lang="scss">
@reference "../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 lg:px-8 sm:px-6;
}

.section-shell {
  @apply py-10 sm:py-12;
}

.btn-accent {
  @apply inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white;
  background-image: linear-gradient(135deg, #3f82f8, #2e66d6);
  box-shadow: 0 12px 24px -14px rgb(37 79 175 / 0.75);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.btn-accent:hover {
  filter: brightness(1.05);
  box-shadow: 0 16px 28px -16px rgb(37 79 175 / 0.8);
}

.btn-secondary {
  @apply inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white;
  background-image: linear-gradient(135deg, #ff9541, #e05f14);
  box-shadow: 0 12px 24px -14px rgb(185 73 19 / 0.72);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.btn-secondary:hover {
  filter: brightness(1.04);
  box-shadow: 0 16px 28px -16px rgb(185 73 19 / 0.78);
}

.card {
  @apply rounded-3xl border border-primary-200/70 bg-white/90 backdrop-blur-sm;
  box-shadow: 0 10px 30px -16px rgb(15 23 42 / 0.35);
}

.reveal-up {
  animation: revealUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.reveal-delay-1 {
  animation-delay: 0.08s;
}

@keyframes revealUp {
  0% {
    opacity: 0;
    transform: translateY(18px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
