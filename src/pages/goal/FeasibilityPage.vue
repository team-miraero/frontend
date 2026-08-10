<!-- 목표 실현가능성 확인 페이지 (GOAL-03) -->
<template>
  <HeroBackground class="font-['Noto_Sans_KR',sans-serif]">
    <StepHeader @back="handleBack" />

    <div
      v-if="goalParams && feasibility"
      class="relative z-10 mx-auto w-full max-w-[650px] animate-fade-in-up px-4 pb-40 pt-2"
    >
      <ProgressBar :current-step="3" :total-steps="3" />

      <span
        v-if="selectedGoal"
        class="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-accent-light px-3 py-1 text-xs font-semibold text-primary"
      >
        <svg
          v-if="selectedGoalPresetId === 'INDEPENDENCE'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <svg
          v-else-if="selectedGoalPresetId === 'EMERGENCY'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg
          v-else-if="selectedGoalPresetId === 'MARRIAGE'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <svg
          v-else-if="selectedGoalPresetId === 'STUDENT_LOAN'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v6.5" />
        </svg>
        <span>{{ selectedGoal.title }}</span>
      </span>

      <p class="mt-4 text-xs font-bold text-primary">STEP 3 — 실현가능성 확인</p>

      <h1 class="mt-4 text-[30px] font-bold leading-tight text-gray-900">
        내 여력으로 가능한<br />목표일까요?
      </h1>

      <div class="mt-6">
        <FeasibilityResult
          v-model:selected-alternative="selectedAlternative"
          available-label="월 가능 저축액"
          :available-amount="displayAvailableMonthly"
          required-label="월 필요 저축액"
          :required-amount="displayRequiredMonthly"
          :status="displayStatus"
          :status-title="statusContent.title"
          :status-message="statusContent.message"
          forecast-label="목표 달성 예측"
          :forecast-message="forecastMessage"
          :monthly-label="formatKRWCompact(displayRequiredMonthly)"
          :period-label="formatPeriodLabel(displayMonths)"
          :goal-label="selectedGoal?.title"
          :stats="stats"
          :adjust-title="statusContent.adjustTitle"
          :adjust-message="statusContent.adjustMessage"
          :alternatives="ALTERNATIVES"
          :recalculated="recalculated"
          :is-recalculating="isRecalculating"
        />
      </div>
    </div>

    <LoadingSpinner
      v-else-if="isFeasibilityLoading"
      message="실현가능성을 계산하고 있어요"
    />

    <BottomCTA
      v-if="goalParams && feasibility"
      :label="ctaLabel"
      :disabled="ctaDisabled"
      @click="handleNext"
    />
  </HeroBackground>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
import ProgressBar from '@/shared/ui/ProgressBar.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'
import FeasibilityResult from '@/shared/ui/FeasibilityResult.vue'
import { useGoalStore } from '@/features/goal'
import { GOAL_PRESETS, GOAL_PRESET_IDS } from '@/features/goal/constants/goal.constants.js'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatKRWCompact } from '@/shared/lib/money'
import { calculateStudentLoan } from '@/features/goal/lib/loan.js'

const ALTERNATIVES = computed(() => {
  if (isStudentLoan.value) {
    return [
      { key: 'period', label: '기간 늘리기', sublabel: '+12개월' },
      { key: 'extra_capacity', label: '추가 상환 여력 늘리기', sublabel: '월 +10만원 절약' },
    ]
  }
  return [
    { key: 'period', label: '기간 늘리기', sublabel: '+12개월' },
    { key: 'amount', label: '목표 금액 낮추기', sublabel: '-20%' },
  ]
})

const STATUS_CONTENT = {
  success: {
    title: '현실적이에요',
    message: '충분히 가능한 목표예요',
  },
  warning: {
    title: '살짝 빠듯해요',
    message: '더 안정적인 계획을 추천해요',
    adjustTitle: '조금만 조정하면 충분해요',
    adjustMessage:
      '현재 월 저축 여력에 가까운 금액이에요. 아래 대안을 선택하면 더 여유 있게 달성할 수 있어요.',
  },
  danger: {
    title: '지금은 무리예요',
    message: '현재 여력에 맞는 계획을 추천해요',
    adjustTitle: '현재 여력보다 부담이 커요',
    adjustMessage: '아래 대안 중 하나를 선택하면 다시 계산해 드려요.',
  },
}

const router = useRouter()
const goalStore = useGoalStore()
const { selectedGoalPresetId, goalParams, feasibility, isFeasibilityLoading, recalculatedFeasibility } =
  storeToRefs(goalStore)

const selectedGoal = computed(() => GOAL_PRESETS.find((preset) => preset.id === selectedGoalPresetId.value))
const isStudentLoan = computed(() => selectedGoalPresetId.value === GOAL_PRESET_IDS.STUDENT_LOAN)

const selectedAlternative = ref('')
const isRecalculating = ref(false)

// 안전한 현재 파라미터 (새로고침 등 기본값 제공)
const currentAmount = computed(() => Number(goalParams.value?.amount) || (isStudentLoan.value ? 12400000 : 10000000))
const currentMonths = computed(() => Number(goalParams.value?.months) || 24)
const currentStartAmount = computed(() => Number(goalParams.value?.startAmount) || 0)

// 학자금 대출인 경우 원리금 균등상환 월 상환액, 일반인 경우 API requiredMonthly 사용
const effectiveRequiredMonthly = computed(() => {
  if (isStudentLoan.value) {
    if (goalParams.value?.loanResult?.monthlyPayment) {
      return goalParams.value.loanResult.monthlyPayment
    }
    const loanCalc = calculateStudentLoan({ amount: currentAmount.value, months: currentMonths.value })
    return loanCalc.monthlyPayment
  }
  return Number(feasibility.value?.requiredMonthly) || 0
})

const effectiveStatus = computed(() => {
  const req = effectiveRequiredMonthly.value
  const avail = Number(feasibility.value?.availableMonthly) || 620000
  if (avail <= 0) return 'danger'
  const ratio = req / avail
  if (ratio <= 1) return 'success'
  if (ratio <= 1.2) return 'warning'
  return 'danger'
})

onMounted(async () => {
  if (!goalParams.value) {
    goalParams.value = {
      amount: currentAmount.value,
      months: currentMonths.value,
      startAmount: currentStartAmount.value,
    }
  }

  try {
    await goalStore.fetchFeasibility({
      goalAmount: currentAmount.value,
      goalMonths: currentMonths.value,
      startAmount: currentStartAmount.value,
      isStudentLoan: isStudentLoan.value,
    })
  } catch (err) {
    console.error('Failed to fetch feasibility:', err)
  }
})

/**
 * 선택한 대안을 반영한 목표 파라미터를 계산한다.
 * @param {string} key
 */
function getAdjustedGoalParams(key) {
  const baseAmount = currentAmount.value
  const baseMonths = currentMonths.value
  const baseStart = currentStartAmount.value

  if (key === 'period') {
    return { amount: baseAmount, months: baseMonths + 12, startAmount: baseStart }
  }
  if (key === 'extra_capacity') {
    return { amount: baseAmount, months: baseMonths, startAmount: baseStart }
  }
  const adjustedAmount = Math.round((baseAmount * 0.8) / 10000) * 10000
  return { amount: adjustedAmount, months: baseMonths, startAmount: baseStart }
}

const recalculatedReqMonthly = computed(() => {
  if (!selectedAlternative.value) return 0
  const adjusted = getAdjustedGoalParams(selectedAlternative.value)
  if (isStudentLoan.value) {
    const loanCalc = calculateStudentLoan({ amount: adjusted.amount, months: adjusted.months })
    return loanCalc.monthlyPayment
  }
  return Number(recalculatedFeasibility.value?.requiredMonthly) || 0
})

// 대안 선택 시 동적으로 반영되는 월 필요 저축/상환액
const displayRequiredMonthly = computed(() => {
  if (selectedAlternative.value && recalculatedReqMonthly.value > 0) {
    return recalculatedReqMonthly.value
  }
  return effectiveRequiredMonthly.value
})

// 대안 선택 시 동적으로 반영되는 월 가능 여력
const displayAvailableMonthly = computed(() => {
  const baseAvail = Number(feasibility.value?.availableMonthly) || 620000
  if (selectedAlternative.value === 'extra_capacity') {
    return baseAvail + 100000 // 월 +10만원 추가 상환 여력 반영
  }
  return baseAvail
})

// 대안 반영 시 실시간 상태 (success / warning / danger)
const displayStatus = computed(() => {
  const req = displayRequiredMonthly.value
  const avail = displayAvailableMonthly.value
  if (avail <= 0) return 'danger'
  const ratio = req / avail
  if (ratio <= 1) return 'success'
  if (ratio <= 1.2) return 'warning'
  return 'danger'
})

const displayMonths = computed(() => {
  const adjusted = getAdjustedGoalParams(selectedAlternative.value)
  return adjusted.months
})

const recalculatedPossible = computed(() => {
  return displayStatus.value === 'success' || displayStatus.value === 'warning'
})

const statusContent = computed(() => STATUS_CONTENT[displayStatus.value ?? 'danger'])

const forecastMessage = computed(() =>
  displayStatus.value === 'success' ? `충분히 달릴 수 있어요🎉` : ''
)

const stats = computed(() => {
  const adjusted = getAdjustedGoalParams(selectedAlternative.value)
  return [
    { label: isStudentLoan.value ? '대출 원금' : '목표 금액', value: formatKRWCompact(adjusted.amount) },
    { label: '목표 기간', value: formatPeriodLabel(adjusted.months) },
    { label: isStudentLoan.value ? '월 상환액' : '월 저축액', value: formatKRWCompact(displayRequiredMonthly.value) },
  ]
})

const recalculated = computed(() => {
  if (!selectedAlternative.value) return null

  const adjusted = getAdjustedGoalParams(selectedAlternative.value)
  const reqMonthly = recalculatedReqMonthly.value

  if (selectedAlternative.value === 'period') {
    return {
      label: isStudentLoan.value ? '조정 후 월 상환액' : '조정 후 월 저축액',
      value: formatKRWCompact(reqMonthly),
      sublabel: '조정 기간',
      subvalue: formatPeriodLabel(adjusted.months),
    }
  }

  if (selectedAlternative.value === 'extra_capacity') {
    return {
      label: '조정 후 월 상환 여력',
      value: formatKRWCompact(displayAvailableMonthly.value),
      sublabel: '월 추가 상환 여력',
      subvalue: '+10만원 절약',
    }
  }

  return {
    label: isStudentLoan.value ? '조정 후 월 상환액' : '조정 후 월 저축액',
    value: formatKRWCompact(reqMonthly),
    sublabel: '조정 원금',
    subvalue: formatKRWCompact(adjusted.amount),
  }
})

watch(selectedAlternative, async (key) => {
  if (!key) {
    recalculatedFeasibility.value = null
    return
  }

  isRecalculating.value = true
  try {
    const adjusted = getAdjustedGoalParams(key)
    await goalStore.fetchRecalculatedFeasibility({
      goalAmount: adjusted.amount,
      goalMonths: adjusted.months,
      startAmount: adjusted.startAmount,
      isStudentLoan: isStudentLoan.value,
    })
  } finally {
    isRecalculating.value = false
  }
})

const ctaLabel = computed(() => {
  if (selectedAlternative.value) {
    if (!recalculatedPossible.value) {
      return '계획 다시 수정하기 (목표 입력)'
    }
    return '조정된 계획으로 시작하기'
  }
  return effectiveStatus.value === 'success'
    ? '계좌 연결하기'
    : '대안을 선택해 주세요'
})

const ctaDisabled = computed(
  () =>
    isRecalculating.value ||
    (effectiveStatus.value !== 'success' && !selectedAlternative.value)
)

function formatPeriodLabel(months) {
  const m = Number(months) || 0
  const years = Math.floor(m / 12)
  const remainMonths = m % 12
  if (years === 0) return `${m}개월`
  if (remainMonths === 0) return `${years}년`
  return `${years}년 ${remainMonths}개월`
}

function handleBack() {
  router.push({ name: ROUTE_NAMES.GOAL_DETAIL })
}

function handleNext() {
  if (selectedAlternative.value) {
    const adjusted = getAdjustedGoalParams(selectedAlternative.value)
    goalParams.value = {
      ...goalParams.value,
      amount: adjusted.amount,
      months: adjusted.months,
      startAmount: adjusted.startAmount,
    }

    // 대안 적용 후에도 여전히 가능 여력을 넘는 무리한 조건이면 목표 상세 페이지로 이동해 직접 재조정하도록 안내
    if (!recalculatedPossible.value) {
      router.push({ name: ROUTE_NAMES.GOAL_DETAIL })
      return
    }
  }
  goalStore.applyRecalculatedFeasibility()
  if (goalParams.value?.loanResult) {
    goalParams.value.loanResult.monthlyPayment = feasibility.value?.requiredMonthly
  }
  router.push({ name: ROUTE_NAMES.GOAL_ACCOUNT })
}
</script>
