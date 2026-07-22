// coach 도메인 API 함수 골격 (COACH-01)

/**
 * @typedef {Object} CoachingMessage
 * @property {string} id
 * @property {string} message
 * @property {string} type
 */

/**
 * @param {string} goalId
 * @returns {Promise<CoachingMessage[]>}
 */
export async function getCoachingMessages(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/goals/${goalId}/coaching`)로 교체
  return []
}
