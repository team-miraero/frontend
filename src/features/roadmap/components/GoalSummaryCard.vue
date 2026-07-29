<!-- "모인 금액 / 목표" 카드 -->
<template>
  <div
    class="rounded-[20px] border border-slate-200 bg-white p-[25px] shadow-[0_2px_7px_rgba(0,102,255,0.06)]"
  >
    <p class="text-xs font-bold text-slate-400">모인 금액 / 목표</p>

    <div class="flex items-end gap-2 pt-2">
      <span class="text-2xl font-black tracking-[-0.72px] text-[#0a192f]">
        {{ formatManwon(goal.currentAmount) }}
      </span>
      <span class="pb-0.5 text-sm text-slate-400">/ {{ formatWon(goal.goalAmount) }}</span>
    </div>

    <div class="pt-3">
      <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div class="h-2 rounded-full bg-primary" :style="{ width: `${goal.progressRate}%` }" />
      </div>
      <div class="flex items-center justify-between pt-1.5 text-xs">
        <span class="font-bold text-primary">{{ goal.progressRate }}% 달성</span>
        <span class="text-slate-400">{{ formatEndDate(goal.period.endDate) }} 목표</span>
      </div>
    </div>

    <div class="mt-2.5 flex items-center gap-2 border-t border-slate-100 pt-2.5">
      <span class="size-1.5 rounded-full" :class="paceDotClass" />
      <span class="text-xs font-bold" :class="paceTextClass">{{ paceLabel }}</span>
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

const paceDotClass = computed(() =>
  props.goal.pace.paceStatus === 'BEHIND' ? 'bg-rose-400' : 'bg-emerald-400'
)
const paceTextClass = computed(() =>
  props.goal.pace.paceStatus === 'BEHIND' ? 'text-rose-600' : 'text-emerald-600'
)
const paceLabel = computed(() => {
  const amount = formatManwon(Math.abs(props.goal.pace.differenceAmount))
  if (props.goal.pace.paceStatus === 'BEHIND') return `예정보다 ${amount}원 뒤처짐`
  if (props.goal.pace.paceStatus === 'AHEAD') return `예정보다 ${amount}원 앞섬`
  return '예정대로 진행 중'
})

function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만`
}
function formatWon(amount) {
  return `${formatManwon(amount)}원`
}
function formatEndDate(yyyyMM) {
  return yyyyMM.replace('-', '.')
}
</script>
