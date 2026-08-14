<!-- 목표 달성 현황 친구 공유하기 배너 카드 -->
<template>
  <button
    type="button"
    class="group relative flex min-h-[108px] w-full items-center justify-between overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-[#edf5ff] via-[#f7faff] to-white p-5 text-left shadow-[0_4px_20px_rgba(0,102,255,0.04)] transition-all hover:shadow-[0_6px_24px_rgba(0,102,255,0.08)] sm:p-6"
    @click="$emit('open')"
  >
    <div class="relative z-10 min-w-0 pr-28 sm:pr-56">
      <h3 class="pt-1.5 text-sm font-black tracking-tight text-[#0a192f] sm:text-base">
        친구에게 나의 로드맵 자랑하기
      </h3>
      <p class="pt-1 text-left text-[11px] font-medium leading-tight text-slate-500 sm:text-xs">
        목표 달성 현황 카드 이미지를 친구들에게 공유하고 함께 달려보세요!
      </p>
      <div
        class="mt-2.5 flex items-center gap-1.5 text-xs font-black text-primary group-hover:translate-x-1 transition-transform"
      >
        <span>지금 공유하기</span>
        <span>→</span>
      </div>
    </div>

    <!-- 우측 친구들 일러스트 -->
    <img
      :src="friendsImage"
      alt="친구들"
      class="absolute -bottom-2 right-2 h-24 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:right-6 sm:h-30"
    />
  </button>
</template>

<script setup>
import friendsImage from '@/assets/images/friends.png'

defineEmits(['open'])
</script>
