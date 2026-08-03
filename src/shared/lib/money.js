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

/**
 * 억, 만 단위로 읽기 직관적인 원화 문자열로 변환한다.
 * (예: 10,000,000 -> "1천만원", 100,000,000 -> "1억원", 120,000,000 -> "1억 2,000만원", 12,400,000 -> "1,240만원")
 * @param {number} amount
 * @returns {string}
 */
export function formatKRWReadable(amount) {
  if (!amount || amount <= 0) return '0원'

  const uk = Math.floor(amount / 100000000)
  const man = Math.floor((amount % 100000000) / 10000)
  const remain = amount % 10000

  let result = ''
  if (uk > 0) {
    result += `${koreanNumberFormatter.format(uk)}억`
  }
  if (man > 0) {
    if (result) result += ' '
    if (man === 1000 && uk === 0) {
      result += '1천'
    } else {
      result += `${koreanNumberFormatter.format(man)}`
    }
    result += '만'
  }
  if (remain > 0) {
    if (result) result += ' '
    result += `${koreanNumberFormatter.format(remain)}`
  }

  return (result || '0') + '원'
}
