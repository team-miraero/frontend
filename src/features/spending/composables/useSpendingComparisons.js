import { computed, ref } from 'vue'
import {
  DEFAULT_SPENDING_AGE_GROUP_ID,
  PEER_SPENDING_BY_AGE_GROUP,
  PREVIOUS_MONTH_SPENDING_BY_CATEGORY,
  SPENDING_AGE_GROUPS,
  SPENDING_CATEGORIES,
} from '@/features/spending/constants/spending.constants'
import { formatKoreanNumber } from '@/shared/lib/money'

export function useSpendingSummaryComparison(props) {
  const formattedTotalSpending = computed(() => formatKoreanNumber(props.totalSpending))
  const formattedSavingCapacity = computed(() => formatKoreanNumber(props.savingCapacity))
  const formattedRemainingMonths = computed(() => formatKoreanNumber(props.remainingMonths))
  const normalizedGoalProgress = computed(() => Math.min(Math.max(props.goalProgress, 0), 100))
  const previousMonthSpending = computed(() => props.totalSpending - props.monthlyDifference)

  const monthlyDifferenceRate = computed(() => {
    if (previousMonthSpending.value <= 0) {
      return 0
    }

    return Math.round((Math.abs(props.monthlyDifference) / previousMonthSpending.value) * 1000) / 10
  })

  const monthlyDifferenceDirection = computed(() => {
    if (props.monthlyDifference > 0) {
      return 'increase'
    }

    if (props.monthlyDifference < 0) {
      return 'decrease'
    }

    return 'default'
  })

  const monthlyDifferenceHighlightText = computed(() => {
    const absoluteDifference = formatKoreanNumber(Math.abs(props.monthlyDifference))

    if (monthlyDifferenceDirection.value === 'increase') {
      return `${absoluteDifference}만원 증가`
    }

    if (monthlyDifferenceDirection.value === 'decrease') {
      return `${absoluteDifference}만원 감소`
    }

    return '변동 없음'
  })

  const monthlyDifferenceDescription = computed(() => {
    if (monthlyDifferenceDirection.value === 'default') {
      return `전월 대비 ${monthlyDifferenceHighlightText.value}`
    }

    return `전월 대비 ${monthlyDifferenceHighlightText.value} · ${monthlyDifferenceRate.value}%`
  })

  const monthlyDifferenceTone = computed(() => {
    if (monthlyDifferenceDirection.value === 'increase') {
      return 'coral'
    }

    if (monthlyDifferenceDirection.value === 'decrease') {
      return 'positive'
    }

    return 'default'
  })

  return {
    formattedTotalSpending,
    formattedSavingCapacity,
    formattedRemainingMonths,
    normalizedGoalProgress,
    monthlyDifferenceRate,
    monthlyDifferenceDirection,
    monthlyDifferenceHighlightText,
    monthlyDifferenceDescription,
    monthlyDifferenceTone,
  }
}

export function usePeerSpendingComparison(summary) {
  const selectedAgeGroupId = ref(DEFAULT_SPENDING_AGE_GROUP_ID)

  const selectedAgeGroupLabel = computed(
    () =>
      SPENDING_AGE_GROUPS.find((ageGroup) => ageGroup.id === selectedAgeGroupId.value)?.label ?? ''
  )

  const comparisonItems = computed(() =>
    [...SPENDING_CATEGORIES]
      .sort((firstCategory, secondCategory) => secondCategory.current - firstCategory.current)
      .map((category) => {
        const peerAmount = PEER_SPENDING_BY_AGE_GROUP[selectedAgeGroupId.value][category.id]
        const maximumAmount = Math.max(category.current, peerAmount, 1)

        return {
          ...category,
          peerAmount,
          difference: category.current - peerAmount,
          currentWidth: (category.current / maximumAmount) * 100,
          peerWidth: (peerAmount / maximumAmount) * 100,
        }
      })
  )

  const peerTotalSpending = computed(() =>
    Object.values(PEER_SPENDING_BY_AGE_GROUP[selectedAgeGroupId.value]).reduce(
      (totalAmount, amount) => totalAmount + amount,
      0
    )
  )

  const totalDifference = computed(() => summary.value.totalSpending - peerTotalSpending.value)
  const absoluteTotalDifference = computed(() => Math.abs(totalDifference.value))

  const totalDifferenceLabel = computed(() => {
    if (totalDifference.value > 0) {
      return '더 사용하고 있어요'
    }

    if (totalDifference.value < 0) {
      return '덜 사용하고 있어요'
    }

    return '비슷하게 사용하고 있어요'
  })

  const largestDifferenceCategoryNames = computed(() =>
    [...comparisonItems.value]
      .sort(
        (firstCategory, secondCategory) =>
          Math.abs(secondCategory.difference) - Math.abs(firstCategory.difference)
      )
      .slice(0, 2)
      .map((category) => category.name)
      .join('와 ')
  )

  return {
    selectedAgeGroupId,
    selectedAgeGroupLabel,
    comparisonItems,
    totalDifference,
    absoluteTotalDifference,
    totalDifferenceLabel,
    largestDifferenceCategoryNames,
  }
}

export function useMonthlySpendingComparison() {
  const monthlyComparisonItems = computed(() =>
    [...SPENDING_CATEGORIES]
      .sort((firstCategory, secondCategory) => secondCategory.current - firstCategory.current)
      .map((category) => {
        const previousAmount = PREVIOUS_MONTH_SPENDING_BY_CATEGORY[category.id]

        return {
          ...category,
          previousAmount,
          difference: category.current - previousAmount,
        }
      })
  )

  return {
    monthlyComparisonItems,
  }
}
