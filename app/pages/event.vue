<template>
  <section class="layout-container section-shell space-y-10">
    <header
      class="hero-card relative overflow-hidden rounded-3xl border border-neutral-300/70 bg-white/90 p-6 sm:p-10"
    >
      <div
        aria-hidden
        class="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary-300/35 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        class="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-secondary-300/35 blur-3xl pointer-events-none"
      />
      <div class="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div class="reveal-up space-y-6">
          <p
            class="inline-flex rounded-full border border-primary-200/80 bg-primary-50 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-primary-700"
          >
            {{ t("home.badge") }}
          </p>
          <h1 class="text-3xl font-black tracking-tight text-primary-900 sm:text-5xl">
            {{ t("home.title") }}
          </h1>
          <p class="text-base leading-relaxed text-neutral-800">
            {{ t("home.description") }}
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink :to="localePath('/wishes/new')" class="btn-accent">
              {{ t("home.ctaSubmit") }}
            </NuxtLink>
            <NuxtLink :to="localePath('/wishes')" class="btn-secondary">
              {{ t("home.ctaBrowse") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/event')"
              class="inline-flex items-center gap-2 rounded-2xl border border-secondary-300 bg-white px-5 py-3 text-secondary-700 transition hover:bg-secondary-50"
            >
              {{ t("home.ctaEvent") }}
            </NuxtLink>
          </div>
          <div class="max-w-sm">
            <Countdown :title="t('home.countdownTitle')" />
          </div>
        </div>

        <div class="reveal-up reveal-delay-1">
          <img
            src="/hero.png"
            :alt="t('home.heroAlt')"
            class="w-full rounded-3xl border border-white/70 bg-white/80 object-cover shadow-[0_24px_48px_-20px_rgba(15,23,42,0.45)]"
          />
        </div>
      </div>
    </header>

    <div id="clips">
      <h2 class="mb-4 text-2xl font-bold">{{ t("home.clipsHeading") }}</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ClipCard
          v-for="clip in clips"
          :key="clip.title"
          :title="clip.title"
          :thumb="clip.thumb"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
useI18nPageSeo({ pageKey: "home" });

const clips = computed(() => [
  {
    title: t("home.clip1"),
    thumb: "/hero.png",
  },
  {
    title: t("home.clip2"),
    thumb: "/hero.png",
  },
  {
    title: t("home.clip3"),
    thumb: "/hero.png",
  },
]);
</script>

<style scoped lang="scss">
@reference "../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 lg:px-8 sm:px-6;
}

.section-shell {
  @apply py-10 sm:py-12;
}

.hero-card {
  box-shadow: 0 24px 48px -24px rgb(var(--v-theme-on-surface) / 0.34);
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
