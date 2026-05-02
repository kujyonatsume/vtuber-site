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
        class="text-sm leading-relaxed wrap-break-word whitespace-pre-line text-neutral-800"
      >
        {{ postContent(item.message) }}
      </p>

      <div v-if="item.assetUrl">
        <img
          v-if="item.category === 'image'"
          :src="item.assetUrl"
          class="object-cover w-full"
        />
        <div
          v-else-if="item.category === 'video'"
          class="media-16x9 w-full"
        >
          <video
            :src="item.assetUrl"
            controls
            preload="metadata"
            class="object-cover"
          />
        </div>
        <div
          v-else-if="item.category === 'embed'"
          class="media-16x9 w-full"
        >
          <iframe
            :src="embedSrc(item.assetUrl)"
            title="YouTube player"
            loading="lazy"
            frameborder="0"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="
              autoplay;
              clipboard-write;
              encrypted-media;
              picture-in-picture;
              web-share;
            "
            class="w-full h-full border-0"
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
  return (message || "").trim();

}

function embedSrc(url?: string | null) {
  if (!url) return "";

  try {
    const u = new URL(url, "https://www.youtube.com");
    u.searchParams.set("controls", "0");
    u.searchParams.set("fs", "0");
    u.searchParams.set("rel", "0");
    u.searchParams.set("iv_load_policy", "3");
    u.searchParams.set("playsinline", "1");
    return u.toString();
  } catch {
    return url;
  }
}

function categoryLabel(category?: string | null) {
  switch ((category || "").toLowerCase()) {
    case "image":
      return t("blessingCard.category.image");
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
    case "video":
      return "orange";
    case "embed":
      return "red";
    default:
      return "grey";
  }
}
</script>

<style scoped>
.media-16x9 {
  aspect-ratio: 16 / 9;
}
</style>
