<template>
  <VDialog
    v-model="open"
    :persistent="persistent"
    max-width="480"
    :z-index="12000"
    @click:outside="closeDialog"
  >
    <LoginForm
      v-if="open"
      :show-close="!persistent"
      @success="closeDialog(true)"
      @cancel="closeDialog()"
    />
  </VDialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    persistent?: boolean;
  }>(),
  {
    persistent: false,
  }
);
const { persistent } = toRefs(props);
const emit = defineEmits<{ "update:modelValue": [boolean] }>();
const open = useVModel(props, "modelValue", emit);

function closeDialog(force = false) {
  if (persistent.value && !force) return;
  open.value = false;
}
</script>
