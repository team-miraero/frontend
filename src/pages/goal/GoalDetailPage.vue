<!-- 목표 구체화 페이지 (GOAL-02) -->
<template>
  <HeroBackground class="font-['Noto_Sans_KR',sans-serif]">
    <StepHeader @back="handleBack" />

    <div class="relative z-10 mx-auto w-full max-w-[650px] animate-fade-in-up px-4 pb-40 pt-2">
      <ProgressBar :current-step="2" :total-steps="3" />

      <span
        v-if="selectedGoal"
        class="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-accent-light px-3 py-1 text-xs font-semibold text-primary"
      >
        <svg
          v-if="selectedGoalId === 'INDEPENDENCE'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <svg
          v-else-if="selectedGoalId === 'EMERGENCY'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg
          v-else-if="selectedGoalId === 'MARRIAGE'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <svg
          v-else-if="selectedGoalId === 'STUDENT_LOAN'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v6.5" />
        </svg>
        <span>{{ selectedGoal.title }}</span>
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

    <BottomCTA label="실현 가능성 확인" :disabled="ctaDisabled" @click="handleNext" />
  </HeroBackground>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
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
const ctaDisabled = computed(
  () => !amount.value || amount.value <= 0 || startAmount.value > amount.value
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
