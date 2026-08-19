<template>
  <div
    role="radio"
    tabindex="0"
    :aria-checked="isSelected"
    class="group relative flex w-full flex-col justify-between p-5 rounded-2xl transition-all duration-200 ease-out text-left select-none border-2 cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 active:scale-[0.98]"
    style="-webkit-tap-highlight-color: transparent"
    :class="[
      isSelected
        ? 'border-[#0066FF] bg-[#EBF3FF] shadow-md -translate-y-1'
        : 'border-slate-200/90 bg-white hover:-translate-y-1 hover:border-primary/40 hover:shadow-md',
    ]"
    @click="$emit('select')"
    @keydown.space.prevent="$emit('select')"
    @keydown.enter.prevent="$emit('select')"
  >
    <!-- 상단 영역: 아이콘 / 우측 동그라미 체크마크 (일렬 정렬) -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <!-- 아이콘 둥근 박스 -->
      <div
        class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0"
        :class="isSelected ? 'bg-white shadow-xs' : 'bg-[#EBF3FF]'"
      >
        <GoalTypeIcon :goal-type="id" size="lg" class="text-[#0066FF]" />
      </div>

      <!-- 우측 동그라미 선택 체크마크 -->
      <div
        class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shrink-0"
        :class="
          isSelected
            ? 'bg-[#0066FF] text-white shadow-xs scale-100'
            : 'border-2 border-gray-300 bg-white text-transparent scale-90 group-hover:border-gray-400'
        "
      >
        <svg class="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <!-- (i) 툴팁 팝오버 (산뜻한 화이트 카드) -->
    <div
      v-if="isTooltipOpen"
      class="absolute left-3 right-3 top-3 z-30 animate-fade-in-up rounded-2xl border border-blue-200 bg-white p-3.5 text-xs leading-relaxed text-gray-800 shadow-xl ring-1 ring-black/5"
      @click.stop
    >
      <div class="flex items-start justify-between gap-2">
        <p class="text-xs font-medium leading-relaxed text-gray-700 break-keep">
          <span class="inline-flex items-center gap-1 font-bold text-[#0066FF]">
            <AppIcon name="lightbulb" size="sm" /> 누구에게 맞을까요? </span
          ><br />
          {{ guideInfo }}
        </p>
        <button
          type="button"
          class="shrink-0 text-gray-400 hover:text-gray-700 text-xs font-bold px-1"
          @click.stop="isTooltipOpen = false"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 텍스트 영역: 타이틀 + i 버튼 + 1줄 설명 -->
    <div class="mt-1">
      <div class="flex items-center gap-1.5 mb-1">
        <h3
          class="text-base sm:text-lg font-bold transition-colors"
          :class="isSelected ? 'text-[#0066FF]' : 'text-gray-900'"
        >
          {{ title }}
        </h3>

        <!-- (i) 정보 가이드 버튼 -->
        <button
          v-if="guideInfo"
          type="button"
          class="inline-flex size-6 items-center justify-center -m-1 rounded-full text-gray-400 transition-colors hover:text-[#0066FF] hover:bg-blue-50 focus:outline-none shrink-0"
          :class="isTooltipOpen ? 'text-[#0066FF] bg-blue-50' : ''"
          title="목표 가이드 보기"
          @click.stop="isTooltipOpen = !isTooltipOpen"
        >
          <svg
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>
      </div>

      <p class="text-xs sm:text-sm text-gray-500 font-medium leading-snug line-clamp-1">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import AppIcon from '@/shared/ui/AppIcon.vue'
import GoalTypeIcon from '@/shared/ui/GoalTypeIcon.vue'

defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  isSelected: { type: Boolean, default: false },
  guideInfo: { type: String, default: '' },
})

defineEmits(['select'])

const isTooltipOpen = ref(false)

function handleDocumentClick() {
  if (isTooltipOpen.value) {
    isTooltipOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>
