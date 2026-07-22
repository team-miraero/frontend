// pacemaker 도메인 API 함수 골격 (PACE-01~06)

/**
 * @typedef {Object} CashflowAnalysis
 * @property {number} monthlyIncome
 * @property {number} monthlyExpense
 * @property {number} netCashflow
 */

/**
 * @typedef {Object} SpareMoney
 * @property {number} today 오늘 남은 여유자금
 * @property {number} thisWeek 이번 주 여유자금
 * @property {number} thisMonth 이번 달 여유자금
 */

/**
 * @typedef {Object} NextMonthReserve
 * @property {number} reserveRate 준비금 확보율
 * @property {number} reservedAmount
 * @property {number} targetAmount
 */

/**
 * @param {string} goalId
 * @returns {Promise<CashflowAnalysis>}
 */
export async function getCashflowAnalysis(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/goals/${goalId}/cashflow`)로 교체
  return { monthlyIncome: 0, monthlyExpense: 0, netCashflow: 0 }
}

/**
 * @param {string} goalId
 * @returns {Promise<SpareMoney>}
 */
export async function getSpareMoney(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/goals/${goalId}/spare-money`)로 교체
  return { today: 0, thisWeek: 0, thisMonth: 0 }
}

/**
 * @param {string} goalId
 * @returns {Promise<NextMonthReserve>}
 */
export async function getNextMonthReserve(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/goals/${goalId}/next-month-reserve`)로 교체
  return { reserveRate: 0, reservedAmount: 0, targetAmount: 0 }
}
