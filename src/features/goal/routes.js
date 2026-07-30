// goal 도메인 라우트 (GOAL-01~05)
import { ROUTE_NAMES } from '@/shared/constants/routes'
import GoalLayout from '@/app/layouts/GoalLayout.vue'

export const goalRoutes = [
  {
    path: '/goal',
    component: GoalLayout,
    children: [
      {
        path: 'select',
        name: ROUTE_NAMES.GOAL_SELECT,
        component: () => import('@/pages/goal/GoalSelectPage.vue'),
      },
      {
        path: 'detail',
        name: ROUTE_NAMES.GOAL_DETAIL,
        component: () => import('@/pages/goal/GoalDetailPage.vue'),
      },
      {
        path: 'feasibility',
        name: ROUTE_NAMES.GOAL_FEASIBILITY,
        component: () => import('@/pages/goal/FeasibilityPage.vue'),
      },
      {
        path: 'account',
        name: ROUTE_NAMES.GOAL_ACCOUNT,
        component: () => import('@/pages/goal/AccountLinkPage.vue'),
      },
    ],
  },
]
