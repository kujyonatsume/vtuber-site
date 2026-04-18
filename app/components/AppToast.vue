<template>
  <div class="toast" :style="{ backgroundColor: color || '#333', color: '#fff' }">
    <div class="toast__grid">
      <!-- 左：ICON -->
      <div class="toast__left">
        <VIcon v-if="icon" :icon="icon" size="20" />
      </div>

      <!-- 中：文字 -->
      <div class="toast__center">
        <div class="toast__title">
          {{ text }}
        </div>
        <div v-if="description" class="toast__desc">
          {{ description }}
        </div>
      </div>

      <!-- 右：Action -->
      <div class="toast__right">
        <VBtn v-if="action" size="small" variant="text" @click="onAction">
          {{ action.label }}
        </VBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string;
  description?: string;
  icon?: string;
  color?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
}>();

const emit = defineEmits(["close"]);

function onAction() {
  props.action?.onClick?.();
  emit("close");
}
</script>

<style scoped lang="scss">
.toast {
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 320px;
  max-width: 420px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* 三欄結構（重點） */
.toast__grid {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 12px;
}

/* 左 */
.toast__left {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 中（完全置中） */
.toast__center {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 右 */
.toast__right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 文字 */
.toast__title {
  font-size: 14px;
}

.toast__desc {
  font-size: 10px;
  opacity: 0.7;
}
</style>
