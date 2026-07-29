<!-- 페이스 상태 배너 + 페이스메이커 CTA 버튼: paceStatus에 따라 색상/문구가 바뀜 -->
<template>
  <div class="flex w-full items-stretch gap-4">
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
    >
      <img :src="theme.ctaIcon" alt="" class="size-[18px]" />
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

const theme = computed(() => PACE_THEME[props.pace.paceStatus] ?? PACE_THEME.ON_TRACK)
</script>
