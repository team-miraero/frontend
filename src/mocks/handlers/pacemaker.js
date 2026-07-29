// 페이스메이커(자동저축) 관련 MSW 핸들러
import { http, HttpResponse } from 'msw'

// 테스트 시 registered/mockPacemakerStatus 조합만 바꿔가며 미개설·OFF·ON 상태를 확인하면 됩니다.
let mockRegistered = true
let mockPacemakerStatus = 'ACTIVE' // 'ACTIVE' | 'PAUSED' | null

export const pacemakerHandlers = [
  http.get('*/api/pace-maker', async () => {
    return HttpResponse.json({
      autoSavingId: 21,
      registered: mockRegistered,
      status: mockPacemakerStatus,
      enabled: mockPacemakerStatus === 'ACTIVE',
      monthlySecuredAmount: 42000,
      balance: 270000,
      todayEarned: 12700,
      streakDays: 52,
      dailyLimit: 10000,
    })
  }),

  http.patch('*/api/pace-maker/:autoSavingId/status', async ({ request }) => {
    const { status } = await request.json()
    mockPacemakerStatus = status
    return HttpResponse.json({
      autoSavingId: 21,
      status,
      changedAt: new Date().toISOString().slice(0, 19),
    })
  }),
]
