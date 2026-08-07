<!-- 사이드 "여유자금" 영역 하단 및 모바일: 친구에게 목표 달성 현황 자랑하기 카드 -->
<template>
  <button
    type="button"
    class="w-full rounded-2xl border p-5 text-left transition-all hover:opacity-95 shadow-[0_2px_8px_rgba(0,102,255,0.06)]"
    :style="{ borderColor: theme.cardBorder, backgroundImage: theme.cardGradient }"
    @click="$emit('open')"
  >
    <div class="flex items-center justify-between">
      <span class="flex items-center gap-1.5 text-sm font-bold text-[#0a192f]"
        >🧑‍🤝‍🧑 친구에게 공유하기</span
      >
    </div>
    <p class="pt-2 text-xs text-slate-500">지금까지 달성한 목표를 친구들에게 공유해 보세요.</p>
    <div class="flex justify-end pt-2">
      <span class="text-sm font-bold text-primary">공유하기 →</span>
    </div>
  </button>
</template>

<script setup>
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'

defineEmits(['open'])

const theme = PACE_THEME.AHEAD
</script>
