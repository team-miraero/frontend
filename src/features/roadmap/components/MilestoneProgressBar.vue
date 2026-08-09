<!-- 목표 진행 로드맵: 전체 마일스톤 진행바 + 현재/목표 페이스 비교 (도로 이미지 버전, 카드 없이 페이지에 바로 배치) -->
<template>
  <div class="relative w-full" style="aspect-ratio: 1536 / 418">
    <div class="absolute top-0 left-0 w-full" style="aspect-ratio: 1536 / 418">
      <img
        :src="roadmapImage"
        alt=""
        class="absolute inset-0 size-full object-contain"
        style="filter: drop-shadow(0 10px 8px rgba(10, 25, 47, 0.18))"
      />

      <!-- 마일스톤 라벨 + 마커: 도로 곡선 위 지점(pointOnRoad)에 배치 -->
      <div
        v-for="milestone in milestones"
        :key="milestone.milestoneId"
        class="absolute flex w-max -translate-x-1/2 flex-col items-center"
        :class="isLastMilestone(milestone) ? '-translate-y-[150%]' : '-translate-y-full'"
        :style="markerStyle(milestonePosition(milestone))"
      >
        <div
          class="flex flex-col items-center rounded-xl border px-3 py-1.5"
          :class="
            milestone.status === 'COMPLETED'
              ? 'border-primary/20 bg-white'
              : 'border-slate-200 bg-white'
          "
        >
          <span
            class="text-xs font-black tracking-[-0.1px]"
            :class="milestone.status === 'COMPLETED' ? 'text-primary' : 'text-slate-400'"
          >
            {{ formatManwon(milestone.targetAmount) }}원
          </span>
          <span
            class="text-[11px] font-bold"
            :class="milestone.status === 'COMPLETED' ? 'text-primary/70' : 'text-slate-400'"
          >
            {{ milestonePercent(milestone) }}%
          </span>
          <span
            v-if="isLastMilestone(milestone)"
            class="mt-0.5 flex items-center gap-1 border-t border-slate-100 pt-1 text-[10px] font-bold text-slate-400"
          >
            예상 도착일 {{ formatEndDate(goal.period.endDate) }}
          </span>
        </div>
        <span
          class="mt-1 flex size-4 items-center justify-center rounded-full border-2"
          :class="
            milestone.status === 'COMPLETED'
              ? 'border-primary bg-primary'
              : 'border-slate-300 bg-white'
          "
        >
          <img
            v-if="milestone.status === 'COMPLETED'"
            src="@/assets/icons/milestone-complete-check.svg"
            alt=""
            class="size-[7px]"
          />
        </span>
      </div>

      <!-- 현재 페이스: 토끼가 달리고, 브로콜리(페이스메이커)는 원형 배지로 발밑에 동행 -->
      <div
        class="absolute flex -translate-x-1/2 -translate-y-[60%] items-end"
        :style="characterMarkerStyle(goal.progressRate)"
      >
        <div class="relative top-2 flex items-end">
          <span
            class="absolute -top-11 left-1/2 z-20 w-max -translate-x-1/2 whitespace-nowrap rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-[#0a192f] shadow-[0_4px_12px_rgba(10,25,47,0.12)]"
          >
            페이스 유지 중! 💪
          </span>
          <img :src="rabbitImage" alt="현재 페이스" class="h-28 w-auto drop-shadow-md sm:h-36" />
          <span
            class="absolute -top-11 left-1/2 z-20 flex size-9 -translate-x-[calc(100%+52px)] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#eafaf0] shadow-md sm:size-11"
          >
            <img :src="coliBottomImage" alt="페이스메이커" class="size-full object-contain p-0.5" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import roadmapImage from '@/assets/images/roadmap7.png'
import rabbitImage from '@/assets/images/rabbit_new.png'
import coliBottomImage from '@/assets/images/coli_bottom.png'

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

function formatEndDate(yyyyMM) {
  return yyyyMM.replace('-', '.')
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

function milestonePercent(milestone) {
  return Math.round((milestone.targetAmount / props.goal.goalAmount) * 100)
}

// 캐릭터 전용 앵커 좌표 (도로 아스팔트 표면에 발이 닿아 달리는 위치)
const CHARACTER_ROAD_ANCHORS = [
  { t: 0, left: 4, top: 68 },
  { t: 0.25, left: 24, top: 59 },
  { t: 0.5, left: 48, top: 54 },
  { t: 0.75, left: 72, top: 49 },
  { t: 1, left: 92, top: 45 },
]

// 마일스톤 마커 앵커 좌표: roadmap7.png를 픽셀 단위로 분석해서 각 지점의 도로 윗선(top edge) 실측값을 반영
const ROAD_ANCHORS = [
  { t: 0, left: 7, top: 63.9 },
  { t: 0.25, left: 28.5, top: 66.5 },
  { t: 0.5, left: 50, top: 53.3 },
  { t: 0.75, left: 71.5, top: 43.1 },
  { t: 1, left: 93, top: 34.7 },
]

function interpolateAnchors(anchors, trackPercent) {
  const t = Math.min(1, Math.max(0, (trackPercent - TRACK_START) / (TRACK_END - TRACK_START)))
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]
    if (t >= a.t && t <= b.t) {
      const localT = (t - a.t) / (b.t - a.t)
      return {
        left: a.left + (b.left - a.left) * localT,
        top: a.top + (b.top - a.top) * localT,
      }
    }
  }
  return anchors[anchors.length - 1]
}

function pointOnRoad(trackPercent) {
  return interpolateAnchors(ROAD_ANCHORS, trackPercent)
}

function markerStyle(trackPercent) {
  const { left, top } = pointOnRoad(trackPercent)
  return { left: `${left}%`, top: `${top}%` }
}

function characterPointOnRoad(trackPercent) {
  return interpolateAnchors(CHARACTER_ROAD_ANCHORS, trackPercent)
}

function characterMarkerStyle(trackPercent) {
  const { left, top } = characterPointOnRoad(trackPercent)
  return { left: `${left}%`, top: `${top}%` }
}
</script>
