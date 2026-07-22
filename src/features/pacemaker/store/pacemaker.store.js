// pacemaker 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePacemakerStore = defineStore('feature-pacemaker', () => {
  // 담을 상태: cashflowAnalysis, spareMoney(오늘/주/월), nextMonthReserve(준비금 확보율)
  const cashflowAnalysis = ref(null)
  const spareMoney = ref(null)
  const nextMonthReserve = ref(null)

  return { cashflowAnalysis, spareMoney, nextMonthReserve }
})
