<!-- 페이스메이커 자동 저축 전체 내역 모달 -->
<template>
  <BaseModal
    :model-value="modelValue"
    hide-default-close
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="flex items-center justify-between border-b border-slate-100 px-7 pb-[17px] pt-6">
      <h3 class="text-base font-black text-[#0a192f]">자동 저축 내역</h3>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-full bg-[#f8fbff]"
        aria-label="닫기"
        @click="$emit('update:modelValue', false)"
      >
        <img src="@/assets/icons/modal-close.svg" alt="" class="size-[15px]" />
      </button>
    </div>

    <div class="flex max-h-[400px] flex-col gap-2 overflow-y-auto px-7 py-5">
      <div
        v-for="item in histories"
        :key="item.date"
        class="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0"
      >
        <div>
          <p class="text-xs font-bold text-[#0a192f]">{{ formatDate(item.date) }}</p>
          <p class="pt-0.5 text-xs text-slate-400">{{ describeHistory(item) }}</p>
        </div>
        <p
          class="text-sm font-bold"
          :class="item.status === 'SAVED' ? 'text-primary' : 'text-slate-300'"
        >
          {{ item.status === 'SAVED' ? `+${formatWon(item.amount)}` : '—' }}
        </p>
      </div>

      <p v-if="histories.length === 0" class="py-6 text-center text-sm text-slate-400">
        아직 저축 내역이 없어요
      </p>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/shared/ui/BaseModal.vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  histories: {
    type: Array,
    default: () => [],
  },
})
defineEmits(['update:modelValue'])

function describeHistory(item) {
  if (item.description) return item.description
  return item.status === 'SAVED' ? '여유자금 자동 저축' : '저축 건너뜀'
}

function formatDate(isoDate) {
  return isoDate.replaceAll('-', '.')
}

function formatWon(amount) {
  return `${(amount ?? 0).toLocaleString()}원`
}
</script>
