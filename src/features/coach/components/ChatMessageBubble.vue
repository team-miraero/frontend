<template>
  <div class="flex w-full items-end gap-2.5" :class="isUser ? 'justify-end' : 'justify-start'">
    <div v-if="!isUser" class="mb-1 flex size-7 sm:size-8 shrink-0 items-center justify-center">
      <!-- 겉에 파란 동그라미 없이 반짝 별 아이콘만 깔끔하게 사용 -->
      <svg
        class="size-5 sm:size-5.5 text-primary drop-shadow-xs"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round" />
        <path d="M19 17L20.2 19.8L23 21L20.2 22.2L19 25L17.8 22.2L15 21L17.8 19.8L19 17Z" />
        <path d="M19 2L19.8 4.2L22 5L19.8 5.8L19 8L18.2 5.8L16 5L18.2 4.2L19 2Z" />
      </svg>
    </div>

    <div
      v-if="isUser"
      class="max-w-[88%] rounded-[18px] rounded-tr-[4px] bg-primary px-3.5 py-2.5 text-xs leading-[20px] text-white shadow-xs whitespace-pre-wrap break-words sm:max-w-[540px] sm:rounded-[20px] sm:px-[17px] sm:py-[13px] sm:text-sm sm:leading-[22.75px]"
    >
      {{ message.content }}
    </div>

    <div
      v-else
      class="max-w-[88%] rounded-[18px] rounded-tl-[4px] border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs leading-[22px] text-[#0a192f] shadow-2xs whitespace-pre-wrap break-words sm:max-w-[540px] sm:rounded-[20px] sm:px-[17px] sm:py-[13px] sm:text-sm sm:leading-[25px]"
      v-html="formattedAssistantContent"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CHAT_ROLES } from '@/features/coach/constants/coach.constants'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const isUser = computed(() => props.message.role === CHAT_ROLES.USER)

// HTML 이스케이프 (XSS 안전성)
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// AI 코치 응답 포맷터: 내용은 100% 보존하며 [대괄호 소제목] 및 마크다운 헤더를 시인성 높은 파란색 뱃지/소제목으로 변환
const formattedAssistantContent = computed(() => {
  if (!props.message?.content) return ''
  let text = escapeHtml(props.message.content)

  // 1. 마크다운 헤더 (### 소제목, ## 소제목 등) 지원
  text = text.replace(/^(#{1,4})\s*(.+)$/gm, '<span class="block font-bold text-primary text-[13px] sm:text-sm mt-3 mb-1 first:mt-0">$2</span>')

  // 2. **[대괄호]** 및 [대괄호] 소제목 -> 한눈에 팍 들어오는 파란색 뱃지 칩 스타일로 변환
  text = text.replace(/(?:\*\*)?(\[[^\]]+\])(?:\*\*)?/g, '<span class="inline-flex items-center rounded-md bg-blue-50 border border-blue-200/70 px-2 py-0.5 font-bold text-primary text-[12px] sm:text-[13px] my-1 shadow-2xs">$1</span>')

  // 3. 일반 **볼드** 지원
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#0a192f]">$1</strong>')

  return text
})
</script>
