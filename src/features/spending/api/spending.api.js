// spending 도메인 API 함수 골격 (EXP-01~04)

const MOCK_SPENDING_SUMMARY = {
  totalSpending: 90,
  savingCapacity: 35,
  remainingMonths: 53,
  monthlyDifference: 4,
  goalProgress: 62,
  myDataLinked: true,
  referenceMonth: '2026-07',
}

/**
 * @typedef {Object} SpendingSummary
 * @property {number} totalSpending 만원 단위
 * @property {number} savingCapacity 만원 단위
 * @property {number} remainingMonths
 * @property {number} monthlyDifference 만원 단위
 * @property {number} goalProgress
 * @property {boolean} myDataLinked 마이데이터 연동 여부
 * @property {string | null} referenceMonth 데이터 기준 월 (YYYY-MM)
 */

/**
 * @param {{ from: string, to: string }} params
 * @returns {Promise<SpendingSummary>}
 */
export async function getSpendingSummary(params) {
  // TODO: 실제 API 연동 시 client.get('/spending/summary', { params })로 교체
  return { ...MOCK_SPENDING_SUMMARY }
}
