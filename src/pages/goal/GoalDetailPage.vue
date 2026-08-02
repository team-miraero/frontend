<!-- 목표 구체화 페이지 (GOAL-02) -->
<template>
  <HeroBackground class="font-['Noto_Sans_KR',sans-serif]">
    <div
      class="sticky top-0 z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-6 backdrop-blur-md md:px-8 lg:px-[80px]"
    >
      <BrandHeader />
      <button
        type="button"
        class="flex items-center gap-1 py-3 text-sm text-gray-500 transition-colors hover:text-gray-900"
        @click="handleBack"
      >
        <span aria-hidden="true">‹</span>
        <span>이전</span>
      </button>
    </div>

    <div class="relative z-10 mx-auto w-full max-w-[650px] animate-fade-in-up px-4 pb-40 pt-2">
      <ProgressBar :current-step="2" :total-steps="3" />

      <span
        v-if="selectedGoal"
        class="mt-4 inline-flex items-center gap-1 rounded-2xl bg-accent-light px-3 py-1 text-xs font-semibold text-primary"
      >
        {{ selectedGoal.icon }} {{ selectedGoal.title }}
      </span>

      <p class="mt-4 text-xs font-bold text-primary">STEP 2 — 목표 구체화</p>

      <h1 class="mt-4 whitespace-pre-line text-[30px] font-bold leading-tight text-gray-900">
        {{ config.title }}
      </h1>

      <div class="mt-6 space-y-4">
        <AmountPresetCard
          v-if="config.amountFieldType === 'presetCard'"
          v-model="amount"
          :label="config.amountLabel"
          :presets="config.amountPresets"
          class="animate-fade-in-up"
          style="animation-delay: 100ms"
        />
        <AmountInputCard
          v-else
          v-model="amount"
          :label="config.amountLabel"
          :caption="amountCaption"
          :presets="config.amountPresets"
          class="animate-fade-in-up"
          style="animation-delay: 100ms"
        />

        <PeriodSliderCard
          v-model="months"
          :label="config.periodLabel"
          :caption="config.showTargetDate ? targetDateLabel : ''"
          result-label="월 예상 저축액"
          :result-value="monthlyAmountLabel"
          :result-caption="config.showPeriodFormula ? periodFormulaLabel : ''"
          :min="config.periodMin"
          :max="config.periodMax"
          :presets="config.periodPresets"
          class="animate-fade-in-up"
          style="animation-delay: 175ms"
        />

        <AmountInputCard
          v-model="startAmount"
          label="이미 모아둔 금액"
          description="없으면 0원으로 두세요"
          class="animate-fade-in-up"
          style="animation-delay: 250ms"
        />
      </div>

      <p class="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-gray-400">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mt-0.5 h-3.5 w-3.5 shrink-0"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
        <span>
          {{ config.infoText.prefix
          }}<span v-if="config.infoText.highlight" class="font-semibold text-primary">{{
            config.infoText.highlight
          }}</span
          >{{ config.infoText.suffix }}
        </span>
      </p>
    </div>

    <BottomCTA label="실현 가능성 확인" @click="handleNext" />
  </HeroBackground>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BrandHeader from '@/shared/ui/BrandHeader.vue'
import ProgressBar from '@/shared/ui/ProgressBar.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import AmountInputCard from '@/shared/ui/AmountInputCard.vue'
import AmountPresetCard from '@/features/goal/components/AmountPresetCard.vue'
import PeriodSliderCard from '@/shared/ui/PeriodSliderCard.vue'
import { useGoalStore } from '@/features/goal'
import { GOAL_PRESETS } from '@/features/goal/constants/goal.constants.js'
import {
  GOAL_DETAIL_CONFIG,
  DEFAULT_GOAL_DETAIL_CONFIG,
} from '@/features/goal/constants/goalDetailConfig.js'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatKRWCompact } from '@/shared/lib/money'

const router = useRouter()
const goalStore = useGoalStore()
const { selectedGoalId } = storeToRefs(goalStore)

const selectedGoal = computed(() => GOAL_PRESETS.find((preset) => preset.id === selectedGoalId.value))
const config = computed(
  () => GOAL_DETAIL_CONFIG[selectedGoalId.value] ?? DEFAULT_GOAL_DETAIL_CONFIG
)

const amount = ref(config.value.defaultAmount)
const months = ref(config.value.periodDefault)
const startAmount = ref(0)

const amountCaption = computed(() =>
  amount.value > 0 ? `= ${formatKRWCompact(amount.value)}` : ''
)
const monthlyAmountLabel = computed(() => formatKRWCompact(amount.value / months.value))
const targetDateLabel = computed(() => {
  const target = new Date()
  target.setMonth(target.getMonth() + months.value)
  return `목표 달성 예정일: ${target.getFullYear()}년 ${target.getMonth() + 1}월`
})
const periodFormulaLabel = computed(
  () => `${formatKRWCompact(amount.value)} ÷ ${months.value}개월`
)

function handleBack() {
  router.push({ name: ROUTE_NAMES.GOAL_SELECT })
}

function handleNext() {
  goalStore.goalParams = {
    amount: amount.value,
    months: months.value,
    startAmount: startAmount.value,
  }
  router.push({ name: ROUTE_NAMES.GOAL_FEASIBILITY })
}
</script>
