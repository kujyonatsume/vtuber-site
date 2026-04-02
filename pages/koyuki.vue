<script setup lang="ts">
import anime from "animejs";

const shell = ref<HTMLElement | null>(null);
const { mode, isCute, toggleMode } = useKoyukiMode();

const links = [
  { label: "返回", to: "/" },
  { label: "Home", to: "/koyuki" },
  { label: "Activity", to: "/koyuki/activity" },
  { label: "Album", to: "/koyuki/album" },
  { label: "About", to: "/koyuki/about" },
];

const modeLabel = computed(() => (isCute.value ? "可愛模式" : "爆言模式"));

function applyBattleEffect() {
  if (!shell.value) return;

  anime({
    targets: shell.value,
    translateX: [-12, 12, -9, 9, -6, 6, 0],
    duration: 280,
    easing: "easeInOutSine",
  });

  anime({
    targets: shell.value,
    boxShadow: [
      "0 0 0 rgba(0,0,0,0)",
      "0 0 80px rgba(185,28,28,0.85)",
      "0 0 0 rgba(0,0,0,0)",
    ],
    duration: 380,
    easing: "easeOutQuad",
  });
}

watch(mode, (val, prev) => {
  if (val === "battle" && prev !== val) applyBattleEffect();
});
</script>

<template>
  <div
    ref="shell"
    :class="[
      'relative min-h-screen overflow-x-hidden transition-colors duration-700',
      isCute
        ? 'bg-gradient-to-b from-green-100 via-white to-white text-slate-900'
        : 'bg-gradient-to-b from-[#180202] via-red-950 to-[#120101] text-red-100',
    ]"
  >
    <div aria-hidden class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute left-[-6rem] top-[-4rem] h-56 w-56 rounded-full blur-3xl"
        :class="isCute ? 'bg-emerald-200/55' : 'bg-red-600/25'"
      />
      <div
        class="absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full blur-3xl"
        :class="isCute ? 'bg-lime-200/55' : 'bg-red-800/30'"
      />
    </div>

    <nav
      class="sticky top-0 z-30 border-b backdrop-blur"
      :class="
        isCute
          ? 'border-emerald-200/70 bg-white/70'
          : 'border-red-900/80 bg-black/45'
      "
    >
      <div class="layout-container flex flex-wrap items-center gap-4 py-4">
        <NuxtLink to="/koyuki" class="text-lg font-semibold tracking-wide">
          雪KOYUKI
        </NuxtLink>

        <div class="ml-auto flex items-center gap-2 sm:gap-4">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-3 py-1.5 text-sm transition"
            exact-active-class="font-semibold"
            :class="
              isCute
                ? 'hover:bg-emerald-100/80'
                : 'hover:bg-red-900/45 hover:text-red-50'
            "
          >
            {{ link.label }}
          </NuxtLink>
          <button
            class="rounded-full border px-4 py-2 text-sm font-medium transition hover:scale-[1.03]"
            :class="
              isCute
                ? 'border-emerald-300 bg-white text-emerald-700'
                : 'border-red-800 bg-black/55 text-red-100'
            "
            @click="toggleMode"
          >
            {{ modeLabel }}
          </button>
        </div>
      </div>
    </nav>

    <NuxtPage />

    <footer class="relative z-10 py-10 text-center text-sm opacity-70">
      Snowfall Annals © 2026. All rights reserved.
    </footer>
  </div>
</template>
