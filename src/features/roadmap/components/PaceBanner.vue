<template>
  <section
    class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,35,70,0.03)] sm:p-7 md:p-8"
  >
    <div
      class="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,450px)] lg:items-stretch"
    >
      <!-- 좌측: 뱃지/일시정지 + 메인 목표 금액/현황 + 페이스 3개 인셋 카드 -->
      <div class="flex h-full flex-col justify-between">
        <div>
          <!-- 상단 뱃지 + 목표 일시정지/재개 버튼 -->
          <div class="flex items-center justify-between gap-2 min-w-0">
            <!-- 진행 중 뱃지 -->
            <span
              v-if="!disabled"
              class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
            >
              <span class="size-1.5 shrink-0 rounded-full bg-primary" />
              <span>진행 중</span>
            </span>
            <!-- 일시정지 뱃지 -->
            <span
              v-else
              class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500"
            >
              <span class="size-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>일시정지</span>
            </span>

            <!-- 진행 중일 때: 목표 일시정지 버튼 (보조 버튼, shrink-0으로 찌그러짐 방지) -->
            <button
              v-if="!disabled"
              type="button"
              class="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#0a192f] active:scale-95 cursor-pointer select-none"
              @click="$emit('pause')"
            >
              <img src="@/assets/icons/goal-pause.svg" alt="" class="size-2.5 opacity-60" />
              <span class="whitespace-nowrap">목표 일시정지</span>
            </button>
            <!-- 일시정지일 때: 목표 재개하기 버튼 (Primary 강조 버튼, shrink-0) -->
            <button
              v-else
              type="button"
              class="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(0,102,255,0.28)] transition hover:bg-primary/90 active:scale-95 cursor-pointer select-none"
              @click="$emit('resume')"
            >
              <svg class="size-2.5 fill-current" viewBox="0 0 24 24">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
              <span class="whitespace-nowrap">목표 재개하기</span>
            </button>
          </div>

          <!-- 메인 목표 제목 (모바일 단어 단위 줄바꿈 break-keep) -->
          <h1
            class="mt-3.5 text-2xl font-black leading-[1.35] text-[#0a192f] sm:text-3xl lg:text-[34px] break-keep"
          >
            {{ formatManwon(goalAmount) }}만원 목표까지<br />
            <span class="text-primary tabular-nums"
              >{{ formatManwon(animatedCurrentAmount) }}만원</span
            >
            모았어요
          </h1>

          <!-- 달성률 및 도착 예정일 (일시정지 시 안내 캡션 연동) -->
          <div class="mt-3 flex items-center gap-2 text-xs sm:text-sm">
            <span class="text-[#0a192f] font-bold">
              <span class="tabular-nums">{{ progressRate }}%</span>
              <span class="font-normal text-slate-500 ml-0.5">달성</span>
            </span>
            <span class="size-1 rounded-full bg-slate-300" />
            <span v-if="!disabled" class="font-normal text-slate-500">
              예상 도착일 <strong class="font-semibold text-slate-700">{{ formattedEndDate }}</strong>
            </span>
            <span v-else class="font-normal text-slate-400">
              자동이체 해제됨 · 저금통 적립 일시정지
            </span>
          </div>
        </div>

        <!-- 하단: 페이스 정보 인셋 카드 (슬레이트 톤앤매너) -->
        <div class="mt-5 sm:mt-6">
          <div class="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 sm:p-3.5 shadow-2xs">
            <div class="grid grid-cols-3 divide-x divide-slate-200/80 items-center">
              <!-- 1. 현재 페이스 -->
              <div class="px-2 text-center sm:text-left sm:pl-3 sm:pr-2">
                <span class="block text-[11px] font-medium text-slate-500">현재 페이스</span>
                <div class="mt-0.5 flex items-baseline justify-center sm:justify-start gap-0.5">
                  <strong
                    class="text-xs font-bold tabular-nums text-[#0a192f] sm:text-sm md:text-base"
                  >
                    {{ formatManwon(currentAmount) }}만원
                  </strong>
                  <span class="text-[10px] font-normal text-slate-400 sm:text-xs">/월</span>
                </div>
              </div>

              <!-- 2. 목표 페이스 -->
              <div class="px-2 text-center sm:text-left sm:pl-4 sm:pr-2">
                <span class="block text-[11px] font-medium text-slate-500">목표 페이스</span>
                <div class="mt-0.5 flex items-baseline justify-center sm:justify-start gap-0.5">
                  <strong
                    class="text-xs font-bold tabular-nums text-slate-700 sm:text-sm md:text-base"
                  >
                    {{ formatManwon(pace.expectedAmount) }}만원
                  </strong>
                  <span class="text-[10px] font-normal text-slate-400 sm:text-xs">/월</span>
                </div>
              </div>

              <!-- 3. 차이 금액 -->
              <div class="px-2 text-center sm:text-left sm:pl-4 sm:pr-2">
                <span class="block text-[11px] font-medium text-slate-500">페이스 차이</span>
                <div class="mt-0.5 flex items-baseline justify-center sm:justify-start gap-0.5">
                  <strong
                    class="text-xs font-bold tabular-nums sm:text-sm md:text-base"
                    :style="{ color: theme.badgeText }"
                  >
                    {{ pace.paceStatus === 'BEHIND' ? '-' : '+'
                    }}{{ formatManwon(Math.abs(pace.differenceAmount)) }}만원
                  </strong>
                  <span class="text-[10px] font-normal text-slate-400 sm:text-xs">/월</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측: 스마트 자동 저축 카드 (슬림형 슬레이트 인셋 패널) -->
      <div
        class="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 sm:p-4 shadow-2xs"
      >
        <div
          v-if="dailyAvailableMoney || monthlyAvailableMoney"
          class="grid grid-cols-2 gap-2 border-b border-slate-200/60 pb-2.5"
        >
          <button
            v-if="dailyAvailableMoney"
            type="button"
            class="group rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-left shadow-2xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 cursor-pointer select-none"
            :class="!monthlyAvailableMoney ? 'col-span-2' : ''"
            :disabled="disabled"
            @click="$emit('open-today')"
          >
            <span
              class="block text-[11px] font-medium text-slate-500 group-hover:text-primary transition-colors"
              >오늘 여유자금</span
            >
            <strong class="mt-0.5 block text-sm font-bold tabular-nums text-primary sm:text-base">
              {{ formatWon(dailyAvailableMoney.todayAvailableMoney) }}
            </strong>
          </button>
          <button
            v-if="monthlyAvailableMoney"
            type="button"
            class="group rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-left shadow-2xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 cursor-pointer select-none"
            :class="!dailyAvailableMoney ? 'col-span-2' : ''"
            :disabled="disabled"
            @click="$emit('open-month')"
          >
            <span
              class="block text-[11px] font-medium text-slate-500 group-hover:text-primary transition-colors"
              >이번 달 여유자금</span
            >
            <strong class="mt-0.5 block text-sm font-bold tabular-nums text-primary sm:text-base">
              {{ formatWon(monthlyAvailableMoney.availableMoney) }}
            </strong>
          </button>
        </div>

        <div class="flex flex-1 flex-col justify-between gap-2.5 pt-2.5">
          <!-- 1. 알아서 모으기 -->
          <button
            type="button"
            class="group flex w-full items-center gap-3.5 rounded-xl text-left transition active:scale-[0.98] cursor-pointer select-none"
            :class="[
              disabled ? 'pointer-events-none opacity-45' : '',
              isAssistMode ? 'px-3 py-2.5 shadow-sm' : 'py-1 sm:py-1.5',
            ]"
            :style="
              isAssistMode
                ? {
                    backgroundImage: theme.ctaGradient,
                    boxShadow: `0 4px 16px ${theme.ctaShadow}`,
                  }
                : undefined
            "
            :disabled="disabled"
            @click="$emit('cta-click')"
          >
            <span
              class="flex size-8 sm:size-8.5 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
              :class="isAssistMode ? 'bg-white/20 text-white' : 'bg-primary text-white shadow-sm'"
            >
              <!-- 1. 알아서 모으기 선명한 번개 SVG -->
              <svg
                class="size-4 sm:size-4.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            <span class="min-w-0 flex-1">
              <strong
                class="block text-xs sm:text-sm font-bold transition-colors duration-200"
                :class="isAssistMode ? 'text-white' : 'text-[#0a192f] group-hover:text-primary'"
              >
                {{ primaryCtaTitle }}
              </strong>
              <span
                class="mt-0.5 block text-[11px] sm:text-xs font-medium"
                :class="isAssistMode ? 'text-white/80' : 'text-[#73809c]'"
              >
                {{ primaryCtaDescription }}
              </span>
            </span>
            <span
              class="text-xl leading-none transition-all duration-200 group-hover:translate-x-1"
              :class="
                isAssistMode
                  ? 'text-white/80 group-hover:text-white'
                  : 'text-slate-300 group-hover:text-primary'
              "
              >›</span
            >
          </button>

          <!-- 깔끔한 직선 구분선 -->
          <div class="h-px w-full bg-slate-200/60" />

          <!-- 2. 다음 달 자금마련 (스위치 위치 고정 및 인라인 상태 전환) -->
          <button
            type="button"
            class="group flex w-full items-center gap-3 rounded-xl py-1 text-left disabled:cursor-not-allowed disabled:opacity-60 transition active:scale-[0.98] select-none cursor-pointer"
            :class="disabled ? 'pointer-events-none opacity-45' : ''"
            :disabled="isToggling || disabled"
            @click="$emit('toggle')"
          >
            <span
              class="flex size-8 sm:size-8.5 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
            >
              <!-- 2. 다음 달 자금마련 선명한 캘린더 SVG -->
              <svg
                class="size-4 sm:size-4.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-center justify-between gap-3">
                <span class="min-w-0">
                  <strong class="block text-xs sm:text-sm font-bold text-[#0a192f] truncate"
                    >다음 달 자금마련</strong
                  >
                  <span
                    class="mt-0.5 block text-[11px] sm:text-xs truncate transition-colors"
                    :class="
                      pacemaker?.enabled ? 'font-bold text-primary' : 'font-medium text-[#73809c]'
                    "
                  >
                    {{
                      pacemaker?.enabled
                        ? `이번달 +${formatWon(pacemaker.monthlySecuredAmount)} 자동 확보`
                        : '하루 여유자금으로 자동 저축'
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
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import pacemakerSetupCtaIcon from '@/assets/icons/pacemaker-setup-cta.svg'
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'
import { useCountUp } from '@/shared/composables/useCountUp'

const props = defineProps({
  pace: { type: Object, required: true },
  progressRate: { type: Number, required: true },
  goalName: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  currentAmount: { type: Number, default: 0 },
  goalAmount: { type: Number, default: 0 },
  endDate: { type: String, default: '' },
  dailyAvailableMoney: { type: Object, default: null },
  monthlyAvailableMoney: { type: Object, default: null },
  pacemaker: { type: Object, default: null },
  isToggling: { type: Boolean, default: false },
})

defineEmits(['cta-click', 'pause', 'resume', 'open-today', 'open-month', 'toggle'])

const theme = computed(() => PACE_THEME[props.pace.paceStatus] ?? PACE_THEME.ON_TRACK)
const isAssistMode = computed(() => props.pace.paceStatus === 'BEHIND')
const isPacemakerRegistered = computed(() => props.pacemaker?.registered === true)
const primaryCtaTitle = computed(() => {
  if (isAssistMode.value) return '페이스메이커가 도와줄게요'
  return isPacemakerRegistered.value ? '알아서 모으기' : '페이스메이커가 알아서 모아줄게요'
})
const primaryCtaDescription = computed(() => {
  if (isAssistMode.value) return theme.value.ctaAction
  return isPacemakerRegistered.value ? '이번 달 목표 금액을 자동으로 모아요' : '다음달 자금마련 →'
})
const formattedEndDate = computed(() => props.endDate?.replace('-', '.') ?? '')

// 메인 금액 부드러운 카운트업 (1초 감속 롤링)
const currentAmountRef = computed(() => props.currentAmount)
const { displayValue: animatedCurrentAmount } = useCountUp(currentAmountRef, {
  duration: 1000,
  initialValue: 0,
})

function formatManwon(amount) {
  return Math.round(Number(amount || 0) / 10000).toLocaleString()
}

function formatWon(amount) {
  return `${Number(amount ?? 0).toLocaleString('ko-KR')}원`
}
</script>
