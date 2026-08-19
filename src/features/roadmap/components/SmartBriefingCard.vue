<!-- 스마트 자산 브리핑 해석 카드: 상단에서 이미 보여준 숫자를 반복하지 않고, 현재 페이스 상태를 해석해 다음 행동을 제안한다 -->
<template>
  <div
    class="flex flex-col rounded-2xl border border-slate-100 bg-[#f8fbff] p-4 transition-all duration-200 ease-out hover:border-slate-200 hover:bg-white hover:shadow-[0_4px_16px_rgba(15,23,42,0.04)] break-keep"
  >
    <div class="flex items-start gap-2.5">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <!-- 시작 전: 깃발 -->
        <svg
          v-if="paceState === PACE_STATE.NOT_STARTED"
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
        <!-- 앞선 페이스: 상승 그래프 -->
        <svg
          v-else-if="paceState === PACE_STATE.AHEAD"
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="3 17 9 11 13 15 21 7" />
          <polyline points="14 7 21 7 21 14" />
        </svg>
        <!-- 뒤처진 페이스: 과녁 -->
        <svg
          v-else-if="paceState === PACE_STATE.BEHIND"
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <!-- 적정 페이스: 체크 -->
        <svg
          v-else
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>

      <div class="min-w-0 pt-0.5">
        <p class="text-sm font-bold text-[#0a192f] break-keep">{{ headline }}</p>
        <p class="mt-1 text-xs font-medium leading-relaxed text-slate-500 break-keep">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PACE_STATE, derivePaceState } from '@/features/roadmap/constants/pace-state.constants'

const props = defineProps({
  goal: {
    type: Object,
    default: () => ({}),
  },
})

const paceState = computed(() =>
  derivePaceState({
    currentAmount: props.goal?.currentAmount,
    paceStatus: props.goal?.pace?.paceStatus,
  })
)

const expectedAmount = computed(() => Number(props.goal?.pace?.expectedAmount ?? 0))
const differenceAmount = computed(() => Math.abs(Number(props.goal?.pace?.differenceAmount ?? 0)))
const remainingAmount = computed(() =>
  Math.max(0, Number(props.goal?.goalAmount ?? 0) - Number(props.goal?.currentAmount ?? 0))
)

// 앞선 페이스일 때 현재 속도를 유지하면 몇 개월 먼저 도착하는지 (남은 금액 ÷ 페이스, 보수적으로 반올림)
const monthsSaved = computed(() => {
  if (paceState.value !== PACE_STATE.AHEAD || expectedAmount.value <= 0) return 0
  const currentMonthlyPace = expectedAmount.value + differenceAmount.value
  if (currentMonthlyPace <= 0) return 0
  const monthsAtExpectedPace = remainingAmount.value / expectedAmount.value
  const monthsAtCurrentPace = remainingAmount.value / currentMonthlyPace
  return Math.max(0, Math.round(monthsAtExpectedPace - monthsAtCurrentPace))
})

const formattedEndDate = computed(() => {
  const [year, month] = String(props.goal?.period?.endDate ?? '').split('-')
  if (!year || !month) return ''
  return `${year}년 ${Number(month)}월`
})

const headline = computed(() => {
  if (paceState.value === PACE_STATE.NOT_STARTED) return '첫 저축을 시작해볼까요?'
  if (paceState.value === PACE_STATE.AHEAD) return '목표보다 빠르게 달리고 있어요!'
  if (paceState.value === PACE_STATE.BEHIND) {
    return `목표보다 ${formatManwon(differenceAmount.value)}만원/월 뒤처졌어요`
  }
  return '지금처럼만 모으면 돼요!'
})

const description = computed(() => {
  if (paceState.value === PACE_STATE.NOT_STARTED) {
    return '다음 달부터 설정한 금액이 자동으로 모일 예정이에요.'
  }
  if (paceState.value === PACE_STATE.AHEAD) {
    return monthsSaved.value >= 1
      ? `현재 페이스라면 목표를 ${monthsSaved.value}개월 먼저 달성할 수 있어요.`
      : '현재 속도를 유지하면 목표를 기존 예상보다 더 빠르게 달성할 수 있어요.'
  }
  if (paceState.value === PACE_STATE.BEHIND) {
    return `앞으로 매달 약 ${formatManwon(differenceAmount.value)}만원씩 더 모으면 다시 목표 페이스에 도달할 수 있어요.`
  }
  return formattedEndDate.value
    ? `현재 페이스를 유지하면 ${formattedEndDate.value} 목표 달성이 가능해요.`
    : '현재 페이스를 유지하면 목표를 예정대로 달성할 수 있어요.'
})

function formatManwon(amount) {
  return Math.round(Number(amount ?? 0) / 10000).toLocaleString()
}
</script>
