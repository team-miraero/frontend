// coach 도메인 상태 store: 채팅 메시지 목록 및 입력 상태
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as coachApi from '@/features/coach/api/coach.api'
import { CHAT_ROLES } from '@/features/coach/constants/coach.constants'

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'assistant' | 'user'} role
 * @property {string} content
 * @property {string} createdAt
 */

export const useCoachStore = defineStore('feature-coach', () => {
  /** @type {import('vue').Ref<ChatMessage[]>} */
  const messages = ref([])
  const draftInput = ref('')
  const isSending = ref(false)

  const hasMessages = computed(() => messages.value.length > 0)

  /**
   * @param {'assistant' | 'user'} role
   * @param {string} content
   * @returns {ChatMessage}
   */
  function createMessage(role, content) {
    return {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * @param {string} content
   */
  function initWelcomeMessage(content) {
    if (hasMessages.value) return
    messages.value.push(createMessage(CHAT_ROLES.ASSISTANT, content))
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
    if (!text || isSending.value) return

    messages.value.push(createMessage(CHAT_ROLES.USER, text))
    draftInput.value = ''
    isSending.value = true

    try {
      const reply = await coachApi.sendMessage({ message: text })
      messages.value.push(createMessage(CHAT_ROLES.ASSISTANT, reply.message))
    } finally {
      isSending.value = false
    }
  }

  return {
    messages,
    draftInput,
    isSending,
    initWelcomeMessage,
    setDraftInput,
    sendMessage,
  }
})
