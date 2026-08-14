<template>
  <section class="h-full" aria-labelledby="spending-peer-title">
    <article class="h-full rounded-2xl border border-[#E2E8F0] bg-white p-5">
      <h2 id="spending-peer-title" class="sr-only">또래 지출과 비교</h2>

      <div
        class="grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)_auto] items-center gap-1.5 sm:gap-2"
        aria-label="또래 지출 비교 조건"
      >
        <div
          class="grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1"
          role="group"
          aria-label="비교 기준"
        >
          <button
            v-for="basis in SPENDING_COMPARISON_BASES"
            :key="basis.id"
            type="button"
            class="whitespace-nowrap rounded-lg px-1 py-2 text-[9px] font-semibold transition-colors sm:px-2 sm:text-xs"
            :class="
              selectedComparisonBasis === basis.id
                ? 'bg-white text-[#0066FF] shadow-sm'
                : 'text-[#64748B]'
            "
            :aria-pressed="selectedComparisonBasis === basis.id"
            @click="selectedComparisonBasis = basis.id"
          >
            {{ basis.label }}
          </button>
        </div>

        <div
          class="grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1"
          role="group"
          aria-label="지출 유형"
        >
          <button
            v-for="type in categoryTypes"
            :key="type.id"
            type="button"
            class="whitespace-nowrap rounded-lg px-1 py-2 text-[9px] font-semibold transition-colors sm:px-2 sm:text-xs"
            :class="
              selectedCategoryType === type.id
                ? 'bg-white text-[#0066FF] shadow-sm'
                : 'text-[#64748B]'
            "
            :aria-pressed="selectedCategoryType === type.id"
            @click="selectedCategoryType = type.id"
          >
            {{ type.label }}
          </button>
        </div>

        <label class="min-w-0 text-xs font-medium text-[#64748B]">
          <span class="sr-only">비교 그룹</span>
          <select
            v-model="selectedPeerGroupId"
            class="w-[76px] rounded-lg border border-[#D6E4FF] bg-[#F8FBFF] px-1.5 py-2 text-[10px] font-semibold text-[#0A192F] outline-none focus:border-[#0066FF] sm:w-auto sm:px-3 sm:text-xs"
          >
            <option v-for="group in peerGroupOptions" :key="group.id" :value="group.id">
              {{ group.label }}
            </option>
          </select>
        </label>
      </div>

      <div
        v-if="comparisonAvailable && comparisonItems.length > 0"
        class="mt-4 rounded-xl bg-[#F4F8FF] px-4 py-3"
      >
        <p class="text-sm font-semibold text-[#0A192F]">
          {{ selectedPeerGroupLabel }} {{ peerComparisonLabel }}보다

          <strong :class="totalDifferenceClass">
            월 {{ formatAmount(absoluteTotalDifference) }}만원
            {{ totalDifferenceLabel }}
          </strong>
        </p>

        <p class="mt-1 text-xs text-[#64748B]">
          가장 차이가 큰 항목은 {{ largestDifferenceCategoryNames }}{{ categoryNamesEnding }}.
        </p>
      </div>

      <ul
        v-if="comparisonAvailable && comparisonItems.length > 0"
        class="mt-2 divide-y divide-[#EEF2F7]"
      >
        <li
          v-for="category in comparisonItems"
          :key="category.id"
          class="grid min-w-0 grid-cols-[28px_36px_minmax(100px,1fr)_52px] items-center gap-1.5 py-4 first:pt-2 last:pb-0 sm:grid-cols-[32px_56px_minmax(140px,1fr)_64px] sm:gap-3"
        >
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs sm:h-8 sm:w-8 sm:text-sm"
            :style="{ backgroundColor: category.softColor }"
            aria-hidden="true"
          >
            {{ category.icon }}
          </span>

          <span class="truncate text-[11px] font-semibold text-[#0A192F] sm:text-xs">
            {{ category.name }}
          </span>

          <div
            class="grid min-w-0 gap-1.5"
            role="img"
            :aria-label="`${category.name}: 나 ${formatAmount(category.current)}만원, ${peerAverageLabel} ${formatAmount(category.peerAmount)}만원`"
          >
            <div
              class="grid grid-cols-[28px_minmax(0,1fr)_42px] items-center gap-1 text-[9px] text-[#64748B] sm:grid-cols-[32px_minmax(0,1fr)_48px] sm:text-[10px]"
            >
              <span>나</span>
              <div class="h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                <div
                  class="h-full rounded-full bg-[#0066FF]"
                  :style="{ width: `${category.currentWidth}%` }"
                />
              </div>
              <strong class="whitespace-nowrap text-right text-[#0A192F]"
                >{{ formatAmount(category.current) }}만원</strong
              >
            </div>

            <div
              class="grid grid-cols-[28px_minmax(0,1fr)_42px] items-center gap-1 text-[9px] text-[#64748B] sm:grid-cols-[32px_minmax(0,1fr)_48px] sm:text-[10px]"
            >
              <span>평균</span>
              <div class="h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
                <div
                  class="h-full rounded-full bg-[#CBD5E1]"
                  :style="{ width: `${category.peerWidth}%` }"
                />
              </div>
              <strong class="whitespace-nowrap text-right text-[#64748B]"
                >{{ formatAmount(category.peerAmount) }}만원</strong
              >
            </div>
          </div>

          <span
            class="whitespace-nowrap text-right text-[10px] font-semibold sm:text-[11px]"
            :class="getDifferenceClass(category.difference)"
          >
            {{ formatDifference(category.difference) }}
          </span>
        </li>
      </ul>

      <p
        v-if="comparisonAvailable && comparisonItems.length === 0"
        class="mt-4 rounded-xl bg-[#F8FAFC] px-4 py-8 text-center text-sm text-[#64748B]"
      >
        비교할 또래 지출 데이터가 없어요.
      </p>

      <p
        v-if="!comparisonAvailable"
        class="mt-4 rounded-xl bg-[#F8FAFC] px-4 py-8 text-center text-sm text-[#64748B]"
      >
        {{ unavailableMessage }}
      </p>
    </article>
  </section>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { usePeerSpendingComparison } from '@/features/spending/composables/useSpendingComparisons'
import {
  SPENDING_CATEGORY_TYPES,
  SPENDING_COMPARISON_BASES,
} from '@/features/spending/constants/spending.constants'
import { formatKoreanNumber } from '@/shared/lib/money'

const props = defineProps({
  summary: {
    type: Object,
    required: true,
  },
})

const formatAmount = formatKoreanNumber
const categoryTypes = [
  { id: SPENDING_CATEGORY_TYPES.FIXED, label: '고정지출' },
  { id: SPENDING_CATEGORY_TYPES.VARIABLE, label: '변동지출' },
]

const {
  selectedComparisonBasis,
  selectedCategoryType,
  selectedPeerGroupId,
  selectedPeerGroupLabel,
  peerGroupOptions,
  comparisonAvailable,
  unavailableMessage,
  comparisonItems,
  totalDifference,
  absoluteTotalDifference,
  totalDifferenceLabel,
  largestDifferenceCategoryNames,
} = usePeerSpendingComparison(toRef(props, 'summary'))

const peerComparisonLabel = computed(() =>
  selectedComparisonBasis.value === 'AGE' ? '또래' : '소득 구간 평균'
)

const peerAverageLabel = computed(() =>
  selectedComparisonBasis.value === 'AGE' ? '또래 평균' : '소득구간 평균'
)

const categoryNamesEnding = computed(() => {
  const lastCharacterCode = largestDifferenceCategoryNames.value.charCodeAt(
    largestDifferenceCategoryNames.value.length - 1
  )
  const hasFinalConsonant =
    lastCharacterCode >= 0xac00 &&
    lastCharacterCode <= 0xd7a3 &&
    (lastCharacterCode - 0xac00) % 28 !== 0

  return hasFinalConsonant ? '이에요' : '예요'
})

const totalDifferenceClass = computed(() => {
  if (totalDifference.value > 0) {
    return 'text-[#FF5A67]'
  }

  if (totalDifference.value < 0) {
    return 'text-[#10B981]'
  }

  return 'text-[#0066FF]'
})

const getDifferenceClass = (difference) => {
  if (difference > 0) {
    return 'text-[#FF5A67]'
  }

  if (difference < 0) {
    return 'text-[#10B981]'
  }

  return 'text-[#64748B]'
}

const formatDifference = (difference) => {
  if (difference === 0) {
    return '비슷해요'
  }

  return `${difference > 0 ? '+' : '-'}${formatAmount(Math.abs(difference))}만원`
}
</script>
