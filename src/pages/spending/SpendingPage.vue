<template>
  <SpendingDashboard
    :goals="goals"
    :selected-goal-id="selectedGoalId"
    :selected-goal="selectedGoalName"
    :are-goals-loading="areGoalsLoading"
    @select-goal="selectGoal"
  />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { SpendingDashboard } from '@/features/spending'
import { useGoalStore } from '@/features/goal'

const goalStore = useGoalStore()
const { goals, selectedGoalId, selectedGoal, areGoalsLoading } = storeToRefs(goalStore)
const selectedGoalName = computed(() => selectedGoal.value?.goalName ?? '')

function selectGoal(goalId) {
  const numericGoalId = Number(goalId)
  if (Number.isInteger(numericGoalId) && numericGoalId > 0) goalStore.selectGoal(numericGoalId)
}

onMounted(async () => {
  await goalStore.fetchGoals()

  const numericGoalId = Number(selectedGoalId.value)
  const hasSelectedGoal =
    Number.isInteger(numericGoalId) &&
    goals.value.some((goal) => Number(goal.goalId) === numericGoalId)

  if (hasSelectedGoal) {
    goalStore.selectGoal(numericGoalId)
    return
  }

  const firstGoalId = Number(goals.value[0]?.goalId)
  goalStore.selectGoal(Number.isInteger(firstGoalId) && firstGoalId > 0 ? firstGoalId : null)
})
</script>
