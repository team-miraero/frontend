<!-- 스플릿 기록 아래 요약 그룹: 기존 4개 카드(GoalSummaryCard·ConnectedAssetsCard·PacemakerToggleCard·ShareWithFriendsCard)를
     내부 로직 변경 없이 그대로 조합만 해서, 도로/스플릿과 이어지는 하나의 시각적 그룹으로 묶는다 -->
<template>
  <div>
    <div class="mx-8 h-3.5 border-x-2 border-dashed border-[#c5dcff] opacity-70" />

    <div
      class="rounded-3xl border border-slate-200 bg-white p-3.5 shadow-[0_2px_10px_rgba(0,102,255,0.05)] sm:p-4"
    >
      <div class="flex items-center gap-2 pb-2.5">
        <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eafaf0]">
          <img :src="coliBottomImage" alt="" class="size-4 object-contain" />
        </span>
        <p class="text-xs font-bold text-slate-600">콜리가 정리했어요 — 오늘의 자산 현황을 확인해보세요</p>
      </div>

      <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <GoalSummaryCard :goal="goal" />
        <ConnectedAssetsCard :assets="assets" @open-detail="$emit('open-detail')" />
      </div>
    </div>

    <!-- 다음달 자금마련 / 공유하기: 옆 카드와 높이를 동일하게 맞춘 배너 그리드 -->
    <div class="grid grid-cols-1 items-stretch gap-2.5 pt-2.5 sm:grid-cols-2">
      <PacemakerToggleCard :pacemaker="pacemaker" @toggle="$emit('toggle')" />
      <ShareWithFriendsCard @open="$emit('open')" />
    </div>
  </div>
</template>

<script setup>
import GoalSummaryCard from '@/features/roadmap/components/GoalSummaryCard.vue'
import ConnectedAssetsCard from '@/features/roadmap/components/ConnectedAssetsCard.vue'
import PacemakerToggleCard from '@/features/roadmap/components/PacemakerToggleCard.vue'
import ShareWithFriendsCard from '@/features/roadmap/components/ShareWithFriendsCard.vue'
import coliBottomImage from '@/assets/images/coli_bottom.png'

defineProps({
  goal: {
    type: Object,
    required: true,
  },
  assets: {
    type: Array,
    required: true,
  },
  pacemaker: {
    type: Object,
    default: null,
  },
})
defineEmits(['open-detail', 'toggle', 'open'])
</script>
