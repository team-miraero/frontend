<!-- 공용 모달 컴포넌트 샘플 -->
<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <slot />
        <button
          v-if="showDefaultClose"
          type="button"
          class="mt-4 text-sm text-gray-500"
          @click="$emit('update:modelValue', false)"
        >
          닫기
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  showDefaultClose: {
    type: Boolean,
    default: true,
  }
})
defineEmits(['update:modelValue'])
</script>
