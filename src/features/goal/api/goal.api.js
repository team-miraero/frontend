// goal 도메인 API 함수 골격 (GOAL-01~05)

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
