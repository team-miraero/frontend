<!-- 하단 새 로드맵 추가 CTA 배너 (ShareWithFriendsCard / PacemakerToggleCard 디자인 결 반영) -->
<template>
  <div
    class="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-[#eaf2ff] via-[#f4f8ff] to-[#eef5ff] p-5 shadow-[0_2px_8px_rgba(0,102,255,0.06)] sm:p-6 md:flex-row md:items-center"
  >
    <!-- 좌측 문구 영역 -->
    <div class="relative z-10 max-w-xl">
      <span
        class="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/80 px-2.5 py-0.5 text-xs font-bold text-primary shadow-sm"
      >
        🏃 새로운 도전
      </span>
      <h3 class="mt-2 text-lg font-black tracking-tight text-[#0a192f] sm:text-xl">
        다음 목표도 페이스메이커와 함께 달려요
      </h3>
      <p class="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
        새로운 목표 로드맵을 등록하고 또 한 번의 멋진 성취를 경험해보세요!
      </p>
    </div>

    <!-- 우측 친구들 캐릭터 일러스트 (데스크톱에서 자연스럽게 노출) -->
    <img
      :src="friendsImage"
      alt="미래로 친구들"
      class="pointer-events-none absolute -bottom-1 right-36 hidden h-24 w-auto object-contain drop-shadow-sm md:block lg:right-48"
    />

    <!-- 액션 버튼 -->
    <div class="relative z-10 mt-4 shrink-0 md:mt-0">
      <button
        type="button"
        class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-lg sm:w-auto"
        @click="$emit('add-goal')"
      >
        <svg
          class="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>새 로드맵 시작하기</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import friendsImage from '@/assets/images/friends.png'

defineEmits(['add-goal'])
</script>
