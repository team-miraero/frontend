<!-- 콜리의 스마트 자산 브리핑 (기존 RaceRecordSummary) -->
<template>
  <div class="space-y-3">
    <div
      class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,35,70,0.03)] sm:p-6 md:p-7"
    >
      <div class="flex items-center justify-between pb-4 sm:pb-5">
        <div class="flex items-center gap-2.5">
          <span class="flex size-7 items-center justify-center rounded-xl bg-[#eafaf0] shadow-sm ring-1 ring-[#cbf2d8]">
            <img :src="coliBottomImage" alt="" class="size-5 object-contain" />
          </span>
          <div>
            <h3 class="text-sm font-black tracking-tight text-[#0a192f] sm:text-base">
              콜리의 스마트 자산 브리핑
            </h3>
            <p class="text-xs font-bold text-slate-400">
              목표 달성을 위해 연결된 자산과 저축 현황이에요
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <GoalSummaryCard :goal="goal" />
        <ConnectedAssetsCard :assets="assets" @open-detail="$emit('open-detail')" />
      </div>
    </div>

    <!-- 3. 친구에게 공유하기 배너 -->
    <div>
      <ShareWithFriendsCard @open="$emit('open')" />
    </div>
  </div>
</template>

<script setup>
import GoalSummaryCard from '@/features/roadmap/components/GoalSummaryCard.vue'
import ConnectedAssetsCard from '@/features/roadmap/components/ConnectedAssetsCard.vue'
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
})

defineEmits(['open', 'open-detail'])
</script>
