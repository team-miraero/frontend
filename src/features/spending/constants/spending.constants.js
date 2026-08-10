export const DEFAULT_SELECTED_GOAL = '유럽 여행자금'

export const MONTHS_SHORTENED_PER_SAVING_UNIT = 0.04

export const SPENDING_CATEGORY_TYPES = {
  FIXED: 'FIXED',
  VARIABLE: 'VARIABLE',
}

export const SPENDING_COMPARISON_BASES = [
  { id: 'AGE', label: '연령대 기준' },
  { id: 'INCOME', label: '월소득 기준' },
]

export const SPENDING_AGE_GROUPS = [
  { id: 'early-20s', label: '20대 초' },
  { id: 'late-20s', label: '20대 후' },
  { id: 'early-30s', label: '30대 초' },
  { id: 'late-30s', label: '30대 후' },
]

export const SPENDING_INCOME_GROUPS = [
  { id: 'under-250', label: '250만원 미만' },
  { id: '250-350', label: '250~350만원' },
  { id: '350-500', label: '350~500만원' },
  { id: 'over-500', label: '500만원 이상' },
]

export const DEFAULT_SPENDING_AGE_GROUP_ID = 'late-20s'
export const DEFAULT_SPENDING_INCOME_GROUP_ID = '250-350'

// 카테고리와 타입, 표시 순서, 스타일을 하나의 메타데이터로 관리한다.
export const SPENDING_CATEGORIES = [
  { id: 'housing', code: 'HOUSING', name: '주거', type: 'FIXED', icon: '🏠', current: 38, accent: '#3D8BFF', softColor: '#EEF5FF', borderColor: '#B9D4FF' },
  { id: 'telecommunication', code: 'TELECOMMUNICATION', name: '통신', type: 'FIXED', icon: '📱', current: 7, accent: '#0EA5E9', softColor: '#F0F9FF', borderColor: '#BAE6FD' },
  { id: 'insurance', code: 'INSURANCE', name: '보험', type: 'FIXED', icon: '🛡️', current: 12, accent: '#6366F1', softColor: '#EEF2FF', borderColor: '#C7D2FE' },
  { id: 'subscription', code: 'SUBSCRIPTION', name: '구독', type: 'FIXED', icon: '📺', current: 8, accent: '#8B5CF6', softColor: '#F5F3FF', borderColor: '#DDD6FE' },
  { id: 'loanRepayment', code: 'LOAN_REPAYMENT', name: '대출상환', type: 'FIXED', icon: '🏦', current: 15, accent: '#64748B', softColor: '#F1F5F9', borderColor: '#CBD5E1' },
  { id: 'savings', code: 'SAVINGS', name: '저축', type: 'FIXED', icon: '🐷', current: 20, accent: '#10B981', softColor: '#ECFDF5', borderColor: '#A7F3D0' },
  { id: 'investment', code: 'INVESTMENT', name: '투자', type: 'FIXED', icon: '📈', current: 10, accent: '#14B8A6', softColor: '#F0FDFA', borderColor: '#99F6E4' },
  { id: 'food', code: 'FOOD', name: '식비', type: 'VARIABLE', icon: '🍴', current: 32, mode: 'adjustable', min: 0, step: 1, accent: '#FF6B6B', softColor: '#FFF1F2', borderColor: '#FFCDD2' },
  { id: 'cafe', code: 'CAFE', name: '카페', type: 'VARIABLE', icon: '☕', current: 14, mode: 'adjustable', min: 0, step: 1, accent: '#F59E0B', softColor: '#FFF7E8', borderColor: '#FDD99A' },
  { id: 'transportation', code: 'TRANSPORTATION', name: '교통', type: 'VARIABLE', icon: '🚌', current: 9, accent: '#10B981', softColor: '#ECFDF5', borderColor: '#A7F3D0' },
  { id: 'shopping', code: 'SHOPPING', name: '쇼핑', type: 'VARIABLE', icon: '🛍️', current: 22, mode: 'adjustable', min: 0, step: 1, accent: '#A855F7', softColor: '#F8F0FF', borderColor: '#DDB9FF' },
  { id: 'culture', code: 'CULTURE', name: '문화', type: 'VARIABLE', icon: '🎬', current: 7, mode: 'adjustable', min: 0, step: 1, accent: '#EC4899', softColor: '#FDF2F8', borderColor: '#FBCFE8' },
  { id: 'medical', code: 'MEDICAL', name: '의료', type: 'VARIABLE', icon: '🩺', current: 5, mode: 'adjustable', min: 0, step: 1, accent: '#06B6D4', softColor: '#ECFEFF', borderColor: '#A5F3FC' },
  { id: 'other', code: 'OTHER', name: '기타', type: 'VARIABLE', icon: '💳', current: 3, mode: 'adjustable', min: 0, step: 1, accent: '#64748B', softColor: '#F1F5F9', borderColor: '#CBD5E1' },
]

export const PREVIOUS_MONTH_SPENDING_BY_CATEGORY = {
  food: 29,
  cafe: 16,
  transportation: 10,
  shopping: 20,
  culture: 8,
  medical: 4,
  other: 5,
}

export const RECENT_THREE_MONTH_AVERAGE_SPENDING_BY_CATEGORY = {
  food: 34,
  cafe: 14,
  transportation: 10,
  shopping: 24,
  culture: 8,
  medical: 5,
  other: 3,
}

const LATE_TWENTIES_PEER_SPENDING = {
  housing: 40,
  telecommunication: 6,
  insurance: 11,
  subscription: 7,
  loanRepayment: 12,
  savings: 18,
  investment: 8,
  food: 30,
  cafe: 12,
  transportation: 10,
  shopping: 20,
  culture: 6,
  medical: 4,
  other: 4,
}

const scaleSpending = (spending, factor) =>
  Object.fromEntries(
    Object.entries(spending).map(([categoryId, amount]) => [categoryId, Math.round(amount * factor)])
  )

export const PEER_SPENDING_BY_BASIS = {
  AGE: {
    'early-20s': scaleSpending(LATE_TWENTIES_PEER_SPENDING, 0.86),
    'late-20s': LATE_TWENTIES_PEER_SPENDING,
    'early-30s': scaleSpending(LATE_TWENTIES_PEER_SPENDING, 1.12),
    'late-30s': scaleSpending(LATE_TWENTIES_PEER_SPENDING, 1.2),
  },
  INCOME: {
    'under-250': scaleSpending(LATE_TWENTIES_PEER_SPENDING, 0.78),
    '250-350': scaleSpending(LATE_TWENTIES_PEER_SPENDING, 0.98),
    '350-500': scaleSpending(LATE_TWENTIES_PEER_SPENDING, 1.18),
    'over-500': scaleSpending(LATE_TWENTIES_PEER_SPENDING, 1.42),
  },
}
