// goal 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGoalStore = defineStore('feature-goal', () => {
  // 담을 상태: selectedGoalType, goalParams(목표금액·기간·시드머니), feasibilityResult, linkedAccountIds
  const selectedGoalType = ref(null)
  const goalParams = ref(null)
  const feasibilityResult = ref(null)
  const linkedAccountIds = ref([])

  return { selectedGoalType, goalParams, feasibilityResult, linkedAccountIds }
})
