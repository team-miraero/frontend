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
    description: '보증금부터 월세, 이사 비용까지 나만의 공간을 만들기 위한 첫걸음',
    icon: '🏠',
  },
  {
    id: GOAL_PRESET_IDS.EMERGENCY,
    title: '비상금·첫 목돈',
    description: '갑작스러운 지출에 대비하고 든든한 시드머니를 모으기 위한 기본 자금',
    icon: '💰',
  },
  {
    id: GOAL_PRESET_IDS.MARRIAGE,
    title: '결혼자금',
    description: '일생의 가장 특별한 시작인 결혼식과 신혼 보금자리를 위한 자비로운 준비',
    icon: '💍',
  },
  {
    id: GOAL_PRESET_IDS.STUDENT_LOAN,
    title: '학자금 대출 상환',
    description: '미래를 향해 더 가볍게 날아오르기 위한 학자금 대출 완전 상환 계획',
    icon: '🎓',
  },
])
