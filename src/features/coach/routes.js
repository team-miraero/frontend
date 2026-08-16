// coach 도메인 라우트 (COACH-01)
import { ROUTE_NAMES } from '@/shared/constants/routes'

export const coachRoutes = [
  {
    path: '/coach',
    name: ROUTE_NAMES.COACH,
    component: () => import('@/pages/coach/CoachPage.vue'),
  },
]
