<!-- 사이드 "여유자금" 패널: 카드 클릭 시 각각 오늘/이번 달 여유자금 상세 모달을 염 -->
<template>
  <div class="w-full">
    <p class="text-sm font-bold text-[#0a192f]">여유자금</p>

    <!-- 모바일(lg 미만): 오늘/이번 달을 한 행에 나란히, 데스크톱: 기존처럼 세로로 쌓음 -->
    <div class="mt-2 grid grid-cols-2 gap-2.5 sm:gap-3 lg:block lg:gap-0">
      <button
        type="button"
        class="flex w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 text-left transition-all hover:border-slate-300"
        @click="$emit('open-today')"
      >
        <div>
          <div class="flex items-center justify-between">
            <span
              class="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap"
            >
              <AppIcon name="sun" size="sm" /> 오늘
            </span>
          </div>
          <p
            class="pt-1.5 text-sm font-black text-[#0a192f] sm:pt-3 sm:text-xl lg:text-2xl whitespace-nowrap"
          >
            {{ formatKRW(daily.todayAvailableMoney) }}
          </p>
        </div>
        <p class="pt-1 text-[10px] leading-tight text-slate-400 sm:text-xs">
          오늘 하루 안심하고 쓸 수 있는 돈 <span class="font-tossface">🎯</span>
        </p>
      </button>

      <button
        type="button"
        class="flex w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 text-left transition-all hover:border-slate-300 lg:mt-3"
        @click="$emit('open-month')"
      >
        <div>
          <div class="flex items-center justify-between">
            <span
              class="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap"
            >
              <span class="font-tossface text-base">📅</span> 이번 달
            </span>
          </div>
          <p
            class="pt-1.5 text-sm font-black text-[#0a192f] sm:pt-3 sm:text-xl lg:text-2xl whitespace-nowrap"
          >
            {{ formatKRW(monthly.availableMoney) }}
          </p>
        </div>
        <p class="pt-1 text-[10px] leading-tight text-slate-400 sm:text-xs">
          고정지출 뺀 이번 달 순수 여유금 <span class="font-tossface">🍀</span>
        </p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { formatKRW } from '@/shared/lib/money'
import AppIcon from '@/shared/ui/AppIcon.vue'
defineProps({
  monthly: {
    type: Object,
    required: true,
  },
  daily: {
    type: Object,
    required: true,
  },
})
defineEmits(['open-today', 'open-month'])
</script>
