<!-- AI 목표 코치 채팅 페이지 -->
<template>
  <div class="flex h-full">
    <div class="flex h-full flex-1 flex-col bg-[#f8fbff]">
      <!-- AI 코치 상단 채팅 헤더 바 -->
      <div
        class="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3 sm:px-6 md:px-8"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#66b2ff] shadow-sm"
          >
            <img src="@/assets/icons/ai-coach-avatar.svg" alt="" class="size-4" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h1 class="text-sm font-black tracking-[-0.3px] text-[#0a192f] sm:text-base">
                AI 목표 코치
              </h1>
              <span
                class="hidden items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary sm:inline-flex"
              >
                {{ goalLabel ? `${goalLabel} 맞춤 코칭` : '마이데이터 맞춤 코칭' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 truncate max-w-[240px] sm:max-w-md">
              저축 및 목표 달성 페이스를 코칭해드려요
            </p>
          </div>
        </div>

        <!-- 모바일: 대화 목록 열기 버튼 -->
        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="대화 목록 열기"
          @click="isCoachSidebarOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-5"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <!-- 메시지 리스트 (반응형 패딩 및 스크롤) -->
      <div
        ref="messageListRef"
        class="flex-1 space-y-3 overflow-y-auto px-3.5 py-4 sm:space-y-4 sm:px-6 sm:py-6 lg:px-10"
      >
        <LoadingSpinner
          v-if="coachStore.isLoadingMessages && coachStore.messages.length === 0"
          message="대화 내역을 불러오고 있어요"
          sub-message="AI 코칭 데이터를 준비 중이에요."
          container-class="py-20"
        />
        <template v-else>
          <ChatMessageBubble
            v-for="message in coachStore.messages"
            :key="message.id"
            :message="message"
          />

          <!-- AI 답변 생성 중 (생각 중 / 타이핑 인디케이터 말풍선) -->
          <div v-if="coachStore.isSending" class="flex w-full items-end gap-2.5 justify-start">
            <div class="mb-0.5 shrink-0">
              <div
                class="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#66b2ff] drop-shadow-[0_2px_5px_rgba(0,102,255,0.28)]"
              >
                <img src="@/assets/icons/ai-coach-avatar.svg" alt="" class="size-[13px]" />
              </div>
            </div>
            <div
              class="flex items-center gap-1.5 rounded-[18px] rounded-tl-[4px] border border-[#dbeafe] bg-[#f4f8ff] px-4 py-3 shadow-xs text-[#0a192f]"
            >
              <span class="size-2 rounded-full bg-primary/70 animate-bounce" style="animation-delay: 0ms;" />
              <span class="size-2 rounded-full bg-primary/70 animate-bounce" style="animation-delay: 150ms;" />
              <span class="size-2 rounded-full bg-primary/70 animate-bounce" style="animation-delay: 300ms;" />
            </div>
          </div>
        </template>
      </div>

      <!-- 입력 영역 -->
      <CoachChatInput />
    </div>

    <CoachConversationSidebar
      v-model:is-open="isCoachSidebarOpen"
      :conversations="coachStore.conversations"
      :active-conversation-id="coachStore.currentConversationId"
      @create="handleCreateConversation"
      @select="handleSelectConversation"
      @delete="handleDeleteConversation"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useGoalStore } from '@/features/goal'
import { GOAL_TYPES } from '@/shared/constants/goals'
import { useMediaQuery } from '@/shared/composables/useMediaQuery'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'
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

// 대화 목록(모바일 오버레이) 열림 상태 — 데스크톱은 기본 펼침, 모바일은 기본 접힘
const isDesktop = useMediaQuery('(min-width: 1024px)')
const isCoachSidebarOpen = ref(isDesktop.value)

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
  () => [coachStore.messages.length, coachStore.isSending],
  () => scrollToBottom()
)

async function handleCreateConversation() {
  await coachStore.createNewConversation('새 대화', welcomeMessage.value)
  if (!isDesktop.value) isCoachSidebarOpen.value = false
  scrollToBottom()
}

async function handleSelectConversation(conversationId) {
  await coachStore.selectConversation(conversationId)
  if (!isDesktop.value) isCoachSidebarOpen.value = false
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
