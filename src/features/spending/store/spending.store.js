// spending 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSpendingSummary } from '@/features/spending/api/spending.api'

export const useSpendingStore = defineStore('spending', () => {
  const spendingSummary = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function loadSpendingData(params) {
    isLoading.value = true
    error.value = null

    try {
      spendingSummary.value = await getSpendingSummary(params)
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
  }

  return {
    spendingSummary,
    isLoading,
    error,
    loadSpendingData,
  }
})
