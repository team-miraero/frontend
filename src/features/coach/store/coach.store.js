// coach 도메인 상태 store: 대화방 목록 + 현재 대화방의 메시지
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as coachApi from '@/features/coach/api/coach.api'
import { CHAT_ROLES } from '@/features/coach/constants/coach.constants'
import { useAuthStore } from '@/stores/auth.store'

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

  function $reset() {
    conversations.value = []
    currentConversationId.value = null
    messages.value = []
    draftInput.value = ''
    isSending.value = false
    isLoadingConversations.value = false
    isLoadingMessages.value = false
  }

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
   * @param {string | null | undefined} senderType
   */
  function mapSenderType(senderType) {
    if (!senderType) return CHAT_ROLES.ASSISTANT
    const upper = String(senderType).toUpperCase()
    return upper === 'USER' ? CHAT_ROLES.USER : CHAT_ROLES.ASSISTANT
  }

  async function fetchConversations() {
    isLoadingConversations.value = true
    try {
      const res = await coachApi.getConversations()
      const rawList = Array.isArray(res) ? res : []
      conversations.value = rawList.map((c) => ({
        conversationId: c.aiCoachConversationId ?? c.conversationId ?? c.id,
        title: c.title ?? '새 대화',
        createdAt: c.createdAt,
        lastMessageAt: c.lastMessageAt ?? null,
        ...c,
      }))
    } catch (err) {
      conversations.value = []
      throw err
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
      const rawMessages = Array.isArray(result) ? result : (result?.messages ?? [])
      messages.value = rawMessages.map((item) => ({
        id: item.aiCoachMessageId ?? item.messageId ?? item.id ?? crypto.randomUUID(),
        role: mapSenderType(item.senderType ?? item.role),
        content: item.content ?? item.message ?? '',
        createdAt: item.createdAt ?? new Date().toISOString(),
      }))
    } catch (err) {
      messages.value = []
      throw err
    } finally {
      isLoadingMessages.value = false
    }
  }

  /**
   * @param {string} [welcomeContent] 새 대화방 진입 시 보여줄 인사말 — 서버엔 저장되지 않는 클라이언트 전용 표시
   */
  async function createNewConversation(welcomeContent) {
    const res = await coachApi.createConversation()
    const newConvId = res?.aiCoachConversationId ?? res?.conversationId ?? res?.id ?? Date.now()
    const conversation = {
      conversationId: newConvId,
      title: res?.title ?? '새 대화',
      createdAt: res?.createdAt ?? new Date().toISOString(),
      lastMessageAt: res?.lastMessageAt ?? null,
      ...res,
    }
    conversations.value = [conversation, ...conversations.value]
    currentConversationId.value = newConvId
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
    conversations.value = conversations.value.filter(
      (c) => (c.aiCoachConversationId ?? c.conversationId) !== conversationId
    )

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
    messages.value.push(createLocalMessage(CHAT_ROLES.ASSISTANT, ''))
    const assistantMessage = messages.value[messages.value.length - 1]
    draftInput.value = ''
    isSending.value = true

    try {
      const completedMessage = await coachApi.sendMessageStream(
        {
          conversationId: currentConversationId.value,
          message: text,
        },
        useAuthStore().accessToken,
        {
          onDelta: (delta) => {
            assistantMessage.content += delta
          },
        }
      )
      assistantMessage.id = completedMessage.aiCoachMessageId ?? assistantMessage.id
      assistantMessage.content = completedMessage.content ?? assistantMessage.content
      assistantMessage.createdAt = completedMessage.createdAt ?? assistantMessage.createdAt
    } catch (err) {
      messages.value = messages.value.filter((message) => message.id !== assistantMessage.id)
      throw err
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
    $reset,
  }
})
