// 원화 포맷 유틸
const koreanNumberFormatter = new Intl.NumberFormat('ko-KR')

/**
 * 숫자를 한국어 로케일 천 단위 구분 문자열로 변환한다.
 * @param {number} value
 * @returns {string}
 */
export function formatKoreanNumber(value) {
  return koreanNumberFormatter.format(value)
}

/**
 * 숫자를 "1,234,000원" 형태의 원화 문자열로 변환한다.
 * @param {number} amount
 * @returns {string}
 */
export function formatKRW(amount) {
  return `${formatKoreanNumber(amount)}원`
}

/**
 * "만원" 단위 축약 표기로 변환한다. (예: 12,340,000 -> "1,234만원")
 * @param {number} amount
 * @returns {string}
 */
export function formatKRWCompact(amount) {
  const man = Math.round(amount / 10000)
  return `${formatKoreanNumber(man)}만원`
}
