<!-- 사이드 "여유자금" 패널 -->
<template>
  <div class="w-full">
    <p class="text-sm font-bold text-[#0a192f]">여유자금</p>

    <div class="mt-2 rounded-2xl border border-slate-200 bg-white p-5">
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-sm text-slate-500">☀️ 오늘</span>
      </div>
      <p class="pt-3 text-2xl font-black text-[#0a192f]">{{ formatWon(estimatedDailyMoney) }}</p>
      <p class="pt-1 text-xs text-slate-400">오늘 하루 안심하고 쓸 수 있는 돈 🎯</p>
    </div>

    <div class="mt-3 rounded-2xl border border-slate-200 bg-white p-5">
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-sm text-slate-500">📅 이번 달</span>
      </div>
      <p class="pt-3 text-2xl font-black text-[#0a192f]">
        {{ formatWon(availableMoney.availableMoney) }}
      </p>
      <p class="pt-1 text-xs text-slate-400">고정지출 뺀 이번 달 순수 여유금 🍀</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  availableMoney: {
    type: Object,
    required: true,
  },
})

// TODO: 백엔드가 '오늘' 여유자금을 따로 안 주고 있어서, 이번 달 여유자금을 이번 달 남은 일수로 나눈 근사치입니다.
// 정확한 일 단위 필드가 API에 추가되면 이 계산은 제거하고 바로 바인딩.
const estimatedDailyMoney = computed(() => {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const remainingDays = daysInMonth - today.getDate() + 1
  return Math.round(props.availableMoney.availableMoney / remainingDays)
})

function formatWon(amount) {
  return `${amount.toLocaleString()}원`
}
</script>
