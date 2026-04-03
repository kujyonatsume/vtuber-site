<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="flex flex-col flex-1 gap-3 p-4">
      <header class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <div class="text-sm font-semibold truncate text-primary-900">
            {{ item.displayName }}
          </div>
          <div class="mt-0.5 text-[11px] text-neutral-600"></div>
        </div>
        <div class="flex items-center gap-2">
          <VChip
            size="x-small"
            variant="tonal"
            :color="categoryColor(item.category)"
            :prepend-icon="categoryIcon(item.category)"
          >
            {{ categoryLabel(item.category) }}
          </VChip>
          <VChip
            v-if="item.isAnonymous"
            size="x-small"
            variant="tonal"
            color="grey"
          >
            匿名
          </VChip>
        </div>
      </header>

      <p class="text-sm leading-relaxed break-words whitespace-pre-line text-neutral-800">
        {{ postContent(item.message) }}
      </p>

      <div v-if="item.assetUrl" class="relative aspect-[4/3] bg-neutral-100">
        <img
          v-if="item.category === 'image'"
          :src="item.assetUrl"
          class="object-cover w-full h-full"
        />
        <video
          v-else-if="item.category === 'video'"
          :src="item.assetUrl"
          controls
          preload="metadata"
          class="object-cover w-full h-full bg-black"
        />
        <iframe
          v-else-if="item.category === 'embed'"
          :src="item.assetUrl"
          title="YouTube player"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
            web-share;
          "
          allowfullscreen
          class="w-full h-full border-0"
        />
        <div
          v-else-if="item.category === 'audio'"
          class="flex flex-col items-center justify-center w-full h-full gap-3 px-4"
        >
          <div
            class="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-full"
          >
            <VIcon size="16">mdi-music-note-outline</VIcon>
            <span>音檔</span>
          </div>
          <audio
            :src="item.assetUrl"
            controls
            preload="metadata"
            class="w-full"
          />
        </div>
      </div>

      <footer
        class="mt-auto flex items-center justify-between text-[11px] text-neutral-700"
      >
        <span class="truncate">{{
          new Date(item.createdAt).toLocaleString()
        }}</span>
      </footer>

      <div
        v-if="$slots.actions"
        class="flex flex-wrap items-center justify-end gap-2 mt-2"
      >
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
type BlessingItem = {
  id: number | string;
  isAnonymous: boolean;
  displayName?: string;
  nickname?: string;
  category: string;
  message: string;
  assetUrl?: string | null;
  createdAt: string | Date;
};

const props = defineProps<{
  item: BlessingItem;
}>();

function postContent(message: string) {
  const text = (message || "").trim();
  return text || "（無內文）";
}

function categoryLabel(category?: string | null) {
  switch ((category || "").toLowerCase()) {
    case "image":
      return "圖片";
    case "audio":
      return "音檔";
    case "video":
      return "影片";
    case "embed":
      return "YT 嵌入";
    default:
      return "文字";
  }
}

function categoryIcon(category?: string | null) {
  switch ((category || "").toLowerCase()) {
    case "image":
      return "mdi-image-outline";
    case "audio":
      return "mdi-music-note-outline";
    case "video":
      return "mdi-video-outline";
    case "embed":
      return "mdi-youtube";
    default:
      return "mdi-text-box-outline";
  }
}

function categoryColor(category?: string | null) {
  switch ((category || "").toLowerCase()) {
    case "image":
      return "blue";
    case "audio":
      return "teal";
    case "video":
      return "orange";
    case "embed":
      return "red";
    default:
      return "grey";
  }
}
</script>
