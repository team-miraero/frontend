<!-- AI 코치 대화방 목록 사이드바: 화면 오른쪽에 배치, 드래그로 폭 조절/접기 가능 -->
<template>
  <div
    ref="containerRef"
    class="relative h-full shrink-0"
    :style="{ width: isCollapsed ? '0px' : `${width}px` }"
    :class="{ 'transition-[width] duration-150 ease-out': !isDragging }"
  >
    <!-- 접힌 상태: 화면 오른쪽 끝에 붙는 펼치기 탭 -->
    <button
      v-if="isCollapsed"
      type="button"
      class="absolute -left-8 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-l-xl border border-r-0 border-slate-200 bg-white text-slate-400 shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:text-primary"
      aria-label="대화 목록 펼치기"
      @click="isCollapsed = false"
    >
      <ChevronIcon direction="left" />
    </button>

    <aside
      v-show="!isCollapsed"
      class="flex h-full w-full flex-col overflow-hidden border-l border-slate-200 bg-white"
    >
      <!-- 새 대화 버튼 + 접기 버튼 -->
      <div class="flex items-center gap-2 border-b border-slate-100 p-4">
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] py-2.5 text-sm font-bold text-primary"
          @click="$emit('create')"
        >
          <img src="@/assets/icons/plus.svg" alt="" class="size-3" />
          새 대화
        </button>
        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
          aria-label="대화 목록 접기"
          @click="isCollapsed = true"
        >
          <ChevronIcon direction="right" />
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
                <path
                  d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"
                />
              </svg>
            </button>
          </div>
        </li>

        <li v-if="conversations.length === 0" class="px-3 py-6 text-center text-xs text-slate-400">
          아직 대화가 없어요
        </li>
      </ul>
    </aside>

    <!-- 드래그로 폭 조절: 사이드바 왼쪽 경계에 배치 -->
    <div
      v-if="!isCollapsed"
      class="absolute -left-1 top-0 h-full w-2 cursor-col-resize select-none"
      @mousedown="startDrag"
    >
      <div class="mx-auto h-full w-px bg-transparent hover:bg-primary/30" />
    </div>
  </div>
</template>

<script setup>
import { h, onBeforeUnmount, ref } from 'vue'

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

const MIN_WIDTH = 200
const MAX_WIDTH = 420
const DEFAULT_WIDTH = 260
const COLLAPSE_THRESHOLD = 140

const containerRef = ref(null)
const width = ref(DEFAULT_WIDTH)
const isCollapsed = ref(false)
const isDragging = ref(false)

function startDrag(event) {
  event.preventDefault()
  isDragging.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', stopDrag)
}

function handleDrag(event) {
  if (!isDragging.value || !containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const nextWidth = rect.right - event.clientX

  if (nextWidth < COLLAPSE_THRESHOLD) {
    isCollapsed.value = true
    return
  }

  isCollapsed.value = false
  width.value = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, nextWidth))
}

function stopDrag() {
  isDragging.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', stopDrag)
}

onBeforeUnmount(stopDrag)

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

// 접기/펼치기 화살표 아이콘 (좌우 방향만 다른 단순 chevron이라 인라인 컴포넌트로 처리)
const ChevronIcon = (props) =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'size-4',
    },
    [
      h('path', {
        d: props.direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6',
      }),
    ]
  )
</script>
