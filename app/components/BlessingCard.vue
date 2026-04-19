<template>
  <article :id="`post-${item.id}`"
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
        </div>
      </header>

      <p
        class="text-sm leading-relaxed break-words whitespace-pre-line text-neutral-800"
      >
        {{ postContent(item.message) }}
      </p>

      <div v-if="item.assetUrl">
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
          frameborder="0"
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
        <audio
          v-else-if="item.category === 'audio'"
          :src="item.assetUrl"
          controls
          preload="metadata"
          class="w-full"
        />
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

defineProps<{
  item: BlessingItem;
}>();
const { t } = useI18n();

function postContent(message: string) {
  const text = (message || "").trim();
  return text || t("blessingCard.empty");
}

function categoryLabel(category?: string | null) {
  switch ((category || "").toLowerCase()) {
    case "image":
      return t("blessingCard.category.image");
    case "audio":
      return t("blessingCard.category.audio");
    case "video":
      return t("blessingCard.category.video");
    case "embed":
      return t("blessingCard.category.embed");
    default:
      return t("blessingCard.category.text");
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
