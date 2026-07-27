<template>
  <section class="w-full" aria-labelledby="spending-summary-title">
    <h2 id="spending-summary-title" class="sr-only">이번 달 지출 요약</h2>

    <!-- 모바일 통합 요약 카드 -->
    <article class="rounded-2xl border border-[#D6E4FF] bg-white p-5 md:hidden">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-[#64748B]">이번 달 총지출</p>

          <div class="mt-2 flex items-end gap-1">
            <strong class="text-[32px] font-bold leading-none tracking-[-0.04em] text-[#0A192F]">
              {{ formattedTotalSpending }}
            </strong>

            <span class="pb-0.5 text-sm font-medium text-[#64748B]"> 만원 </span>
          </div>
        </div>

        <span class="rounded-full bg-[#EAF2FF] px-3 py-1.5 text-xs font-semibold text-[#0066FF]">
          {{ selectedGoal }}
        </span>
      </div>

      <div
        class="mt-5 grid grid-cols-2 divide-x divide-[#E2E8F0] rounded-xl bg-[#F4F8FF] px-3 py-4"
      >
        <div class="px-2">
          <p class="text-xs text-[#64748B]">이번 달 저축 여력</p>

          <p class="mt-1.5">
            <strong class="text-xl font-bold text-[#10B981]">
              {{ formattedSavingCapacity }}
            </strong>

            <span class="ml-0.5 text-xs font-medium text-[#64748B]"> 만원 </span>
          </p>
        </div>

        <div class="px-4">
          <p class="text-xs text-[#64748B]">목표 달성까지</p>

          <p class="mt-1.5">
            <strong class="text-xl font-bold text-[#0066FF]">
              {{ formattedRemainingMonths }}
            </strong>

            <span class="ml-0.5 text-xs font-medium text-[#64748B]"> 개월 </span>
          </p>
        </div>
      </div>

      <div class="mt-4">
        <div class="flex items-center justify-between gap-4">
          <p class="text-xs text-[#64748B]">
            전월 대비

            <strong class="ml-1 font-semibold" :class="monthlyDifferenceColorClass">
              {{ monthlyDifferenceText }}
            </strong>
          </p>

          <span class="text-xs font-medium text-[#64748B]">
            잔여 {{ formattedRemainingMonths }}개월
          </span>
        </div>

        <div
          class="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAF2FF]"
          role="progressbar"
          :aria-valuenow="normalizedGoalProgress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="목표 달성 진행률"
        >
          <div
            class="h-full rounded-full bg-[#0066FF] transition-[width] duration-300"
            :style="{ width: `${normalizedGoalProgress}%` }"
          />
        </div>
      </div>
    </article>

    <!-- 태블릿 및 데스크톱 KPI 카드 -->
    <div class="hidden grid-cols-3 gap-5 md:grid">
      <SpendingSummaryCard
        title="이번 달 총지출"
        :value="totalSpending"
        unit="만원"
        :description="desktopMonthlyDifferenceDescription"
        :description-highlight="monthlyDifferenceText"
        :tone="monthlyDifferenceTone"
      />

      <SpendingSummaryCard
        title="이번 달 저축 여력"
        :value="savingCapacity"
        unit="만원"
        description="목표를 위해 저축 가능한 금액이에요"
        tone="positive"
      />

      <SpendingSummaryCard
        title="목표 달성 현황"
        :value="`잔여 ${formattedRemainingMonths}`"
        unit="개월"
        :progress="goalProgress"
        progress-label="목표 달성 진행률"
        :progress-text="`${normalizedGoalProgress}%`"
        tone="default"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import SpendingSummaryCard from './SpendingSummaryCard.vue'

const props = defineProps({
  totalSpending: {
    type: Number,
    default: 90,
  },
  savingCapacity: {
    type: Number,
    default: 35,
  },
  remainingMonths: {
    type: Number,
    default: 53,
  },
  monthlyDifference: {
    type: Number,
    default: 4,
  },
  goalProgress: {
    type: Number,
    default: 62,
  },
  selectedGoal: {
    type: String,
    default: '유럽 여행자금',
  },
})

const formatNumber = (value) => new Intl.NumberFormat('ko-KR').format(value)

const formattedTotalSpending = computed(() => formatNumber(props.totalSpending))

const formattedSavingCapacity = computed(() => formatNumber(props.savingCapacity))

const formattedRemainingMonths = computed(() => formatNumber(props.remainingMonths))

const normalizedGoalProgress = computed(() => Math.min(Math.max(props.goalProgress, 0), 100))

const monthlyDifferenceText = computed(() => {
  const absoluteDifference = formatNumber(Math.abs(props.monthlyDifference))

  if (props.monthlyDifference > 0) {
    return `+${absoluteDifference}만원`
  }

  if (props.monthlyDifference < 0) {
    return `-${absoluteDifference}만원`
  }

  return '변동 없음'
})

const desktopMonthlyDifferenceDescription = computed(
  () => `전월 대비 ${monthlyDifferenceText.value}`
)

const monthlyDifferenceTone = computed(() => {
  if (props.monthlyDifference > 0) {
    return 'warning'
  }

  if (props.monthlyDifference < 0) {
    return 'positive'
  }

  return 'default'
})

const monthlyDifferenceColorClass = computed(() => {
  if (props.monthlyDifference > 0) {
    return 'text-[#F59E0B]'
  }

  if (props.monthlyDifference < 0) {
    return 'text-[#10B981]'
  }

  return 'text-[#64748B]'
})
</script>
