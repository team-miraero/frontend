// coach 도메인 API 함수: AI 목표 코치 대화방 CRUD + 메시지
import { client } from '@/shared/api/client'
import { unwrapApiData } from '@/shared/api/unwrapApiData'

/**
 * @typedef {Object} Conversation
 * @property {number} conversationId
 * @property {string} title
 * @property {string | null} lastMessageAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ChatMessageDto
 * @property {number} messageId
 * @property {'USER' | 'ASSISTANT'} senderType
 * @property {string} content
 * @property {string} createdAt
 */

/**
 * 최근 대화 조회 (GET /ai-coach/conversations/latest)
 * @returns {Promise<{ conversation: Conversation | null, messages: ChatMessageDto[] }>}
 */
export async function getLatestConversation() {
  const { data } = await client.get('/ai-coach/conversations/latest')
  return unwrapApiData(data)
}

/**
 * 새 대화방 생성 (POST /ai-coach/conversations)
 * @param {string} [title]
 * @returns {Promise<Conversation>}
 */
export async function createConversation(title) {
  const { data } = await client.post('/ai-coach/conversations', null, {
    params: title ? { title } : undefined,
  })
  return unwrapApiData(data)
}

/**
 * 대화방 목록 조회 (GET /ai-coach/conversations)
 * @returns {Promise<Conversation[]>}
 */
export async function getConversations() {
  const { data } = await client.get('/ai-coach/conversations')
  const unwrapped = unwrapApiData(data)
  return unwrapped?.conversations ?? []
}

/**
 * 특정 대화방의 정보 및 메시지 목록 조회 (GET /ai-coach/conversations/{conversationId}/messages)
 * @param {number} conversationId
 * @returns {Promise<{ conversation: Conversation, messages: ChatMessageDto[] }>}
 */
export async function getConversationMessages(conversationId) {
  const { data } = await client.get(`/ai-coach/conversations/${conversationId}/messages`)
  return unwrapApiData(data)
}

/**
 * 대화방 삭제 (DELETE /ai-coach/conversations/{conversationId})
 * @param {number} conversationId
 * @returns {Promise<unknown>}
 */
export async function deleteConversation(conversationId) {
  const { data } = await client.delete(`/ai-coach/conversations/${conversationId}`)
  return unwrapApiData(data)
}

/**
 * @typedef {Object} SendChatMessagePayload
 * @property {number} conversationId
 * @property {string} message
 */

/**
 * @typedef {Object} SendChatMessageResult
 * @property {number} conversationId
 * @property {ChatMessageDto} userMessage
 * @property {ChatMessageDto} assistantMessage
 */

/**
 * 메시지 전송 및 AI 응답 수신 (POST /ai-coach/conversations/{conversationId}/messages)
 * @param {SendChatMessagePayload} payload
 * @returns {Promise<SendChatMessageResult>}
 */
export async function sendMessage(payload) {
  const { data } = await client.post(
    `/ai-coach/conversations/${payload.conversationId}/messages`,
    { content: payload.message }
  )
  return unwrapApiData(data)
}
