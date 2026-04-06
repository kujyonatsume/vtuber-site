<template>
  <section class="py-8 layout-container">
    <ClientOnly>
      <LoginDialog v-model="open" persistent />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
const open = ref(true);
const { user } = useAuth();

watch(
  () => user.value?.index,
  (id) => {
    if (!id) return;
    navigateTo("/");
  },
  { immediate: true }
);
</script>
