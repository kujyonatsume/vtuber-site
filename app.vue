<template>
  <VApp>
    <ClientOnly><IntroSplash /></ClientOnly>
    <div class="min-h-dvh flex bg-secondary-100 text-primary-900 flex-col">
      <NavBar />
      <main class="flex-1">
        <NuxtLayout>
          <!-- ✅ 修正 Nuxt 提示 -->
          <NuxtPage />
        </NuxtLayout>
      </main>
      <footer
        class="border-t border-neutral-300/60 py-6 text-center text-sm text-neutral-800"
      >
        © {{ year }} 九条夏目
      </footer>
    </div>
    <VSonner />
  </VApp>
</template>

<script setup lang="tsx">
import { VSonner } from "vuetify-sonner";
const year = new Date().getFullYear();
</script>
