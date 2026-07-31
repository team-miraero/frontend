<!-- "모인 금액 / 목표" 카드 -->
<template>
  <!-- 데스크톱(lg 이상): 기존 한 줄 배치 그대로 유지 -->
  <div
    class="hidden rounded-[20px] border border-slate-200 bg-white p-[25px] shadow-[0_2px_7px_rgba(0,102,255,0.06)] lg:block"
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

  <!-- 모바일(lg 미만): 글자 크기를 줄이고 목표/모인 금액을 각각 한 줄씩 줄바꿈한 축약형 -->
  <div
    class="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_2px_7px_rgba(0,102,255,0.06)] lg:hidden"
  >
    <p class="text-xs font-bold text-slate-400">모인 금액 / 목표</p>

    <div class="flex flex-col gap-0.5 pt-2">
      <p class="text-xs text-slate-400">목표 {{ formatWon(goal.goalAmount) }}</p>
      <p class="text-lg font-black tracking-[-0.36px] text-[#0a192f]">
        모인 {{ formatManwon(goal.currentAmount) }}
      </p>
    </div>

    <div class="pt-3">
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div class="h-1.5 rounded-full bg-primary" :style="{ width: `${goal.progressRate}%` }" />
      </div>
      <div class="flex items-center justify-between gap-1 pt-1.5 text-[11px]">
        <span class="whitespace-nowrap font-bold text-primary">{{ goal.progressRate }}% 달성</span>
        <span class="whitespace-nowrap text-slate-400"
          >{{ formatEndDate(goal.period.endDate) }} 목표</span
        >
      </div>
    </div>

    <div class="mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2">
      <span class="size-1.5 rounded-full" :class="paceDotClass" />
      <span class="text-[11px] font-bold" :class="paceTextClass">{{ paceLabelShort }}</span>
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

// 모바일 축약형: "예정보다" 접두어 없이 핵심 문구만
const paceLabelShort = computed(() => {
  const amount = formatManwon(Math.abs(props.goal.pace.differenceAmount))
  if (props.goal.pace.paceStatus === 'BEHIND') return `${amount}원 뒤처짐`
  if (props.goal.pace.paceStatus === 'AHEAD') return `${amount}원 앞섬`
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
