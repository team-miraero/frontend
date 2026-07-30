<!-- 목표설정 퍼널(GOAL-01~04) 공통 하단 고정 CTA 버튼 -->
<template>
  <div
    class="fixed inset-x-0 bottom-8 z-20 flex justify-center px-4 pointer-events-none"
  >
    <div class="w-full max-w-md pointer-events-auto flex flex-col items-center">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-4 font-semibold text-white shadow-lg transition-colors disabled:bg-gray-300 disabled:text-gray-500"
        :disabled="disabled"
        @click="emit('click', $event)"
      >
        <span>{{ label }}</span>
        <span aria-hidden="true">›</span>
      </button>
      <p v-if="caption" class="mt-2 text-center text-xs text-gray-400">{{ caption }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  caption: { type: String, default: '' },
})
const emit = defineEmits(['click'])
</script>
