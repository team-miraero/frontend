// 페이스메이커(자동저축) 관련 MSW 핸들러
import { http, HttpResponse } from 'msw'

let mockPacemakerStatus = 'null' // 여유자금 통장 미개설 상태

export const pacemakerHandlers = [
  http.get('*/api/pace-maker', async () => {
    return HttpResponse.json({
      autoSavingId: 21,
      registered: false,
      status: mockPacemakerStatus,
      enabled: mockPacemakerStatus === 'ACTIVE',
      monthlySecuredAmount: 42000,
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
