// 히어로 스토리보드 6단계: 아이콘 + 문구 데이터 (마지막 단계는 강조 스타일)
/**
 * @typedef {Object} HeroStoryStep
 * @property {string} label
 * @property {string} iconPath
 * @property {boolean} [final]
 */

/** @type {HeroStoryStep[]} */
export const STORY_STEPS = [
  {
    label: '로드맵을 준비하고 있어요',
    iconPath:
      'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
  {
    label: '현재 페이스를 분석 중이에요',
    iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    label: '목표까지 함께할게요!',
    iconPath:
      'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
  },
  {
    label: '목표 도착!',
    iconPath: 'M9 12.75l2.25 2.25 4.5-4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    final: true,
  },
]
