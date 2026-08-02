// 목표 실현가능성(GOAL-03) 상태 판정: API가 계산한 필요/가능 저축액으로 '현실적/빠듯/무리' 등급만 매김
// 필요 저축액(requiredMonthly) 자체의 계산은 백엔드(실현가능성 조회 API)가 담당한다.

/**
 * @typedef {Object} FeasibilityStatusInput
 * @property {number} requiredMonthly API가 계산한 월 필요 저축액
 * @property {number} availableMonthly API가 계산한 월 가능 저축액
 */

/**
 * @typedef {Object} FeasibilityStatus
 * @property {number} ratio requiredMonthly / availableMonthly
 * @property {'success' | 'warning' | 'danger'} status
 */

const WARNING_RATIO_LIMIT = 1.2

/**
 * @param {FeasibilityStatusInput} params
 * @returns {FeasibilityStatus}
 */
export function resolveFeasibilityStatus({ requiredMonthly, availableMonthly }) {
  const ratio = availableMonthly > 0 ? requiredMonthly / availableMonthly : Infinity

  let status = 'danger'
  if (ratio <= 1) {
    status = 'success'
  } else if (ratio <= WARNING_RATIO_LIMIT) {
    status = 'warning'
  }

  return { ratio, status }
}
