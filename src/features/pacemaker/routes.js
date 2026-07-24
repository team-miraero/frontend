// pacemaker 도메인 라우트
import { ROUTE_NAMES } from '@/shared/constants/routes'

export const pacemakerRoutes = [
  {
    path: '/pacemaker',
    name: ROUTE_NAMES.PACEMAKER,
    component: () => import('@/pages/pacemaker/PacemakerPage.vue'),
  },
]