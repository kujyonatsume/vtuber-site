<template>
  <section class="section-shell mx-auto max-w-4xl space-y-6">
    <h1 class="text-3xl font-bold">{{ t("about.title") }}</h1>
    <p class="text-neutral-800">
      {{ t("about.description") }}
    </p>

    <div class="card card-hover p-6">
      <h2 class="mb-3 font-semibold">{{ t("about.contactTitle") }}</h2>
      <ul class="space-y-2 text-neutral-800">
        <li>
          {{ t("about.email") }}:
          <a class="text-primary hover:underline" href="mailto:contact@example.com">
            contact@example.com
          </a>
        </li>
        <li>
          {{ t("about.twitter") }}:
          <a
            class="text-primary hover:underline"
            href="https://x.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
          >
            @yourhandle
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style scoped lang="scss">
@reference "../assets/styles/tailwind.css";

.section-shell {
  @apply py-10 sm:py-12;
}

.card {
  @apply rounded-3xl border border-primary-200/70 bg-white/90 backdrop-blur-sm;
  box-shadow: 0 10px 30px -16px rgb(var(--v-theme-on-surface) / 0.26);
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s ease;
}

.card-hover:hover {
  @apply border-primary-300/80 bg-white/95;
  box-shadow: 0 24px 48px -24px rgb(var(--v-theme-on-surface) / 0.34);
  transform: translateY(-2px);
}
</style>
