import { computed, ref } from 'vue'
import {
  MONTHS_SHORTENED_PER_SAVING_UNIT,
  RECENT_THREE_MONTH_AVERAGE_SPENDING_BY_CATEGORY,
  SPENDING_CATEGORIES,
} from '@/features/spending/constants/spending.constants'

const roundToOneDecimal = (value) => Math.round(value * 10) / 10

export function calculateSavingAmount(category) {
  if (category.mode !== 'adjustable' || category.target === null) {
    return 0
  }

  return Math.max(category.recentThreeMonthAverage - category.target, 0)
}

export function calculateShortenedMonths(savingAmount) {
  if (savingAmount <= 0) {
    return 0
  }

  return Math.max(roundToOneDecimal(savingAmount * MONTHS_SHORTENED_PER_SAVING_UNIT), 0.1)
}

export function formatShortenedMonths(months) {
  return Number.isInteger(months) ? String(months) : months.toFixed(1)
}

export function useSpendingSimulator() {
  const categories = ref(
    SPENDING_CATEGORIES.map((category) => ({
      ...category,
      recentThreeMonthAverage:
        RECENT_THREE_MONTH_AVERAGE_SPENDING_BY_CATEGORY[category.id] ?? category.current,
    }))
  )
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
    formatShortenedMonths(totalShortenedMonths.value)
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

    if (!category || category.mode !== 'adjustable') {
      return
    }

    category.target = target < category.recentThreeMonthAverage ? target : null
  }

  return {
    categories,
    selectedCategoryId,
    selectedCategoryIndex,
    selectedCategory,
    totalSavingAmount,
    totalShortenedMonths,
    formattedTotalShortenedMonths,
    selectCategory,
    selectCategoryByOffset,
    updateCategoryTarget,
  }
}
