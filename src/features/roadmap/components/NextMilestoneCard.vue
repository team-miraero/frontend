<!-- 다음 마일스톤: 파란 그라데이션 배경의 독립된 카드 -->
<template>
  <div
    v-if="nextMilestone && goal"
    class="flex flex-col gap-4 rounded-3xl p-6 shadow-[0_6px_14px_rgba(0,102,255,0.21)]"
    style="background-image: linear-gradient(165deg, rgb(0, 102, 255) 0%, rgb(61, 139, 255) 100%)"
  >
    <div class="flex items-center justify-between">
      <span class="rounded-lg bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
        다음 마일스톤 — {{ nextMilestone.order }}단계
      </span>
      <span class="text-[10px] text-white/75">{{ nextMilestone.targetDate }} 예상</span>
    </div>

    <div>
      <div class="flex items-center justify-between text-[10px] text-white/70">
        <span
          >{{ previousMilestone?.order ?? 0 }}단계 ({{
            formatManwon(previousMilestone?.targetAmount ?? 0)
          }})</span
        >
        <span>{{ nextMilestone.order }}단계 ({{ formatManwon(nextMilestone.targetAmount) }})</span>
      </div>
      <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div class="h-2 rounded-full bg-white" :style="{ width: `${segmentProgress}%` }" />
      </div>
      <div class="flex items-center justify-between pt-1.5 text-[10px]">
        <span class="font-bold text-white/85">
          현재 {{ formatManwon(goal?.currentAmount ?? 0) }}원 ({{ segmentProgress }}% 도달)
        </span>
        <span class="text-white/75">{{ formatManwon(remainingToNext) }} 남음</span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div class="rounded-xl bg-white/15 px-3 py-2.5">
        <p class="text-[9px] text-white/65">현재 잔액</p>
        <p class="pt-0.5 text-sm font-black tracking-[-0.28px] text-white">
          {{ formatManwon(goal?.currentAmount ?? 0) }}
        </p>
      </div>
      <div class="rounded-xl bg-white/15 px-3 py-2.5">
        <p class="text-[9px] text-white/65">다음 목표</p>
        <p class="pt-0.5 text-sm font-black tracking-[-0.28px] text-white">
          {{ formatManwon(nextMilestone.targetAmount) }}
        </p>
      </div>
      <div class="rounded-xl bg-white/15 px-3 py-2.5">
        <p class="text-[9px] text-white/65">남은 금액</p>
        <p class="pt-0.5 text-sm font-black tracking-[-0.28px] text-white">
          {{ formatManwon(remainingToNext) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  goal: {
    type: Object,
    default: null,
  },
  milestones: {
    type: Array,
    default: () => [],
  },
})

const nextMilestone = computed(
  () => (Array.isArray(props.milestones) ? props.milestones.find((m) => m.status === 'IN_PROGRESS') : null) ?? null
)
const previousMilestone = computed(() => {
  if (!nextMilestone.value || !Array.isArray(props.milestones)) return null
  const index = props.milestones.indexOf(nextMilestone.value)
  return index > 0 ? props.milestones[index - 1] : null
})

const segmentProgress = computed(() => {
  if (!nextMilestone.value || !props.goal) return 0
  const from = previousMilestone.value?.targetAmount ?? 0
  const to = nextMilestone.value.targetAmount
  const current = props.goal?.currentAmount ?? 0
  if (to <= from) return 0
  return Math.min(100, Math.round(((current - from) / (to - from)) * 100))
})

const remainingToNext = computed(() =>
  nextMilestone.value && props.goal
    ? Math.max(0, nextMilestone.value.targetAmount - (props.goal.currentAmount ?? 0))
    : 0
)

function formatManwon(amount) {
  const num = Number(amount) || 0
  return `${Math.round(num / 10000).toLocaleString()}만`
}
</script>
