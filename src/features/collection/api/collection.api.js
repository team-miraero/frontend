// collection 도메인 API 함수 골격 (COLL-01~02)

/**
 * @typedef {Object} CollectionStatus
 * @property {string} goalId
 * @property {number} collectedAmount
 * @property {number} targetAmount
 */

/**
 * @param {string} goalId
 * @returns {Promise<CollectionStatus>}
 */
export async function getCollectionStatus(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/goals/${goalId}/collection`)로 교체
  return { goalId: '', collectedAmount: 0, targetAmount: 0 }
}

/**
 * @param {{ goalId: string, amount: number }} payload
 * @returns {Promise<void>}
 */
export async function addManualDeposit(payload) {
  // TODO: 실제 API 연동 시 client.post(`/goals/${payload.goalId}/collection/deposit`, payload)로 교체
}
