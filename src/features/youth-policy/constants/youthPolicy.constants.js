/**
 * @typedef {Object} PolicyCategory
 * @property {string} id
 * @property {string} label
 * @property {string} keyword 목록 조회 API에 keyword 파라미터로 그대로 넘기는 값 (전체는 빈 문자열)
 */

export const POLICY_CATEGORY_IDS = Object.freeze({
  ALL: 'ALL',
  JOB: 'JOB',
  HOUSING: 'HOUSING',
  FINANCE: 'FINANCE',
  WELFARE: 'WELFARE',
  EDUCATION: 'EDUCATION',
  CULTURE: 'CULTURE',
})

/** @type {ReadonlyArray<PolicyCategory>} */
export const POLICY_CATEGORIES = Object.freeze([
  { id: POLICY_CATEGORY_IDS.ALL, label: '전체', keyword: '' },
  { id: POLICY_CATEGORY_IDS.JOB, label: '일자리', keyword: '일자리' },
  { id: POLICY_CATEGORY_IDS.HOUSING, label: '주거', keyword: '주거지원' },
  { id: POLICY_CATEGORY_IDS.FINANCE, label: '금융', keyword: '금융' },
  { id: POLICY_CATEGORY_IDS.WELFARE, label: '복지', keyword: '복지' },
  { id: POLICY_CATEGORY_IDS.EDUCATION, label: '교육', keyword: '교육' },
  { id: POLICY_CATEGORY_IDS.CULTURE, label: '문화', keyword: '문화' },
])

export const DEFAULT_PAGE_SIZE = 10

// 조건 일치 정책은 첫 화면에서 3개만 미리 보고, 전체보기에서는 6개씩 탐색한다.
export const RECOMMENDED_PREVIEW_SIZE = 3
export const RECOMMENDED_PAGE_SIZE = 6

/** @type {ReadonlyArray<string>} */
export const POLICY_REGIONS = Object.freeze([
  '전체',
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
])
