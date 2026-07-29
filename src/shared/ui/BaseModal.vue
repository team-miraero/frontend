<!-- 공용 모달 컴포넌트: hideDefaultClose로 기본 닫기 버튼을 끄고 슬롯에서 커스텀 헤더/푸터를 구성할 수 있음 -->
<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lg"
        :class="hideDefaultClose ? '' : 'p-6'"
      >
        <slot />
        <button
          v-if="!hideDefaultClose"
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
  modelValue: { type: Boolean, default: false },
  hideDefaultClose: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>
