<!-- 공용 버튼 컴포넌트 샘플 -->
<template>
  <button
    type="button"
    class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['click'])
</script>
