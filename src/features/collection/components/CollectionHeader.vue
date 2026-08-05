<!-- 목표 컬렉션 상단 헤더 컴포넌트 -->
<template>
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        목표 컬렉션
      </h1>
      <p class="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-500">
        <span>달성한 목표들을 모아뒀어요</span>
        <span class="inline-block h-1 w-1 rounded-full bg-gray-300" />
        <span class="font-bold text-primary">{{ countLabel }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  achievedCount: {
    type: Number,
    default: 0,
  },
})

const countLabel = computed(() => `${Number(props.achievedCount) || 0}개 달성`)
</script>
