<!-- components/ToastContainer.vue -->
<template>
  <div class="toaster">
    <TransitionGroup name="toast">
      <AppToast
        v-for="t in computedToasts"
        :key="t.id"
        v-bind="t"
        @close="remove(t.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
interface Toast {
  id: number;
  text: string;
  description?: string;
  icon?: string;
  color?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const computedToasts = computed(() => {
  const toasts = useState<Toast[]>("toasts", () => []);
  toasts.value = toasts.value.filter((_, i) => i >= toasts.value.length - 5);
  return toasts.value;
});

function remove(id: number) {
  const toasts = useState<Toast[]>("toasts");
  toasts.value = toasts.value.filter((t) => t.id !== id);
}
</script>

<style scoped>
.toaster {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
}

/* 動畫 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
