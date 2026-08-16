/**
 * @typedef {Object} GoalPreset
 * @property {string} id - 목표 프리셋 고유 ID
 * @property {string} title - 목표 프리셋 제목
 * @property {string} description - 목표 프리셋 설명
 * @property {string} icon - 목표 프리셋 아이콘 (이모지 또는 아이콘명)
 * @property {boolean} [isRecommended] - 첫 시작 추천 여부
 * @property {string} [badgeText] - 추천 뱃지 문구
 * @property {string[]} [tags] - 목표 특성 태그 목록
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

export const GOAL_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
})

/**
 * 4가지 목표 프리셋 데이터 상수
 * @type {ReadonlyArray<GoalPreset>}
 */
export const GOAL_PRESETS = Object.freeze([
  {
    id: GOAL_PRESET_IDS.EMERGENCY,
    title: '비상금',
    description: '예상치 못한 지출과 생활비 대비',
    icon: '💰',
    isRecommended: false,
    badgeText: null,
    tags: ['초년생 필수', '3~6개월 생활비', '종잣돈 첫걸음'],
    guideInfo: '아직 뚜렷한 목표가 없거나, 갑작스러운 지출에 대비해 생활비를 모으는 분께 추천해요.',
  },
  {
    id: GOAL_PRESET_IDS.INDEPENDENCE,
    title: '독립자금',
    description: '나만의 첫 보증금과 자취 준비',
    icon: '🏠',
    isRecommended: false,
    badgeText: null,
    tags: ['보증금 마련', '1인가구 독립', '중기 목표'],
    guideInfo: '첫 자취 독립이나 전세 보증금 등 나만의 보금자리를 준비하는 분께 추천해요.',
  },
  {
    id: GOAL_PRESET_IDS.STUDENT_LOAN,
    title: '학자금 대출 상환',
    description: '이자 부담을 줄이는 부채 상환',
    icon: '🎓',
    isRecommended: false,
    badgeText: null,
    tags: ['이자 절감', '신용점수 관리', '부채 제로'],
    guideInfo: '대출 이자 부담을 줄이고 원금을 계획적으로 빠르게 갚고 싶은 분께 추천해요.',
  },
  {
    id: GOAL_PRESET_IDS.MARRIAGE,
    title: '결혼자금',
    description: '새로운 출발을 위한 목돈 마련',
    icon: '💍',
    isRecommended: false,
    badgeText: null,
    tags: ['미래 자산', '안정형 저축', '중장기 목표'],
    guideInfo: '결혼식과 신혼 준비를 위해 안정적으로 목돈을 마련하고 싶은 분께 추천해요.',
  },
])
