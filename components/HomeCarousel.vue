<template>
  <VCarousel
    :height="height"
    :cycle="true"
    :interval="interval"
    show-arrows
    hide-delimiter-background
    class="rounded-3xl overflow-hidden border border-neutral-100/10"
  >
    <VCarouselItem v-for="(it, i) in items" :key="i">
      <div class="relative h-full w-full">
        <img :src="it.src" :alt="it.title" class="h-full w-full object-cover" />
        <div
          class="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/60 to-transparent"
        >
          <h3 class="text-lg sm:text-xl font-semibold">{{ it.title }}</h3>
          <p class="text-sm text-neutral-300">{{ it.subtitle }}</p>
        </div>
      </div>
    </VCarouselItem>
  </VCarousel>
</template>

<script setup lang="tsx">
type Slide = { src: string; title: string; subtitle?: string };
const props = withDefaults(
  defineProps<{
    items?: Slide[];
    height?: number | string;
    interval?: number;
  }>(),
  {
    items: () => [
      {
        src: "/banners/1.jpg",
        title: "每週六 20:00 合作實況",
        subtitle: "YouTube / Twitch 同步",
      },
      {
        src: "/banners/2.jpg",
        title: "技術直播：Nuxt + Three.js",
        subtitle: "互動 Demo 與 QA",
      },
      {
        src: "/banners/3.jpg",
        title: "歌回與觀眾點歌",
        subtitle: "歡迎投稿想聽的曲目",
      },
    ],
    height: 360,
    interval: 4000,
  }
);
</script>
