<template>
  <section class="w-full" aria-labelledby="spending-simulator-title">
    <!-- 섹션 헤더 -->
    <div>
      <div class="flex items-start justify-between gap-3">
        <h2
          id="spending-simulator-title"
          class="shrink-0 text-lg font-bold text-[#0A192F] md:text-xl"
        >
          절감 시뮬레이터
        </h2>

        <div
          class="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-[0_2px_8px_rgba(0,102,255,0.28)] sm:gap-2 sm:px-4"
        >
          <svg
            class="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"
            />
          </svg>

          <span class="text-right leading-4 sm:whitespace-nowrap" aria-live="polite">
            {{ selectedGoal }} 총 {{ formattedTotalShortenedMonths }} 단축
          </span>
        </div>
      </div>

      <p class="mt-1 text-sm text-[#64748B]">기준 지출은 최근 3개월 평균 소비예요.</p>
    </div>

    <!-- 모바일 카테고리 선택 -->
    <div class="mt-5 min-[1400px]:hidden">
      <p class="mb-3 text-center text-xs text-[#64748B]">
        카테고리를 선택하고 지출을 조절해보세요.
      </p>

      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="relative flex min-h-[82px] flex-col items-center justify-center rounded-2xl border p-2 transition-all active:scale-[0.98] cursor-pointer select-none"
          :class="
            selectedCategoryId === category.id
              ? 'border-primary/40 bg-[#EAF2FF] shadow-xs'
              : 'border-slate-200/80 bg-white hover:bg-[#F8FAFC]'
          "
          :aria-pressed="selectedCategoryId === category.id"
          @click="selectCategory(category.id)"
        >
          <SpendingCategoryIcon
            :icon="category.icon"
            :category-id="category.id"
            :accent="category.accent"
            size="sm"
            :active="selectedCategoryId === category.id"
          />

          <span class="mt-1.5 text-xs font-bold text-[#0A192F]">
            {{ category.name }}
          </span>

          <span
            v-if="category.target !== null"
            class="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"
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
          id-prefix="mobile-"
          selected
          @update-target="updateCategoryTarget"
        />
      </div>

      <div class="mt-3 flex items-center justify-center gap-3 text-xs text-[#64748B]">
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="selectedCategoryIndex === 0"
          aria-label="이전 카테고리"
          @click="selectPreviousCategory"
        >
          ‹
        </button>

        <span class="font-bold tabular-nums">
          {{ selectedCategoryIndex + 1 }} / {{ categories.length }}
        </span>

        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="selectedCategoryIndex === categories.length - 1"
          aria-label="다음 카테고리"
          @click="selectNextCategory"
        >
          ›
        </button>
      </div>
    </div>

    <!-- 넓은 데스크톱 -->
    <div class="mt-5 hidden grid-cols-3 gap-4 min-[1400px]:grid">
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
import { onMounted, toRef, watch } from 'vue'
import SpendingCategoryCard from '@/features/spending/components/SpendingCategoryCard.vue'
import SpendingCategoryIcon from '@/features/spending/components/SpendingCategoryIcon.vue'
import { useSpendingSimulator } from '@/features/spending/composables/useSpendingSimulator'
import { DEFAULT_SELECTED_GOAL } from '@/features/spending/constants/spending.constants'

const props = defineProps({
  summary: {
    type: Object,
    required: true,
  },
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
  loadCategoryTargets,
  refreshSimulation,
  selectCategory,
  selectCategoryByOffset,
  updateCategoryTarget,
} = useSpendingSimulator(toRef(props, 'summary'))

onMounted(() => {
  loadCategoryTargets()
})

watch(
  () => props.summary?.referenceMonth,
  () => refreshSimulation()
)

const selectPreviousCategory = () => selectCategoryByOffset(-1)

const selectNextCategory = () => selectCategoryByOffset(1)
</script>
