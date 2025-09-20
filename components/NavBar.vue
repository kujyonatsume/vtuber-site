<!-- components\NavBar.vue -->
<template>
  <header
    class="sticky top-0 z-40 bg-primary-900/80 backdrop-blur border-b border-neutral-100/10"
  >
    <div class="mx-auto max-w-7xl flex items-center justify-between py-3 px-4">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <img src="/favicon.ico" alt="logo" class="h-8 w-8 animate-float" />
        <span class="font-bold tracking-wide">VTuber Project</span>
      </NuxtLink>
      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink>
        <NuxtLink to="/event" class="hover:text-primary">活動</NuxtLink>
        <NuxtLink to="/schedule" class="hover:text-primary">行程</NuxtLink>
        <NuxtLink to="/clips" class="hover:text-primary">剪輯</NuxtLink>
        <NuxtLink to="/about" class="hover:text-primary">關於</NuxtLink>
      </nav>
      <div class="flex items-center gap-2">
        <VBtn class="md:hidden" variant="tonal" @click="drawer = true">
          <VIcon icon="mdi-menu" />
        </VBtn>
      </div>
    </div>
  </header>
      <VNavigationDrawer
      v-model="drawer"
      temporary
      location="right"
      class="bg-neutral-900"
    >
      <VList density="compact">
        <VListItem to="/" title="首頁" @click="drawer = false" />
        <VListItem to="/event" title="活動" @click="drawer = false" />
        <VListItem to="/schedule" title="行程" @click="drawer = false" />
        <VListItem to="/clips" title="剪輯" @click="drawer = false" />
        <VListItem to="/about" title="關於" @click="drawer = false" />
      </VList>
    </VNavigationDrawer>
</template>

<script setup lang="ts">
const isDark = useDark();
const toggle = useToggle(isDark);
const drawer = ref(false);
</script>
