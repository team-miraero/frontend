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
        {{ selectedGoal.label }}
      </span>

      <p class="mt-4 text-xs font-bold text-primary">STEP 2 — 목표 구체화</p>

      <h1 class="mt-4 text-[30px] font-bold leading-tight text-gray-900">
        얼마를, 언제까지<br />모을까요?
      </h1>

      <div class="mt-6 space-y-4">
        <AmountInputCard
          v-model="amount"
          label="보증금 목표금액"
          :caption="amountCaption"
          :presets="AMOUNT_PRESETS"
          class="animate-fade-in-up"
          style="animation-delay: 100ms"
        />

        <PeriodSliderCard
          v-model="months"
          label="목표 기간"
          :caption="targetDateLabel"
          result-label="월 예상 저축액"
          :result-value="monthlyAmountLabel"
          :min="6"
          :max="60"
          :presets="PERIOD_PRESETS"
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
          소득·지출은 마이데이터에서 자동으로 계산해요. 입력한 금액과 실제 저축 여력을 함께 고려해
          로드맵을 만들어 드려요.
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
import PeriodSliderCard from '@/shared/ui/PeriodSliderCard.vue'
import { useGoalStore } from '@/features/goal'
import { GOAL_TYPES } from '@/shared/constants/goals'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatKRWCompact } from '@/shared/lib/money'

const AMOUNT_PRESETS = [
  { label: '1,000만원', value: 10000000 },
  { label: '2,000만원', value: 20000000 },
  { label: '3,000만원', value: 30000000 },
  { label: '5,000만원', value: 50000000 },
]

const PERIOD_PRESETS = [
  { label: '6개월', value: 6 },
  { label: '1년', value: 12 },
  { label: '2년', value: 24 },
  { label: '3년', value: 36 },
]

const router = useRouter()
const goalStore = useGoalStore()
const { selectedGoalType } = storeToRefs(goalStore)

const selectedGoal = computed(() => GOAL_TYPES.find((goal) => goal.id === selectedGoalType.value))

const amount = ref(30000000)
const months = ref(24)
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
