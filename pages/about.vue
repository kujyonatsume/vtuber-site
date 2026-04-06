<template>
  <section class="section-shell mx-auto max-w-4xl space-y-6">
    <h1 class="text-3xl font-bold">關於</h1>
    <p class="text-neutral-800">
      這是 VTuber 企劃網站樣板。包含
      RWD、動畫、導覽與頁面骨架，可依你的品牌與色彩延伸。
    </p>

    <div class="card card-hover p-6">
      <h2 class="font-semibold mb-3">聯絡合作</h2>
      <ul class="space-y-2 text-neutral-800">
        <li>
          Email：<a
            class="text-primary hover:underline"
            href="mailto:contact@example.com"
            >contact@example.com</a
          >
        </li>
        <li>
          Twitter：<a
            class="text-primary hover:underline"
            href="https://x.com/yourhandle"
            target="_blank"
            >@yourhandle</a
          >
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-shell {
  @apply py-10 sm:py-12;
}

.card {
  @apply rounded-3xl border border-primary-200/70 bg-white/90 backdrop-blur-sm;
  box-shadow: 0 10px 30px -16px rgb(15 23 42 / 0.35);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.28s ease;
}

.card-hover:hover {
  @apply border-primary-300/80 bg-white/95;
  box-shadow: 0 24px 48px -24px rgb(15 23 42 / 0.45);
  transform: translateY(-2px);
}
</style>
