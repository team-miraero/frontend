// coach 도메인 상태 store: 대화방 목록 + 현재 대화방의 메시지
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as coachApi from '@/features/coach/api/coach.api'
import { CHAT_ROLES } from '@/features/coach/constants/coach.constants'

/**
 * @typedef {Object} ChatMessage
 * @property {number | string} id
 * @property {'assistant' | 'user'} role
 * @property {string} content
 * @property {string} createdAt
 */

export const useCoachStore = defineStore('feature-coach', () => {
  /** @type {import('vue').Ref<import('@/features/coach/api/coach.api').Conversation[]>} */
  const conversations = ref([])
  /** @type {import('vue').Ref<number | null>} */
  const currentConversationId = ref(null)
  /** @type {import('vue').Ref<ChatMessage[]>} */
  const messages = ref([])
  const draftInput = ref('')
  const isSending = ref(false)
  const isLoadingConversations = ref(false)
  const isLoadingMessages = ref(false)

  /**
   * @param {'assistant' | 'user'} role
   * @param {string} content
   * @returns {ChatMessage}
   */
  function createLocalMessage(role, content) {
    return {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * @param {'USER' | 'ASSISTANT'} senderType
   */
  function mapSenderType(senderType) {
    return senderType === 'USER' ? CHAT_ROLES.USER : CHAT_ROLES.ASSISTANT
  }

  async function fetchConversations() {
    isLoadingConversations.value = true
    try {
      conversations.value = await coachApi.getConversations()
    } finally {
      isLoadingConversations.value = false
    }
  }

  /**
   * @param {number} conversationId
   */
  async function selectConversation(conversationId) {
    if (currentConversationId.value === conversationId) return
    currentConversationId.value = conversationId
    draftInput.value = ''
    isLoadingMessages.value = true
    try {
      const result = await coachApi.getConversationMessages(conversationId)
      messages.value = result.messages.map((item) => ({
        id: item.messageId,
        role: mapSenderType(item.senderType),
        content: item.content,
        createdAt: item.createdAt,
      }))
    } finally {
      isLoadingMessages.value = false
    }
  }

  /**
   * @param {string} title
   * @param {string} [welcomeContent] 새 대화방 진입 시 보여줄 인사말 — 서버엔 저장되지 않는 클라이언트 전용 표시
   */
  async function createNewConversation(title, welcomeContent) {
    const conversation = await coachApi.createConversation(title)
    conversations.value = [conversation, ...conversations.value]
    currentConversationId.value = conversation.conversationId
    draftInput.value = ''
    messages.value = welcomeContent
      ? [createLocalMessage(CHAT_ROLES.ASSISTANT, welcomeContent)]
      : []
  }

  /**
   * @param {number} conversationId
   */
  async function removeConversation(conversationId) {
    await coachApi.deleteConversation(conversationId)
    conversations.value = conversations.value.filter((c) => c.conversationId !== conversationId)

    if (currentConversationId.value === conversationId) {
      currentConversationId.value = null
      messages.value = []
    }
  }

  /**
   * @param {string} value
   */
  function setDraftInput(value) {
    draftInput.value = value
  }

  /**
   * @param {string} [content] 생략 시 draftInput을 사용
   */
  async function sendMessage(content) {
    const text = (content ?? draftInput.value).trim()
    if (!text || isSending.value || !currentConversationId.value) return

    messages.value.push(createLocalMessage(CHAT_ROLES.USER, text))
    draftInput.value = ''
    isSending.value = true

    try {
      const reply = await coachApi.sendMessage({
        conversationId: currentConversationId.value,
        message: text,
      })
      messages.value.push(createLocalMessage(CHAT_ROLES.ASSISTANT, reply.message))
    } finally {
      isSending.value = false
    }
  }

  return {
    conversations,
    currentConversationId,
    messages,
    draftInput,
    isSending,
    isLoadingConversations,
    isLoadingMessages,
    fetchConversations,
    selectConversation,
    createNewConversation,
    removeConversation,
    setDraftInput,
    sendMessage,
  }
})
