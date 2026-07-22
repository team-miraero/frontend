// spending 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSpendingStore = defineStore('feature-spending', () => {
  // 담을 상태: spendingSummary, transactions, selectedCategory
  const spendingSummary = ref(null)
  const transactions = ref([])
  const selectedCategory = ref(null)

  return { spendingSummary, transactions, selectedCategory }
})
