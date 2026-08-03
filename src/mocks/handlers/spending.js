import { http, HttpResponse } from 'msw'

const transactions = [
  {
    transactionId: 1,
    transactionName: '배달의민족',
    transactionType: 'EXPENSE',
    amount: -150000,
    categoryId: 1,
    categoryCode: 'FOOD',
    categoryName: '식비',
    transactedAt: '2026-07-15T18:30:00',
  },
  {
    transactionId: 2,
    transactionName: '스타벅스 강남역점',
    transactionType: 'EXPENSE',
    amount: -65000,
    categoryId: 2,
    categoryCode: 'CAFE',
    categoryName: '카페',
    transactedAt: '2026-07-14T13:20:00',
  },
  {
    transactionId: 3,
    transactionName: '무신사 스탠다드',
    transactionType: 'EXPENSE',
    amount: -120000,
    categoryId: 3,
    categoryCode: 'SHOPPING',
    categoryName: '쇼핑',
    transactedAt: '2026-07-14T11:10:00',
  },
  {
    transactionId: 4,
    transactionName: 'T머니 충전',
    transactionType: 'EXPENSE',
    amount: -30000,
    categoryId: 4,
    categoryCode: 'TRANSPORTATION',
    categoryName: '교통',
    transactedAt: '2026-07-13T09:00:00',
  },
  {
    transactionId: 5,
    transactionName: '넷플릭스',
    transactionType: 'EXPENSE',
    amount: -17000,
    categoryId: 5,
    categoryCode: 'SUBSCRIPTION',
    categoryName: '구독',
    transactedAt: '2026-07-13T08:30:00',
  },
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
      totalCount: 10,
    })
  }),
  http.get('*/api/transactions/summary', ({ request }) => {
    const url = new URL(request.url)

    return HttpResponse.json({
      yearMonth: url.searchParams.get('yearMonth') ?? '2026-07',
      totalExpense: 900000,
      previousMonthExpense: 860000,
      expenseDifference: 40000,
      expenseChangeType: 'INCREASE',
    })
  }),
]
