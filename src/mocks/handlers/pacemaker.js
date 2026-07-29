// 페이스메이커(자동저축) 관련 MSW 핸들러
import { http, HttpResponse } from 'msw'

// 상태 2가지: 사용자 여유자금 통장 개설/미개설
// let mockPacemakerStatus = 'ACTIVE' // 토글 테스트를 위해 모듈 스코프에서 상태 유지
let mockPacemakerStatus = null // 미개설 상태 기본값

export const pacemakerHandlers = [
  http.get('*/api/pace-maker', async () => {
    return HttpResponse.json({
      autoSavingId: 21,
      registered: false,
      // registered: true,
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
