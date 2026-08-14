<template>
  <section
    class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,35,70,0.04)] sm:p-7 md:p-8"
  >
    <div
      class="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,460px)] lg:items-center"
    >
      <!-- 좌측: 뱃지/일시정지 + 메인 목표 금액/현황 + 페이스 3개 인라인 -->
      <div class="flex flex-col justify-between">
        <div>
          <!-- 상단 뱃지 + 목표 일시정지 버튼 -->
          <div class="flex items-center justify-between gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
            >
              <span class="size-1.5 rounded-full bg-primary" />
              진행 중인 목표
            </span>

            <button
              type="button"
              class="flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#0a192f]"
              :class="disabled ? 'pointer-events-none opacity-45' : ''"
              @click="$emit('pause')"
            >
              <img src="@/assets/icons/goal-pause.svg" alt="" class="size-2.5 opacity-60" />
              목표 일시정지
            </button>
          </div>

          <!-- 메인 목표 제목 -->
          <h1
            class="mt-3.5 text-2xl font-black leading-[1.35] text-[#0a192f] sm:text-3xl lg:text-[34px]"
          >
            {{ formatManwon(goalAmount) }}만원 목표까지<br />
            <span class="text-primary tabular-nums">{{ formatManwon(animatedCurrentAmount) }}만원</span> 모았어요
          </h1>

          <!-- 달성률 및 도착 예정일 (검정색 복원 & 좌측 시작점 일치) -->
          <div class="mt-3 flex items-center gap-2 text-xs font-bold sm:text-sm">
            <span class="text-[#0a192f]">
              {{ progressRate }}% <span class="font-medium text-slate-500">달성</span>
            </span>
            <span class="size-1 rounded-full bg-slate-300" />
            <span class="font-medium text-slate-500">
              예상 도착일 <strong class="font-bold text-slate-700">{{ formattedEndDate }}</strong>
            </span>
          </div>
        </div>

        <!-- 하단: 페이스 정보 3개 박스 (데스크톱 좌측 시작선 x=0 칼정렬) -->
        <div class="mt-5 sm:mt-6">
          <div
            class="grid grid-cols-3 items-center divide-x divide-slate-200 rounded-2xl border border-slate-100 bg-[#f8fbff] p-2.5 sm:flex sm:divide-x-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-[13px]"
          >
            <!-- 1. 현재 페이스 -->
            <div class="px-1 text-center sm:px-0 sm:pr-6 sm:text-left">
              <span
                class="block text-[10px] font-bold text-slate-500 sm:inline sm:text-xs sm:text-[#0a192f]"
              >
                현재 페이스
              </span>
              <div class="mt-0.5 sm:ml-2 sm:mt-0 sm:inline-block">
                <strong class="text-xs font-black text-primary sm:text-sm md:text-base">
                  {{ formatManwon(currentAmount) }}만원
                </strong>
                <span
                  class="ml-0.5 text-[9px] font-bold text-slate-400 sm:text-xs sm:text-slate-500"
                >
                  /월
                </span>
              </div>
            </div>

            <!-- 2. 목표 페이스 -->
            <div
              class="px-1 text-center sm:border-l sm:border-slate-200 sm:px-6 sm:text-left"
            >
              <span
                class="block text-[10px] font-bold text-slate-500 sm:inline sm:text-xs sm:text-[#0a192f]"
              >
                목표 페이스
              </span>
              <div class="mt-0.5 sm:ml-2 sm:mt-0 sm:inline-block">
                <strong class="text-xs font-black text-[#0a192f] sm:text-sm md:text-base">
                  {{ formatManwon(pace.expectedAmount) }}만원
                </strong>
                <span
                  class="ml-0.5 text-[9px] font-bold text-slate-400 sm:text-xs sm:text-slate-500"
                >
                  /월
                </span>
              </div>
            </div>

            <!-- 3. 차이 금액 -->
            <div
              class="px-1 text-center sm:border-l sm:border-slate-200 sm:px-6 sm:text-left"
            >
              <span
                class="block text-[10px] font-bold text-slate-500 sm:hidden"
              >
                페이스 차이
              </span>
              <div class="mt-0.5 sm:mt-0 sm:inline-block">
                <strong
                  class="text-xs font-black sm:text-sm md:text-base"
                  :style="{ color: theme.badgeText }"
                >
                  {{ pace.paceStatus === 'BEHIND' ? '-' : '+'
                  }}{{ formatManwon(Math.abs(pace.differenceAmount)) }}만원
                </strong>
                <span
                  class="ml-0.5 text-[9px] font-bold text-slate-400 sm:text-xs sm:text-slate-500"
                >
                  /월
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측: 스마트 자동 저축 카드 (슬림형 인셋 패널) -->
      <div
        class="overflow-hidden rounded-2xl border border-slate-100 bg-[#f8fbff] p-3.5 shadow-sm sm:p-4.5"
      >
        <div
          v-if="dailyAvailableMoney || monthlyAvailableMoney"
          class="grid grid-cols-2 gap-2 border-b border-slate-200/60 pb-3"
        >
          <button
            v-if="dailyAvailableMoney"
            type="button"
            class="rounded-xl border border-primary/10 bg-white px-3 py-2 text-left shadow-sm transition hover:border-primary/25 hover:bg-[#eaf2ff] disabled:pointer-events-none disabled:opacity-45"
            :class="!monthlyAvailableMoney ? 'col-span-2' : ''"
            :disabled="disabled"
            @click="$emit('open-today')"
          >
            <span class="block text-[11px] font-bold text-slate-500">오늘 여유자금</span>
            <strong class="mt-0.5 block text-sm font-black text-primary sm:text-base">
              {{ formatWon(dailyAvailableMoney.todayAvailableMoney) }}
            </strong>
          </button>
          <button
            v-if="monthlyAvailableMoney"
            type="button"
            class="rounded-xl border border-primary/10 bg-white px-3 py-2 text-left shadow-sm transition hover:border-primary/25 hover:bg-[#eaf2ff] disabled:pointer-events-none disabled:opacity-45"
            :class="!dailyAvailableMoney ? 'col-span-2' : ''"
            :disabled="disabled"
            @click="$emit('open-month')"
          >
            <span class="block text-[11px] font-bold text-slate-500">이번 달 여유자금</span>
            <strong class="mt-0.5 block text-sm font-black text-primary sm:text-base">
              {{ formatWon(monthlyAvailableMoney.availableMoney) }}
            </strong>
          </button>
        </div>

        <div class="space-y-1 pt-0.5">
          <!-- 1. 알아서 모으기 -->
          <button
            type="button"
            class="group flex w-full items-center gap-3.5 rounded-xl border-b border-slate-200/60 py-2.5 text-left transition hover:bg-white sm:py-3"
            :class="disabled ? 'pointer-events-none opacity-45' : ''"
            @click="$emit('cta-click')"
          >
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm"
            >
              <img src="@/assets/icons/pacemaker-setup-cta.svg" alt="" class="size-4" />
            </span>
            <span class="min-w-0 flex-1">
              <strong class="block text-sm font-bold text-[#0a192f]">알아서 모으기</strong>
              <span class="mt-0.5 block text-xs font-medium text-[#73809c]"
                >이번 달 목표 금액을 자동으로 모아요</span
              >
            </span>
            <span class="text-xl leading-none text-slate-300 transition group-hover:text-primary">›</span>
          </button>

          <!-- 2. 다음 달 자금마련 -->
          <button
            type="button"
            class="flex w-full gap-3.5 rounded-xl pt-2.5 text-left disabled:cursor-not-allowed disabled:opacity-60 sm:pt-3"
            :disabled="isToggling"
            @click="$emit('toggle')"
          >
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
            >
              <img
                src="@/assets/icons/money-box.svg"
                alt=""
                class="size-4 brightness-0 invert"
              />
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-start justify-between gap-3">
                <span>
                  <strong class="block text-sm font-bold text-[#0a192f]">다음 달 자금마련</strong>
                  <span class="mt-0.5 block text-xs font-medium text-[#73809c]">
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
                class="mt-2.5 block rounded-xl bg-[#eaf2ff] px-3.5 py-2 text-xs font-bold text-primary"
              >
                이번달 +{{ formatWon(pacemaker.monthlySecuredAmount) }} 자동 확보
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
import { PACE_THEME } from '@/features/roadmap/constants/pace.constants'
import { useCountUp } from '@/shared/composables/useCountUp'

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

// 메인 금액 부드러운 카운트업 (1초 감속 롤링)
const currentAmountRef = computed(() => props.currentAmount)
const { displayValue: animatedCurrentAmount } = useCountUp(currentAmountRef, { duration: 1000 })

function formatManwon(amount) {
  return Math.round(Number(amount || 0) / 10000).toLocaleString()
}

function formatWon(amount) {
  return `${Number(amount ?? 0).toLocaleString('ko-KR')}원`
}
</script>
