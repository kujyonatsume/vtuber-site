<template>
  <div class="toaster">
    <TransitionGroup name="toast">
      <AppToast
        v-for="t in toast.list"
        :key="t.id"
        v-bind="t"
        @close="t.remove()"
      />
    </TransitionGroup>
  </div>
</template>

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
