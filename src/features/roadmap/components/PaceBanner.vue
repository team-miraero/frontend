<!-- 페이스 상태 배너 + 페이스메이커 CTA 버튼: paceStatus에 따라 색상/문구가 바뀜 -->
<template>
  <div class="hidden w-full items-stretch gap-4 lg:flex">
    <div
      class="flex flex-1 items-center justify-between rounded-[18px] border px-5 py-4"
      :style="{ borderColor: theme.cardBorder, backgroundImage: theme.cardGradient }"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-2xl"
          :style="{ backgroundColor: theme.iconBg }"
        >
          <img :src="theme.icon" alt="" class="size-4" />
        </div>
        <div>
          <p class="text-sm font-black tracking-[-0.28px] text-[#0a192f]">{{ theme.title }}</p>
          <p class="pt-0.5 text-xs text-slate-500">{{ theme.subtitle(pace) }}</p>
        </div>
      </div>

      <div
        class="flex shrink-0 flex-col items-center rounded-[10px] border px-3.5 py-2"
        :style="{ backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }"
      >
        <p class="text-lg font-black tracking-[-0.36px]" :style="{ color: theme.badgeText }">
          {{ progressRate }}%
        </p>
        <p class="text-[9px] text-slate-400">달성률</p>
      </div>
    </div>

    <button
      type="button"
      class="flex min-w-[150px] flex-col items-center justify-center gap-1.5 rounded-[18px] px-5 py-4"
      :style="{ backgroundImage: theme.ctaGradient, boxShadow: `0 4px 10px ${theme.ctaShadow}` }"
      @click="$emit('cta-click')"
    >
      <img :src="theme.ctaIcon" alt="" class="size-[18px]" />
      <span class="text-center text-xs font-black leading-[15px] text-white">
        <span class="block">{{ theme.ctaLines[0] }}</span>
        <span class="block">{{ theme.ctaLines[1] }}</span>
      </span>
      <span class="text-[10px] font-bold text-white opacity-80">{{ theme.ctaAction }}</span>
    </button>
  </div>

  <!-- 모바일(lg 미만): 배너를 달성률 + 현재 페이스 아이콘만 남긴 축약형으로,
       CTA는 세로로 늘어지지 않게, 배너와 함께 정사각형에 가까운 2열 그리드로 배치 -->
  <div class="grid grid-cols-2 gap-3 lg:hidden">
    <div
      class="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-3"
      :style="{ borderColor: theme.cardBorder, backgroundImage: theme.cardGradient }"
    >
      <div
        class="flex size-8 shrink-0 items-center justify-center rounded-full"
        :style="{ backgroundColor: theme.iconBg }"
      >
        <img :src="theme.icon" alt="" class="size-3.5" />
      </div>
      <p class="text-xs font-bold text-slate-500">현재 페이스</p>
      <div class="flex items-baseline gap-1">
        <span class="text-lg font-black tracking-[-0.32px]" :style="{ color: theme.badgeText }">
          {{ progressRate }}%
        </span>
        <span class="text-[10px] text-slate-400">달성률</span>
      </div>
    </div>

    <button
      type="button"
      class="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-3"
      :style="{ backgroundImage: theme.ctaGradient, boxShadow: `0 4px 10px ${theme.ctaShadow}` }"
      @click="$emit('cta-click')"
    >
      <img :src="theme.ctaIcon" alt="" class="size-5 shrink-0" />
      <span class="text-center text-xs font-black leading-[15px] text-white">
        <span class="block">{{ theme.ctaLines[0] }}</span>
        <span class="block">{{ theme.ctaLines[1] }}</span>
      </span>
      <span class="text-[10px] font-bold text-white opacity-80">{{ theme.ctaAction }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'

const props = defineProps({
  pace: {
    type: Object,
    required: true, // { expectedAmount, differenceAmount, paceStatus }
  },
  progressRate: {
    type: Number,
    required: true,
  },
})
defineEmits(['cta-click'])

const theme = computed(() => PACE_THEME[props.pace.paceStatus] ?? PACE_THEME.ON_TRACK)
</script>
