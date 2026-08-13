<!-- 이번 달 여유자금 상세 모달: 이번 달 여유자금 계산 내역 + 이번 달 진행률을 보여줌 -->
<template>
  <BaseModal
    :model-value="modelValue"
    hide-default-close
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="flex items-start justify-between border-b border-slate-100 px-7 pb-[17px] pt-6">
      <div>
        <p class="text-xs font-bold text-slate-400">📅 이번 달 여유자금</p>
        <p class="pt-1 text-2xl font-black tracking-[-0.72px] text-[#0a192f]">
          {{ formatWon(monthly.availableMoney) }}
        </p>
      </div>
      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8fbff]"
        aria-label="닫기"
        @click="$emit('update:modelValue', false)"
      >
        <img src="@/assets/icons/modal-close.svg" alt="" class="size-[15px]" />
      </button>
    </div>

    <div class="flex flex-col gap-4 px-7 py-5">
      <p class="text-xs font-bold uppercase tracking-[1.2px] text-slate-400">어떻게 계산됐나요?</p>

      <div class="flex flex-col">
        <div v-for="(row, index) in rows" :key="row.label">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-bold text-[#0a192f]">{{ row.label }}</p>
              <p class="pt-0.5 text-xs text-slate-400">{{ row.caption }}</p>
            </div>
            <p
              class="shrink-0 whitespace-nowrap text-sm font-black"
              :class="row.sign === '+' ? 'text-emerald-600' : 'text-rose-500'"
            >
              {{ row.sign }} {{ formatWon(row.amount) }}
            </p>
          </div>
          <div v-if="index < rows.length - 1" class="my-3 h-px w-full bg-slate-100" />
        </div>
      </div>

      <div
        class="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#f4f8ff] px-5 py-4"
      >
        <p class="text-sm font-bold text-[#0a192f]">이번 달 여유자금</p>
        <p class="text-lg font-black text-[#0a192f]">= {{ formatWon(monthly.availableMoney) }}</p>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold text-slate-400">이번 달 진행률</p>
          <p class="text-xs font-bold text-slate-500">
            {{ monthly.elapsedDays }}/{{ monthly.periodDays }}일
          </p>
        </div>
        <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div class="h-2 rounded-full bg-primary" :style="{ width: `${progress.percent}%` }" />
        </div>
        <p class="pt-1.5 text-xs leading-[19.5px] text-slate-400">
          남은 {{ monthly.remainingDays }}일 동안 이 페이스를 유지하면 목표 저축이 지켜져요.
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  monthly: {
    type: Object,
    required: true, // { income, fixedExpense, targetGoalAutoTransfer, otherGoalAutoTransfer, variableExpense, availableMoney }
  },
})
defineEmits(['update:modelValue'])

const rows = computed(() => [
  {
    label: '이번 달 소득',
    caption: '마이데이터 연동 기준',
    amount: props.monthly.income,
    sign: '+',
  },
  {
    label: '목표 저축 (자동이체)',
    caption: '이 목표 자동이체 합계',
    amount: props.monthly.targetGoalAutoTransfer,
    sign: '−',
  },
  {
    label: '다른 목표 저축',
    caption: '다른 목표 자동이체 합계',
    amount: props.monthly.otherGoalAutoTransfer,
    sign: '−',
  },
  {
    label: '고정지출',
    caption: '월세·통신·구독 등',
    amount: props.monthly.fixedExpense,
    sign: '−',
  },
  {
    label: '이번 달 변동 지출',
    caption: '카드·현금 실제 지출 (현재까지)',
    amount: props.monthly.variableExpense,
    sign: '−',
  },
])

const progress = computed(() => {
  if (!props.monthly.periodDays) return { percent: 0 }
  return {
    percent: Math.min(
      100,
      Math.round((props.monthly.elapsedDays / props.monthly.periodDays) * 100)
    ),
  }
})

function formatWon(amount) {
  return `${amount.toLocaleString()}원`
}
</script>
