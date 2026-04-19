<template>
  <section class="layout-container section-shell space-y-10">
    <header class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
      <div class="reveal-up space-y-6">
        <h1 class="text-3xl font-extrabold sm:text-5xl">{{ t("event.title") }}</h1>
        <p class="text-neutral-800">
          {{ t("event.description") }}
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/wishes/new')" class="btn-accent">
            {{ t("event.ctaSubmit") }}
          </NuxtLink>
          <NuxtLink :to="localePath('/wishes')" class="btn-secondary">
            {{ t("event.ctaBrowse") }}
          </NuxtLink>
        </div>
      </div>
      <div class="relative reveal-up reveal-delay-1">
        <img
          src="/hero.png"
          :alt="t('event.heroAlt')"
          class="w-full rounded-3xl drop-shadow-2xl animate-float"
        />
      </div>
    </header>

    <Countdown :target="flowStep.target" :title="flowStep.title" />

    <section class="card p-6 sm:p-8">
      <div class="mb-5 space-y-2">
        <h2 class="text-2xl font-black tracking-tight text-primary-900">
          {{ t("event.timelineTitle") }}
        </h2>
        <p class="text-sm text-neutral-700">
          {{ t("event.timelineDescription") }}
        </p>
      </div>

      <ol :class="flowListClass">
        <template v-for="(step, idx) in flowSteps" :key="`${step.target}-${idx}`">
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
const { t } = useI18n();
const localePath = useLocalePath();
const { width } = useWindowSize();
useI18nPageSeo({ pageKey: "event" });

const isRwdMobile = computed(() => width.value < 768);
const flowListClass = computed(() =>
  isRwdMobile.value
    ? "flex flex-col gap-2"
    : "flex flex-row items-stretch gap-1",
);

const flowSteps = computed(() => [
  { target: "2026-05-10T00:00:00+08:00", title: t("event.step1") },
  { target: "2026-09-01T00:00:00+08:00", title: t("event.step2") },
  { target: "2026-10-01T00:00:00+08:00", title: t("event.step3") },
  { target: "2026-10-03T00:00:00+08:00", title: t("event.step4") },
  { target: "2026-10-04T00:00:00+08:00", title: t("event.step5") },
  { target: "2026-12-27T00:00:00+08:00", title: t("event.step6") },
]);

const flowStep = computed(() => {
  const now = new Date();
  for (const step of flowSteps.value) {
    const stepDate = new Date(step.target);
    if (now < stepDate) return step;
  }

  return flowSteps.value[flowSteps.value.length - 1] || {
    target: "2026-12-27T00:00:00+08:00",
    title: t("event.step6"),
  };
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
  background-image: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    color-mix(in srgb, rgb(var(--v-theme-primary)) 76%, black)
  );
  box-shadow: 0 12px 24px -14px rgb(var(--v-theme-primary) / 0.66);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.btn-accent:hover {
  filter: brightness(1.05);
  box-shadow: 0 16px 28px -16px rgb(var(--v-theme-primary) / 0.74);
}

.btn-secondary {
  @apply inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white;
  background-image: linear-gradient(
    135deg,
    rgb(var(--v-theme-secondary)),
    color-mix(in srgb, rgb(var(--v-theme-secondary)) 76%, black)
  );
  box-shadow: 0 12px 24px -14px rgb(var(--v-theme-secondary) / 0.64);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.btn-secondary:hover {
  filter: brightness(1.04);
  box-shadow: 0 16px 28px -16px rgb(var(--v-theme-secondary) / 0.72);
}

.card {
  @apply rounded-3xl border border-primary-200/70 bg-white/90 backdrop-blur-sm;
  box-shadow: 0 10px 30px -16px rgb(var(--v-theme-on-surface) / 0.26);
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
