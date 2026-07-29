<template>
  <SpendingDashboard
    :goals="goals"
    :selected-goal-id="selectedGoalId"
    :selected-goal="selectedGoalName"
    :are-goals-loading="areGoalsLoading"
    @select-goal="goalStore.selectGoal"
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

onMounted(() => {
  goalStore.fetchGoals()
})
</script>
