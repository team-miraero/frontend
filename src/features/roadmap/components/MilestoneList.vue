<!-- 전체 마일스톤 리스트 (러닝 스플릿 기록판 스타일 · 가로 카드 + 커넥터) -->
<template>
  <div
    class="rounded-3xl border border-slate-200 bg-white p-[25px] shadow-[0_2px_7px_rgba(0,102,255,0.06)]"
  >
    <div class="flex items-center gap-1.5 pb-5">
      <span class="text-xs">🏁</span>
      <p class="text-xs font-bold uppercase tracking-[1.2px] text-slate-400">스플릿 기록</p>
    </div>

    <div ref="scrollContainer" class="flex items-start gap-0 overflow-x-auto pb-1">
      <template v-for="(milestone, index) in milestones" :key="milestone.milestoneId">
        <div
          :data-in-progress="milestone.status === 'IN_PROGRESS' ? 'true' : null"
          class="flex min-w-[140px] flex-1 flex-col rounded-2xl border p-3"
          :class="[
            milestone.status === 'COMPLETED'
              ? 'border-primary/15 bg-primary/[0.02]'
              : milestone.status === 'IN_PROGRESS'
                ? 'border-primary/30 bg-white shadow-[0_4px_14px_rgba(0,102,255,0.1)]'
                : 'border-slate-200 bg-slate-50',
          ]"
        >
          <div class="flex items-center gap-1.5">
            <span
              class="flex size-5 shrink-0 items-center justify-center rounded-full border-2"
              :class="
                milestone.status === 'COMPLETED'
                  ? 'border-primary bg-primary'
                  : milestone.status === 'IN_PROGRESS'
                    ? 'border-primary bg-white'
                    : 'border-slate-300 bg-white'
              "
            >
              <img
                v-if="milestone.status === 'COMPLETED'"
                src="@/assets/icons/milestone-dot-check.svg"
                alt=""
                class="size-2.5 brightness-0 invert"
              />
              <span
                v-else
                class="size-1.5 rounded-full"
                :class="milestone.status === 'IN_PROGRESS' ? 'bg-primary' : 'bg-slate-300'"
              />
            </span>
            <span
              class="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-black tracking-[-0.2px]"
              :class="
                milestone.status === 'COMPLETED'
                  ? 'bg-primary/[0.09] text-primary'
                  : 'bg-slate-100 text-slate-400'
              "
            >
              SPLIT {{ index + 1 }}
            </span>
          </div>

          <p
            class="pt-2 text-sm font-black tracking-[-0.3px]"
            :class="
              milestone.status === 'COMPLETED' || milestone.status === 'IN_PROGRESS'
                ? 'text-primary'
                : 'text-slate-400'
            "
          >
            {{ formatManwon(milestone.targetAmount) }}원
          </p>

          <span
            class="mt-1 w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold"
            :class="
              milestone.status === 'COMPLETED'
                ? 'bg-primary/[0.09] text-primary'
                : milestone.status === 'IN_PROGRESS'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-400'
            "
          >
            {{
              milestone.status === 'COMPLETED'
                ? '완료 ✓'
                : milestone.status === 'IN_PROGRESS'
                  ? '진행 중'
                  : '예정'
            }}
          </span>

          <!-- 진행 중인 구간: NextMilestoneCard와 동일한 계산식(segmentProgress/remainingToNext) -->
          <div v-if="milestone.status === 'IN_PROGRESS' && goal" class="pt-2">
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
              <div
                class="h-1.5 rounded-full bg-primary"
                :style="{ width: `${segmentProgress(milestone, index)}%` }"
              />
            </div>
            <p class="pt-1 text-[10px] font-bold text-primary">
              현재 {{ formatManwon(goal.currentAmount) }}원 ({{
                segmentProgress(milestone, index)
              }}%)
            </p>
            <p class="text-[10px] text-primary/70">
              {{ formatManwon(remainingToNext(milestone)) }} 남음
            </p>
          </div>

          <p
            class="pt-2 text-[10px]"
            :class="milestone.status === 'COMPLETED' ? 'text-primary/60' : 'text-slate-400'"
          >
            <template v-if="milestone.targetDate">달성 {{ milestone.targetDate }}</template>
            <template v-else>{{ milestone.percentage }}% 체크포인트</template>
          </p>

          <p
            v-if="milestone.title"
            class="pt-1 text-[11px] font-bold"
            :class="milestone.status === 'COMPLETED' ? 'text-slate-700' : 'text-slate-400'"
          >
            {{ milestone.title }}
          </p>

          <div v-if="milestone.tags?.length" class="flex flex-wrap gap-1 pt-1.5">
            <span
              v-for="tag in milestone.tags"
              :key="tag"
              class="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
              :class="
                milestone.status === 'COMPLETED'
                  ? 'bg-primary/[0.07] text-primary'
                  : 'bg-slate-100 text-slate-400'
              "
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div
          v-if="index < milestones.length - 1"
          class="mt-[22px] h-px w-3 shrink-0 self-start"
          :class="milestone.status === 'COMPLETED' ? 'bg-primary/25' : 'bg-slate-200'"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const scrollContainer = ref(null)

const props = defineProps({
  milestones: {
    type: Array,
    required: true,
  },
  goal: {
    type: Object,
    default: null, // NextMilestoneCard와 동일하게 currentAmount만 사용
  },
})

let hasScrolledToInProgress = false

// 가로 스크롤 목록이라 "진행 중" 카드가 화면 밖에 있을 수 있어서, milestones 데이터가 실제로 도착하면
// (컴포넌트 마운트 시점엔 아직 빈 배열이라 onMounted로는 타이밍이 안 맞음) 그 카드가 보이도록 한 번만 스크롤
watch(
  () => props.milestones,
  (milestones) => {
    if (hasScrolledToInProgress || !milestones?.length) return
    const inProgressCardEl = scrollContainer.value?.querySelector('[data-in-progress="true"]')
    if (!inProgressCardEl) return
    inProgressCardEl.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
    hasScrolledToInProgress = true
  },
  { immediate: true, flush: 'post' }
)

function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만`
}

// NextMilestoneCard.vue의 segmentProgress/remainingToNext와 동일한 계산식
function segmentProgress(milestone, index) {
  const from = props.milestones[index - 1]?.targetAmount ?? 0
  const to = milestone.targetAmount
  return Math.min(100, Math.round(((props.goal.currentAmount - from) / (to - from)) * 100))
}

function remainingToNext(milestone) {
  return Math.max(0, milestone.targetAmount - props.goal.currentAmount)
}
</script>
