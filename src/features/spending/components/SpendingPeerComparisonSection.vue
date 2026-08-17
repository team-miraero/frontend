<template>
  <section class="h-full" aria-labelledby="spending-peer-title">
    <article class="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
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
            class="whitespace-nowrap rounded-lg px-1 py-2 text-[9px] font-semibold transition-all duration-150 sm:px-2 sm:text-xs"
            :class="
              selectedComparisonBasis === basis.id
                ? 'bg-white text-[#0066FF] shadow-sm font-bold'
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
            class="whitespace-nowrap rounded-lg px-1 py-2 text-[9px] font-semibold transition-all duration-150 sm:px-2 sm:text-xs"
            :class="
              selectedCategoryType === type.id
                ? 'bg-white text-[#0066FF] shadow-sm font-bold'
                : 'text-[#64748B]'
            "
            :aria-pressed="selectedCategoryType === type.id"
            @click="selectedCategoryType = type.id"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="relative min-w-0">
          <label for="spending-peer-group-select" class="sr-only">비교 그룹</label>
          <select
            id="spending-peer-group-select"
            v-model="selectedPeerGroupId"
            class="w-[88px] appearance-none cursor-pointer rounded-xl border border-[#D6E4FF] bg-[#F8FBFF] py-2 pl-2 pr-6 text-[10px] font-bold text-[#0A192F] shadow-2xs outline-none transition-all duration-150 hover:border-[#0066FF]/60 hover:bg-[#F0F6FF] focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 sm:w-[124px] sm:py-2 sm:pl-3 sm:pr-7 sm:text-xs"
          >
            <option v-for="group in peerGroupOptions" :key="group.id" :value="group.id">
              {{ group.label }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[#0066FF] sm:right-2">
            <svg
              class="h-3 w-3 sm:h-3.5 sm:w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        v-if="comparisonItems.length > 0"
        class="mt-4 flex min-h-[64px] flex-col justify-center rounded-xl border border-primary/10 bg-[#F4F8FF] px-3.5 py-2.5 sm:px-4 sm:py-3"
      >
        <p class="text-xs font-bold tracking-tight text-[#0A192F] break-keep sm:text-sm">
          {{ selectedPeerGroupLabel }} {{ peerComparisonLabel }}보다

          <strong :class="totalDifferenceClass">
            월 {{ formatAmount(absoluteTotalDifference) }}만원
            {{ totalDifferenceLabel }}
          </strong>
        </p>

        <p class="mt-1 text-[11px] text-[#64748B] break-keep sm:text-xs">
          가장 차이가 큰 항목은 {{ largestDifferenceCategoryNames }}{{ categoryNamesEnding }}.
        </p>
      </div>

      <ul v-if="comparisonItems.length > 0" class="mt-2 divide-y divide-slate-100">
        <li
          v-for="category in comparisonItems"
          :key="category.id"
          class="grid min-w-0 grid-cols-[28px_36px_minmax(100px,1fr)_52px] items-center gap-1.5 py-3.5 first:pt-2 last:pb-0 sm:grid-cols-[32px_56px_minmax(140px,1fr)_64px] sm:gap-3"
        >
          <SpendingCategoryIcon
            :icon="category.icon"
            :category-id="category.id"
            :accent="category.accent"
            size="sm"
          />

          <span class="truncate text-xs font-bold text-[#0A192F]">
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
              <span class="font-bold">나</span>
              <div class="h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                <div
                  class="h-full rounded-full bg-[#0066FF] transition-all duration-300 ease-out"
                  :style="{ width: `${category.currentWidth}%` }"
                />
              </div>
              <strong class="whitespace-nowrap text-right font-black tabular-nums text-[#0A192F]"
                >{{ formatAmount(category.current) }}만원</strong
              >
            </div>

            <div
              class="grid grid-cols-[28px_minmax(0,1fr)_42px] items-center gap-1 text-[9px] text-[#64748B] sm:grid-cols-[32px_minmax(0,1fr)_48px] sm:text-[10px]"
            >
              <span>평균</span>
              <div class="h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                <div
                  class="h-full rounded-full bg-[#94A3B8] transition-all duration-300 ease-out"
                  :style="{ width: `${category.peerWidth}%` }"
                />
              </div>
              <span class="whitespace-nowrap text-right tabular-nums text-[#64748B]"
                >{{ formatAmount(category.peerAmount) }}만원</span
              >
            </div>
          </div>

          <span
            class="whitespace-nowrap text-right text-xs font-black tabular-nums"
            :class="getDifferenceClass(category.difference)"
          >
            {{ formatDifference(category.difference) }}
          </span>
        </li>
      </ul>

      <p
        v-if="comparisonItems.length === 0"
        class="mt-4 rounded-xl bg-[#F8FAFC] px-4 py-8 text-center text-sm text-[#64748B]"
      >
        비교할 또래 지출 데이터가 없어요.
      </p>
    </article>
  </section>
</template>

<script setup>
import { computed, toRef } from 'vue'
import SpendingCategoryIcon from '@/features/spending/components/SpendingCategoryIcon.vue'
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
  comparisonItems,
  totalDifference,
  absoluteTotalDifference,
  totalDifferenceLabel,
  largestDifferenceCategoryNames,
} = usePeerSpendingComparison(toRef(props, 'summary'))

const peerComparisonLabel = computed(() =>
  selectedComparisonBasis.value === 'AGE' ? '또래' : '소득평균'
)

const peerAverageLabel = computed(() =>
  selectedComparisonBasis.value === 'AGE' ? '또래 평균' : '소득평균'
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
