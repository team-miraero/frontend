<template>
  <div
    class="relative flex flex-col p-6 rounded-2xl transition-all duration-300 cursor-pointer border-2 select-none"
    :class="
      isSelected
        ? 'border-[#0066FF] bg-white shadow-md'
        : 'border-transparent bg-[#F4F7FA] hover:bg-slate-100 hover:shadow-sm'
    "
    @click="$emit('select')"
  >
    <!-- 우측 상단 파란 원형 체크마크 -->
    <div
      v-if="isSelected"
      class="absolute top-5 right-5 w-6 h-6 bg-[#0066FF] text-white rounded-full flex items-center justify-center shadow-sm animate-in zoom-in duration-200"
    >
      <svg class="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <!-- 옅은 파란색 둥근 박스 안의 아이콘 -->
    <div
      class="w-12 h-12 bg-[#EBF3FF] rounded-2xl flex items-center justify-center mb-4 transition-colors"
    >
      <!-- 독립자금 (집) -->
      <svg
        v-if="id === 'INDEPENDENCE'"
        class="w-6 h-6 text-[#0066FF]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>

      <!-- 비상금 (저금통/동전) -->
      <svg
        v-else-if="id === 'EMERGENCY'"
        class="w-6 h-6 text-[#0066FF]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>

      <!-- 결혼자금 (하트) -->
      <svg
        v-else-if="id === 'MARRIAGE'"
        class="w-6 h-6 text-[#0066FF]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>

      <!-- 학자금 대출 (학사모) -->
      <svg
        v-else-if="id === 'STUDENT_LOAN'"
        class="w-6 h-6 text-[#0066FF]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v6.5" />
      </svg>

      <!-- 기본 이모지 fallback -->
      <span v-else class="text-xl">{{ icon }}</span>
    </div>

    <!-- 타이틀 -->
    <h3
      class="text-base sm:text-lg font-bold mb-1 transition-colors"
      :class="isSelected ? 'text-[#0066FF]' : 'text-gray-900'"
    >
      {{ title }}
    </h3>

    <!-- 서브타이틀 -->
    <p class="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  isSelected: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

