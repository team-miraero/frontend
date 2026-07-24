<!-- AI 코치 채팅 입력창: 추천 질문 칩 + 텍스트 입력 + 전송 -->
<template>
  <div class="border-t border-[#e8effe] bg-white px-10 pt-3 pb-6">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="prompt in SUGGESTED_PROMPTS"
        :key="prompt"
        type="button"
        class="rounded-full border border-[#66b2ff] px-[15px] py-[7px] text-xs font-bold text-primary disabled:opacity-50"
        :disabled="coachStore.isSending"
        @click="coachStore.sendMessage(prompt)"
      >
        {{ prompt }}
      </button>
    </div>

    <div
      class="mt-3 flex items-end gap-3 rounded-[18px] border border-[#dbeafe] bg-[#f8fbff] px-[17px] py-[13px] drop-shadow-[0_2px_6px_rgba(0,102,255,0.06)]"
    >
      <textarea
        v-model="draftInput"
        rows="1"
        placeholder="저축·목표 관련 질문을 자유롭게 입력하세요..."
        class="min-h-6 max-h-[120px] flex-1 resize-none bg-transparent text-sm leading-[21.7px] text-[#0a192f] placeholder:text-[rgba(10,25,47,0.5)] focus:outline-none"
        @input="autoGrow"
        @keydown.enter.exact.prevent="handleSend"
      />
      <button
        type="button"
        class="flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors"
        :class="canSend ? 'bg-primary' : 'bg-slate-200'"
        :disabled="!canSend"
        @click="handleSend"
      >
        <img src="@/assets/icons/send.svg" alt="전송" class="size-[15px]" />
      </button>
    </div>

    <p class="pt-2 text-center text-xs text-slate-300">
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
