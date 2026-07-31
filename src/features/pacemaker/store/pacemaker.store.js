// pacemaker 도메인 상태 store: 자동저축 활성화 상태
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as pacemakerApi from '@/features/pacemaker/api/pacemaker.api'
import { goalApi } from '@/features/goal'
import { GOAL_TYPE_ICON } from '@/features/pacemaker/constants/pacemaker.constants'

export const usePacemakerStore = defineStore('feature-pacemaker', () => {
  /** @type {import('vue').Ref<import('@/features/pacemaker/api/pacemaker.api').PacemakerStatus | null>} */
  const pacemakerStatus = ref(null)
  const depositTargets = ref([])
  const histories = ref([])
  const hasMoreHistories = ref(false)

  async function fetchPacemakerStatus() {
    pacemakerStatus.value = await pacemakerApi.getPacemakerStatus()
  }

  // 입금 가능 계좌 = 각 목표의 연결 자산(/api/goals/{goalId}/assets) 중 LOAN이 아닌 것들
  async function fetchDepositTargets() {
    const goals = await goalApi.getGoals()
    const assetsByGoal = await Promise.all(goals.map((goal) => goalApi.getGoalAssets(goal.goalId)))

    depositTargets.value = goals.flatMap((goal, index) =>
      assetsByGoal[index]
        .filter((asset) => asset.assetType !== 'LOAN')
        .map((asset) => ({
          goalId: goal.goalId,
          goalName: goal.goalName,
          icon: GOAL_TYPE_ICON[goal.goalType] ?? '🎯',
          accountNickname: asset.assetName,
          accountBalance: asset.balance,
          bankName: asset.bankName,
          accountNumberMasked: asset.accountNumberMasked,
        }))
    )
  }

  async function togglePacemaker() {
    if (!pacemakerStatus.value?.autoSavingId) return
    const nextStatus = pacemakerStatus.value.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    const result = await pacemakerApi.updatePacemakerStatus(
      pacemakerStatus.value.autoSavingId,
      nextStatus
    )
    pacemakerStatus.value.status = result.status
    pacemakerStatus.value.enabled = result.status === 'ACTIVE'
  }

  /**
   * @param {number} goalId
   * @param {number} amount
   */
  async function depositToGoal(goalId, amount) {
    const result = await pacemakerApi.depositToGoalAccount(goalId, amount)
    if (pacemakerStatus.value) {
      pacemakerStatus.value.balance = result.remainingBalance
    }
    return result
  }

  async function fetchHistories() {
    const result = await pacemakerApi.getPacemakerHistories()
    histories.value = result.histories
    hasMoreHistories.value = result.hasNext
  }

  return {
    pacemakerStatus,
    depositTargets,
    histories,
    hasMoreHistories,
    fetchPacemakerStatus,
    fetchDepositTargets,
    togglePacemaker,
    depositToGoal,
    fetchHistories,
  }
})
