<!-- 목표 컬렉션 빈 상태 (Empty State) 컴포넌트 -->
<template>
  <div
    class="mx-auto flex w-full max-w-[640px] flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white/80 p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]"
  >
    <!-- 트로피 / 컵 아이콘 컨테이너 -->
    <div
      class="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-inner"
    >
      <div
        class="absolute -inset-1 rounded-3xl bg-primary/10 blur-sm transition-all duration-500"
      />
      <!-- 트로피 SVG 아이콘 -->
      <svg
        class="relative h-12 w-12 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V4a2 2 0 00-2-2H8a2 2 0 00-2 2v3m12 0h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-12-6H4a2 2 0 00-2 2v2a2 2 0 002 2h2"
        />
      </svg>
    </div>

    <!-- 타이틀 & 서브텍스트 -->
    <h3 class="mt-6 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
      아직 달성한 목표가 없어요
    </h3>
    <p class="mt-2 text-sm font-medium text-gray-500">
      첫 목표를 완주해보세요!
    </p>

    <!-- 버튼 (목표 로드맵 시작하기) -->
    <button
      type="button"
      class="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:translate-y-0"
      @click="$emit('start-roadmap')"
    >
      <span>목표 로드맵 시작하기</span>
      <svg
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineEmits(['start-roadmap'])
</script>
