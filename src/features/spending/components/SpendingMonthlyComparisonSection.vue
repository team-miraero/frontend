<template>
  <section
    class="min-w-0 w-full min-[1400px]:contents"
    aria-labelledby="spending-category-monthly-title"
  >
    <article
      class="min-w-0 w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5 min-[1400px]:order-3 min-[1400px]:flex min-[1400px]:flex-col"
    >
      <div>
        <h2 id="spending-category-monthly-title" class="text-base font-bold text-[#0A192F]">
          카테고리별 지난달 대비 변화
        </h2>

        <p class="mt-1 text-xs text-[#64748B]">각 항목의 지난달과 이번 달 지출을 비교해보세요.</p>
      </div>

      <ul
        class="mt-5 grid gap-2.5 min-[1400px]:min-h-0 min-[1400px]:flex-1 min-[1400px]:grid-rows-6"
      >
        <li
          v-for="category in monthlyComparisonItems"
          :key="category.id"
          class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 rounded-xl border border-[#E2E8F0] px-3 py-3 sm:grid-cols-[minmax(64px,0.8fr)_minmax(112px,1.4fr)_auto]"
        >
          <div class="flex min-w-0 items-center gap-2">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
              :style="{ backgroundColor: category.softColor }"
              aria-hidden="true"
            >
              {{ category.icon }}
            </span>

            <span class="truncate text-xs font-semibold text-[#0A192F]">
              {{ category.name }}
            </span>
          </div>

          <div
            class="col-span-2 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 text-center sm:col-span-1 sm:col-start-2 sm:row-start-1"
          >
            <div>
              <p class="text-[10px] text-[#94A3B8]">지난달</p>
              <strong class="mt-0.5 block text-xs text-[#0A192F]">
                {{ formatAmount(category.previousAmount) }}만원
              </strong>
            </div>

            <span class="text-xs text-[#94A3B8]" aria-hidden="true">→</span>

            <div>
              <p class="text-[10px] text-[#94A3B8]">이번 달</p>
              <strong class="mt-0.5 block text-xs text-[#0A192F]">
                {{ formatAmount(category.current) }}만원
              </strong>
            </div>
          </div>

          <span
            class="col-start-2 row-start-1 whitespace-nowrap text-[11px] font-semibold sm:col-start-3"
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
import { useMonthlySpendingComparison } from '@/features/spending/composables/useSpendingComparisons'
import { formatKoreanNumber } from '@/shared/lib/money'

const formatAmount = formatKoreanNumber
const { monthlyComparisonItems } = useMonthlySpendingComparison()

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

  return `${difference > 0 ? '↑' : '↓'} ${formatAmount(Math.abs(difference))}만원`
}
</script>
