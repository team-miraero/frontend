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
  // 내 지출 응답에 없는 카테고리는 상수의 목 금액(category.current)으로 되돌리지 않는다.
  // 비교 탭은 같은 카테고리를 0으로 보여주는데 여기만 지어낸 금액을 쓰면 화면끼리 어긋난다.
  const categories = computed(() =>
    SPENDING_CATEGORIES.filter(
      (category) =>
        category.type === SPENDING_CATEGORY_TYPES.VARIABLE &&
        category.id !== 'transportation' &&
        Object.hasOwn(categorySpending.value, category.id)
    ).map((category) => ({
      ...category,
      current: categorySpending.value[category.id] ?? 0,
      target: categoryTargets.value[category.id] ?? null,
      recentThreeMonthAverage:
        RECENT_THREE_MONTH_AVERAGE_SPENDING_BY_CATEGORY[category.id] ??
        categorySpending.value[category.id] ??
        0,
    }))
  )
  // categories 구성은 API 응답에 따라 달라지므로, 고른 카테고리가 목록에서 빠지면
  // 첫 번째 카테고리로 되돌려 selectedCategory가 undefined가 되지 않게 한다.
  const rawSelectedCategoryId = ref(categories.value[0]?.id ?? null)

  const selectedCategoryId = computed({
    get: () =>
      categories.value.some((category) => category.id === rawSelectedCategoryId.value)
        ? rawSelectedCategoryId.value
        : (categories.value[0]?.id ?? null),
    set: (value) => {
      rawSelectedCategoryId.value = value
    },
  })

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
