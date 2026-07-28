// spending 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSpendingSummary, getTransactions } from '@/features/spending/api/spending.api'

export const useSpendingStore = defineStore('spending', () => {
  const spendingSummary = ref(null)
  const transactions = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function loadSpendingData(params) {
    isLoading.value = true
    error.value = null

    try {
      const [summary, loadedTransactions] = await Promise.all([
        getSpendingSummary(params),
        getTransactions(params),
      ])

      spendingSummary.value = summary
      transactions.value = loadedTransactions
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
  }

  return {
    spendingSummary,
    transactions,
    isLoading,
    error,
    loadSpendingData,
  }
})
