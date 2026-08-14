<template>
  <section
    class="grid w-full gap-7 pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,550px)] lg:items-start"
  >
    <div>
      <p class="text-[15px] font-bold text-[#0a192f]">
        안녕하세요, 오늘도 목표를 향해 달려볼까요 👋
      </p>
      <h1
        class="mt-7 text-[30px] font-black leading-[1.35] tracking-[-1px] text-[#0a192f] sm:text-[38px]"
      >
        {{ formatManwon(goalAmount) }}만원 목표까지<br />
        <span class="text-primary">{{ formatManwon(currentAmount) }}만원</span> 모았어요
      </h1>

      <div class="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold">
        <span class="text-[#0a192f]"
          >{{ progressRate }}% <span class="font-medium text-slate-500">달성</span></span
        >
        <span class="size-1 rounded-full bg-slate-300" />
        <span class="font-medium text-slate-500"
          >예상 도착일 <strong class="text-[#73809c]">{{ formattedEndDate }}</strong></span
        >
      </div>

      <div class="mt-8 flex flex-wrap items-center gap-y-4 text-[13px]">
        <div class="pr-6">
          <span class="font-bold text-[#0a192f]">현재 페이스</span>
          <strong class="ml-2 text-lg text-primary">{{ formatManwon(currentAmount) }}만원</strong>
          <span class="ml-1 font-bold text-slate-500">/ 월</span>
        </div>
        <div class="border-l border-slate-300 px-6">
          <span class="font-bold text-[#0a192f]">목표 페이스</span>
          <strong class="ml-2 text-lg text-[#0a192f]"
            >{{ formatManwon(pace.expectedAmount) }}만원</strong
          >
          <span class="ml-1 font-bold text-slate-500">/ 월</span>
        </div>
        <div class="border-l border-slate-300 px-6">
          <strong class="text-lg" :style="{ color: theme.badgeText }">
            {{ pace.paceStatus === 'BEHIND' ? '-' : '+'
            }}{{ formatManwon(Math.abs(pace.differenceAmount)) }}만원
          </strong>
          <span class="ml-1 font-bold text-slate-500">/ 월</span>
        </div>
        <button
          type="button"
          class="ml-1 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm transition hover:border-primary/30 hover:text-primary"
          :class="disabled ? 'pointer-events-none opacity-45' : ''"
          @click="$emit('pause')"
        >
          <span
            class="flex size-7 items-center justify-center rounded-full border border-slate-200"
          >
            <img src="@/assets/icons/goal-pause.svg" alt="" class="size-3" />
          </span>
          목표 일시정지
        </button>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,35,70,0.03)]"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between px-6 py-4 text-left"
        :class="disabled ? 'pointer-events-none opacity-45' : ''"
        @click="$emit('cta-click')"
      >
        <strong class="text-[17px] text-[#0a192f]">페이스메이커</strong>
      </button>
      <div class="px-6 pb-2">
        <button
          type="button"
          class="flex w-full items-center gap-4 border-b border-slate-100 py-4 text-left"
          :class="disabled ? 'pointer-events-none opacity-45' : ''"
          @click="$emit('cta-click')"
        >
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"
            >⚡</span
          >
          <span class="min-w-0 flex-1">
            <strong class="block text-sm text-[#0a192f]">알아서 모으기</strong>
            <span class="mt-1 block text-xs font-medium text-[#73809c]"
              >이번 달 목표 금액을 자동으로 모아요</span
            >
          </span>
          <span class="text-2xl leading-none text-primary">›</span>
        </button>
        <button
          type="button"
          class="flex w-full gap-4 py-4 text-left disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isToggling"
          @click="$emit('toggle')"
        >
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
            >▣</span
          >
          <span class="min-w-0 flex-1">
            <span class="flex items-start justify-between gap-3">
              <span>
                <strong class="block text-sm text-[#0a192f]">다음 달 자금마련</strong>
                <span class="mt-1 block text-xs font-medium text-[#73809c]">
                  {{
                    pacemaker?.enabled
                      ? '오늘 하루 여유자금을 자동 저축'
                      : '하루 여유자금으로 다음 달 자금을 미리 마련해둘게요'
                  }}
                </span>
              </span>
              <span
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                :class="pacemaker?.enabled ? 'bg-primary' : 'bg-slate-300'"
                role="switch"
                :aria-checked="pacemaker?.enabled === true"
              >
                <span
                  class="absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all"
                  :class="pacemaker?.enabled ? 'left-[22px]' : 'left-0.5'"
                />
              </span>
            </span>
            <span
              v-if="pacemaker?.enabled"
              class="mt-3 block rounded-xl bg-[#eaf2ff] px-4 py-3 text-xs font-bold text-primary"
            >
              이번달 +{{ formatWon(pacemaker.monthlySecuredAmount) }} 자동 확보
            </span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'

const props = defineProps({
  pace: { type: Object, required: true },
  progressRate: { type: Number, required: true },
  disabled: { type: Boolean, default: false },
  currentAmount: { type: Number, default: 0 },
  goalAmount: { type: Number, default: 0 },
  endDate: { type: String, default: '' },
  dailyAvailableMoney: { type: Object, default: null },
  monthlyAvailableMoney: { type: Object, default: null },
  pacemaker: { type: Object, default: null },
  isToggling: { type: Boolean, default: false },
})

defineEmits(['cta-click', 'pause', 'open-today', 'open-month', 'toggle'])

const theme = computed(() => PACE_THEME[props.pace.paceStatus] ?? PACE_THEME.ON_TRACK)
const formattedEndDate = computed(() => props.endDate?.replace('-', '.') ?? '')

function formatManwon(amount) {
  return Math.round(Number(amount || 0) / 10000).toLocaleString()
}

function formatWon(amount) {
  return `${Number(amount ?? 0).toLocaleString('ko-KR')}원`
}
</script>
