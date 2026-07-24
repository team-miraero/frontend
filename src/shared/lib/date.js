// 날짜 포맷 유틸
/**
 * Date를 "YYYY.MM.DD" 형태로 변환한다.
 * @param {Date | string} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

/**
 * 오늘 기준 목표일까지 남은 개월 수를 계산한다.
 * @param {Date | string} targetDate
 * @returns {number}
 */
export function diffInMonths(targetDate) {
  const target = targetDate instanceof Date ? targetDate : new Date(targetDate)
  const now = new Date()
  return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
}
