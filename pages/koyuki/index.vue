<script setup lang="ts">
import anime from "animejs";
const mode = useLocalStorage("mode", "cute");

useHead({
  title: "雪KOYUKI｜子午計畫",
  meta: [{ name: "description", content: "雪原之上，競技為王。" }],
});

const el = ref<HTMLElement>();

const toggleMode = () => {
  mode.value = mode.value === "cute" ? "battle" : "cute";
};

onMounted(() => {
  // 入場動畫
  anime({
    targets: ".fade-up",
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 1200,
    easing: "easeOutExpo",
    delay: anime.stagger(200),
  });
});

watch(mode, (newVal) => {
  if (newVal === "battle") {
    // 畫面震動
    anime({
      targets: el.value,
      translateX: [
        { value: -15, duration: 30 },
        { value: 15, duration: 30 },
        { value: -12, duration: 30 },
        { value: 12, duration: 30 },
        { value: -8, duration: 30 },
        { value: 8, duration: 30 },
        { value: 0, duration: 30 },
      ],
      easing: "easeInOutSine",
    });

    // 紅色閃光爆發
    anime({
      targets: el.value,
      boxShadow: [
        "0 0 0 rgba(0,0,0,0)",
        "0 0 80px rgba(185,28,28,0.9)",
        "0 0 0 rgba(0,0,0,0)",
      ],
      duration: 450,
      easing: "easeOutQuad",
    });
  }
});
</script>

<template>
  <div
    ref="el"
    :class="[
      'min-h-screen overflow-x-hidden transition-all duration-700',
      mode === 'cute'
        ? 'bg-gradient-to-b from-green-100 via-white to-white text-black'
        : 'bg-gradient-to-b from-black via-red-950 to-red-900 text-red-100',
    ]"
  >
    <!-- Hero -->

    <AnimatedCard
      :mode="mode"
      class="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center"
    >
      <h1
        class="text-5xl font-bold transition-all duration-500 md:text-7xl fade-up"
        :class="
          mode === 'battle' ? 'drop-shadow-[0_0_25px_rgba(185,28,28,0.9)]' : ''
        "
      >
        雪KOYUKI
      </h1>
      <p class="max-w-2xl mt-6 text-xl md:text-2xl fade-up">
        可愛只是表面。上場時，她是雪原的獵手。
      </p>
      <button
        @click="toggleMode"
        class="px-8 py-3 mt-10 transition-all duration-300 border rounded-full hover:scale-110 fade-up"
        :class="
          mode === 'cute'
            ? 'border-emerald-300 text-emerald-600'
            : 'bg-black/60 border border-red-800 text-red-200 hover:bg-red-900/40'
        "
      >
        切換模式：{{ mode === "cute" ? "可愛模式" : "爆言模式" }}
      </button>
    </AnimatedCard>

    <!-- 人設 -->
    <AnimatedCard
      :mode="mode"
      class="relative z-10 max-w-5xl px-6 py-24 mx-auto"
    >
      <h2 class="mb-12 text-4xl font-bold text-center fade-up">
        Character Profile
      </h2>

      <div class="grid items-center gap-12 md:grid-cols-2">
        <ul class="space-y-4 text-lg">
          <li>物種：雪貂</li>
          <li>身高：155cm（含耳朵）</li>
          <li>生日：2007/12/27</li>
          <li>生日花：春天石楠</li>
          <li>代表物：四葉幸運草、雪花</li>
          <li>團體：TeRaź 序境</li>
        </ul>
        <div class="fade-up">
          <p class="text-lg leading-relaxed">
            子午學院自然魔法學系學生，因為意外掉落到表世界，
            發覺了自己對競技舞台的熱愛與嚮往。
          </p>

          <AnimatedCard :mode="mode"
            class="p-6 mt-8 transition-all duration-500 rounded-xl backdrop-blur-md"
            :class="
              mode === 'cute'
                ? 'bg-green-50/70 text-emerald-800'
                : 'bg-black/60 border border-red-800 text-red-200'
            "
          >
            <p v-if="mode === 'cute'">聲音可愛、喜歡撒嬌的雪貂少女。</p>
            <p v-else>
              拿起槍的瞬間，爆言模式啟動。 女生不擅長FPS？讓我打破你的印象。
            </p>
          </AnimatedCard>

        </div>
      </div>
    </AnimatedCard>

    <!-- 生日區 -->
    <AnimatedCard :mode="mode" class="relative z-10 py-24 text-center">
      <h2 class="text-4xl font-bold fade-up">12 / 27 Birthday</h2>
      <p class="mt-6 text-lg fade-up">
        春天石楠象徵祝福與守護。 雪花與四葉幸運草，是她的象徵。
      </p>
      <div class="mt-10 text-6xl fade-up">❄️ 🍀 ✨</div>
    </AnimatedCard>
  </div>
</template>

<style scoped></style>
