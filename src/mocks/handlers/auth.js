// auth 관련 MSW 핸들러 샘플
import { http, HttpResponse } from 'msw'

export const authHandlers = [
  http.post('*/api/auth/login', async () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      user: { id: 'u1', name: '홍길동', email: 'test@example.com' },
    })
  }),

  http.post('*/api/auth/signup', async () => {
    return HttpResponse.json({ id: 'u1' }, { status: 201 })
  }),
]
