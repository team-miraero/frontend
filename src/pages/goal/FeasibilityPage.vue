<!-- 목표 실현가능성 확인 페이지 (GOAL-03) -->
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

    <div
      v-if="goalParams && feasibility"
      class="relative z-10 mx-auto w-full max-w-[650px] animate-fade-in-up px-4 pb-40 pt-2"
    >
      <ProgressBar :current-step="3" :total-steps="3" />

      <span
        v-if="selectedGoal"
        class="mt-4 inline-flex items-center gap-1 rounded-2xl bg-accent-light px-3 py-1 text-xs font-semibold text-primary"
      >
        {{ selectedGoal.icon }} {{ selectedGoal.title }}
      </span>

      <p class="mt-4 text-xs font-bold text-primary">STEP 3 — 실현가능성 확인</p>

      <h1 class="mt-4 text-[30px] font-bold leading-tight text-gray-900">
        내 여력으로 가능한<br />목표일까요?
      </h1>

      <div class="mt-6">
        <FeasibilityResult
          v-model:selected-alternative="selectedAlternative"
          available-label="월 가능 저축액"
          :available-amount="feasibility.availableMonthly"
          required-label="월 필요 저축액"
          :required-amount="feasibility.requiredMonthly"
          :status="feasibility.status"
          :status-title="statusContent.title"
          :status-message="statusContent.message"
          forecast-label="목표 달성 예측"
          :forecast-message="forecastMessage"
          :monthly-label="formatKRWCompact(feasibility.requiredMonthly)"
          :period-label="formatPeriodLabel(goalParams.months)"
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
      v-else-if="goalParams && isFeasibilityLoading"
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
import BrandHeader from '@/shared/ui/BrandHeader.vue'
import ProgressBar from '@/shared/ui/ProgressBar.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'
import FeasibilityResult from '@/shared/ui/FeasibilityResult.vue'
import { useGoalStore } from '@/features/goal'
import { GOAL_PRESETS } from '@/features/goal/constants/goal.constants.js'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatKRWCompact } from '@/shared/lib/money'

const ALTERNATIVES = [
  { key: 'period', label: '기간 늘리기', sublabel: '+12개월' },
  { key: 'amount', label: '금액 낮추기', sublabel: '-20%' },
]

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
const { selectedGoalId, goalParams, feasibility, isFeasibilityLoading, recalculatedFeasibility } =
  storeToRefs(goalStore)

const selectedGoal = computed(() => GOAL_PRESETS.find((preset) => preset.id === selectedGoalId.value))

const selectedAlternative = ref('')
const isRecalculating = ref(false)

onMounted(async () => {
  if (!goalParams.value) {
    router.replace({ name: ROUTE_NAMES.GOAL_DETAIL })
    return
  }
  await goalStore.fetchFeasibility({
    goalAmount: goalParams.value.amount,
    goalMonths: goalParams.value.months,
    startAmount: goalParams.value.startAmount,
  })
})

const statusContent = computed(() => STATUS_CONTENT[feasibility.value?.status ?? 'danger'])

const forecastMessage = computed(() =>
  feasibility.value?.status === 'success' ? `충분히 달릴 수 있어요🎉` : ''
)

const stats = computed(() => [
  { label: '목표 금액', value: formatKRWCompact(goalParams.value.amount) },
  { label: '목표 기간', value: formatPeriodLabel(goalParams.value.months) },
  { label: '월 저축액', value: formatKRWCompact(feasibility.value.requiredMonthly) },
])

const recalculated = computed(() => {
  if (!selectedAlternative.value || !recalculatedFeasibility.value) return null

  if (selectedAlternative.value === 'period') {
    const adjustedMonths = goalParams.value.months + 12
    return {
      label: '조정 후 월 저축액',
      value: formatKRWCompact(recalculatedFeasibility.value.requiredMonthly),
      sublabel: '조정 기간',
      subvalue: formatPeriodLabel(adjustedMonths),
    }
  }

  const adjustedAmount = Math.round((goalParams.value.amount * 0.8) / 10000) * 10000
  return {
    label: '조정 후 월 저축액',
    value: formatKRWCompact(recalculatedFeasibility.value.requiredMonthly),
    sublabel: '조정 금액',
    subvalue: formatKRWCompact(adjustedAmount),
  }
})

watch(selectedAlternative, async (key) => {
  if (!key) {
    recalculatedFeasibility.value = null
    return
  }

  isRecalculating.value = true
  try {
    if (key === 'period') {
      await goalStore.fetchRecalculatedFeasibility({
        goalAmount: goalParams.value.amount,
        goalMonths: goalParams.value.months + 12,
        startAmount: goalParams.value.startAmount,
      })
      return
    }

    const adjustedAmount = Math.round((goalParams.value.amount * 0.8) / 10000) * 10000
    await goalStore.fetchRecalculatedFeasibility({
      goalAmount: adjustedAmount,
      goalMonths: goalParams.value.months,
      startAmount: goalParams.value.startAmount,
    })
  } finally {
    isRecalculating.value = false
  }
})

const ctaLabel = computed(() =>
  feasibility.value?.status === 'success' || selectedAlternative.value
    ? '계좌 연결하기'
    : '대안을 선택해 주세요'
)
const ctaDisabled = computed(
  () => feasibility.value?.status !== 'success' && !selectedAlternative.value
)

function formatPeriodLabel(months) {
  const years = Math.floor(months / 12)
  const remainMonths = months % 12
  if (years === 0) return `${months}개월`
  if (remainMonths === 0) return `${years}년`
  return `${years}년 ${remainMonths}개월`
}

function handleBack() {
  router.push({ name: ROUTE_NAMES.GOAL_DETAIL })
}

function handleNext() {
  router.push({ name: ROUTE_NAMES.GOAL_ACCOUNT })
}
</script>
