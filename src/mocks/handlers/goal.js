// goal 관련 MSW 핸들러 샘플 (마이데이터 mock 포함)
import { http, HttpResponse } from 'msw'
import mydata from '@/mocks/fixtures/mydata.json'

export const goalHandlers = [
  http.post('*/api/goals', async () => {
    return HttpResponse.json({ id: 'g1' }, { status: 201 })
  }),

  http.get('*/api/goals/:goalId/feasibility', async () => {
    return HttpResponse.json({ result: '현실적' })
  }),

  http.get('*/api/mydata', async () => {
    return HttpResponse.json(mydata)
  }),
]
