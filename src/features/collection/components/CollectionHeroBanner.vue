<!-- 컬렉션 상단 명예의 전당 요약 히어로 배너 (PaceBanner / RaceRecordSummary 디자인 결 반영) -->
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
          🏁 완주 트로피 룸
        </span>
        <span class="text-xs font-bold text-slate-400">
          콜리가 함께한 완주 기록
        </span>
      </div>

      <h1 class="text-lg font-black leading-snug tracking-[-0.4px] text-[#0a192f] sm:text-xl md:text-2xl">
        총 <span class="text-primary">{{ totalCount }}개</span>의 로드맵을 성공적으로 완주했어요!
      </h1>

      <p class="text-xs font-medium text-slate-500 sm:text-sm">
        목표 페이스를 끝까지 유지하며 모은 값진 성과예요. 다음 목표도 함께 달려봐요.
      </p>

      <!-- 요약 통계 그리드 바 (PaceBanner 스펙 일치) -->
      <div
        class="mt-1 flex w-fit flex-wrap divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50/50"
      >
        <div class="flex flex-col gap-0.5 px-4 py-2">
          <span class="text-[11px] font-bold text-slate-400">총 완주 금액</span>
          <span class="text-base font-black tracking-[-0.36px] text-[#0a192f]">
            {{ formatManwon(totalAmount) }}<span class="text-xs font-bold text-slate-400">만원</span>
          </span>
        </div>
        <div class="flex flex-col gap-0.5 px-4 py-2">
          <span class="text-[11px] font-bold text-slate-400">완주한 목표</span>
          <span class="text-base font-black tracking-[-0.36px] text-primary">
            {{ totalCount }}<span class="text-xs font-bold text-slate-400">개</span>
          </span>
        </div>
        <div class="flex flex-col gap-0.5 px-4 py-2">
          <span class="text-[11px] font-bold text-slate-400">달성 완료율</span>
          <span class="text-base font-black tracking-[-0.36px] text-emerald-600">
            100<span class="text-xs font-bold text-slate-400">%</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 우측 캐릭터 일러스트 배너 (콜리 & 친구들) -->
    <div
      class="relative hidden shrink-0 items-center justify-center pr-2 lg:flex"
    >
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
import coliImage from '@/assets/images/coli8-thick.png'

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
