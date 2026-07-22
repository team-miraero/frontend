// roadmap 도메인 API 함수 골격: 로드맵 대시보드 (DASH-01~09)

/**
 * @typedef {'시작' | '탄력' | '가속' | '결승'} JourneyStage
 */

/**
 * @typedef {Object} Milestone
 * @property {string} id
 * @property {string} label
 * @property {number} targetAmount
 * @property {boolean} achieved
 * @property {string} achievedAt
 */

/**
 * @typedef {Object} Roadmap
 * @property {string} goalId
 * @property {JourneyStage} currentStage
 * @property {number} progressRate
 * @property {Milestone[]} milestones
 */

/**
 * @param {string} goalId
 * @returns {Promise<Roadmap>}
 */
export async function getRoadmap(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/goals/${goalId}/roadmap`)로 교체
  return { goalId: '', currentStage: '시작', progressRate: 0, milestones: [] }
}

/**
 * @param {string} goalId
 * @returns {Promise<Milestone[]>}
 */
export async function getMilestones(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/goals/${goalId}/milestones`)로 교체
  return []
}
