<!-- AI 목표 코치 채팅 페이지 -->
<template>
  <div class="flex h-full">
    <CoachConversationSidebar
      :conversations="coachStore.conversations"
      :active-conversation-id="coachStore.currentConversationId"
      @create="handleCreateConversation"
      @select="handleSelectConversation"
      @delete="handleDeleteConversation"
    />

    <div class="flex h-full flex-1 flex-col bg-[#f8fbff]">
      <!-- 인트로 -->
      <div class="border-b border-slate-200 bg-white px-10 py-6">
        <div class="flex items-start gap-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#66b2ff] drop-shadow-[0_4px_7px_rgba(0,102,255,0.22)]"
          >
            <img src="@/assets/icons/ai-coach-avatar.svg" alt="" class="size-[18px]" />
          </div>
          <div>
            <h1 class="text-xl font-black tracking-[-0.4px] text-[#0a192f]">AI 목표 코치</h1>
            <p class="pt-1 text-sm leading-[22.75px] text-[#4a5568]">
              내 자산(마이데이터)과 목표를 바탕으로
              <strong class="font-bold">"이거 써도 될까?"</strong>,
              <strong class="font-bold">"저축 금액이 밀렸는데 페이스 회복 가능해?"</strong>,
              <strong class="font-bold">"목표 언제 도달해?"</strong>
              같은 궁금증에 답해드려요.
            </p>
            <div class="flex items-center gap-1.5 pt-2">
              <span class="size-1.5 shrink-0 rounded-full bg-amber-500" />
              <p class="text-xs text-slate-500">
                저축·목표 관리 상담만 해요. 투자 종목 추천이나 매매 조언은 하지 않아요.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 메시지 리스트 -->
      <div ref="messageListRef" class="flex-1 space-y-4 overflow-y-auto px-10 py-6">
        <ChatMessageBubble
          v-for="message in coachStore.messages"
          :key="message.id"
          :message="message"
        />
      </div>

      <!-- 입력 영역 -->
      <CoachChatInput />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useGoalStore } from '@/features/goal'
import { GOAL_TYPES } from '@/shared/constants/goals'
import {
  useCoachStore,
  ChatMessageBubble,
  CoachChatInput,
  CoachConversationSidebar,
} from '@/features/coach'

const authStore = useAuthStore()
const goalStore = useGoalStore()
const coachStore = useCoachStore()

const messageListRef = ref(null)

const userName = computed(() => authStore.user?.name ?? '')
const goalLabel = computed(
  () => GOAL_TYPES.find((type) => type.id === goalStore.selectedGoalType)?.label ?? ''
)

// TODO: goal store에 목표 title 전용 필드가 생기면 selectedGoalType 대신 그 필드로 교체
const welcomeMessage = computed(() => {
  const greeting = userName.value ? `안녕하세요 ${userName.value}님 👋 ` : '안녕하세요 👋 '
  const goalPart = goalLabel.value ? `${goalLabel.value} 목표를 함께 관리하는 코치예요. ` : ''
  return `${greeting}${goalPart}무엇이 궁금하세요?`
})

function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

watch(
  () => coachStore.messages.length,
  () => scrollToBottom()
)

async function handleCreateConversation() {
  await coachStore.createNewConversation('새 대화', welcomeMessage.value)
  scrollToBottom()
}

async function handleSelectConversation(conversationId) {
  await coachStore.selectConversation(conversationId)
  scrollToBottom()
}

async function handleDeleteConversation(conversationId) {
  const wasActive = coachStore.currentConversationId === conversationId
  // eslint-disable-next-line no-alert
  if (!window.confirm('이 대화를 삭제할까요? 삭제하면 되돌릴 수 없어요.')) return

  await coachStore.removeConversation(conversationId)

  if (!wasActive) return

  // 삭제한 대화방이 보고 있던 대화방이면, 남은 대화방 중 최신 것으로 전환하거나 새로 만듦
  if (coachStore.conversations.length > 0) {
    await coachStore.selectConversation(coachStore.conversations[0].conversationId)
  } else {
    await coachStore.createNewConversation('새 대화', welcomeMessage.value)
  }
}

onMounted(async () => {
  await coachStore.fetchConversations()

  if (coachStore.conversations.length > 0) {
    await coachStore.selectConversation(coachStore.conversations[0].conversationId)
  } else {
    await coachStore.createNewConversation('새 대화', welcomeMessage.value)
  }

  scrollToBottom()
})
</script>
