// spending 도메인 API 함수 골격 (EXP-01~04)

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} accountId
 * @property {string} date
 * @property {string} category
 * @property {number} amount
 * @property {string} description
 */

/**
 * @typedef {Object} CategoryBreakdown
 * @property {string} category
 * @property {number} totalAmount
 * @property {number} ratio
 */

/**
 * @typedef {Object} SpendingSummary
 * @property {number} totalSpent
 * @property {CategoryBreakdown[]} byCategory
 */

/**
 * @param {{ from: string, to: string }} params
 * @returns {Promise<SpendingSummary>}
 */
export async function getSpendingSummary(params) {
  // TODO: 실제 API 연동 시 client.get('/spending/summary', { params })로 교체
  return { totalSpent: 0, byCategory: [] }
}

/**
 * @param {{ from: string, to: string, category?: string }} params
 * @returns {Promise<Transaction[]>}
 */
export async function getTransactions(params) {
  // TODO: 실제 API 연동 시 client.get('/spending/transactions', { params })로 교체
  return []
}
