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
import {
  PACE_STATE,
  derivePaceState,
  deriveGoalPaceMetrics,
} from '@/features/roadmap/constants/pace-state.constants'

const props = defineProps({
  goal: {
    type: Object,
    default: () => ({}),
  },
})

const paceState = computed(() => derivePaceState(props.goal))
const paceMetrics = computed(() => deriveGoalPaceMetrics(props.goal))
const paceDifferenceManwon = computed(() =>
  formatManwon(Math.abs(paceMetrics.value.paceDifference))
)
const targetMonthlyPaceManwon = computed(() => formatManwon(paceMetrics.value.targetMonthlyPace))

// 앞선 페이스일 때 "지금 속도를 유지하면 목표를 몇 개월 일찍 달성하는지"는
// 남은 금액을 목표 페이스/현재 페이스 각각으로 나눈 개월 수 차이로 계산한다.
// 두 페이스 중 하나라도 0 이하라 계산이 성립하지 않으면 숫자를 임의로 지어내지 않는다.
const monthsSaved = computed(() => {
  if (paceState.value !== PACE_STATE.AHEAD) return null
  const { targetMonthlyPace, currentMonthlyPace } = paceMetrics.value
  if (targetMonthlyPace <= 0 || currentMonthlyPace <= 0) return null

  const remainingAmount = Math.max(0, Number(props.goal?.goalAmount ?? 0) - Number(props.goal?.currentAmount ?? 0))
  const monthsAtTargetPace = remainingAmount / targetMonthlyPace
  const monthsAtCurrentPace = remainingAmount / currentMonthlyPace
  const saved = Math.round(monthsAtTargetPace - monthsAtCurrentPace)
  return saved >= 1 ? saved : null
})

const headline = computed(() => {
  if (paceState.value === PACE_STATE.NOT_STARTED)
    return `목표를 위해 월 ${targetMonthlyPaceManwon.value}만원씩 모으면 돼요!`
  if (paceState.value === PACE_STATE.AHEAD) return `목표보다 월 ${paceDifferenceManwon.value}만원 빠른 페이스예요.`
  if (paceState.value === PACE_STATE.BEHIND) return `목표보다 월 ${paceDifferenceManwon.value}만원 느린 페이스예요.`
  return '목표 페이스에 맞춰 잘 달리고 있어요.'
})

const description = computed(() => {
  if (paceState.value === PACE_STATE.NOT_STARTED) {
    return '첫 저축을 시작하면 나의 페이스를 비교해드릴게요.'
  }
  if (paceState.value === PACE_STATE.AHEAD) {
    return monthsSaved.value
      ? `이 속도를 유지하면 목표를 약 ${monthsSaved.value}개월 빨리 달성할 수 있어요.`
      : '지금의 저축 속도를 잘 유지하고 있어요.'
  }
  if (paceState.value === PACE_STATE.BEHIND) {
    return `매달 ${paceDifferenceManwon.value}만원을 더 모으면 목표 페이스에 맞출 수 있어요.`
  }
  return '지금처럼 꾸준히 이어가보세요.'
})

function formatManwon(amount) {
  return Math.round(Number(amount ?? 0) / 10000).toLocaleString()
}
</script>
