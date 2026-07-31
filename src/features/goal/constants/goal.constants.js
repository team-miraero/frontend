/**
 * @typedef {Object} GoalPreset
 * @property {string} id - 목표 프리셋 고유 ID
 * @property {string} title - 목표 프리셋 제목
 * @property {string} description - 목표 프리셋 설명
 * @property {string} icon - 목표 프리셋 아이콘 (이모지 또는 아이콘명)
 */

/**
 * 4가지 목표 프리셋 고유 ID 정의
 * @type {Readonly<{INDEPENDENCE: string, EMERGENCY: string, MARRIAGE: string, STUDENT_LOAN: string}>}
 */
export const GOAL_PRESET_IDS = Object.freeze({
  INDEPENDENCE: 'INDEPENDENCE',
  EMERGENCY: 'EMERGENCY',
  MARRIAGE: 'MARRIAGE',
  STUDENT_LOAN: 'STUDENT_LOAN',
})

/**
 * 4가지 목표 프리셋 데이터 상수
 * @type {ReadonlyArray<GoalPreset>}
 */
export const GOAL_PRESETS = Object.freeze([
  {
    id: GOAL_PRESET_IDS.INDEPENDENCE,
    title: '독립자금',
    description: '전세·월세 보증금 마련',
    icon: '🏠',
  },
  {
    id: GOAL_PRESET_IDS.EMERGENCY,
    title: '비상금·첫 목돈',
    description: '생활비 목돈 마련',
    icon: '💰',
  },
  {
    id: GOAL_PRESET_IDS.MARRIAGE,
    title: '결혼자금',
    description: '결혼을 위한 목돈',
    icon: '💍',
  },
  {
    id: GOAL_PRESET_IDS.STUDENT_LOAN,
    title: '학자금 대출 상환',
    description: '빚 없는 출발',
    icon: '🎓',
  },
])
