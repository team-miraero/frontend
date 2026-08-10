<template>
  <article
    class="flex flex-col rounded-2xl border bg-white p-4 transition-colors md:p-5"
    :style="cardStyle"
  >
    <!-- 카드 헤더 -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
          :style="{ backgroundColor: category.softColor }"
          aria-hidden="true"
        >
          {{ category.icon }}
        </span>

        <div class="flex min-w-0 flex-wrap items-center gap-2">
          <h3 class="text-sm font-semibold text-[#0A192F]">
            {{ category.name }}
          </h3>

          <span
            v-if="category.target !== null"
            class="flex items-center gap-1 text-xs font-medium text-[#64748B]"
          >
            <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: category.accent }" />

            드래그 중 · 실시간 반영 중
          </span>
        </div>
      </div>

      <span
        class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
        :style="{
          color: category.target === null ? '#94A3B8' : category.accent,
          backgroundColor: category.target === null ? '#F1F5F9' : category.softColor,
        }"
      >
        {{ savingBadge }}
      </span>
    </div>

    <div class="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div class="rounded-xl bg-[#F4F8FF] px-3 py-3 text-center">
        <p class="text-xs text-[#94A3B8]">기준 지출</p>

        <p class="mt-1 text-base font-bold text-[#0A192F]">
          {{ formatAmount(category.recentThreeMonthAverage) }}만원
        </p>
      </div>

      <svg
        class="h-5 w-5 text-[#B6CCF5]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-4-4 4 4-4 4" />
      </svg>

      <div class="rounded-xl border px-3 py-3 text-center" :style="targetBoxStyle">
        <p class="text-xs text-[#94A3B8]">목표 지출</p>

        <p
          class="mt-1 text-base font-bold"
          :style="{
            color: category.target === null ? '#94A3B8' : category.accent,
          }"
        >
          {{
            category.target === null ? '슬라이더로 조절' : `${formatAmount(category.target)}만원`
          }}
        </p>
      </div>
    </div>

    <!-- 슬라이더 -->
    <div class="relative mt-5">
      <label :for="rangeInputId" class="sr-only"> {{ category.name }} 목표 지출 조절 </label>

      <input
        :id="rangeInputId"
        class="spending-range block w-full cursor-pointer"
        type="range"
        :min="category.min"
        :max="category.recentThreeMonthAverage"
        :step="category.step ?? 1"
        :value="sliderValue"
        :style="rangeStyle"
        @input="handleRangeInput"
      />

      <div class="mt-2 flex items-center justify-between text-xs text-[#94A3B8]">
        <span>{{ formatAmount(category.min) }}</span>
        <span>{{ formatAmount(category.recentThreeMonthAverage) }}만원</span>
      </div>
    </div>

    <!-- 조절 전 안내 -->
    <div
      v-if="category.target === null"
      class="mt-4 flex items-center gap-2 rounded-xl bg-[#F1F5F9] px-3 py-3 text-xs text-[#64748B]"
    >
      <span
        class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#94A3B8] text-[10px]"
        aria-hidden="true"
      >
        i
      </span>

      슬라이더를 움직여 목표 지출을 정해보세요.
    </div>

    <!-- 조절 후 결과 -->
    <div
      v-else
      class="mt-4 flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-xs"
      :style="{ backgroundColor: category.softColor }"
    >
      <span class="font-semibold" :style="{ color: category.accent }">
        {{ selectedGoal }} {{ formattedShortenedMonths }} 단축
      </span>

      <span class="shrink-0 text-[#64748B]"> 월 {{ formatAmount(savingAmount) }}만원 추가 </span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import {
  calculateSavingAmount,
  calculateShortenedMonths,
  formatShortenedPeriod,
} from '@/features/spending/composables/useSpendingSimulator'
import { formatKoreanNumber } from '@/shared/lib/money'

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  selectedGoal: {
    type: String,
    required: true,
  },
  // 모바일용/데스크톱용 카드가 동시에 DOM에 렌더되므로, 같은 카테고리라도 id가 겹치지 않도록 구분한다.
  idPrefix: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-target'])

const formatAmount = formatKoreanNumber

const rangeInputId = computed(() => `spending-range-${props.idPrefix}${props.category.id}`)

const sliderValue = computed(() => props.category.target ?? props.category.recentThreeMonthAverage)
const hasTarget = computed(() => props.category.target !== null)

const savingAmount = computed(() => calculateSavingAmount(props.category))

const shortenedMonths = computed(() => calculateShortenedMonths(savingAmount.value))

const formattedShortenedMonths = computed(() => formatShortenedPeriod(shortenedMonths.value))

const savingBadge = computed(() => {
  if (!hasTarget.value) {
    return '-'
  }

  return `-${formatAmount(savingAmount.value)}만원`
})

const rangeProgress = computed(() => {
  const range = props.category.recentThreeMonthAverage - props.category.min

  if (range <= 0) {
    return 100
  }

  return ((sliderValue.value - props.category.min) / range) * 100
})

const cardStyle = computed(() => ({
  '--category-accent': props.category.accent,
  borderColor: props.selected || hasTarget.value ? props.category.accent : '#E2E8F0',
}))

const targetBoxStyle = computed(() => {
  if (!hasTarget.value) {
    return {
      borderColor: 'transparent',
      backgroundColor: '#F1F5F9',
    }
  }

  return {
    borderColor: props.category.borderColor,
    backgroundColor: props.category.softColor,
  }
})

const rangeStyle = computed(() => ({
  '--category-accent': props.category.accent,
  '--range-progress': `${rangeProgress.value}%`,
}))

const handleRangeInput = (event) => {
  emit('update-target', {
    id: props.category.id,
    target: Number(event.target.value),
  })
}
</script>

<style scoped>
.spending-range {
  height: 6px;
  appearance: none;
  border-radius: 9999px;
  outline: none;
  background: linear-gradient(
    to right,
    var(--category-accent) 0%,
    var(--category-accent) var(--range-progress),
    #e2e8f0 var(--range-progress),
    #e2e8f0 100%
  );
}

.spending-range:focus-visible {
  outline: 2px solid var(--category-accent);
  outline-offset: 4px;
}

.spending-range::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  appearance: none;
  border: 2px solid var(--category-accent);
  border-radius: 50%;
  background: #ffffff;
  cursor: grab;
}

.spending-range::-webkit-slider-thumb:active {
  cursor: grabbing;
}

.spending-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  border: 2px solid var(--category-accent);
  border-radius: 50%;
  background: #ffffff;
  cursor: grab;
}
</style>
