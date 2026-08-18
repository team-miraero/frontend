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
      messages.value = (result.messages ?? []).map((item) => ({
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
   * 최근 대화를 불러오거나 기존 대화가 없으면 새 대화방 생성
   * @param {string} [welcomeContent]
   */
  async function loadInitialConversation(welcomeContent) {
    isLoadingMessages.value = true
    try {
      const result = await coachApi.getLatestConversation()
      if (result?.conversation) {
        currentConversationId.value = result.conversation.conversationId
        messages.value = (result.messages ?? []).map((item) => ({
          id: item.messageId,
          role: mapSenderType(item.senderType),
          content: item.content,
          createdAt: item.createdAt,
        }))
      } else {
        await createNewConversation('새 대화', welcomeContent)
      }
    } finally {
      isLoadingMessages.value = false
    }
  }

  /**
   * @param {string} title
   * @param {string} [welcomeContent] 새 대화방 진입 시 보여줄 인사말
   */
  async function createNewConversation(title = '새 대화', welcomeContent) {
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

    const tempId = crypto.randomUUID()
    messages.value.push({
      id: tempId,
      role: CHAT_ROLES.USER,
      content: text,
      createdAt: new Date().toISOString(),
    })
    draftInput.value = ''
    isSending.value = true

    try {
      const result = await coachApi.sendMessage({
        conversationId: currentConversationId.value,
        message: text,
      })

      // 서버 응답의 userMessage로 임시 메시지 ID/데이터 동기화
      const userIndex = messages.value.findIndex((m) => m.id === tempId)
      if (userIndex !== -1 && result?.userMessage) {
        messages.value[userIndex] = {
          id: result.userMessage.messageId,
          role: CHAT_ROLES.USER,
          content: result.userMessage.content,
          createdAt: result.userMessage.createdAt,
        }
      }

      // 서버 응답의 assistantMessage 추가
      if (result?.assistantMessage) {
        messages.value.push({
          id: result.assistantMessage.messageId,
          role: CHAT_ROLES.ASSISTANT,
          content: result.assistantMessage.content,
          createdAt: result.assistantMessage.createdAt,
        })
      }

      // 사이드바 해당 대화방의 lastMessageAt 업데이트
      const conv = conversations.value.find(
        (c) => c.conversationId === currentConversationId.value
      )
      if (conv && result?.assistantMessage) {
        conv.lastMessageAt = result.assistantMessage.createdAt
        conv.updatedAt = result.assistantMessage.createdAt
      }
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
    loadInitialConversation,
    createNewConversation,
    removeConversation,
    setDraftInput,
    sendMessage,
  }
})
