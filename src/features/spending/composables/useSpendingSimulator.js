import { computed, ref } from 'vue'
import {
  MONTHS_SHORTENED_PER_SAVING_UNIT,
  RECENT_THREE_MONTH_AVERAGE_SPENDING_BY_CATEGORY,
  SPENDING_CATEGORY_TYPES,
  SPENDING_CATEGORIES,
} from '@/features/spending/constants/spending.constants'

const roundToOneDecimal = (value) => Math.round(value * 10) / 10
const DAYS_PER_MONTH = 30

export function calculateSavingAmount(category) {
  if (category.target === null) {
    return 0
  }

  return Math.max(category.recentThreeMonthAverage - category.target, 0)
}

/**
 * 절감액을 단축 개월 수(반올림 없는 원값)로 환산한다.
 * 카드별 표시값과 총합 표시값이 같은 원값에서 계산돼야 서로 어긋나지 않는다.
 */
export function calculateShortenedMonths(savingAmount) {
  if (savingAmount <= 0) {
    return 0
  }

  return savingAmount * MONTHS_SHORTENED_PER_SAVING_UNIT
}

/**
 * 1개월 미만은 일 단위, 이상은 개월 단위(소수 첫째 자리)로 표시한다.
 * 0.04개월처럼 "개월" 그릇에 담기엔 너무 작은 값을 억지로 부풀리지 않기 위함.
 */
export function formatShortenedPeriod(months) {
  if (months <= 0) {
    return '0일'
  }

  if (months < 1) {
    return `${Math.max(Math.round(months * DAYS_PER_MONTH), 1)}일`
  }

  const rounded = roundToOneDecimal(months)
  return `${Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)}개월`
}

export function useSpendingSimulator(summary) {
  const categoryTargets = ref({})
  const categorySpending = computed(() => summary?.value?.categorySpending ?? {})
  const categories = computed(() =>
    SPENDING_CATEGORIES.filter(
      (category) =>
        category.type === SPENDING_CATEGORY_TYPES.VARIABLE && category.id !== 'transportation'
    ).map((category) => ({
      ...category,
      current: categorySpending.value[category.id] ?? category.current,
      target: categoryTargets.value[category.id] ?? null,
      recentThreeMonthAverage:
        RECENT_THREE_MONTH_AVERAGE_SPENDING_BY_CATEGORY[category.id] ??
        categorySpending.value[category.id] ??
        category.current,
    }))
  )
  // SPENDING_CATEGORIES는 정적 상수라 categories의 카테고리 구성(6개)은 항상 고정된다.
  const selectedCategoryId = ref(categories.value[0]?.id ?? null)

  const selectedCategoryIndex = computed(() =>
    categories.value.findIndex((category) => category.id === selectedCategoryId.value)
  )

  const selectedCategory = computed(() =>
    categories.value.find((category) => category.id === selectedCategoryId.value)
  )

  const totalSavingAmount = computed(() =>
    categories.value.reduce(
      (totalSaving, category) => totalSaving + calculateSavingAmount(category),
      0
    )
  )

  const totalShortenedMonths = computed(() => calculateShortenedMonths(totalSavingAmount.value))

  const formattedTotalShortenedMonths = computed(() =>
    formatShortenedPeriod(totalShortenedMonths.value)
  )

  function selectCategory(categoryId) {
    if (categories.value.some((category) => category.id === categoryId)) {
      selectedCategoryId.value = categoryId
    }
  }

  function selectCategoryByOffset(offset) {
    const nextCategory = categories.value[selectedCategoryIndex.value + offset]

    if (nextCategory) {
      selectedCategoryId.value = nextCategory.id
    }
  }

  function updateCategoryTarget({ id, target }) {
    const category = categories.value.find((item) => item.id === id)

    if (!category) {
      return
    }

    categoryTargets.value[category.id] = target < category.recentThreeMonthAverage ? target : null
  }

  return {
    categories,
    selectedCategoryId,
    selectedCategoryIndex,
    selectedCategory,
    formattedTotalShortenedMonths,
    selectCategory,
    selectCategoryByOffset,
    updateCategoryTarget,
  }
}
