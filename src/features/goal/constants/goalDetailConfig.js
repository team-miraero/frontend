// GOAL-02(목표 구체화) 화면을 목표 프리셋별로 다르게 그리기 위한 설정
import { GOAL_PRESET_IDS } from '@/features/goal/constants/goal.constants.js'

/**
 * @typedef {Object} GoalDetailConfig
 * @property {string} title 화면 타이틀 (줄바꿈은 \n)
 * @property {string} amountLabel 목표금액 입력 카드 라벨
 * @property {{label: string, value: number}[]} amountPresets 금액 프리셋 칩
 * @property {number} defaultAmount 금액 기본값
 * @property {string} periodLabel 기간 카드 라벨
 * @property {number} periodMin
 * @property {number} periodMax
 * @property {number} periodDefault
 * @property {{label: string, value: number}[]} periodPresets 기간 프리셋 칩 (빈 배열이면 슬라이더만)
 * @property {boolean} showTargetDate 기간 카드에 목표 달성 예정일 캡션 표시 여부
 * @property {boolean} showPeriodFormula 결과 박스에 "금액 ÷ 기간" 수식 캡션 표시 여부
 */

/** @type {Record<string, GoalDetailConfig>} */
export const GOAL_DETAIL_CONFIG = {
  [GOAL_PRESET_IDS.INDEPENDENCE]: {
    title: '얼마를, 언제까지\n모을까요?',
    amountLabel: '보증금 목표금액',
    amountPresets: [
      { label: '1,000만원', value: 10000000 },
      { label: '2,000만원', value: 20000000 },
      { label: '3,000만원', value: 30000000 },
      { label: '5,000만원', value: 50000000 },
    ],
    defaultAmount: 30000000,
    periodLabel: '목표 기간',
    periodMin: 6,
    periodMax: 60,
    periodDefault: 24,
    periodPresets: [
      { label: '6개월', value: 6 },
      { label: '1년', value: 12 },
      { label: '2년', value: 24 },
      { label: '3년', value: 36 },
    ],
    showTargetDate: true,
    showPeriodFormula: false,
  },
  [GOAL_PRESET_IDS.EMERGENCY]: {
    title: '비상금, 몇 개월치\n모을까요?',
    amountLabel: '목표금액',
    amountPresets: [
      { label: '300만원', value: 3000000 },
      { label: '500만원', value: 5000000 },
      { label: '1,000만원', value: 10000000 },
    ],
    defaultAmount: 5000000,
    periodLabel: '모으는 기간',
    periodMin: 1,
    periodMax: 36,
    periodDefault: 12,
    periodPresets: [
      { label: '3개월', value: 3 },
      { label: '6개월', value: 6 },
      { label: '1년', value: 12 },
      { label: '2년', value: 24 },
    ],
    showTargetDate: false,
    showPeriodFormula: true,
  },
}

export const DEFAULT_GOAL_DETAIL_CONFIG = GOAL_DETAIL_CONFIG[GOAL_PRESET_IDS.INDEPENDENCE]
