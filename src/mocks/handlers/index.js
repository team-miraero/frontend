// MSW 핸들러 barrel: 도메인별 핸들러를 합침
import { authHandlers } from '@/mocks/handlers/auth'
import { goalHandlers } from '@/mocks/handlers/goal'

export const handlers = [...authHandlers, ...goalHandlers]
