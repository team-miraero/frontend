// spending 도메인 API 함수 골격 (EXP-01~04)

const MOCK_SPENDING_SUMMARY = {
  totalSpending: 90,
  savingCapacity: 35,
  remainingMonths: 53,
  monthlyDifference: 4,
  goalProgress: 62,
}

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
 * @typedef {Object} SpendingSummary
 * @property {number} totalSpending 만원 단위
 * @property {number} savingCapacity 만원 단위
 * @property {number} remainingMonths
 * @property {number} monthlyDifference 만원 단위
 * @property {number} goalProgress
 */

/**
 * @param {{ from: string, to: string }} params
 * @returns {Promise<SpendingSummary>}
 */
export async function getSpendingSummary(params) {
  // TODO: 실제 API 연동 시 client.get('/spending/summary', { params })로 교체
  return { ...MOCK_SPENDING_SUMMARY }
}

/**
 * @param {{ from: string, to: string, category?: string }} params
 * @returns {Promise<Transaction[]>}
 */
export async function getTransactions(params) {
  // TODO: 실제 API 연동 시 client.get('/spending/transactions', { params })로 교체
  return []
}
