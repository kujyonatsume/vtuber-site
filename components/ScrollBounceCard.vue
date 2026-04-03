<script setup lang="ts">
defineProps<{
  mode?: KoyukiMode;
  threshold?: number;
}>();
</script>

<template>
  <AnimatedCard :mode="mode ?? 'cute'" :threshold="threshold ?? 0.2">
    <slot />
  </AnimatedCard>
</template>
