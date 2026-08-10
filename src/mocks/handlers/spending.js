import { http, HttpResponse } from 'msw'

const transactions = [
  {
    transactionId: 6,
    transactionName: '월세 자동이체',
    transactionType: 'EXPENSE',
    amount: -380000,
    categoryId: 1,
    categoryCode: 'HOUSING',
    categoryName: '주거',
    categoryType: 'FIXED',
    transactedAt: '2026-07-15T09:00:00',
  },
  {
    transactionId: 1,
    transactionName: '배달의민족',
    transactionType: 'EXPENSE',
    amount: -320000,
    categoryId: 8,
    categoryCode: 'FOOD',
    categoryName: '식비',
    categoryType: 'VARIABLE',
    transactedAt: '2026-07-15T18:30:00',
  },
  {
    transactionId: 2,
    transactionName: '스타벅스 강남역점',
    transactionType: 'EXPENSE',
    amount: -140000,
    categoryId: 9,
    categoryCode: 'CAFE',
    categoryName: '카페',
    categoryType: 'VARIABLE',
    transactedAt: '2026-07-14T13:20:00',
  },
  {
    transactionId: 3,
    transactionName: '무신사 스탠다드',
    transactionType: 'EXPENSE',
    amount: -220000,
    categoryId: 11,
    categoryCode: 'SHOPPING',
    categoryName: '쇼핑',
    categoryType: 'VARIABLE',
    transactedAt: '2026-07-14T11:10:00',
  },
  {
    transactionId: 4,
    transactionName: 'T머니 충전',
    transactionType: 'EXPENSE',
    amount: -90000,
    categoryId: 10,
    categoryCode: 'TRANSPORTATION',
    categoryName: '교통',
    categoryType: 'VARIABLE',
    transactedAt: '2026-07-13T09:00:00',
  },
  {
    transactionId: 5,
    transactionName: '넷플릭스',
    transactionType: 'EXPENSE',
    amount: -80000,
    categoryId: 4,
    categoryCode: 'SUBSCRIPTION',
    categoryName: '구독',
    categoryType: 'FIXED',
    transactedAt: '2026-07-13T08:30:00',
  },
  { transactionId: 7, transactionName: '이동통신 요금', transactionType: 'EXPENSE', amount: -70000, categoryId: 2, categoryCode: 'TELECOMMUNICATION', categoryName: '통신', categoryType: 'FIXED', transactedAt: '2026-07-12T09:00:00' },
  { transactionId: 8, transactionName: '보험료 자동이체', transactionType: 'EXPENSE', amount: -120000, categoryId: 3, categoryCode: 'INSURANCE', categoryName: '보험', categoryType: 'FIXED', transactedAt: '2026-07-11T09:00:00' },
  { transactionId: 9, transactionName: '대출 원리금 상환', transactionType: 'EXPENSE', amount: -150000, categoryId: 5, categoryCode: 'LOAN_REPAYMENT', categoryName: '대출상환', categoryType: 'FIXED', transactedAt: '2026-07-10T09:00:00' },
  { transactionId: 10, transactionName: '적금 자동이체', transactionType: 'EXPENSE', amount: -200000, categoryId: 6, categoryCode: 'SAVINGS', categoryName: '저축', categoryType: 'FIXED', transactedAt: '2026-07-09T09:00:00' },
  { transactionId: 11, transactionName: 'ETF 적립식 투자', transactionType: 'EXPENSE', amount: -100000, categoryId: 7, categoryCode: 'INVESTMENT', categoryName: '투자', categoryType: 'FIXED', transactedAt: '2026-07-08T09:00:00' },
  { transactionId: 12, transactionName: '영화관', transactionType: 'EXPENSE', amount: -70000, categoryId: 12, categoryCode: 'CULTURE', categoryName: '문화', categoryType: 'VARIABLE', transactedAt: '2026-07-07T19:30:00' },
  { transactionId: 13, transactionName: '연세내과', transactionType: 'EXPENSE', amount: -50000, categoryId: 13, categoryCode: 'MEDICAL', categoryName: '의료', categoryType: 'VARIABLE', transactedAt: '2026-07-06T14:00:00' },
  { transactionId: 14, transactionName: '생활용품', transactionType: 'EXPENSE', amount: -30000, categoryId: 14, categoryCode: 'OTHER', categoryName: '기타', categoryType: 'VARIABLE', transactedAt: '2026-07-05T16:00:00' },
]

export const spendingHandlers = [
  http.get('*/api/transactions', ({ request }) => {
    const url = new URL(request.url)
    const transactionType = url.searchParams.get('transactionType')
    const filteredTransactions = transactionType
      ? transactions.filter((transaction) => transaction.transactionType === transactionType)
      : transactions

    return HttpResponse.json({
      yearMonth: url.searchParams.get('yearMonth') ?? '2026-07',
      transactions: filteredTransactions,
      totalCount: filteredTransactions.length,
    })
  }),
  http.get('*/api/transactions/summary', ({ request }) => {
    const url = new URL(request.url)

    return HttpResponse.json({
      yearMonth: url.searchParams.get('yearMonth') ?? '2026-07',
      totalExpense: 2020000,
      previousMonthExpense: 1980000,
      expenseDifference: 40000,
      expenseChangeType: 'INCREASE',
    })
  }),
]
