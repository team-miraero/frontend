<!-- 목표 진행 로드맵: 전체 마일스톤 진행바 + 현재/목표 페이스 비교 -->
<template>
  <div
    class="w-full rounded-3xl border border-slate-200 bg-white px-7 py-6 shadow-[0_2px_7px_rgba(0,102,255,0.06)]"
  >
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold uppercase tracking-[1.2px] text-slate-400">목표 진행 로드맵</p>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2"
        @click="$emit('pause')"
      >
        <img src="@/assets/icons/goal-pause.svg" alt="" class="size-[11px]" />
        <span class="text-xs font-bold text-slate-500">목표 일시정지</span>
      </button>
    </div>

    <div class="relative mt-8 h-24">
      <!-- 마일스톤 라벨 (금액/날짜) -->
      <div
        v-for="milestone in milestones"
        :key="milestone.milestoneId"
        class="absolute top-0 flex w-max -translate-x-[58%] flex-col items-center lg:-translate-x-1/2"
        :style="{ left: `${milestonePosition(milestone)}%` }"
      >
        <span
          class="text-[10px] font-black tracking-[-0.1px]"
          :class="milestone.status === 'COMPLETED' ? 'text-primary' : 'text-slate-400'"
        >
          {{ formatManwon(milestone.targetAmount) }}
        </span>
        <span
          class="pt-px text-[9px]"
          :class="milestone.status === 'COMPLETED' ? 'text-primary/60' : 'text-slate-300'"
        >
          {{ milestone.targetDate }}
        </span>
      </div>

      <!-- 트랙: 마커와 동일하게 좌우 7%씩 여백을 두고 시작/끝 -->
      <div class="absolute top-11 h-[5px] rounded-full bg-slate-200" style="left: 7%; right: 7%" />
      <div
        class="absolute top-11 h-[5px] rounded-full bg-primary"
        :style="{ left: `${TRACK_START}%`, width: `${progressFillWidth()}%` }"
      />

      <!-- 마일스톤 동그라미 마커: 트랙 '위'에 겹쳐서 배치 -->
      <span
        v-for="milestone in milestones"
        :key="`dot-${milestone.milestoneId}`"
        class="absolute top-[37px] flex size-[19px] -translate-x-1/2 items-center justify-center rounded-full border-2"
        :class="
          milestone.status === 'COMPLETED'
            ? 'border-primary bg-primary shadow-[0_2px_5px_rgba(0,102,255,0.25)]'
            : 'border-slate-300 bg-white'
        "
        :style="{ left: `${milestonePosition(milestone)}%` }"
      >
        <img
          v-if="milestone.status === 'COMPLETED'"
          src="@/assets/icons/milestone-complete-check.svg"
          alt=""
          class="size-2"
        />
        <img
          v-else-if="isLastMilestone(milestone)"
          src="@/assets/icons/milestone-final-flag.svg"
          alt=""
          class="size-[7px]"
        />
      </span>

      <!-- 목표 페이스 마커: expectedAmount 위치 -->
      <span
        class="absolute top-[30px] flex size-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-dashed border-[#639bde] bg-slate-200"
        :style="{ left: `${pacePositions().target}%` }"
      >
        <img src="@/assets/icons/pace-target-runner.svg" alt="목표 페이스" class="size-4" />
      </span>

      <!-- 현재 페이스 마커: progressRate(=currentAmount) 위치 -->
      <span
        class="absolute top-[30px] flex size-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-dashed border-primary bg-primary/60 shadow-[0_4px_14px_rgba(0,102,255,0.31)]"
        :style="{ left: `${goal.progressRate}%` }"
      >
        <img src="@/assets/icons/pace-current-runner.svg" alt="현재 페이스" class="size-3.5" />
      </span>
    </div>

    <!-- 현재, 목표페이스 설명 컨테이너 하단, 왼쪽 정렬 -->
    <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span
            class="flex size-[18px] items-center justify-center rounded-full border-2 border-dashed border-primary bg-primary/60 shadow-[0_4px_14px_rgba(0,102,255,0.31)]"
          >
            <img src="@/assets/icons/pace-current-runner-sm.svg" alt="" class="size-2.5" />
          </span>
          <span class="text-[10px] text-slate-500"
            >현재 · {{ formatManwon(goal.currentAmount) }}원</span
          >
        </div>
        <div class="flex items-center gap-1.5">
          <span
            class="flex size-[18px] items-center justify-center rounded-full border-2 border-dashed border-[#639bde] bg-slate-200"
          >
            <img src="@/assets/icons/pace-target-runner-sm.svg" alt="" class="size-2.5" />
          </span>
          <span class="text-[10px] text-slate-400"
            >목표 페이스 · {{ formatManwon(goal.pace.expectedAmount) }}원</span
          >
        </div>
      </div>

      <span
        class="rounded-full border border-primary/20 bg-primary/[0.06] px-2.5 py-0.5 text-[10px] font-bold text-primary"
      >
        {{ goal.pace.paceStatus === 'BEHIND' ? '▼' : '▲' }}
        {{ formatManwon(Math.abs(goal.pace.differenceAmount)) }}
        <!-- 모바일: 문장 첫 단어(금액)까지만 노출, "앞섬/뒤처짐"은 데스크톱에서만 -->
        <span class="hidden lg:inline">{{
          goal.pace.paceStatus === 'BEHIND' ? '뒤처짐' : '앞섬'
        }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  goal: {
    type: Object,
    required: true, // GoalDetail
  },
  milestones: {
    type: Array,
    required: true,
  },
})
defineEmits(['pause'])

// 마일스톤/페이스 마커 위치: goalAmount 대비 금액 비율(%)
const TRACK_START = 7
const TRACK_END = 93

// 금액 비율(0~1)을 트랙의 실제 표시 구간(7%~93%)으로 변환하는 단일 기준
function toTrackPercent(ratio) {
  const clampedRatio = Math.min(1, Math.max(0, ratio))
  return TRACK_START + clampedRatio * (TRACK_END - TRACK_START)
}

function milestonePosition(milestone) {
  return toTrackPercent(milestone.targetAmount / props.goal.goalAmount)
}

function progressFillWidth() {
  return toTrackPercent(props.goal.progressRate / 100) - TRACK_START
}

function isLastMilestone(milestone) {
  return props.milestones[props.milestones.length - 1]?.milestoneId === milestone.milestoneId
}

function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만`
}

// 목표/현재 페이스 최소 간격 확보
function pacePositions() {
  const target = toTrackPercent(props.goal.pace.expectedAmount / props.goal.goalAmount)
  const current = toTrackPercent(props.goal.progressRate / 100)
  const MIN_GAP = 2.5

  if (Math.abs(current - target) >= MIN_GAP) {
    return { target, current }
  }

  const mid = (current + target) / 2
  return current >= target
    ? { target: mid - MIN_GAP / 2, current: mid + MIN_GAP / 2 }
    : { target: mid + MIN_GAP / 2, current: mid - MIN_GAP / 2 }
}
</script>
