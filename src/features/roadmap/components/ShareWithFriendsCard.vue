<!-- 사이드 "여유자금" 영역 하단 및 모바일: 친구에게 목표 달성 현황 자랑하기 카드 -->
<template>
  <button
    type="button"
    class="flex h-full w-full flex-col justify-between rounded-2xl border p-3 sm:p-5 text-left transition-all hover:opacity-95 shadow-[0_2px_8px_rgba(0,102,255,0.06)]"
    :style="{ borderColor: theme.cardBorder, backgroundImage: theme.cardGradient }"
    @click="$emit('open')"
  >
    <div>
      <div class="flex items-center justify-between">
        <span
          class="flex items-center gap-1 text-[11px] sm:text-sm font-bold text-[#0a192f] whitespace-nowrap"
        >
          🧑‍🤝‍🧑 친구에게 공유하기
        </span>
      </div>
      <p class="pt-1 text-[10px] leading-tight text-slate-500 sm:text-xs text-left">
        목표 달성 현황을 친구들에게 자랑해 보세요!
      </p>
    </div>
    <div class="flex justify-end pt-1.5">
      <span class="text-[11px] sm:text-sm font-bold text-primary whitespace-nowrap"
        >공유하기 →</span
      >
    </div>
  </button>
</template>

<script setup>
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'

defineEmits(['open'])

const theme = PACE_THEME.AHEAD
</script>
