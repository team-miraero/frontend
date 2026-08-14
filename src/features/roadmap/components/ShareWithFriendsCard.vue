<!-- 사이드 "여유자금" 영역 하단 및 모바일: 친구에게 목표 달성 현황 자랑하기 카드 -->
<template>
  <button
    type="button"
    class="group relative flex min-h-[104px] w-full items-center justify-between overflow-hidden rounded-[20px] border px-5 py-4 text-left shadow-[0_2px_8px_rgba(0,102,255,0.06)] transition-all hover:shadow-md sm:min-h-[112px] sm:px-7"
    :style="{ borderColor: theme.cardBorder, backgroundImage: theme.cardGradient }"
    @click="$emit('open')"
  >
    <div class="relative z-10 min-w-0 pr-24 sm:pr-52">
      <h3 class="whitespace-nowrap text-sm font-bold text-[#0a192f] sm:text-base">
        친구에게 공유하기
      </h3>
      <p class="pt-1 text-left text-[11px] leading-tight text-slate-500 sm:text-xs">
        목표 달성 현황을 친구들에게 자랑해 보세요!
      </p>
      <span class="mt-2 inline-flex text-xs font-bold text-primary sm:text-sm">공유하기 →</span>
    </div>

    <!-- 우측 대형 friends.png 캐릭터 일러스트 -->
    <img
      :src="friendsImage"
      alt="친구들"
      class="absolute -bottom-3 right-3 h-24 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 sm:right-8 sm:h-32"
    />
  </button>
</template>

<script setup>
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'
import friendsImage from '@/assets/images/friends.png'

defineEmits(['open'])

const theme = PACE_THEME.AHEAD
</script>
