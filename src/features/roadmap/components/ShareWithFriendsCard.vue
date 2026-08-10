<!-- 사이드 "여유자금" 영역 하단 및 모바일: 친구에게 목표 달성 현황 자랑하기 카드 -->
<template>
  <button
    type="button"
    class="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] border p-3.5 sm:p-4 text-left transition-all hover:shadow-md shadow-[0_2px_8px_rgba(0,102,255,0.06)]"
    :style="{ borderColor: theme.cardBorder, backgroundImage: theme.cardGradient }"
    @click="$emit('open')"
  >
    <div class="relative z-10 flex items-start justify-between gap-2 pr-20 sm:pr-24">
      <div>
        <h3 class="text-[11px] sm:text-xs font-bold text-[#0a192f] whitespace-nowrap">
          친구에게 공유하기
        </h3>
        <p class="pt-1 text-[10px] leading-tight text-slate-500 sm:text-xs text-left">
          목표 달성 현황을 친구들에게 자랑해 보세요!
        </p>
      </div>
    </div>

    <!-- 우측 대형 friends.png 캐릭터 일러스트 -->
    <img
      :src="friendsImage"
      alt="친구들"
      class="absolute -bottom-1 right-2 sm:right-3 h-20 sm:h-24 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5"
    />

    <div class="relative z-10 flex items-center justify-start pt-2">
      <span class="text-[11px] sm:text-xs font-bold text-primary whitespace-nowrap">
        공유하기 →
      </span>
    </div>
  </button>
</template>

<script setup>
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'
import friendsImage from '@/assets/images/friends.png'

defineEmits(['open'])

const theme = PACE_THEME.AHEAD
</script>
