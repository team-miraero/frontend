<!-- AI 코치 대화방 목록 사이드바 -->
<template>
  <aside class="flex h-full w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white">
    <!-- 새 대화 버튼 -->
    <div class="border-b border-slate-100 p-4">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] py-2.5 text-sm font-bold text-primary"
        @click="$emit('create')"
      >
        <img src="@/assets/icons/plus.svg" alt="" class="size-3" />
        새 대화
      </button>
    </div>

    <!-- 대화방 리스트 -->
    <ul class="flex-1 overflow-y-auto p-2">
      <li v-for="conversation in conversations" :key="conversation.conversationId">
        <div
          class="group flex items-center gap-1 rounded-xl px-3 py-2.5"
          :class="
            conversation.conversationId === activeConversationId
              ? 'bg-[#eaf2ff]'
              : 'hover:bg-slate-50'
          "
        >
          <button
            type="button"
            class="min-w-0 flex-1 text-left"
            @click="$emit('select', conversation.conversationId)"
          >
            <p
              class="truncate text-sm font-bold"
              :class="
                conversation.conversationId === activeConversationId
                  ? 'text-primary'
                  : 'text-[#0a192f]'
              "
            >
              {{ conversation.title }}
            </p>
            <p class="truncate text-xs text-slate-400">{{ formatRelativeDate(conversation) }}</p>
          </button>
          <button
            type="button"
            class="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
            aria-label="대화방 삭제"
            @click="$emit('delete', conversation.conversationId)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-3.5"
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
            </svg>
          </button>
        </div>
      </li>

      <li v-if="conversations.length === 0" class="px-3 py-6 text-center text-xs text-slate-400">
        아직 대화가 없어요
      </li>
    </ul>
  </aside>
</template>

<script setup>
defineProps({
  conversations: {
    type: Array,
    default: () => [],
  },
  activeConversationId: {
    type: Number,
    default: null,
  },
})
defineEmits(['create', 'select', 'delete'])

function formatRelativeDate(conversation) {
  const isoDate = conversation.lastMessageAt ?? conversation.createdAt
  const date = new Date(isoDate)
  const now = new Date()
  const isSameDay = date.toDateString() === now.toDateString()

  if (isSameDay) {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}
</script>
