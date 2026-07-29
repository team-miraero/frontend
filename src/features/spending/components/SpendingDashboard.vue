<template>
  <div class="mx-auto w-full max-w-[1660px] px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-12 lg:px-10">
    <div class="mb-5 md:mb-7">
      <p class="text-xs font-medium text-[#64748B]">마이데이터 연동 · 7월 기준</p>
    </div>

    <p
      v-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
      role="alert"
    >
      지출 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
    </p>

    <template v-else-if="spendingSummary">
      <SpendingSummarySection
        :total-spending="spendingSummary.totalSpending"
        :saving-capacity="spendingSummary.savingCapacity"
        :remaining-months="spendingSummary.remainingMonths"
        :monthly-difference="spendingSummary.monthlyDifference"
        :goal-progress="spendingSummary.goalProgress"
        :selected-goal="selectedGoal"
      />

      <SpendingContentTabs
        class="mt-5 md:mt-7"
        :summary="spendingSummary"
        :selected-goal="selectedGoal"
      />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import SpendingContentTabs from '@/features/spending/components/SpendingContentTabs.vue'
import SpendingSummarySection from '@/features/spending/components/SpendingSummarySection.vue'
import { DEFAULT_SELECTED_GOAL } from '@/features/spending/constants/spending.constants'
import { useSpendingStore } from '@/features/spending/store/spending.store'

const spendingStore = useSpendingStore()
const { spendingSummary, error } = storeToRefs(spendingStore)
const selectedGoal = DEFAULT_SELECTED_GOAL

onMounted(() => {
  spendingStore.loadSpendingData({
    from: '2026-07-01',
    to: '2026-07-31',
  })
})
</script>
