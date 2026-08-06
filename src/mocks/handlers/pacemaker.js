// 페이스메이커 API 최신 예시 응답 기반 MSW 핸들러
import { http, HttpResponse } from 'msw'

let mockRegistered = false
let mockPacemakerStatus = null // 'ACTIVE' | 'PAUSED' | null
let mockBalance = 520000
let mockMaxAmount = 10000

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

  http.post('*/api/money-boxes', async ({ request }) => {
    const { moneyBoxType, autoTransfer } = await request.json()

    if (moneyBoxType !== 'SAVING' || autoTransfer !== null) {
      return HttpResponse.json({ message: '잘못된 저금통 개설 요청입니다.' }, { status: 400 })
    }

    mockRegistered = true
    mockPacemakerStatus = 'ACTIVE'

    return HttpResponse.json({
      moneyBoxId: 31,
      moneyBoxType: 'SAVING',
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

  http.post('*/api/pace-maker/deposit', async ({ request }) => {
    const { goalId, amount } = await request.json()
    mockBalance = Math.max(0, mockBalance - amount)

    return HttpResponse.json({
      goalId,
      depositedAmount: amount,
      remainingBalance: mockBalance,
    })
  }),

  http.get('*/api/pace-maker/histories', () => {
    return HttpResponse.json({
      content: [
        { date: '2026-07-18', status: 'SAVED', amount: 3200, description: null },
        {
          date: '2026-07-17',
          status: 'SKIPPED',
          amount: null,
          description: '지출 초과',
        },
      ],
      page: 0,
      size: 20,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true,
    })
  }),
]
