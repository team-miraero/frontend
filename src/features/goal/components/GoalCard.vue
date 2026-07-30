<!-- src/features/goal/components/GoalCard.vue -->
<template>
  <div
    class="relative flex flex-col p-6 rounded-2xl transition-all duration-300 cursor-pointer border-2"
    :class="
      isSelected
        ? 'border-blue-600 bg-blue-50/50 shadow-md'
        : 'border-transparent bg-white shadow-sm hover:border-blue-300 hover:-translate-y-1 hover:shadow-md'
    "
    @click="$emit('select')"
  >
    <!-- 우측 상단 체크마크 -->
    <div
      v-if="isSelected"
      class="absolute top-4 right-4 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm animate-in zoom-in duration-200"
    >
      ✓
    </div>

    <!-- 아이콘 (이모지) -->
    <div class="text-3xl mb-4">{{ icon }}</div>

    <!-- 타이틀 (선택 시 파란색으로 변경) -->
    <h3
      class="text-lg font-bold mb-1 transition-colors"
      :class="isSelected ? 'text-blue-600' : 'text-gray-900'"
    >
      {{ title }}
    </h3>

    <!-- 서브타이틀 -->
    <p class="text-sm text-gray-500">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>
