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
        <!--
        <NuxtLayout>

        </NuxtLayout>
        -->
      </main>
      <footer :class="['py-6 text-center text-sm backdrop-blur', footerClass]">
        © {{ year }} 九条夏目
      </footer>
    </div>
    <VSonner />
  </VApp>
</template>

<script setup lang="tsx">
const { user } = useAuth();
const footerClass = computed(() =>
  user.value
    ? "border-t border-primary-200/80 bg-primary-50/78 text-primary-800"
    : "border-t border-neutral-300/60 bg-white/70 text-neutral-800",
);

const year = new Date().getFullYear();
</script>

<style>
[data-sonner-toaster][data-x-position="center"][data-y-position="top"] {
  top: 50% !important;
  right: auto !important;
  bottom: auto !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

@media (max-width: 600px) {
  [data-sonner-toaster][data-x-position="center"][data-y-position="top"] {
    width: var(--width) !important;
    max-width: calc(100vw - 32px);
  }
}
</style>
