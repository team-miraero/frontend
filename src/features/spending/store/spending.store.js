// spending 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getSpendingSummary,
  getTransactions,
  getTransactionSummary,
} from '@/features/spending/api/spending.api'

export const useSpendingStore = defineStore('spending', () => {
  const spendingSummary = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const transactionHistory = ref(null)
  const transactionSummary = ref(null)
  const areTransactionsLoading = ref(false)
  const transactionsError = ref(null)

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

  async function loadTransactions(params) {
    areTransactionsLoading.value = true
    transactionsError.value = null
    transactionHistory.value = null
    transactionSummary.value = null

    try {
      const [history, summary] = await Promise.all([
        getTransactions(params),
        getTransactionSummary(params),
      ])

      if (history.yearMonth !== summary.yearMonth) {
        throw new TypeError('거래 내역과 요약의 기준 월이 일치하지 않습니다.')
      }

      transactionHistory.value = history
      transactionSummary.value = summary
    } catch (caughtError) {
      transactionsError.value = caughtError
    } finally {
      areTransactionsLoading.value = false
    }
  }

  return {
    spendingSummary,
    isLoading,
    error,
    transactionHistory,
    transactionSummary,
    areTransactionsLoading,
    transactionsError,
    loadSpendingData,
    loadTransactions,
  }
})
