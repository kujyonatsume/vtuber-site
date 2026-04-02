<template>
  <VApp>
    <ClientOnly><IntroSplash /></ClientOnly>
    <div class="flex flex-col min-h-dvh text-primary-900">
      <NavBar v-if="showGlobalChrome" />
      <main class="flex-1">
        <NuxtLayout>
          <!-- ✅ 修正 Nuxt 提示 -->
          <NuxtPage />
        </NuxtLayout>
      </main>
      <footer
        v-if="showGlobalChrome"
        class="py-6 text-sm text-center border-t border-neutral-300/60 bg-white/70 text-neutral-800 backdrop-blur"
      >
        © {{ year }} 九条夏目
        
      </footer>
    </div>
    <VSonner />
  </VApp>
</template>

<script setup lang="tsx">
import { VSonner } from "vuetify-sonner";

const route = useRoute();
const showGlobalChrome = computed(() => !route.path.startsWith("/koyuki"));

const year = new Date().getFullYear();
</script>
