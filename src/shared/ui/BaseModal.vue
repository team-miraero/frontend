<!-- 공용 모달 컴포넌트: 모바일에서는 바텀시트(Bottom Sheet), PC/태블릿에서는 중앙 모달로 반응형 전환 -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
        @mousedown.self="handleBackdropClick"
      >
        <div
          class="w-full max-w-md overflow-hidden rounded-t-[28px] bg-white shadow-2xl transition-all sm:rounded-2xl"
          :class="hideDefaultClose ? '' : 'p-6'"
        >
          <!-- 모바일 상단 핸들 바 -->
          <div class="flex justify-center pt-3 pb-1 sm:hidden">
            <div class="h-1 w-10 rounded-full bg-slate-200" />
          </div>

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
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  hideDefaultClose: { type: Boolean, default: false },
  closeOnBackdrop: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false)
  }
}
</script>
