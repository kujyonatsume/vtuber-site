<template>
  <section class="py-8 layout-container">
    <ClientOnly>
      <div class="mx-auto w-full max-w-[480px]">
        <LoginForm />
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
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

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 lg:px-8 sm:px-6;
}
</style>
