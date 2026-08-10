import { computed, ref } from 'vue'
import {
  DEFAULT_SPENDING_AGE_GROUP_ID,
  DEFAULT_SPENDING_INCOME_GROUP_ID,
  PEER_SPENDING_BY_BASIS,
  PREVIOUS_MONTH_SPENDING_BY_CATEGORY,
  SPENDING_AGE_GROUPS,
  SPENDING_CATEGORY_TYPES,
  SPENDING_CATEGORIES,
  SPENDING_INCOME_GROUPS,
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
  const selectedComparisonBasis = ref('AGE')
  const selectedCategoryType = ref(SPENDING_CATEGORY_TYPES.VARIABLE)
  const selectedAgeGroupId = ref(DEFAULT_SPENDING_AGE_GROUP_ID)
  const selectedIncomeGroupId = ref(DEFAULT_SPENDING_INCOME_GROUP_ID)

  const peerGroupOptions = computed(() =>
    selectedComparisonBasis.value === 'AGE' ? SPENDING_AGE_GROUPS : SPENDING_INCOME_GROUPS
  )

  const selectedPeerGroupId = computed({
    get: () =>
      selectedComparisonBasis.value === 'AGE'
        ? selectedAgeGroupId.value
        : selectedIncomeGroupId.value,
    set: (value) => {
      if (selectedComparisonBasis.value === 'AGE') selectedAgeGroupId.value = value
      else selectedIncomeGroupId.value = value
    },
  })

  const selectedPeerGroupLabel = computed(
    () => peerGroupOptions.value.find((group) => group.id === selectedPeerGroupId.value)?.label ?? ''
  )

  const peerSpending = computed(
    () => PEER_SPENDING_BY_BASIS[selectedComparisonBasis.value][selectedPeerGroupId.value]
  )

  const categorySpending = computed(() => summary.value.categorySpending ?? {})

  const comparisonItems = computed(() =>
    SPENDING_CATEGORIES.filter((category) => category.type === selectedCategoryType.value)
      .map((category) => ({
        ...category,
        current: categorySpending.value[category.id] ?? category.current,
      }))
      .sort((firstCategory, secondCategory) => secondCategory.current - firstCategory.current)
      .map((category) => {
        const peerAmount = peerSpending.value[category.id] ?? 0
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

  const currentTotalSpending = computed(() =>
    comparisonItems.value.reduce((total, category) => total + category.current, 0)
  )
  const peerTotalSpending = computed(() =>
    comparisonItems.value.reduce((total, category) => total + category.peerAmount, 0)
  )

  const totalDifference = computed(() => currentTotalSpending.value - peerTotalSpending.value)
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
    joinKoreanNames(
      [...comparisonItems.value]
      .sort(
        (firstCategory, secondCategory) =>
          Math.abs(secondCategory.difference) - Math.abs(firstCategory.difference)
      )
      .slice(0, 2)
      .map((category) => category.name)
    )
  )

  return {
    selectedComparisonBasis,
    selectedCategoryType,
    selectedPeerGroupId,
    selectedPeerGroupLabel,
    peerGroupOptions,
    comparisonItems,
    totalDifference,
    absoluteTotalDifference,
    totalDifferenceLabel,
    largestDifferenceCategoryNames,
  }
}

function joinKoreanNames(names) {
  if (names.length < 2) return names[0] ?? ''

  const firstName = names[0]
  const lastCharacterCode = firstName.charCodeAt(firstName.length - 1)
  const hasFinalConsonant =
    lastCharacterCode >= 0xac00 &&
    lastCharacterCode <= 0xd7a3 &&
    (lastCharacterCode - 0xac00) % 28 !== 0

  return `${firstName}${hasFinalConsonant ? '과' : '와'} ${names[1]}`
}

export function useMonthlySpendingComparison(summary) {
  const categorySpending = computed(() => summary.value.categorySpending ?? {})
  const monthlyComparisonItems = computed(() =>
    SPENDING_CATEGORIES.filter(
      (category) => category.type === SPENDING_CATEGORY_TYPES.VARIABLE
    )
      .map((category) => {
        const current = categorySpending.value[category.id] ?? category.current
        const previousAmount = PREVIOUS_MONTH_SPENDING_BY_CATEGORY[category.id] ?? current

        return {
          ...category,
          current,
          previousAmount,
          difference: current - previousAmount,
        }
      })
  )

  return {
    monthlyComparisonItems,
  }
}
