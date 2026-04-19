<template>
  <VApp>
    <div
      :class="[
        'app-shell flex min-h-dvh flex-col text-primary-900',
        user ? 'app-shell--authed' : 'app-shell--guest',
      ]"
    >
      <NavBar />
      <main class="flex-1">
        <div class="text-primary-900">
          <NuxtPage />
        </div>
      </main>
      <footer
        :class="[
          'border-t border-primary-200/80 py-6 text-center text-sm backdrop-blur',
          footerClass,
        ]"
      >
        {{ t("app.footer", { year }) }}
      </footer>
    </div>
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>
  </VApp>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { user } = useAuth();

const footerClass = computed(() =>
  user.value ? "text-primary-800" : "text-neutral-800",
);

const year = new Date().getFullYear();
</script>

<style lang="scss">
.app-shell--guest {
  background-image:
    radial-gradient(
      circle at 12% 8%,
      rgb(255 255 255 / 0.72) 0,
      rgb(255 255 255 / 0) 40%
    ),
    radial-gradient(
      circle at 90% 4%,
      rgb(255 226 193 / 0.38) 0,
      rgb(255 226 193 / 0) 44%
    ),
    linear-gradient(160deg, #f4f8ff 0%, #e8f0ff 52%, #fff2df 100%);
}

.app-shell--authed {
  background-image:
    radial-gradient(
      circle at 12% 8%,
      rgb(214 233 255 / 0.68) 0,
      rgb(214 233 255 / 0) 40%
    ),
    radial-gradient(
      circle at 88% 4%,
      rgb(255 201 146 / 0.3) 0,
      rgb(255 201 146 / 0) 44%
    ),
    linear-gradient(162deg, #e9f2ff 0%, #d7e7ff 54%, #ffe3c3 100%);
}

.v-theme--dark .app-shell--guest {
  background-image:
    radial-gradient(
      circle at 12% 8%,
      rgb(116 171 255 / 0.22) 0,
      rgb(116 171 255 / 0) 44%
    ),
    radial-gradient(
      circle at 90% 4%,
      rgb(255 181 115 / 0.2) 0,
      rgb(255 181 115 / 0) 46%
    ),
    linear-gradient(160deg, #0b1220 0%, #111827 52%, #1f2937 100%);
}

.v-theme--dark .app-shell--authed {
  background-image:
    radial-gradient(
      circle at 12% 8%,
      rgb(147 190 255 / 0.24) 0,
      rgb(147 190 255 / 0) 44%
    ),
    radial-gradient(
      circle at 88% 4%,
      rgb(255 202 158 / 0.18) 0,
      rgb(255 202 158 / 0) 46%
    ),
    linear-gradient(162deg, #0f172a 0%, #111827 54%, #1f2937 100%);
}
</style>
