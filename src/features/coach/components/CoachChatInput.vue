<template>
  <div class="border-t border-[#e8effe] bg-white px-3.5 pt-2.5 pb-3 sm:px-6 sm:pt-3 sm:pb-5 lg:px-10">
    <!-- 추천 질문 칩: 모바일에선 가로 스크롤 탭, 태블릿 이상에선 flex-wrap -->
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap sm:pb-0">
      <button
        v-for="prompt in SUGGESTED_PROMPTS"
        :key="prompt"
        type="button"
        class="shrink-0 rounded-full border border-primary/30 bg-[#f4f8ff] px-3 py-1 text-xs font-bold text-primary shadow-2xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-primary/10 hover:border-primary/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5 sm:py-1.5 cursor-pointer select-none"
        :disabled="coachStore.isSending"
        @click="coachStore.sendMessage(prompt)"
      >
        {{ prompt }}
      </button>
    </div>

    <!-- 입력창 및 전송 버튼 (상하 여백 및 수직 정렬 완벽 대칭) -->
    <div
      class="mt-2.5 flex items-center gap-2 rounded-[20px] border border-[#dbeafe] bg-[#f8fbff] px-3.5 py-2 shadow-xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 sm:mt-3 sm:px-4 sm:py-2.5"
    >
      <textarea
        v-model="draftInput"
        rows="1"
        placeholder="저축·목표 관련 질문을 자유롭게 입력하세요..."
        class="min-h-[22px] max-h-[110px] flex-1 resize-none bg-transparent py-1 text-xs leading-[20px] text-[#0a192f] placeholder:text-slate-400 focus:outline-none sm:min-h-[24px] sm:py-1 sm:text-sm sm:leading-[22px]"
        @input="autoGrow"
        @keydown.enter.exact.prevent="handleSend"
      />
      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-xl transition-all active:scale-90 sm:size-9 cursor-pointer"
        :class="
          canSend
            ? 'bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary/90'
            : 'bg-slate-200 text-slate-400'
        "
        :disabled="!canSend"
        aria-label="메시지 전송"
        @click="handleSend"
      >
        <svg
          class="size-4 transition-transform duration-150"
          :class="canSend ? '-translate-y-0.5' : ''"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </div>

    <p class="pt-1.5 text-center text-[10px] text-slate-400 sm:pt-2 sm:text-xs">
      저축·목표 관리 상담만 해요 — 투자 종목 추천·매매 조언은 제공하지 않아요
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCoachStore } from '@/features/coach/store/coach.store'
import { SUGGESTED_PROMPTS } from '@/features/coach/constants/coach.constants'

const coachStore = useCoachStore()

const draftInput = computed({
  get: () => coachStore.draftInput,
  set: (value) => coachStore.setDraftInput(value),
})

const canSend = computed(() => draftInput.value.trim().length > 0 && !coachStore.isSending)

function autoGrow(event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}

function handleSend() {
  if (!canSend.value) return
  coachStore.sendMessage()
}
</script>
