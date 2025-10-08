<template>
  <div class="text-center space-y-2 animate-slideUp">
    <h2 class="text-xl font-bold">{{ title ?? "活動倒數" }}</h2>
    <p class="text-3xl font-mono" aria-live="polite">
      {{ dd }} 天 {{ hh.toString().padStart(2, "0") }}:{{
        mm.toString().padStart(2, "0")
      }}:{{ ss.toString().padStart(2, "0") }}
    </p>
  </div>
</template>
<script setup lang="tsx">
import ms from 'ms'
defineProps<{ title?: string }>();
const end = new Date("2025/12/27").getTime()

const diff = ref(0)
onMounted(() => {
  const update = () => (diff.value = Math.max(0, end - Date.now()))
  update()
  const t = setInterval(update, 1000)
  onBeforeUnmount(() => clearInterval(t))
})

const dd = computed(() => Math.floor(diff.value / 86400000))
const hh = computed(() => Math.floor(diff.value / 3600000) % 24)
const mm = computed(() => Math.floor(diff.value / 60000) % 60)
const ss = computed(() => Math.floor(diff.value / 1000) % 60)
</script>
