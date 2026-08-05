<!-- 하단 배너 (Call to Action) 컴포넌트 -->
<template>
  <div
    class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-blue-600 to-indigo-600 p-7 text-white shadow-xl shadow-primary/20"
  >
    <!-- 배경 장식 패턴 -->
    <div
      class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
    />
    <div
      class="pointer-events-none absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-blue-300/20 blur-xl"
    />

    <div
      class="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
    >
      <div>
        <div class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          <span>🎯 Next Goal</span>
        </div>
        <h3 class="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
          다음 목표도 함께해요
        </h3>
        <p class="mt-1 text-xs font-medium text-blue-100 sm:text-sm">
          새로운 로드맵을 설정하고 또 다른 멋진 성취를 이뤄보세요!
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg active:translate-y-0"
        @click="$emit('add-goal')"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>+ 새 로드맵 추가</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['add-goal'])
</script>
