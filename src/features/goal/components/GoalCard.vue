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
    <!-- 상단 영역: 목표 유형 아이콘 -->
    <div class="mb-2 flex items-center sm:mb-3">
      <!-- 아이콘 둥근 박스 -->
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-[14px] transition-colors"
        :class="iconBackgroundClass"
      >
        <GoalTypeIcon :goal-type="id" size="lg" :class="iconToneClass" />
      </div>
    </div>

    <!-- 텍스트 영역: 타이틀 + 1줄 설명 -->
    <div class="mt-1 min-w-0">
      <div class="mb-0.5 flex min-w-0 items-center gap-1 sm:mb-1">
        <h3
          class="min-w-0 truncate whitespace-nowrap text-sm font-bold transition-colors sm:text-base md:text-lg"
          :class="isSelected ? 'text-[#0066FF]' : 'text-gray-900'"
        >
          {{ title }}
        </h3>
        <button
          v-if="guideInfo"
          type="button"
          class="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:text-[#0066FF] focus:outline-none"
          title="목표 가이드 보기"
          aria-label="목표 가이드 보기"
          @click.stop="$emit('guide')"
        >
          <svg class="size-[15px]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.6" />
            <path d="M12 11v6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            <circle cx="12" cy="7.5" r="1.25" fill="currentColor" />
          </svg>
        </button>
      </div>

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
  EMERGENCY: { tone: 'text-[#3182F6]', soft: 'bg-[#F2F7FF]', selected: 'bg-[#E5F0FF]' },
  INDEPENDENCE: { tone: 'text-[#3182F6]', soft: 'bg-[#F2F7FF]', selected: 'bg-[#E5F0FF]' },
  STUDENT_LOAN: { tone: 'text-[#3182F6]', soft: 'bg-[#F2F7FF]', selected: 'bg-[#E5F0FF]' },
  MARRIAGE: { tone: 'text-[#3182F6]', soft: 'bg-[#F2F7FF]', selected: 'bg-[#E5F0FF]' },
}
const iconStyle = computed(() => ICON_STYLES[props.id] || ICON_STYLES.INDEPENDENCE)
const iconToneClass = computed(() => iconStyle.value.tone)
const iconBackgroundClass = computed(() =>
  props.isSelected ? iconStyle.value.selected : iconStyle.value.soft
)
</script>
