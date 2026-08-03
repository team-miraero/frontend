/**
 * 원리금 균등상환 대출 계산 헬퍼
 * @param {Object} params
 * @param {number} params.amount 남은 대출 원금 (원)
 * @param {number} params.months 완납 기간 (개월 수)
 * @param {number} [params.annualRate=0.017] 연 이율 (기본값: 1.7% = 0.017)
 * @returns {{
 *   monthlyPayment: number,
 *   totalInterest: number,
 *   totalPayment: number,
 *   principalRatio: number,
 *   interestRatio: number
 * }}
 */
export function calculateStudentLoan({ amount, months, annualRate = 0.017 }) {
  if (!amount || amount <= 0 || !months || months <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      principalRatio: 100,
      interestRatio: 0,
    }
  }

  const monthlyRate = annualRate / 12
  let monthlyPayment = 0

  if (monthlyRate === 0) {
    monthlyPayment = Math.round(amount / months)
  } else {
    // R = P * (i * (1+i)^n) / ((1+i)^n - 1)
    const compound = Math.pow(1 + monthlyRate, months)
    monthlyPayment = Math.round((amount * monthlyRate * compound) / (compound - 1))
  }

  const totalPayment = monthlyPayment * months
  const totalInterest = Math.max(0, totalPayment - amount)

  const principalRatio = totalPayment > 0 ? Math.round((amount / totalPayment) * 100) : 100
  const interestRatio = Math.max(0, 100 - principalRatio)

  return {
    monthlyPayment,
    totalInterest,
    totalPayment,
    principalRatio,
    interestRatio,
  }
}
