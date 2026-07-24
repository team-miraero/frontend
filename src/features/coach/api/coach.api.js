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

/**
 * @typedef {Object} SendChatMessagePayload
 * @property {string} message
 */

/**
 * @typedef {Object} SendChatMessageResult
 * @property {string} message
 */

/**
 * @param {SendChatMessagePayload} payload
 * @returns {Promise<SendChatMessageResult>}
 */
export async function sendMessage(payload) {
  // TODO: 실제 API 연동 시 client.post('/coach/messages', payload)로 교체
  return {
    message: '말씀해주신 내용을 확인했어요. (AI 코치 응답은 API 연동 후 제공됩니다)',
  }
}
