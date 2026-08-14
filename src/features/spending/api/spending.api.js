import { client } from '@/shared/api/client'
import { unwrapApiData } from '@/shared/api/unwrapApiData'
import { SPENDING_CATEGORIES } from '@/features/spending/constants/spending.constants'

const CATEGORY_META_BY_NAME = new Map(
  SPENDING_CATEGORIES.map((category) => [category.name, category])
)

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function normalizeDateTime(value) {
  if (typeof value === 'string') return value

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value.map(Number)
    const isValidDateTime =
      Number.isInteger(year) &&
      Number.isInteger(month) &&
      Number.isInteger(day) &&
      Number.isInteger(hour) &&
      Number.isInteger(minute) &&
      Number.isInteger(second)

    if (isValidDateTime) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(
        hour
      ).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    }
  }

  return ''
}

function wonToTenThousands(value) {
  return Math.round((toFiniteNumber(value) / 10000) * 10) / 10
}

function requireNumericGoalId(goalId) {
  const numericGoalId = Number(goalId)

  if (!Number.isInteger(numericGoalId) || numericGoalId <= 0) {
    throw new TypeError('지출관리 조회에는 생성된 목표의 숫자형 goalId가 필요합니다.')
  }

  return numericGoalId
}

function mapCategoryAmounts(items, amountField) {
  return (Array.isArray(items) ? items : []).reduce((mapped, item) => {
    const category = CATEGORY_META_BY_NAME.get(item?.categoryName)
    if (category) mapped[category.id] = wonToTenThousands(item?.[amountField])
    return mapped
  }, {})
}

/**
 * Swagger DTO를 기존 Spending 화면 모델로 변환한다.
 * Swagger 금액은 원, 현재 화면 금액은 만원 단위다.
 */
export function mapSpendingSummary({ dashboard, peerAverage, goal, availableMoney }) {
  const monthChanges = Array.isArray(dashboard?.categoryMonthChanges)
    ? dashboard.categoryMonthChanges
    : []
  const threeMonthAverages = Array.isArray(dashboard?.categoryThreeMonthAverages?.categories)
    ? dashboard.categoryThreeMonthAverages.categories
    : []
  const peerAverages = Array.isArray(peerAverage?.categories) ? peerAverage.categories : []

  const currentMonthTotal = monthChanges.reduce(
    (total, category) => total + toFiniteNumber(category?.currentMonthAmount),
    0
  )
  const previousMonthTotal = monthChanges.reduce(
    (total, category) => total + toFiniteNumber(category?.previousMonthAmount),
    0
  )
  const year = Number(dashboard?.year)
  const month = Number(dashboard?.month)
  const hasReferenceMonth =
    Number.isInteger(year) && Number.isInteger(month) && month >= 1 && month <= 12

  return {
    totalSpending: wonToTenThousands(currentMonthTotal),
    previousMonthSpending: wonToTenThousands(previousMonthTotal),
    monthlyDifference: wonToTenThousands(currentMonthTotal - previousMonthTotal),
    savingCapacity: wonToTenThousands(availableMoney?.monthlyAvailableMoney),
    fixedSpending: wonToTenThousands(availableMoney?.fixedExpense),
    variableSpending: wonToTenThousands(availableMoney?.variableExpense),
    remainingMonths: Math.max(0, Math.trunc(toFiniteNumber(goal?.period?.remainMonths))),
    goalProgress: Math.min(100, Math.max(0, toFiniteNumber(goal?.progressRate))),
    goalRemainingAmount: Math.max(
      0,
      toFiniteNumber(goal?.goalAmount) - toFiniteNumber(goal?.currentAmount)
    ),
    referenceMonth: hasReferenceMonth ? `${year}-${String(month).padStart(2, '0')}` : null,
    categorySpending: mapCategoryAmounts(monthChanges, 'currentMonthAmount'),
    previousMonthCategorySpending: mapCategoryAmounts(monthChanges, 'previousMonthAmount'),
    recentThreeMonthAverageSpending: mapCategoryAmounts(threeMonthAverages, 'averageMonthlyAmount'),
    peerCategorySpending: mapCategoryAmounts(peerAverages, 'peerAverageAmount'),
    // TODO: Swagger에 마이데이터 연동 여부 필드 없음
    myDataLinked: null,
  }
}

/**
 * 현재 월 지출 분석과 선택한 목표의 KPI를 조회한다.
 * 지출 분석 API는 goalId를 받지 않고, 목표 상세/가용금액 API만 숫자형 goalId를 사용한다.
 * @param {number} goalId
 */
export async function getSpendingSummary(goalId) {
  const numericGoalId = requireNumericGoalId(goalId)
  const [dashboardResponse, peerResponse, goalResponse, availableMoneyResponse] = await Promise.all(
    [
      client.get('/expense-analysis/dashboard'),
      client.get('/expense-analysis/peer-average'),
      client.get(`/goals/${numericGoalId}`),
      client.get(`/goals/${numericGoalId}/available-money/monthly`),
    ]
  )

  return mapSpendingSummary({
    dashboard: unwrapApiData(dashboardResponse.data),
    peerAverage: unwrapApiData(peerResponse.data),
    goal: unwrapApiData(goalResponse.data),
    // 현재 Swagger는 이 endpoint를 공통 wrapper 없이 직접 DTO로 정의한다.
    // 런타임 응답이 wrapper인 환경도 공통 유틸이 함께 처리한다.
    availableMoney: unwrapApiData(availableMoneyResponse.data),
  })
}

function mapTransaction(transaction) {
  const categoryName = transaction?.category?.categoryName ?? '기타'
  const rawCategoryId = transaction?.category?.categoryId ?? transaction?.categoryId
  const numericCategoryId = Number(rawCategoryId)

  return {
    transactionId: Number(transaction?.transactionId),
    transactionName: transaction?.merchantName ?? '가맹점 정보 없음',
    transactionType: transaction?.transactionType ?? '',
    amount: toFiniteNumber(transaction?.amount),
    categoryId:
      rawCategoryId !== null && rawCategoryId !== undefined && Number.isFinite(numericCategoryId)
        ? numericCategoryId
        : null,
    categoryName,
    transactedAt: normalizeDateTime(transaction?.transactedAt),
  }
}

/**
 * Swagger PageResponse<TransactionResponse>를 화면용 거래 페이지로 변환한다.
 * 백엔드가 반환한 content는 transactionType으로 재필터링하지 않는다.
 */
export function mapTransactionPage(page, { year, month }) {
  const content = Array.isArray(page?.content) ? page.content : []
  const transactions = content.map(mapTransaction)
  const totalElements = Math.max(0, Math.trunc(toFiniteNumber(page?.totalElements, content.length)))
  const totalPages = Math.max(0, Math.trunc(toFiniteNumber(page?.totalPages)))
  const currentPage = Math.max(0, Math.trunc(toFiniteNumber(page?.page)))
  const size = Math.max(0, Math.trunc(toFiniteNumber(page?.size, content.length)))

  return {
    yearMonth: `${year}-${String(month).padStart(2, '0')}`,
    transactions,
    page: currentPage,
    size,
    totalElements,
    totalPages,
    first: page?.first ?? currentPage === 0,
    last: page?.last ?? (totalPages === 0 || currentPage >= totalPages - 1),
  }
}

/**
 * Swagger PageResponse<TransactionResponse>를 거래 모달 모델로 변환한다.
 * @param {{ year: number, month: number, page?: number, size?: number }} params
 */
export async function getTransactions(params) {
  const year = Number(params?.year)
  const month = Number(params?.month)
  const { data: responseBody } = await client.get('/transactions', {
    params: {
      year,
      month,
      page: params?.page ?? 1,
      size: params?.size ?? 100,
    },
  })
  const page = unwrapApiData(responseBody)

  return mapTransactionPage(page, { year, month })
}
