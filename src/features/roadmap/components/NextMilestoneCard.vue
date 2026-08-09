<!-- 다음 마일스톤: 파란 그라데이션 요약 바 (한 화면 아래 SPLIT 목록에 상세가 또 나오므로 여기선 압축 표시) -->
<template>
  <div
    v-if="nextMilestone"
    class="flex flex-col gap-1.5 rounded-2xl px-4 py-3 shadow-[0_4px_10px_rgba(0,102,255,0.18)]"
    style="background-image: linear-gradient(165deg, rgb(0, 102, 255) 0%, rgb(61, 139, 255) 100%)"
  >
    <div class="flex items-center justify-between gap-2">
      <span class="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold text-white">
        다음 체크포인트 · {{ formatManwon(nextMilestone.targetAmount) }}원
      </span>
      <span class="whitespace-nowrap text-[10px] text-white/75">
        {{ previousMilestone?.order ?? 0 }}단계({{ formatManwon(previousMilestone?.targetAmount ?? 0) }})
        →
        {{ nextMilestone.order }}단계 · {{ nextMilestone.targetDate }} 예상
      </span>
    </div>

    <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
      <div class="h-1.5 rounded-full bg-white" :style="{ width: `${segmentProgress}%` }" />
    </div>

    <div class="flex items-center justify-between gap-2 text-[10px]">
      <span class="font-bold text-white/90">
        현재 {{ formatManwon(goal.currentAmount) }}원 ({{ segmentProgress }}% 도달)
      </span>
      <span class="text-white/80">{{ formatManwon(remainingToNext) }} 남음</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  goal: {
    type: Object,
    required: true,
  },
  milestones: {
    type: Array,
    required: true,
  },
})

const nextMilestone = computed(
  () => props.milestones.find((m) => m.status === 'IN_PROGRESS') ?? null
)
const previousMilestone = computed(() => {
  if (!nextMilestone.value) return null
  const index = props.milestones.indexOf(nextMilestone.value)
  return index > 0 ? props.milestones[index - 1] : null
})

const segmentProgress = computed(() => {
  if (!nextMilestone.value) return 0
  const from = previousMilestone.value?.targetAmount ?? 0
  const to = nextMilestone.value.targetAmount
  return Math.min(100, Math.round(((props.goal.currentAmount - from) / (to - from)) * 100))
})

const remainingToNext = computed(() =>
  nextMilestone.value ? Math.max(0, nextMilestone.value.targetAmount - props.goal.currentAmount) : 0
)

function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만`
}
</script>
