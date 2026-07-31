<!-- 목표설정 퍼널(GOAL-01~04) 공통 하단 고정 CTA 버튼 -->
<template>
  <div
    class="fixed inset-x-0 bottom-0 z-20 bg-white/90 px-4 pb-6 pt-3 backdrop-blur-md md:px-8 lg:px-[80px]"
  >
    <div class="mx-auto max-w-[1440px]">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-4 font-semibold text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
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
