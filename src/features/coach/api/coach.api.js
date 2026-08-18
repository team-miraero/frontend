// coach 도메인 API 함수: AI 목표 코치 대화방 CRUD + 메시지
// 이 도메인 API만 응답이 { success, data, error } 형태로 감싸져 있어서
// (다른 feature들은 평평한 JSON을 바로 반환), 여기서 data만 꺼내 반환한다.
import { client } from '@/shared/api/client'

/**
 * @typedef {Object} Conversation
 * @property {number} conversationId
 * @property {string} title
 * @property {string | null} lastMessageAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * 새 대화방 생성
 * @param {string} [title]
 * @returns {Promise<Conversation>}
 */
export async function createConversation(title) {
  const { data } = await client.post('/ai-coach/conversations', null, { params: { title } })
  return data.data
}

/**
 * 대화방 목록 조회
 * @returns {Promise<Conversation[]>}
 */
export async function getConversations() {
  const { data } = await client.get('/ai-coach/conversations')
  return data.data.conversations
}

/**
 * @typedef {Object} ChatMessageDto
 * @property {number} messageId
 * @property {'USER' | 'ASSISTANT'} senderType
 * @property {string} content
 * @property {string} createdAt
 */

/**
 * 특정 대화방의 메시지 목록 조회
 * @param {number} conversationId
 * @returns {Promise<{ conversation: Conversation, messages: ChatMessageDto[] }>}
 */
export async function getConversationMessages(conversationId) {
  const { data } = await client.get(`/ai-coach/conversations/${conversationId}/messages`)
  return data.data
}

/**
 * 대화방 삭제
 * @param {number} conversationId
 * @returns {Promise<{ conversationId: number }>}
 */
export async function deleteConversation(conversationId) {
  const { data } = await client.delete(`/ai-coach/conversations/${conversationId}`)
  return data.data
}

/**
 * @typedef {Object} SendChatMessagePayload
 * @property {number} conversationId
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
  const { data } = await client.post(`/ai-coach/conversations/${payload.conversationId}/messages`, {
    content: payload.message,
  })
  return {
    message: data?.data?.assistantMessage?.content ?? '',
  }
}
