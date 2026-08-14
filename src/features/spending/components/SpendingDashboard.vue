<template>
  <div>
    <RoadmapSelector
      :goals="goals"
      :selected-goal-id="selectedGoalId"
      :disabled="areGoalsLoading"
      :helper-text="roadmapHelperText"
      :trailing-text="myDataStatusText"
      @update:selected-goal-id="$emit('select-goal', $event)"
    />

    <div
      class="mx-auto w-full max-w-[1660px] px-4 pb-24 pt-3 sm:px-6 md:px-8 md:pb-12 md:pt-4 lg:px-10"
    >
      <LoadingSpinner v-if="isLoading" message="지출 정보를 불러오고 있어요" />

      <p
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        role="alert"
      >
        지출 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>

      <p
        v-else-if="!hasNumericGoalId && !areGoalsLoading"
        class="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-8 text-center text-sm text-[#64748B]"
      >
        지출관리에 사용할 목표를 먼저 만들어 주세요.
      </p>

      <template v-else-if="spendingSummary">
        <SpendingSummarySection
          :total-spending="spendingSummary.totalSpending"
          :saving-capacity="spendingSummary.savingCapacity"
          :remaining-months="spendingSummary.remainingMonths"
          :monthly-difference="spendingSummary.monthlyDifference"
          :goal-progress="spendingSummary.goalProgress"
          @open-transactions="openTransactionHistory"
        />

        <SpendingContentTabs
          class="mt-5 md:mt-7"
          :summary="spendingSummary"
          :selected-goal="selectedGoal"
        />
      </template>
    </div>

    <SpendingHistoryModal
      v-model="isTransactionHistoryOpen"
      :transactions="transactionHistory?.transactions ?? []"
      :total-count="transactionHistory?.totalElements ?? 0"
      :total-expense="(spendingSummary?.totalSpending ?? 0) * 10000"
      :loading="areTransactionsLoading"
      :error="transactionsError"
      @retry="loadTransactionHistory"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import SpendingContentTabs from '@/features/spending/components/SpendingContentTabs.vue'
import SpendingHistoryModal from '@/features/spending/components/SpendingHistoryModal.vue'
import SpendingSummarySection from '@/features/spending/components/SpendingSummarySection.vue'
import { useSpendingStore } from '@/features/spending/store/spending.store'
import RoadmapSelector from '@/shared/ui/RoadmapSelector.vue'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'

const spendingStore = useSpendingStore()
const {
  spendingSummary,
  isLoading,
  error,
  transactionHistory,
  areTransactionsLoading,
  transactionsError,
} = storeToRefs(spendingStore)
const isTransactionHistoryOpen = ref(false)

const props = defineProps({
  goals: {
    type: Array,
    default: () => [],
  },
  selectedGoalId: {
    type: [Number, String],
    default: null,
  },
  selectedGoal: {
    type: String,
    default: '',
  },
  areGoalsLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select-goal'])

const roadmapHelperText = computed(() =>
  props.selectedGoal ? `저축 여력과 목표 현황은 ${props.selectedGoal} 로드맵 기준으로 계산돼요` : ''
)

const hasNumericGoalId = computed(() => {
  const goalId = Number(props.selectedGoalId)
  return Number.isInteger(goalId) && goalId > 0
})

const myDataStatusText = computed(() => {
  const month = Number(spendingSummary.value?.referenceMonth?.split('-')[1])
  return Number.isInteger(month) && month > 0 ? `${month}월 기준` : ''
})

const referenceDate = computed(() => {
  const [year, month] = (spendingSummary.value?.referenceMonth ?? '').split('-').map(Number)
  return Number.isInteger(year) && Number.isInteger(month) ? { year, month } : null
})

function loadTransactionHistory() {
  if (!referenceDate.value) return Promise.resolve()
  return spendingStore.loadTransactions(referenceDate.value)
}

function openTransactionHistory() {
  isTransactionHistoryOpen.value = true
  loadTransactionHistory()
}

watch(
  () => props.selectedGoalId,
  (goalId) => {
    const numericGoalId = Number(goalId)
    if (Number.isInteger(numericGoalId) && numericGoalId > 0) {
      spendingStore.loadSpendingData(numericGoalId)
    }
  },
  { immediate: true }
)
</script>
