<template>
  <section
    class="min-w-0 w-full min-[1400px]:contents"
    aria-labelledby="spending-category-monthly-title"
  >
    <article
      class="min-w-0 w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5 min-[1400px]:order-3 min-[1400px]:flex min-[1400px]:flex-col"
    >
      <div class="category-header">
        <h2 id="spending-category-monthly-title" class="text-base font-bold text-[#0A192F]">
          카테고리별 지난달 대비 변화
        </h2>

        <p class="text-xs text-[#64748B]">각 항목의 지난달과 이번 달 지출을 비교해보세요.</p>
      </div>

      <ul class="category-list min-[1400px]:min-h-0 min-[1400px]:flex-1">
        <li
          v-for="category in monthlyComparisonItems"
          :key="category.id"
          class="category-item grid min-w-0 grid-cols-[minmax(56px,0.8fr)_minmax(88px,1.3fr)_auto] items-center gap-x-1.5 rounded-xl border border-[#E2E8F0] px-3 py-3"
        >
          <div class="flex min-w-0 items-center gap-1.5 sm:gap-2">
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
          </div>

          <div
            class="category-comparison grid min-w-0 -translate-x-2 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 text-center"
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
            class="change-amount whitespace-nowrap text-[11px] font-semibold"
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

<style scoped>
.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-header {
  margin-bottom: 20px;
}

.category-header h2 {
  margin-bottom: 4px;
}

.change-amount {
  padding-right: 4px;
  text-align: right;
}

@media (min-width: 768px) {
  .category-item {
    display: grid;
    grid-template-columns:
      minmax(120px, 1fr) minmax(72px, 110px) minmax(24px, 40px) minmax(72px, 110px)
      minmax(56px, 80px);
    align-items: center;
    column-gap: 20px;
    min-height: 68px;
    padding: 12px 16px;
    border: 1px solid #dbe3ef;
    border-radius: 12px;
  }

  .category-comparison {
    display: contents;
    transform: none;
  }
}
</style>
