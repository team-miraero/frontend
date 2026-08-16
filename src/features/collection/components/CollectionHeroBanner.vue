<!-- 컬렉션 상단 명예의 전당 요약 히어로 배너 (대시보드 블루 톤앤매너 & API 명세 기반) -->
<template>
  <div
    class="relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,102,255,0.05)] sm:p-6 lg:flex-row lg:items-center"
  >
    <!-- 좌측 정보 영역 -->
    <div class="relative z-10 flex flex-1 flex-col gap-2.5">
      <div class="flex items-center gap-2">
        <span
          class="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-[#eaf2ff] px-2.5 py-0.5 text-xs font-bold text-primary"
        >
          나만의 완주 룸
        </span>
        <span class="text-xs font-bold text-slate-400"> 콜리가 함께한 완주 기록 </span>
      </div>

      <h1
        class="text-lg font-black leading-snug tracking-[-0.4px] text-[#0a192f] sm:text-xl md:text-2xl"
      >
        총 <span class="text-primary">{{ totalCount }}개</span>의 로드맵을 성공적으로 완주했어요!
      </h1>

      <p class="text-xs font-medium text-slate-500 sm:text-sm">
        목표 페이스를 끝까지 유지하며 모은 값진 성과예요. 다음 목표도 함께 달려봐요.
      </p>

      <!-- 요약 통계 그리드 바 (세련된 미니 칩 스타일) -->
      <div
        class="mt-1 flex w-fit flex-wrap items-center divide-x divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
      >
        <div class="flex items-center gap-2.5 px-3.5 py-1.5">
          <span
            class="flex size-7 items-center justify-center rounded-xl border border-slate-100 bg-white text-xs shadow-xs"
            >💰</span
          >
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-400">총 완주 금액</span>
            <span class="text-sm font-black tracking-[-0.3px] text-[#0a192f]">
              {{ formatManwon(totalAmount) }}<span class="text-xs font-bold text-slate-400">만원</span>
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2.5 px-3.5 py-1.5">
          <span
            class="flex size-7 items-center justify-center rounded-xl border border-slate-100 bg-white text-xs shadow-xs"
            >🏆</span
          >
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-400">완주한 목표</span>
            <span class="text-sm font-black tracking-[-0.3px] text-primary">
              {{ totalCount }}<span class="text-xs font-bold text-slate-400">개</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 우측 캐릭터 일러스트 배너 (콜리 & 골드 트로피) -->
    <div class="relative hidden shrink-0 items-center justify-center pr-2 lg:flex">
      <div
        class="relative flex size-28 items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-br from-[#eaf2ff] to-[#f4f8ff] p-2"
      >
        <img
          :src="coliImage"
          alt="완주 메달 콜리"
          class="size-20 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
        />
        <span
          class="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-sm shadow-md"
        >
          🏆
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import coliImage from '@/assets/images/coli_new.png'

defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
})

function formatManwon(amount) {
  return Math.round((Number(amount) || 0) / 10000).toLocaleString('ko-KR')
}
</script>
