<!-- "모인 금액 / 목표" 카드 -->
<template>
  <div
    class="flex flex-col justify-between rounded-2xl border border-slate-100 bg-[#f8fbff] p-4 transition-all duration-200 ease-out hover:border-slate-200 hover:bg-white hover:shadow-[0_4px_16px_rgba(15,23,42,0.04)] break-keep"
  >
    <div>
      <p class="text-xs font-bold text-slate-400">모인 금액 / 목표</p>

      <div class="flex items-baseline gap-1.5 pt-2">
        <span class="text-xl font-bold tracking-tight tabular-nums text-[#0a192f] sm:text-2xl">
          {{ formatManwon(goal.currentAmount) }}
        </span>
        <span class="text-xs font-bold tabular-nums text-slate-400"
          >/ {{ formatWon(goal.goalAmount) }}</span
        >
      </div>

      <div class="pt-3">
        <div class="h-2 w-full overflow-hidden rounded-full bg-primary/15">
          <div
            class="h-2 rounded-full bg-primary transition-all duration-500"
            :style="{ width: `${progressRate}%` }"
          />
        </div>
        <div class="flex items-center justify-between pt-1.5 text-xs font-bold">
          <span class="text-primary tabular-nums">{{ progressRate }}% 달성</span>
          <span class="text-slate-400">{{ formatEndDate(goal.period.endDate) }} 목표</span>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-1.5 border-t border-slate-200/60 pt-2.5">
      <span class="size-2 shrink-0 rounded-full" :class="paceDotClass" />
      <span class="text-xs font-bold tabular-nums whitespace-nowrap" :class="paceTextClass">{{
        paceLabel
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  goal: {
    type: Object,
    required: true,
  },
})

// 초과 달성해도 진행 바가 컨테이너를 넘지 않도록 0~100으로 묶는다.
const progressRate = computed(() =>
  Math.min(100, Math.max(0, Number(props.goal.progressRate) || 0))
)

const paceDotClass = computed(() =>
  props.goal.pace?.paceStatus === 'BEHIND' ? 'bg-rose-500' : 'bg-emerald-500'
)
const paceTextClass = computed(() =>
  props.goal.pace?.paceStatus === 'BEHIND' ? 'text-rose-600' : 'text-emerald-600'
)
const paceLabel = computed(() => {
  const amount = formatManwon(Math.abs(props.goal.pace?.differenceAmount ?? 0))
  if (props.goal.pace?.paceStatus === 'BEHIND') return `예정보다 ${amount}원 뒤처져 달리는 중`
  if (props.goal.pace?.paceStatus === 'AHEAD') return `예정보다 ${amount}원 앞서 달리는 중`
  return '예정대로 순항 중'
})

function formatManwon(amount) {
  return `${Math.round((amount ?? 0) / 10000).toLocaleString()}만`
}
function formatWon(amount) {
  return `${formatManwon(amount)}원`
}
function formatEndDate(yyyyMM) {
  return (yyyyMM ?? '').replace('-', '.')
}
</script>
