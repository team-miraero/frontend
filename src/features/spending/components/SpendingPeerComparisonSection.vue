<template>
  <section aria-labelledby="spending-peer-title">
    <article class="rounded-2xl border border-[#E2E8F0] bg-white p-5">
      <div class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3">
        <h2
          id="spending-peer-title"
          class="col-start-1 row-start-1 whitespace-nowrap text-base font-bold text-[#0A192F]"
        >
          또래 지출과 비교
        </h2>

        <p class="col-start-1 row-start-2 mt-1 text-xs text-[#94A3B8]">
          월소득과 무관하게 연령대 기준으로 비교해요.
        </p>

        <label
          class="col-start-2 row-span-2 row-start-1 flex items-center gap-2 text-xs font-medium text-[#64748B]"
        >
          <span class="sr-only sm:not-sr-only">비교 연령대</span>

          <select
            v-model="selectedAgeGroupId"
            class="rounded-lg border border-[#D6E4FF] bg-[#F8FBFF] px-2 py-2 font-semibold text-[#0A192F] outline-none focus:border-[#0066FF] sm:px-3"
          >
            <option v-for="ageGroup in SPENDING_AGE_GROUPS" :key="ageGroup.id" :value="ageGroup.id">
              {{ ageGroup.label }}
            </option>
          </select>
        </label>
      </div>

      <div class="mt-5 rounded-xl bg-[#F4F8FF] px-4 py-3">
        <p class="text-sm font-semibold text-[#0A192F]">
          {{ selectedAgeGroupLabel }} 또래보다

          <strong :class="totalDifferenceClass">
            월 {{ formatAmount(absoluteTotalDifference) }}만원
            {{ totalDifferenceLabel }}
          </strong>
        </p>

        <p class="mt-1 text-xs text-[#64748B]">
          가장 차이가 큰 항목은 {{ largestDifferenceCategoryNames }}이에요.
        </p>
      </div>

      <div class="mt-5 flex items-center justify-end gap-4 text-[11px] text-[#64748B]">
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full bg-[#0066FF]" />
          나
        </span>

        <span class="inline-flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full bg-[#CBD5E1]" />
          또래 평균
        </span>
      </div>

      <ul class="mt-2 divide-y divide-[#EEF2F7]">
        <li
          v-for="category in comparisonItems"
          :key="category.id"
          class="grid min-w-0 grid-cols-[28px_28px_minmax(32px,1fr)_48px_44px] items-center gap-1.5 py-4 first:pt-2 last:pb-0 sm:grid-cols-[32px_48px_minmax(80px,1fr)_56px_56px] sm:gap-3"
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
            class="grid min-w-0 gap-1"
            role="img"
            :aria-label="`${category.name}: 나 ${formatAmount(category.current)}만원, 또래 평균 ${formatAmount(category.peerAmount)}만원`"
          >
            <div class="h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
              <div
                class="h-full rounded-full bg-[#0066FF]"
                :style="{ width: `${category.currentWidth}%` }"
              />
            </div>

            <div class="h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
              <div
                class="h-full rounded-full bg-[#CBD5E1]"
                :style="{ width: `${category.peerWidth}%` }"
              />
            </div>
          </div>

          <strong class="whitespace-nowrap text-right text-[11px] text-[#0A192F] sm:text-xs">
            {{ formatAmount(category.current) }}만원
          </strong>

          <span
            class="whitespace-nowrap text-right text-[10px] font-semibold sm:text-[11px]"
            :class="getDifferenceClass(category.difference)"
          >
            {{ formatDifference(category.difference) }}
          </span>
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { usePeerSpendingComparison } from '@/features/spending/composables/useSpendingComparisons'
import { SPENDING_AGE_GROUPS } from '@/features/spending/constants/spending.constants'
import { formatKoreanNumber } from '@/shared/lib/money'

const props = defineProps({
  summary: {
    type: Object,
    required: true,
  },
})

const formatAmount = formatKoreanNumber

const {
  selectedAgeGroupId,
  selectedAgeGroupLabel,
  comparisonItems,
  totalDifference,
  absoluteTotalDifference,
  totalDifferenceLabel,
  largestDifferenceCategoryNames,
} = usePeerSpendingComparison(toRef(props, 'summary'))

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
