<!-- 페이스 히어로 배너: 배지 + 헤드라인 + 페이스 3항목 + CTA / 오늘·이번달 여유자금 + 우측 원형 달성률 게이지 -->
<template>
  <div
    class="relative z-10 flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
  >
    <div class="flex flex-1 flex-col gap-2.5">
      <span
        class="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold"
        :style="{
          backgroundColor: theme.badgeBg,
          borderColor: theme.badgeBorder,
          color: theme.badgeText,
        }"
      >
        오늘의 페이스
      </span>

      <p class="text-lg font-black leading-snug tracking-[-0.4px] text-[#0a192f] sm:text-xl">
        현재 페이스가 목표보다
        <span :style="{ color: theme.badgeText }"
          >{{ formatManwon(Math.abs(pace.differenceAmount)) }}만원</span
        >
        {{ paceStatusLabel }}!
      </p>

      <div
        class="flex w-fit flex-wrap divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white"
      >
        <div class="flex flex-col gap-0.5 px-4 py-2">
          <span class="text-[11px] font-bold text-slate-400">현재 페이스</span>
          <span class="text-base font-black tracking-[-0.36px] text-[#0a192f]">
            {{ formatManwon(currentAmount)
            }}<span class="text-xs font-bold text-slate-400">만원</span>
          </span>
        </div>
        <div class="flex flex-col gap-0.5 px-4 py-2">
          <span class="text-[11px] font-bold text-slate-400">목표 페이스</span>
          <span class="text-base font-black tracking-[-0.36px] text-[#0a192f]">
            {{ formatManwon(pace.expectedAmount)
            }}<span class="text-xs font-bold text-slate-400">만원</span>
          </span>
        </div>
        <div class="flex flex-col gap-0.5 px-4 py-2">
          <span class="text-[11px] font-bold text-slate-400">페이스 차이</span>
          <span class="text-base font-black tracking-[-0.36px]" :style="{ color: theme.badgeText }">
            {{ pace.paceStatus === 'BEHIND' ? '-' : '+'
            }}{{ formatManwon(Math.abs(pace.differenceAmount))
            }}<span class="text-xs font-bold text-slate-400">만원</span>
          </span>
        </div>
      </div>

      <button
        type="button"
        class="flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition-colors hover:bg-slate-50"
        :class="disabled ? 'pointer-events-none opacity-45' : ''"
        @click="$emit('pause')"
      >
        <img src="@/assets/icons/goal-pause.svg" alt="" class="size-[10px]" />
        <span class="text-[11px] font-bold text-slate-500">목표 일시정지</span>
      </button>
    </div>

    <div class="flex shrink-0 items-center gap-3 self-center">
      <!-- 다음달 자금마련 CTA: 하단 PacemakerToggleCard 배너에 같은 기능(토글/개설하기)이 이미 있어서
           히어로 중복 진입점은 잠시 주석 처리. 나중에 다시 쓸 수도 있어서 삭제하지 않고 남겨둠. -->
      <!--
      <button
        type="button"
        class="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5"
        :class="disabled ? 'pointer-events-none opacity-45' : ''"
        @click="$emit('cta-click')"
      >
        <span class="text-xs font-black" :style="{ color: theme.badgeText }">{{ theme.ctaAction }}</span>
      </button>
      -->

      <div v-if="dailyAvailableMoney || monthlyAvailableMoney" class="flex shrink-0 gap-2">
        <button
          v-if="dailyAvailableMoney"
          type="button"
          class="flex min-w-[92px] flex-col items-center rounded-2xl border border-primary/15 bg-[#eaf2ff] px-4 py-3 text-center transition-colors hover:bg-[#dcebff]"
          @click="$emit('open-today')"
        >
          <span class="text-[11px] font-black text-primary">오늘</span>
          <span class="pt-1 text-base font-black text-[#0a192f]">
            {{ formatKRW(dailyAvailableMoney.todayAvailableMoney) }}
          </span>
        </button>
        <button
          v-if="monthlyAvailableMoney"
          type="button"
          class="flex min-w-[92px] flex-col items-center rounded-2xl border border-primary/15 bg-[#eaf2ff] px-4 py-3 text-center transition-colors hover:bg-[#dcebff]"
          @click="$emit('open-month')"
        >
          <span class="text-[11px] font-black text-primary">이번 달</span>
          <span class="pt-1 text-base font-black text-[#0a192f]">
            {{ formatKRW(monthlyAvailableMoney.availableMoney) }}
          </span>
        </button>
      </div>

      <div class="relative flex size-24 shrink-0 items-center justify-center sm:size-28">
        <svg viewBox="0 0 120 120" class="size-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" stroke-width="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            :stroke="theme.badgeText"
            stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="ringCircumference"
            :stroke-dashoffset="ringOffset"
          />
        </svg>
        <div class="absolute flex flex-col items-center">
          <span class="text-xl font-black tracking-[-0.5px] text-[#0a192f]"
            >{{ progressRate }}%</span
          >
          <span class="text-[10px] text-slate-400">전체 달성률</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'
import { formatKRW } from '@/shared/lib/money'

const props = defineProps({
  pace: {
    type: Object,
    required: true, // { expectedAmount, differenceAmount, paceStatus }
  },
  progressRate: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false, // 목표 일시정지 중일 때 CTA 버튼만 비활성화(흐리게 + 클릭 차단)
  },
  currentAmount: {
    type: Number,
    default: 0, // 헤드라인/현재 페이스 표시용 (goal.currentAmount)
  },
  dailyAvailableMoney: {
    type: Object,
    default: null, // { todayAvailableMoney, todayExpense, remainingAvailableMoney }
  },
  monthlyAvailableMoney: {
    type: Object,
    default: null, // { availableMoney }
  },
})
defineEmits(['cta-click', 'pause', 'open-today', 'open-month'])

const theme = computed(() => PACE_THEME[props.pace.paceStatus] ?? PACE_THEME.ON_TRACK)

const paceStatusLabel = computed(() => {
  if (props.pace.paceStatus === 'BEHIND') return '뒤처지고 있어요'
  if (props.pace.paceStatus === 'ON_TRACK') return '와 같아요'
  return '앞서고 있어요'
})

const RING_RADIUS = 52
const ringCircumference = 2 * Math.PI * RING_RADIUS
const ringOffset = computed(() => ringCircumference * (1 - props.progressRate / 100))

function formatManwon(amount) {
  return Math.round(amount / 10000).toLocaleString()
}
</script>
