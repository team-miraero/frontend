<template>
  <div
    role="radio"
    tabindex="0"
    :aria-checked="isSelected"
    class="group relative flex w-full flex-col justify-between p-3.5 sm:p-5 rounded-2xl transition-all duration-200 ease-out text-left select-none border-2 cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 active:scale-[0.98]"
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
    <!-- 상단 영역: 아이콘 / 우측 (i) 가이드 버튼 및 동그라미 체크마크 -->
    <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
      <!-- 아이콘 둥근 박스 -->
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-[14px] transition-colors"
        :class="iconBackgroundClass"
      >
        <GoalTypeIcon :goal-type="id" size="lg" :class="iconToneClass" />
      </div>

      <!-- 우측 영역: (i) 가이드 버튼 + 선택 체크마크 -->
      <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <!-- (i) 정보 가이드 버튼 -->
        <button
          v-if="guideInfo"
          type="button"
          class="inline-flex size-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-[#0066FF] hover:bg-blue-50 focus:outline-none cursor-pointer"
          title="목표 가이드 보기"
          @click.stop="$emit('guide')"
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

        <!-- 우측 동그라미 선택 체크마크 -->
        <div
          class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-200"
          :class="
            isSelected
              ? 'bg-[#0066FF] text-white shadow-xs scale-100'
              : 'border-2 border-gray-300 bg-white text-transparent scale-90 group-hover:border-gray-400'
          "
        >
          <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 텍스트 영역: 타이틀 + 1줄 설명 -->
    <div class="mt-1 min-w-0">
      <h3
        class="text-sm sm:text-base md:text-lg font-bold transition-colors truncate whitespace-nowrap mb-0.5 sm:mb-1"
        :class="isSelected ? 'text-[#0066FF]' : 'text-gray-900'"
      >
        {{ title }}
      </h3>

      <p class="text-[11px] sm:text-xs md:text-sm text-gray-500 font-medium leading-tight sm:leading-snug truncate whitespace-nowrap">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GoalTypeIcon from '@/shared/ui/GoalTypeIcon.vue'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  isSelected: { type: Boolean, default: false },
  guideInfo: { type: String, default: '' },
})

defineEmits(['select', 'guide'])

const ICON_STYLES = {
  EMERGENCY: { tone: 'text-[#00A878]', soft: 'bg-[#F3FBF7]', selected: 'bg-[#E7F8F0]' },
  INDEPENDENCE: { tone: 'text-[#3182F6]', soft: 'bg-[#F2F7FF]', selected: 'bg-[#E5F0FF]' },
  STUDENT_LOAN: { tone: 'text-[#6366F1]', soft: 'bg-[#F5F6FF]', selected: 'bg-[#EAECFF]' },
  MARRIAGE: { tone: 'text-[#E66A84]', soft: 'bg-[#FFF6F8]', selected: 'bg-[#FFECEF]' },
}
const iconStyle = computed(() => ICON_STYLES[props.id] || ICON_STYLES.INDEPENDENCE)
const iconToneClass = computed(() => iconStyle.value.tone)
const iconBackgroundClass = computed(() =>
  props.isSelected ? iconStyle.value.selected : iconStyle.value.soft
)
</script>
