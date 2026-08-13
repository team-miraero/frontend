// 페이스메이커 API 최신 예시 응답 기반 MSW 핸들러
import { http, HttpResponse } from 'msw'

let mockRegistered = false
let mockPacemakerStatus = null // 'ACTIVE' | 'PAUSED' | null
let mockBalance = 520000
let mockMaxAmount = 10000
const mockGoals = [
  {
    goalId: 1,
    goalName: '유럽 여행',
    goalType: 'WEDDING',
    goalAmount: 3000000,
    totalSavedAmount: 1200000,
    depositAssets: [
      {
        assetType: 'ACCOUNT',
        assetId: 3,
        financialInstitutionName: 'KB국민은행',
        maskedAccountNumber: '123-***-789',
        balance: 700000,
      },
      {
        assetType: 'MONEY_BOX',
        assetId: 5,
        financialInstitutionName: null,
        maskedAccountNumber: '456-***-111',
        balance: 500000,
      },
    ],
    withdrawalAccounts: [
      {
        accountId: 8,
        financialInstitutionName: 'KB국민은행',
        maskedAccountNumber: '987-***-123',
        balance: 1000000,
      },
      {
        accountId: 9,
        financialInstitutionName: '우리은행',
        maskedAccountNumber: '111-***-222',
        balance: 2300000,
      },
    ],
  },
  {
    goalId: 2,
    goalName: '비상금',
    goalType: 'EMERGENCY',
    goalAmount: 1000000,
    totalSavedAmount: 250000,
    depositAssets: [
      {
        assetType: 'ACCOUNT',
        assetId: 11,
        financialInstitutionName: '신한은행',
        maskedAccountNumber: '222-***-333',
        balance: 250000,
      },
    ],
    withdrawalAccounts: [
      {
        accountId: 12,
        financialInstitutionName: '신한은행',
        maskedAccountNumber: '999-***-000',
        balance: 500000,
      },
    ],
  },
]

export const pacemakerHandlers = [
  http.get('*/api/pace-maker', () => {
    return HttpResponse.json({
      autoSavingId: mockRegistered ? 21 : null,
      registered: mockRegistered,
      status: mockRegistered ? mockPacemakerStatus : null,
      enabled: mockRegistered && mockPacemakerStatus === 'ACTIVE',
    })
  }),

  http.get('*/api/pace-maker/dashboard', () => {
    return HttpResponse.json({
      autoSavingId: 21,
      status: mockPacemakerStatus ?? 'ACTIVE',
      maxAmount: mockMaxAmount,
      moneyBox: {
        moneyBoxId: 31,
        balance: mockBalance,
        maskedAccountNumber: '123-****-7890',
      },
      todaySaving: {
        savingDate: '2026-07-22',
        amount: 10000,
        status: 'SUCCESS',
      },
      currentStreak: 12,
      weeklyStreak: [
        { savingDate: '2026-07-20', dayOfWeek: 'MONDAY', status: 'SUCCESS' },
        { savingDate: '2026-07-21', dayOfWeek: 'TUESDAY', status: 'SUCCESS' },
        { savingDate: '2026-07-22', dayOfWeek: 'WEDNESDAY', status: 'SUCCESS' },
        { savingDate: '2026-07-23', dayOfWeek: 'THURSDAY', status: 'FAIL' },
        { savingDate: '2026-07-24', dayOfWeek: 'FRIDAY', status: 'FAIL' },
      ],
      monthlySuccessCount: 18,
    })
  }),

  http.get('*/api/pace-maker/goals', () => {
    return HttpResponse.json({ goals: mockGoals })
  }),

  http.post('*/api/pace-maker', async ({ request }) => {
    const { accountId, maxAmount } = await request.json()

    if (!accountId || !maxAmount) {
      return HttpResponse.json(
        { success: false, data: null, error: { message: '연동 계좌와 상한선을 확인해 주세요.' } },
        { status: 400 }
      )
    }

    mockRegistered = true
    mockPacemakerStatus = 'ACTIVE'
    mockMaxAmount = maxAmount

    return HttpResponse.json({
      success: true,
      data: {
        autoSavingId: 21,
        moneyBoxId: 31,
        accountId,
        maxAmount,
        autoSavingStatus: 'ACTIVE',
      },
      error: null,
    })
  }),

  http.patch('*/api/pace-maker/:autoSavingId/status', async ({ request }) => {
    const { status } = await request.json()
    mockRegistered = true
    mockPacemakerStatus = status

    return HttpResponse.json({
      success: true,
      data: {
        autoSavingId: 21,
        registered: true,
        status,
        enabled: status === 'ACTIVE',
      },
      error: null,
    })
  }),

  // 전달받은 최신 경로 표기(max-mount)를 그대로 사용합니다.
  http.patch('*/api/pace-maker/max-mount', async ({ request }) => {
    const { maxAmount } = await request.json()
    mockMaxAmount = maxAmount

    return HttpResponse.json({
      autoSavingId: 21,
      maxAmount,
    })
  }),

  http.post('*/api/pace-maker/deposits', async ({ request }) => {
    const { accountId, amount, moneyBoxId } = await request.json()
    const targetAccount = mockGoals
      .flatMap((goal) => goal.withdrawalAccounts)
      .find((account) => account.accountId === accountId)

    if (!targetAccount || moneyBoxId !== 31 || amount <= 0 || amount > mockBalance) {
      return HttpResponse.json({ message: '입금 요청 정보를 확인해 주세요.' }, { status: 400 })
    }

    mockBalance -= amount
    targetAccount.balance += amount

    return HttpResponse.json({
      accountId,
      moneyBoxId,
      depositedAmount: amount,
      remainingBalance: mockBalance,
    })
  }),

  http.get('*/api/pace-maker/histories', () => {
    return HttpResponse.json({
      content: [
        {
          date: '2026-07-22',
          status: 'SAVED',
          amount: 10000,
          description: '오늘의 여유자금 자동 저축',
        },
        { date: '2026-07-21', status: 'SAVED', amount: 20000, description: null },
        { date: '2026-07-20', status: 'SAVED', amount: 15000, description: null },
        { date: '2026-07-19', status: 'SAVED', amount: 12000, description: null },
        { date: '2026-07-18', status: 'SAVED', amount: 18000, description: null },
        { date: '2026-07-17', status: 'SAVED', amount: 9000, description: null },
        { date: '2026-07-16', status: 'SAVED', amount: 13000, description: null },
        { date: '2026-07-15', status: 'SAVED', amount: 11000, description: null },
        { date: '2026-07-14', status: 'SAVED', amount: 16000, description: null },
        { date: '2026-07-13', status: 'SAVED', amount: 7000, description: null },
        { date: '2026-07-12', status: 'SAVED', amount: 14000, description: null },
        { date: '2026-07-11', status: 'SAVED', amount: 8000, description: null },
        {
          date: '2026-07-10',
          status: 'SKIPPED',
          amount: null,
          description: '여유자금 없음',
        },
        { date: '2026-07-09', status: 'SAVED', amount: 6000, description: null },
        {
          date: '2026-07-08',
          status: 'SKIPPED',
          amount: null,
          description: '지출 초과',
        },
        { date: '2026-07-07', status: 'SAVED', amount: 5000, description: null },
        {
          date: '2026-07-06',
          status: 'SKIPPED',
          amount: null,
          description: '여유자금 없음',
        },
        { date: '2026-07-05', status: 'SAVED', amount: 12000, description: null },
        { date: '2026-07-04', status: 'SAVED', amount: 4000, description: null },
        {
          date: '2026-07-03',
          status: 'SKIPPED',
          amount: null,
          description: '지출 초과',
        },
        { date: '2026-07-02', status: 'SAVED', amount: 10000, description: null },
        { date: '2026-07-01', status: 'SAVED', amount: 3000, description: null },
      ],
      page: 0,
      size: 31,
      totalElements: 22,
      totalPages: 1,
      first: true,
      last: true,
    })
  }),
]
