<!-- 사이드 "여유자금" 패널: 카드 클릭 시 각각 오늘/이번 달 여유자금 상세 모달을 염 -->
<template>
  <div class="w-full">
    <p class="text-sm font-bold text-[#0a192f]">여유자금</p>

    <button
      type="button"
      class="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-5 text-left"
      @click="$emit('open-today')"
    >
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-sm text-slate-500">☀️ 오늘</span>
      </div>
      <p class="pt-3 text-lg font-black text-[#0a192f] lg:text-2xl">
        {{ formatWon(daily.availableMoney) }}
      </p>
      <p class="pt-1 text-xs text-slate-400">오늘 하루 안심하고 쓸 수 있는 돈 🎯</p>
    </button>

    <button
      type="button"
      class="mt-3 w-full rounded-2xl border border-slate-200 bg-white p-5 text-left"
      @click="$emit('open-month')"
    >
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-sm text-slate-500">📅 이번 달</span>
      </div>
      <p class="pt-3 text-lg font-black text-[#0a192f] lg:text-2xl">
        {{ formatWon(monthly.availableMoney) }}
      </p>
      <p class="pt-1 text-xs text-slate-400">고정지출 뺀 이번 달 순수 여유금 🍀</p>
    </button>
  </div>
</template>

<script setup>
defineProps({
  monthly: {
    type: Object,
    required: true, // { income, fixedExpense, targetGoalAutoTransfer, otherGoalAutoTransfer, variableExpense, availableMoney }
  },
  daily: {
    type: Object,
    required: true, // 위와 동일한 형태의 일 단위 값 (백엔드가 계산해서 내려줌)
  },
})
defineEmits(['open-today', 'open-month'])

function formatWon(amount) {
  return `${amount.toLocaleString()}원`
}
</script>
