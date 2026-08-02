// MSW 핸들러 barrel: 도메인별 핸들러를 합침
import { authHandlers } from '@/mocks/handlers/auth'
import { goalHandlers } from '@/mocks/handlers/goal'
import { pacemakerHandlers } from '@/mocks/handlers/pacemaker'
import { coachHandlers } from '@/mocks/handlers/coach'
import { productsHandlers } from '@/mocks/handlers/products'

export const handlers = [
  ...authHandlers,
  ...goalHandlers,
  ...pacemakerHandlers,
  ...coachHandlers,
  ...productsHandlers,
]
