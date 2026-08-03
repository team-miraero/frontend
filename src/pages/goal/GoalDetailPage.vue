<!-- 목표 구체화 페이지 (GOAL-02) -->
<template>
  <HeroBackground class="font-['Noto_Sans_KR',sans-serif]">
    <div
      class="sticky top-0 z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-6 backdrop-blur-md md:px-8 lg:px-[80px]"
    >
      <BrandHeader />
      <button
        type="button"
        class="flex items-center gap-1 py-3 text-sm text-gray-500 transition-colors hover:text-gray-900"
        @click="handleBack"
      >
        <span aria-hidden="true">‹</span>
        <span>이전</span>
      </button>
    </div>

    <div class="relative z-10 mx-auto w-full max-w-[650px] animate-fade-in-up px-4 pb-40 pt-2">
      <ProgressBar :current-step="2" :total-steps="3" />

      <span
        v-if="selectedGoal"
        class="mt-4 inline-flex items-center gap-1 rounded-2xl bg-accent-light px-3 py-1 text-xs font-semibold text-primary"
      >
        {{ selectedGoal.icon }} {{ selectedGoal.title }}
      </span>

      <p class="mt-4 text-xs font-bold text-primary">STEP 2 — 목표 구체화</p>

      <h1 class="mt-4 whitespace-pre-line text-[30px] font-bold leading-tight text-gray-900">
        {{ config.title }}
      </h1>

      <!-- 학자금 대출 상환 전용 UI (미래로.png 와이어프레임 준수) -->
      <template v-if="isStudentLoan">
        <div class="mt-6 space-y-4">
          <!-- 카드 1: 남은 대출 잔액 (원금) -->
          <div class="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <label class="text-sm font-bold text-gray-900">남은 대출 잔액 (원금)</label>
              <span
                class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                마이데이터 자동 연동
              </span>
            </div>
            <div
              class="mt-3 flex items-center rounded-2xl border border-gray-200 bg-white px-4 py-3.5 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            >
              <input
                v-model.number="amount"
                type="number"
                min="0"
                step="100000"
                class="w-full bg-transparent text-xl font-extrabold text-gray-900 outline-none"
              />
              <span class="shrink-0 text-sm font-semibold text-gray-400">원</span>
            </div>
            <div class="mt-2 flex items-center justify-between text-xs">
              <span class="font-semibold text-primary">{{ amountCaption }}</span>
              <span class="text-gray-400">연 1.7% 고정금리 (정부 학자금)</span>
            </div>
          </div>

          <!-- 카드 2: 완납 기간 슬라이더 & 월 납입액 -->
          <PeriodSliderCard
            v-model="months"
            label="완납 기간"
            caption="슬라이더를 조절하면 이자 포함 상환 계획이 자동으로 계산돼요"
            result-label="월 납입액 (이자 포함)"
            :result-value="`${loanResult.monthlyPayment.toLocaleString()}원`"
            result-caption="원리금균등상환 기준 · 연 1.7% 적용"
            :min="config.periodMin"
            :max="config.periodMax"
            :presets="config.periodPresets"
            class="animate-fade-in-up"
            style="animation-delay: 100ms"
          />

          <!-- 카드 3: 이자 포함 상환 계획 카드 -->
          <div
            class="rounded-3xl border border-blue-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm animate-fade-in-up"
            style="animation-delay: 150ms"
          >
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <div class="flex items-center gap-2">
                <span class="text-lg">📊</span>
                <h3 class="text-base font-bold text-gray-900">이자 포함 상환 계획</h3>
              </div>
              <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">
                연 1.7% 고정
              </span>
            </div>

            <!-- 비율 프로그레스 바 -->
            <div class="mt-5">
              <div class="flex items-center justify-between text-xs font-bold text-gray-500 mb-1.5">
                <span>원금</span>
                <span>이자</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden flex">
                <div
                  class="h-full bg-primary transition-all duration-300"
                  :style="{ width: `${loanResult.principalRatio}%` }"
                ></div>
                <div
                  class="h-full bg-orange-400 transition-all duration-300"
                  :style="{ width: `${loanResult.interestRatio}%` }"
                ></div>
              </div>
              <div class="mt-2 flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full bg-primary"></span>
                  <span class="text-gray-600">원금 {{ formatKRWCompact(amount) }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full bg-orange-400"></span>
                  <span class="text-gray-600"
                    >이자 {{ loanResult.totalInterest.toLocaleString() }}원</span
                  >
                </div>
              </div>
            </div>

            <!-- 상세 내역 목록 -->
            <div class="mt-6 space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div class="flex justify-between items-center text-gray-600">
                <span>원금 (남은 대출)</span>
                <span class="font-bold text-gray-900">{{ formatKRWCompact(amount) }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-600">
                <span>이자 총액 (연 1.7% · 원리금균등상환)</span>
                <span class="font-bold text-orange-500"
                  >+ {{ loanResult.totalInterest.toLocaleString() }}원</span
                >
              </div>
            </div>

            <!-- 하단 총 갚아야 할 금액 박스 -->
            <div
              class="mt-5 rounded-2xl bg-blue-50/70 border border-blue-100 p-4 flex items-center justify-between"
            >
              <div>
                <p class="text-xs font-bold text-gray-900">총 갚아야 할 금액</p>
                <p class="text-[11px] text-gray-400 mt-0.5">원금 + 이자 합계</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-extrabold text-primary">
                  약 {{ formatKRWCompact(loanResult.totalPayment) }}
                </p>
                <p class="text-[11px] text-gray-400 mt-0.5">
                  월 {{ loanResult.monthlyPayment.toLocaleString() }}원 × {{ months }}개월
                </p>
              </div>
            </div>
          </div>

          <!-- 카드 4: 추가 상환 여력 -->
          <div
            class="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm animate-fade-in-up"
            style="animation-delay: 200ms"
          >
            <div>
              <h3 class="text-sm font-bold text-gray-900">추가 상환 여력</h3>
              <p class="mt-0.5 text-xs text-gray-400">
                선택 사항 — 매달 더 갚으면 이자도 줄어들어요
              </p>
            </div>
            <div
              class="mt-3 flex items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            >
              <input
                :value="formattedExtraPayment"
                type="text"
                inputmode="numeric"
                placeholder="0"
                class="w-full bg-transparent text-lg font-bold text-gray-900 outline-none"
                @input="handleExtraPaymentInput"
              />
              <span class="shrink-0 text-sm font-semibold text-gray-400">원/월</span>
            </div>
            <div v-if="extraPayment > 0" class="mt-1.5 text-xs font-semibold text-primary">
              = {{ formatKRWReadable(extraPayment) }}
            </div>

            <!-- 입력 시 노출되는 계산 파란색 카드 (추가상환여력.png 디자인 스펙 일치) -->
            <div
              v-if="extraPayment > 0"
              class="mt-4 rounded-2xl bg-[#F0F6FF] border border-blue-100 p-4 animate-fade-in-up"
            >
              <div class="flex items-center gap-1.5 text-xs font-bold text-primary">
                <span class="text-sm">⚡</span>
                <span
                  >완납 {{ extraLoanResult.reducedMonths }}개월 단축! ({{
                    extraLoanResult.newMonths
                  }}개월로 줄어요)</span
                >
              </div>

              <div class="mt-3 space-y-2 border-t border-blue-100/70 pt-3 text-xs">
                <div class="flex justify-between items-center text-gray-600">
                  <span>월 납입액 (추가 포함)</span>
                  <span class="font-bold text-gray-900"
                    >{{ extraLoanResult.newMonthlyPayment.toLocaleString() }}원</span
                  >
                </div>
                <div class="flex justify-between items-center text-gray-600">
                  <span>절약되는 이자</span>
                  <span class="font-bold text-emerald-600"
                    >- {{ extraLoanResult.savedInterest.toLocaleString() }}원</span
                  >
                </div>
                <div class="flex justify-between items-center text-gray-600 pt-1">
                  <span>새 총 상환금액</span>
                  <span class="font-extrabold text-primary text-sm"
                    >약 {{ formatKRWCompact(extraLoanResult.newTotalPayment) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 기존 일반 목표 UI -->
      <template v-else>
        <div class="mt-6 space-y-4">
          <AmountPresetCard
            v-if="config.amountFieldType === 'presetCard'"
            v-model="amount"
            :label="config.amountLabel"
            :presets="config.amountPresets"
            class="animate-fade-in-up"
            style="animation-delay: 100ms"
          />
          <AmountInputCard
            v-else
            v-model="amount"
            :label="config.amountLabel"
            :caption="amountCaption"
            :presets="config.amountPresets"
            class="animate-fade-in-up"
            style="animation-delay: 100ms"
          />

          <PeriodSliderCard
            v-model="months"
            :label="config.periodLabel"
            :caption="config.showTargetDate ? targetDateLabel : ''"
            result-label="월 예상 저축액"
            :result-value="monthlyAmountLabel"
            :result-caption="config.showPeriodFormula ? periodFormulaLabel : ''"
            :min="config.periodMin"
            :max="config.periodMax"
            :presets="config.periodPresets"
            class="animate-fade-in-up"
            style="animation-delay: 175ms"
          />

          <AmountInputCard
            v-model="startAmount"
            label="이미 모아둔 금액"
            description="없으면 0원으로 두세요"
            class="animate-fade-in-up"
            style="animation-delay: 250ms"
          />
        </div>
      </template>

      <p class="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-gray-400">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mt-0.5 h-3.5 w-3.5 shrink-0"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
        <span>
          {{ config.infoText.prefix
          }}<span v-if="config.infoText.highlight" class="font-semibold text-primary">{{
            config.infoText.highlight
          }}</span
          >{{ config.infoText.suffix }}
        </span>
      </p>
    </div>

    <BottomCTA label="실현 가능성 확인" @click="handleNext" />
  </HeroBackground>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BrandHeader from '@/shared/ui/BrandHeader.vue'
import ProgressBar from '@/shared/ui/ProgressBar.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import AmountInputCard from '@/shared/ui/AmountInputCard.vue'
import AmountPresetCard from '@/features/goal/components/AmountPresetCard.vue'
import PeriodSliderCard from '@/shared/ui/PeriodSliderCard.vue'
import { useGoalStore } from '@/features/goal'
import { GOAL_PRESETS, GOAL_PRESET_IDS } from '@/features/goal/constants/goal.constants.js'
import {
  GOAL_DETAIL_CONFIG,
  DEFAULT_GOAL_DETAIL_CONFIG,
} from '@/features/goal/constants/goalDetailConfig.js'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatKRWCompact, formatKRWReadable } from '@/shared/lib/money'
import { calculateStudentLoan, calculateExtraLoanRepayment } from '@/features/goal/lib/loan.js'

const router = useRouter()
const goalStore = useGoalStore()
const { selectedGoalId, goalParams } = storeToRefs(goalStore)

const isStudentLoan = computed(() => selectedGoalId.value === GOAL_PRESET_IDS.STUDENT_LOAN)

const selectedGoal = computed(() => GOAL_PRESETS.find((preset) => preset.id === selectedGoalId.value))
const config = computed(
  () => GOAL_DETAIL_CONFIG[selectedGoalId.value] ?? DEFAULT_GOAL_DETAIL_CONFIG
)

// goalParams에 이전에 입력했던 저장값이 있다면 복원, 없으면 기본값 적용
const amount = ref(goalParams.value?.amount ?? config.value.defaultAmount)
const months = ref(goalParams.value?.months ?? config.value.periodDefault)
const startAmount = ref(goalParams.value?.startAmount ?? 0)
const extraPayment = ref(goalParams.value?.extraPayment ?? 0) // 학자금 대출용 추가 상환 여력

onMounted(() => {
  if (goalParams.value) {
    if (typeof goalParams.value.amount === 'number') amount.value = goalParams.value.amount
    if (typeof goalParams.value.months === 'number') months.value = goalParams.value.months
    if (typeof goalParams.value.startAmount === 'number') startAmount.value = goalParams.value.startAmount
    if (typeof goalParams.value.extraPayment === 'number') extraPayment.value = goalParams.value.extraPayment
  }
})

const formattedExtraPayment = computed(() => {
  if (!extraPayment.value) return ''
  return extraPayment.value.toLocaleString()
})

function handleExtraPaymentInput(e) {
  const rawValue = e.target.value.replace(/[^0-9]/g, '')
  extraPayment.value = rawValue ? parseInt(rawValue, 10) : 0
}

const loanResult = computed(() =>
  calculateStudentLoan({
    amount: amount.value,
    months: months.value,
    annualRate: 0.017,
  })
)

const extraLoanResult = computed(() =>
  calculateExtraLoanRepayment({
    amount: amount.value,
    months: months.value,
    extraPayment: extraPayment.value,
    annualRate: 0.017,
  })
)

const amountCaption = computed(() =>
  amount.value > 0 ? `= ${formatKRWReadable(amount.value)}` : ''
)
const monthlyAmountLabel = computed(() => formatKRWCompact(amount.value / months.value))
const targetDateLabel = computed(() => {
  const target = new Date()
  target.setMonth(target.getMonth() + months.value)
  return `목표 달성 예정일: ${target.getFullYear()}년 ${target.getMonth() + 1}월`
})
const periodFormulaLabel = computed(
  () => `${formatKRWCompact(amount.value)} ÷ ${months.value}개월`
)

function handleBack() {
  router.push({ name: ROUTE_NAMES.GOAL_SELECT })
}

function handleNext() {
  goalStore.goalParams = {
    amount: amount.value,
    months: months.value,
    startAmount: startAmount.value,
    extraPayment: extraPayment.value,
    loanResult: isStudentLoan.value
      ? {
          ...loanResult.value,
          monthlyPayment: extraLoanResult.value.newMonthlyPayment, // 추가 상환액 포함 월 납입액(725,866원)
          originalMonthly: loanResult.value.monthlyPayment,
          savedInterest: extraLoanResult.value.savedInterest,
          reducedMonths: extraLoanResult.value.reducedMonths,
          newMonths: extraLoanResult.value.newMonths,
        }
      : null,
  }
  router.push({ name: ROUTE_NAMES.GOAL_FEASIBILITY })
}
</script>
