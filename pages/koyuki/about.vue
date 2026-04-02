<script setup lang="ts">
const { mode, isCute } = useKoyukiMode();

const pillars = [
  {
    title: "推坑",
    subtitle: "讓更多人看見她的舞台",
    content: `
我們相信，真正的魅力不需要誇張的包裝，
只需要被理解與整理。

雪KOYUKI 的雙模式切換，
不是設定噱頭，
而是一種舞台張力的自然延伸。

我們做的，
只是把這種張力具體化。
    `,
  },
  {
    title: "陪伴",
    subtitle: "長期紀錄，而不是一時熱度",
    content: `
熱度會過去，
但記錄會留下。

從初登舞台，
到一次次穩定輸出與突破，
這些片段值得被保存。

這個網站的存在，
是一種安靜的陪伴。
    `,
  },
  {
    title: "執行力",
    subtitle: "熱愛必須落地",
    content: `
喜歡不應該停在轉發與留言。

設計、排版、動畫、架構優化，
每一次改動都是一次行動。

如果熱愛沒有產出，
它就只是情緒。
    `,
  },
  {
    title: "熱愛",
    subtitle: "不是追逐，而是認同",
    content: `
她對競技的專注，
是一種持續進化的姿態。

我們對創作的投入，
也是同樣的方向。

不是為了流量，
而是為了做到更好。
    `,
  },
];
</script>

<template>
  <main class="min-h-screen px-6 py-32">
    <section class="max-w-5xl mx-auto">

      <!-- Header -->
      <header class="mb-32 text-center">
        <p
          class="mb-6 text-sm tracking-[0.35em]"
          :class="isCute ? 'text-emerald-500' : 'text-red-400'"
        >
          ABOUT US
        </p>

        <h1
          class="mb-10 text-4xl font-bold md:text-5xl"
          :class="isCute ? 'text-slate-900' : 'text-red-100'"
        >
          把喜歡，做成作品
        </h1>

        <div
          class="w-16 h-[2px] mx-auto mb-10"
          :class="isCute ? 'bg-emerald-400' : 'bg-red-500'"
        />

        <p
          class="max-w-2xl mx-auto text-lg leading-relaxed"
          :class="isCute ? 'text-slate-600' : 'text-red-200/70'"
        >
          這不是官方專案，
          也不是商業企劃。
          這是一種主動的創作行動。
        </p>
      </header>

      <!-- 理念區（左右交錯） -->
      <div class="space-y-32">
        <div
          v-for="(item, index) in pillars"
          :key="item.title"
          class="grid items-center gap-12 md:grid-cols-2"
        >
          <!-- 文字區 -->
          <AnimatedCard
            :mode="mode"
            class="p-12 transition border rounded-2xl"
            :class="
              isCute
                ? 'bg-white border-slate-200'
                : 'bg-black/60 border-red-900 text-red-100'
            "
            :style="{ order: index % 2 === 0 ? 1 : 2 }"
          >
            <h2 class="text-3xl font-semibold">
              {{ item.title }}
            </h2>

            <p
              class="mt-4 text-sm tracking-wide opacity-60"
              :class="isCute ? '' : 'text-red-300'"
            >
              {{ item.subtitle }}
            </p>

            <div
              class="w-10 h-[2px] mt-6"
              :class="isCute ? 'bg-emerald-400' : 'bg-red-500'"
            />

            <p
              class="mt-8 leading-relaxed whitespace-pre-line"
              :class="isCute
                ? 'text-slate-600'
                : 'text-red-200/70'"
            >
              {{ item.content }}
            </p>
          </AnimatedCard>

          <!-- 視覺佔位區 -->
          <div
            class="h-64 rounded-2xl"
            :class="isCute
              ? 'bg-gradient-to-br from-green-100 to-white'
              : 'bg-gradient-to-br from-black to-red-900'"
            :style="{ order: index % 2 === 0 ? 2 : 1 }"
          />
        </div>
      </div>

      <!-- 結語區 -->
      <section class="mt-40 text-center">
        <AnimatedCard
          :mode="mode"
          class="p-16 transition border rounded-2xl"
          :class="
            isCute
              ? 'bg-green-50/60 border-green-200'
              : 'bg-black/60 border-red-900 text-red-100'
          "
        >
          <p class="text-2xl leading-relaxed">
            如果你也曾因為她的專注而震撼，
            因為她的轉換而驚訝，
            那麼這裡不是終點。
          </p>

          <div
            class="w-12 h-[2px] mx-auto mt-10"
            :class="isCute ? 'bg-emerald-400' : 'bg-red-500'"
          />

          <p class="mt-10 text-lg opacity-80">
            喜歡，是一種選擇。
            創作，是一種回應。
          </p>
        </AnimatedCard>
      </section>

    </section>
  </main>
</template>

<style scoped></style>
