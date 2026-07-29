<!-- 채팅 메시지 버블: assistant/user 역할에 따라 스타일 분기 -->
<template>
  <div class="flex w-full items-end gap-2.5" :class="isUser ? 'justify-end' : 'justify-start'">
    <div v-if="!isUser" class="mb-0.5 shrink-0">
      <div
        class="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#66b2ff] drop-shadow-[0_2px_5px_rgba(0,102,255,0.28)]"
      >
        <img src="@/assets/icons/ai-coach-avatar.svg" alt="" class="size-[13px]" />
      </div>
    </div>

    <div
      class="max-w-[540px] rounded-[20px] px-[17px] py-[13px] text-sm leading-[22.75px] whitespace-pre-wrap"
      :class="
        isUser
          ? 'rounded-tr-[4px] bg-primary text-white'
          : 'rounded-tl-[4px] border border-[#dbeafe] bg-[#f4f8ff] text-[#0a192f]'
      "
    >
      {{ message.content }}
    </div>
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
</script>
