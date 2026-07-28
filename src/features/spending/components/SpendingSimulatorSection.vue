<template>
  <section class="w-full" aria-labelledby="spending-simulator-title">
    <!-- 섹션 헤더 -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id="spending-simulator-title" class="text-lg font-bold text-[#0A192F] md:text-xl">
          절감 시뮬레이터
        </h2>

        <p class="mt-1 text-sm text-[#64748B]">슬라이더를 조절해 목표 지출을 설정해보세요.</p>
      </div>

      <div
        class="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0066FF] px-3 py-2 text-xs font-semibold text-white md:px-4"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
        </svg>

        <span aria-live="polite">
          {{ selectedGoal }} 총 {{ formattedTotalShortenedMonths }}개월 단축
        </span>
      </div>
    </div>

    <!-- 모바일 카테고리 선택 -->
    <div class="mt-5 md:hidden">
      <p class="mb-3 text-center text-xs text-[#64748B]">
        카테고리를 선택하고 지출을 조절해보세요.
      </p>

      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="relative flex min-h-[78px] flex-col items-center justify-center rounded-xl border bg-white px-2 py-3 transition-colors"
          :style="getSelectorStyle(category)"
          :aria-pressed="selectedCategoryId === category.id"
          @click="selectCategory(category.id)"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full text-base"
            :style="{
              backgroundColor: category.softColor,
            }"
            aria-hidden="true"
          >
            {{ category.icon }}
          </span>

          <span class="mt-1.5 text-xs font-semibold text-[#0A192F]">
            {{ category.name }}
          </span>

          <span
            class="absolute right-2 top-2 h-2 w-2 rounded-full"
            :style="{
              backgroundColor: getStatusColor(category),
            }"
            aria-hidden="true"
          />
        </button>
      </div>

      <!-- 모바일에서 선택된 카드 하나만 표시 -->
      <div class="mt-4">
        <SpendingCategoryCard
          v-if="selectedCategory"
          :category="selectedCategory"
          :selected-goal="selectedGoal"
          selected
          @update-target="updateCategoryTarget"
        />
      </div>

      <div class="mt-3 flex items-center justify-center gap-3 text-xs text-[#64748B]">
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="selectedCategoryIndex === 0"
          aria-label="이전 카테고리"
          @click="selectPreviousCategory"
        >
          ‹
        </button>

        <span> {{ selectedCategoryIndex + 1 }} / {{ categories.length }} </span>

        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="selectedCategoryIndex === categories.length - 1"
          aria-label="다음 카테고리"
          @click="selectNextCategory"
        >
          ›
        </button>
      </div>
    </div>

    <!-- 태블릿 및 데스크톱 -->
    <div class="mt-5 hidden grid-cols-2 gap-4 md:grid lg:grid-cols-3">
      <SpendingCategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :selected-goal="selectedGoal"
        @update-target="updateCategoryTarget"
      />
    </div>
  </section>
</template>

<script setup>
import SpendingCategoryCard from '@/features/spending/components/SpendingCategoryCard.vue'
import { useSpendingSimulator } from '@/features/spending/composables/useSpendingSimulator'
import { DEFAULT_SELECTED_GOAL } from '@/features/spending/constants/spending.constants'

defineProps({
  selectedGoal: {
    type: String,
    default: DEFAULT_SELECTED_GOAL,
  },
})

const {
  categories,
  selectedCategoryId,
  selectedCategoryIndex,
  selectedCategory,
  formattedTotalShortenedMonths,
  selectCategory,
  selectCategoryByOffset,
  updateCategoryTarget,
} = useSpendingSimulator()

const getSelectorStyle = (category) => {
  const isSelected = selectedCategoryId.value === category.id

  return {
    borderColor: isSelected ? category.accent : '#E2E8F0',
    backgroundColor: isSelected ? category.softColor : '#FFFFFF',
  }
}

const getStatusColor = (category) => {
  const isActive = category.mode === 'maintain' || category.target !== null
  return isActive ? category.accent : '#CBD5E1'
}

const selectPreviousCategory = () => selectCategoryByOffset(-1)

const selectNextCategory = () => selectCategoryByOffset(1)
</script>
