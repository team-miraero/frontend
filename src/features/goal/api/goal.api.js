// goal 도메인 API 함수 골격 
import { client } from '@/shared/api/client'
/**
 * @typedef {Object} GoalParams
 * @property {number} targetAmount 목표금액
 * @property {number} periodMonths 기간(개월)
 * @property {number} seedMoney 시드머니
 * @property {string} goalType
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} goalType
 * @property {number} targetAmount
 * @property {number} periodMonths
 * @property {number} seedMoney
 * @property {string} createdAt
 */

/**
 * @typedef {'현실적' | '빠듯' | '무리'} FeasibilityResult
 */

/**
 * @param {GoalParams} params
 * @returns {Promise<Goal>}
 */
export async function createGoal(params) {
  // TODO: 실제 API 연동 시 client.post('/goals', params)로 교체
  return { id: '', goalType: '', targetAmount: 0, periodMonths: 0, seedMoney: 0, createdAt: '' }
}

/**
 * @param {GoalParams} params
 * @returns {Promise<{ result: FeasibilityResult }>}
 */
export async function getFeasibility(params) {
  // TODO: 실제 API 연동 시 client.post('/goals/feasibility', params)로 교체
  return { result: '현실적' }
}

/**
 * @param {{ goalId: string, accountIds: string[] }} payload
 * @returns {Promise<void>}
 */
export async function linkAccount(payload) {
  // TODO: 실제 API 연동 시 client.post(`/goals/${payload.goalId}/accounts`, payload)로 교체
}


// 목표 목록 조회 API
/**
 * @typedef {Object} GoalListItem
 * @property {number} goalId
 * @property {string} goalName
 * @property {string} goalType
 * @property {number} progressRate
 * @property {string} status
 */

/**
 * @returns {Promise<GoalListItem[]>}
 */
export async function getGoals() {
  const { data } = await client.get('/goals')
  return data.goals
}


// 목표 상세 조회 API
/**
 * @typedef {Object} GoalDetail
 * @property {number} goalId
 * @property {string} goalType
 * @property {string} goalName
 * @property {number} goalAmount
 * @property {number} currentAmount
 * @property {number} startAmount
 * @property {number} progressRate
 * @property {{ goalMonths: number, startDate: string, endDate: string, remainMonths: number }} period
 * @property {'ACTIVE' | 'PAUSE' | 'COMPLETED'} status
 * @property {{ expectedAmount: number, differenceAmount: number, paceStatus: 'AHEAD' | 'ON_TRACK' | 'BEHIND' }} pace
 */

/**
 * @param {number} goalId
 * @returns {Promise<GoalDetail>}
 */
export async function getGoalDetail(goalId) {
  const { data } = await client.get(`/goals/${goalId}`)
  return data
}

// 연결 자산 조회 API
/**
 * @typedef {Object} GoalAsset
 * @property {'MONEY_BOX' | 'ACCOUNT' | 'LOAN'} assetType
 * @property {number} assetId
 * @property {string} assetName
 * @property {string} bankName
 * @property {string} accountNumberMasked
 * @property {number | null} balance
 * @property {{ interestRate: number, maturityDate: string } | null} assetDetail
 * @property {{ amount: number, transferDay: number, withdrawalAccount: { bankName: string, accountNumberMasked: string } | null }} autoTransfer
 */

/**
 * @param {number} goalId
 * @returns {Promise<GoalAsset[]>}
 */
export async function getGoalAssets(goalID) {
  const { data } = await client.get(`/goals/${goalId}/assets`)
  return data.assets
}

// 여유자금 조회 API
/**
 * @param {number} goalId
 * @returns {Promise<AvailableMoney>}
 */
export async function getAvailableMoney(goalId) {
  const { data } = await client.get(`/goals/${goalId}/available-money`)
  return data
}

/**
 * @param {number} goalId
 * @param {'ACTIVE' | 'PAUSE'} status
 * @returns {Promise<{ goalId: number, status: string, changedAt: string }>}
 */
export async function updateGoalStatus(goalId, status) {
  const { data } = await client.patch(`/goals/${goalId}/status`, { status })
  return data
}