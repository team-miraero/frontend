<template>
  <section class="w-full" aria-labelledby="spending-simulator-title">
    <!-- 섹션 헤더 -->
    <div>
      <div class="flex items-baseline justify-between gap-2">
        <h2
          id="spending-simulator-title"
          class="shrink-0 text-lg font-bold text-[#0A192F] md:text-xl"
        >
          절감 시뮬레이터
        </h2>

        <p class="min-w-0 text-right text-xs text-[#64748B] md:text-sm">
          기준 지출은 최근 3개월 평균 소비예요.
        </p>
      </div>

      <p class="mt-1 text-center text-xs text-[#64748B]">
        카테고리를 선택하고 지출을 조절해보세요.
      </p>
    </div>

    <!-- 모바일 카테고리 선택 -->
    <div class="mt-4 min-[1400px]:hidden">

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
          @update-target="handleUpdateCategoryTarget"
        />
      </div>

    </div>

    <!-- 넓은 데스크톱 -->
    <div class="mt-4 hidden grid-cols-3 gap-4 min-[1400px]:grid">
      <SpendingCategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :selected-goal="selectedGoal"
        @update-target="handleUpdateCategoryTarget"
      />
    </div>

    <!-- 절감 조정 탭에 머무는 동안 화면 하단에 유지되는 전체 절감 결과 -->
    <div class="mt-3 h-10 min-[1400px]:h-auto">
      <div
        class="fixed inset-x-4 bottom-[calc(74px+env(safe-area-inset-bottom))] z-20 mx-auto max-w-[1376px] rounded-xl border px-3 py-2.5 text-center text-sm shadow-[0_4px_18px_rgba(15,35,70,0.08)] transition-all sm:inset-x-6 md:inset-x-8 md:bottom-4 min-[1400px]:static min-[1400px]:max-w-none min-[1400px]:shadow-none"
        :class="
          hasAdjustedInCurrentView
            ? 'border-primary/15 bg-[#F4F8FF] font-bold text-primary'
            : 'border-slate-100 bg-[#F8FBFF] text-xs text-[#94A3B8]'
        "
        role="status"
        aria-live="polite"
      >
        <template v-if="hasAdjustedInCurrentView">
          {{ selectedGoal }} 총 {{ formattedTotalShortenedMonths }} 단축
        </template>
        <template v-else> 슬라이더를 조절하면 전체 단축 기간이 표시돼요. </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, toRef, watch } from 'vue'
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
  selectedCategory,
  formattedTotalShortenedMonths,
  loadCategoryTargets,
  refreshSimulation,
  selectCategory,
  updateCategoryTarget,
} = useSpendingSimulator(toRef(props, 'summary'))

const hasAdjustedInCurrentView = ref(false)

function handleUpdateCategoryTarget(payload) {
  hasAdjustedInCurrentView.value = true
  updateCategoryTarget(payload)
}

onMounted(() => {
  loadCategoryTargets()
})

watch(
  () => props.summary?.referenceMonth,
  () => refreshSimulation()
)

</script>
