// 목표 4종 메타 정보
/**
 * @typedef {Object} GoalTypeMeta
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {string} icon
 */

/** @type {GoalTypeMeta[]} */
export const GOAL_TYPES = [
  {
    id: 'house',
    label: '내 집 마련',
    description: '전세/매매 자금을 위한 목표',
    icon: 'home',
  },
  {
    id: 'travel',
    label: '여행자금',
    description: '국내외 여행을 위한 목표',
    icon: 'plane',
  },
  {
    id: 'wedding',
    label: '결혼자금',
    description: '결혼 준비를 위한 목표',
    icon: 'ring',
  },
  {
    id: 'emergency',
    label: '비상금',
    description: '예기치 못한 지출 대비 목표',
    icon: 'umbrella',
  },
]
