<script setup lang="ts">
const { mode, isCute, toggleMode } = useKoyukiMode();

useHead({
  title: "雪KOYUKI｜子午計畫",
  meta: [{ name: "description", content: "雪原之上，競技為王。" }],
});
</script>

<template>
  <main class="pb-16 pt-12 sm:pt-16">
    <section class="layout-container min-h-[72vh]">
      <AnimatedCard
        :mode="mode"
        class="flex min-h-[62vh] flex-col items-center justify-center text-center"
      >
        <h1
          class="reveal-up text-5xl font-bold tracking-tight md:text-7xl"
          :class="isCute ? '' : 'drop-shadow-[0_0_18px_rgba(185,28,28,0.85)]'"
        >
          雪KOYUKI
        </h1>
        <p class="reveal-up reveal-delay-1 mt-6 max-w-2xl text-xl md:text-2xl">
          可愛只是表面。上場時，她是雪原的獵手。
        </p>
        <button
          class="reveal-up reveal-delay-2 mt-10 rounded-full border px-8 py-3 text-sm font-medium transition hover:scale-[1.06] sm:text-base"
          :class="
            isCute
              ? 'border-emerald-300 text-emerald-700'
              : 'border-red-800 bg-black/60 text-red-100 hover:bg-red-950/40'
          "
          @click="toggleMode"
        >
          切換模式：{{ isCute ? "可愛模式" : "爆言模式" }}
        </button>
      </AnimatedCard>
    </section>

    <section class="layout-container section-shell">
      <AnimatedCard :mode="mode" class="card p-8 sm:p-10">
        <h2 class="mb-10 text-center text-4xl font-bold">Character Profile</h2>
        <div class="grid items-start gap-10 md:grid-cols-2">
          <ul class="space-y-3 text-lg">
            <li>物種：雪貂</li>
            <li>身高：155cm（含耳朵）</li>
            <li>生日：2007/12/27</li>
            <li>生日花：春天石楠</li>
            <li>代表物：四葉幸運草、雪花</li>
            <li>團體：TeRaź 序境</li>
          </ul>

          <div>
            <p class="text-lg leading-relaxed">
              子午學院自然魔法學系學生，因為意外掉落到表世界，
              發覺了自己對競技舞台的熱愛與嚮往。
            </p>
            <AnimatedCard
              :mode="mode"
              :threshold="0.15"
              class="mt-8 rounded-2xl border p-6 backdrop-blur"
              :class="
                isCute
                  ? 'border-emerald-100 bg-green-50/70 text-emerald-800'
                  : 'border-red-900 bg-black/55 text-red-100'
              "
            >
              <p v-if="isCute">聲音可愛、喜歡撒嬌的雪貂少女。</p>
              <p v-else>
                拿起槍的瞬間，爆言模式啟動。女生不擅長 FPS？讓我打破你的印象。
              </p>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedCard>
    </section>

    <section class="layout-container section-shell text-center">
      <AnimatedCard
        :mode="mode"
        class="card px-6 py-14 sm:px-10"
        :class="isCute ? '' : 'border-red-900 bg-black/55'"
      >
        <h2 class="text-4xl font-bold">12 / 27 Birthday</h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg">
          春天石楠象徵祝福與守護。雪花與四葉幸運草，是她的象徵。
        </p>
        <div class="mt-10 text-5xl sm:text-6xl">❄️ 🍀 ✨</div>
      </AnimatedCard>
    </section>
  </main>
</template>
