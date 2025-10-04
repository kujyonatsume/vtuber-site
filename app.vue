<template>
  <VApp>
    <ClientOnly><IntroSplash /></ClientOnly>
    <div class="min-h-dvh flex flex-col">
      <NavBar />
      <main class="flex-1">
        <NuxtLayout>
          <!-- ✅ 修正 Nuxt 提示 -->
          <NuxtPage />
        </NuxtLayout>
      </main>
      <footer
        class="border-t border-neutral-500/10 py-6 text-center text-sm text-neutral-600"
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
