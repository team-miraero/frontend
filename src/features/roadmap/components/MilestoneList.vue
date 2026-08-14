<!-- 전체 마일스톤 리스트 (러닝 스플릿 기록판 스타일 · 가로 카드 + 커넥터) -->
<template>
  <div class="w-full">
    <!-- 헤더 (상단 알아서 모으기 / 다음달 자금마련과 동일한 원형 뱃지 벡터 아이콘 스타일) -->
    <div class="flex items-center justify-between pb-3.5 sm:pb-4">
      <div class="flex items-center gap-2.5">
        <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm ring-1 ring-primary/20">
          <svg
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 1.5" />
            <path d="M10 2h4" />
            <path d="M18 5l1.5 1.5" />
          </svg>
        </span>
        <div>
          <h3 class="text-sm font-black tracking-tight text-[#0a192f] sm:text-base">
            스플릿 기록
          </h3>
          <p class="text-xs font-bold text-slate-400">
            구간별 목표 달성 현황과 페이스 기록이에요
          </p>
        </div>
      </div>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-500">
        전체 {{ milestones.length }}스플릿
      </span>
    </div>

    <!-- 가로 스크롤 스플릿 카드 리스트 -->
    <div ref="scrollContainer" class="no-scrollbar flex items-stretch gap-3 overflow-x-auto pb-1">
      <template v-for="(milestone, index) in milestones" :key="milestone.milestoneId">
        <div
          :data-in-progress="milestone.status === 'IN_PROGRESS' ? 'true' : null"
          class="flex min-w-[155px] flex-1 flex-col justify-between rounded-2xl border p-3.5 transition-all"
          :class="[
            milestone.status === 'COMPLETED'
              ? 'border-primary/20 bg-[#f8fbff]'
              : milestone.status === 'IN_PROGRESS'
                ? 'border-primary bg-white shadow-[0_4px_18px_rgba(0,102,255,0.1)] ring-2 ring-primary/15'
                : 'border-slate-100 bg-slate-50/60 opacity-80',
          ]"
        >
          <div>
            <!-- 상단 뱃지 & 단계 -->
            <div class="flex items-center justify-between gap-1.5">
              <span
                class="rounded-full px-2 py-0.5 text-[10px] font-black tracking-tight"
                :class="
                  milestone.status === 'COMPLETED'
                    ? 'bg-primary/10 text-primary'
                    : milestone.status === 'IN_PROGRESS'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-200/80 text-slate-500'
                "
              >
                SPLIT {{ index + 1 }}
              </span>

              <span
                class="flex items-center gap-1 text-[10px] font-bold"
                :class="milestone.status === 'COMPLETED' ? 'text-primary' : 'text-slate-400'"
              >
                <span v-if="milestone.status === 'COMPLETED'" class="text-xs font-black">✓</span>
                {{ milestone.percentage }}%
              </span>
            </div>

            <!-- 목표 금액 -->
            <p
              class="pt-2 text-base font-black tracking-tight"
              :class="
                milestone.status === 'COMPLETED' || milestone.status === 'IN_PROGRESS'
                  ? 'text-[#0a192f]'
                  : 'text-slate-400'
              "
            >
              {{ formatManwon(milestone.targetAmount) }}원
            </p>

            <p
              v-if="milestone.title"
              class="pt-0.5 text-[11px] font-bold text-slate-500"
            >
              {{ milestone.title }}
            </p>
          </div>

          <!-- 하단 상태 및 진행률 바 -->
          <div class="pt-3">
            <!-- 진행 중인 구간 게이지 -->
            <div v-if="milestone.status === 'IN_PROGRESS' && goal" class="space-y-1.5">
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
                <div
                  class="h-1.5 rounded-full bg-primary transition-all duration-500"
                  :style="{ width: `${segmentProgress(milestone, index)}%` }"
                />
              </div>
              <div class="flex items-center justify-between text-[10px] font-bold">
                <span class="text-primary">{{ segmentProgress(milestone, index) }}% 달성</span>
                <span class="text-slate-400">{{ formatManwon(remainingToNext(milestone)) }}원 남음</span>
              </div>
            </div>

            <!-- 완료/예정 상태 텍스트 -->
            <div v-else class="flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span v-if="milestone.status === 'COMPLETED'" class="font-bold text-primary">
                달성 완료 🎉
              </span>
              <span v-else>도전 대기 중</span>
              <span v-if="milestone.targetDate">{{ milestone.targetDate }}</span>
            </div>
          </div>
        </div>
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
    default: null,
  },
})

let hasScrolledToInProgress = false

watch(
  () => props.milestones,
  (milestones) => {
    if (hasScrolledToInProgress || !milestones?.length) return
    const container = scrollContainer.value
    const inProgressCardEl = container?.querySelector('[data-in-progress="true"]')
    if (!container || !inProgressCardEl) return

    const centeredLeft =
      inProgressCardEl.offsetLeft - (container.clientWidth - inProgressCardEl.clientWidth) / 2
    container.scrollLeft = Math.max(0, centeredLeft)
    hasScrolledToInProgress = true
  },
  { immediate: true, flush: 'post' }
)

function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만`
}

function segmentProgress(milestone, index) {
  const from = props.milestones[index - 1]?.targetAmount ?? 0
  const to = milestone.targetAmount
  if (to <= from) return 100
  return Math.min(100, Math.max(0, Math.round(((props.goal.currentAmount - from) / (to - from)) * 100)))
}

function remainingToNext(milestone) {
  return Math.max(0, milestone.targetAmount - (props.goal?.currentAmount ?? 0))
}
</script>
