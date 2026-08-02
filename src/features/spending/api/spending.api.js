// spending 도메인 API 함수 골격 (EXP-01~04)
import { client } from '@/shared/api/client'

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

/**
 * @typedef {Object} Transaction
 * @property {number} transactionId
 * @property {string} transactionName
 * @property {'EXPENSE' | 'INCOME'} transactionType
 * @property {number} amount 원 단위
 * @property {number} categoryId
 * @property {string} categoryCode
 * @property {string} categoryName
 * @property {string} transactedAt
 */

/**
 * @typedef {Object} TransactionHistory
 * @property {string} yearMonth
 * @property {Transaction[]} transactions
 * @property {number} totalCount
 */

/**
 * @typedef {Object} TransactionSummary
 * @property {string} yearMonth
 * @property {number} totalExpense 원 단위
 * @property {number} previousMonthExpense 원 단위
 * @property {number} expenseDifference 원 단위
 * @property {'INCREASE' | 'DECREASE' | 'UNCHANGED'} expenseChangeType
 */

const EXPENSE_CHANGE_TYPES = ['INCREASE', 'DECREASE', 'UNCHANGED']

function unwrapApiData(responseBody) {
  if (
    responseBody &&
    typeof responseBody === 'object' &&
    Object.hasOwn(responseBody, 'success') &&
    Object.hasOwn(responseBody, 'data')
  ) {
    if (!responseBody.success) {
      throw new Error(responseBody.error?.message ?? 'API 요청에 실패했습니다.')
    }

    return responseBody.data
  }

  return responseBody
}

function normalizeTransaction(transaction) {
  if (transaction.categoryCode !== 'DELIVERY') {
    return transaction
  }

  return {
    ...transaction,
    categoryCode: 'FOOD',
    categoryName: '식비',
  }
}

function isValidTransaction(transaction) {
  return (
    transaction &&
    typeof transaction === 'object' &&
    Number.isInteger(transaction.transactionId) &&
    typeof transaction.transactionName === 'string' &&
    ['EXPENSE', 'INCOME'].includes(transaction.transactionType) &&
    Number.isFinite(transaction.amount) &&
    Number.isInteger(transaction.categoryId) &&
    typeof transaction.categoryCode === 'string' &&
    typeof transaction.categoryName === 'string' &&
    typeof transaction.transactedAt === 'string'
  )
}

/**
 * 이번 달 최근 거래 내역을 조회한다.
 *
 * @param {{ yearMonth: string }} params
 * @returns {Promise<TransactionHistory>}
 */
export async function getTransactions(params) {
  const { data: responseBody } = await client.get('/transactions', {
    params: { ...params, transactionType: 'EXPENSE' },
  })
  const data = unwrapApiData(responseBody)

  if (
    !data ||
    typeof data.yearMonth !== 'string' ||
    !Array.isArray(data.transactions) ||
    !Number.isInteger(data.totalCount) ||
    data.totalCount < 0 ||
    !data.transactions.every(isValidTransaction)
  ) {
    throw new TypeError('거래 내역 API 응답 형식이 올바르지 않습니다.')
  }

  const transactions = data.transactions
    .filter((transaction) => transaction.transactionType === 'EXPENSE')
    .map(normalizeTransaction)
    .sort((left, right) => right.transactedAt.localeCompare(left.transactedAt))

  return { ...data, transactions }
}

/**
 * 이번 달 거래 요약을 조회한다.
 *
 * @param {{ yearMonth: string }} params
 * @returns {Promise<TransactionSummary>}
 */
export async function getTransactionSummary(params) {
  const { data: responseBody } = await client.get('/transactions/summary', { params })
  const data = unwrapApiData(responseBody)

  if (
    !data ||
    typeof data.yearMonth !== 'string' ||
    !Number.isFinite(data.totalExpense) ||
    !Number.isFinite(data.previousMonthExpense) ||
    !Number.isFinite(data.expenseDifference) ||
    !EXPENSE_CHANGE_TYPES.includes(data.expenseChangeType)
  ) {
    throw new TypeError('거래 요약 API 응답 형식이 올바르지 않습니다.')
  }

  return data
}
