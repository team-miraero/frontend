<!-- 목표 진행 로드맵: 전체 마일스톤 진행바 + 현재/목표 페이스 비교 (도로 이미지 버전, 카드 없이 페이지에 바로 배치) -->
<template>
  <div class="relative w-full" style="aspect-ratio: 2172 / 592">
    <div class="absolute top-0 left-0 w-full" style="aspect-ratio: 2172 / 592">
      <img :src="roadmapImage" alt="" class="absolute inset-0 size-full object-contain" />

      <!-- 마일스톤 라벨 + 마커: 도로 곡선 위 지점(pointOnRoad)에 배치 -->
      <div
        v-for="milestone in milestones"
        :key="milestone.milestoneId"
        class="absolute flex w-max -translate-x-1/2 -translate-y-full flex-col items-center"
        :style="markerStyle(milestonePosition(milestone), isLastMilestone(milestone))"
      >
        <div
          class="hidden flex-col items-center rounded-lg border px-1.5 py-1 sm:flex sm:rounded-xl sm:px-3 sm:py-1.5"
          :class="
            milestone.status === 'COMPLETED'
              ? 'border-primary/20 bg-white'
              : 'border-slate-200 bg-white'
          "
        >
          <span
            class="text-[9px] font-black tracking-[-0.1px] sm:text-xs"
            :class="milestone.status === 'COMPLETED' ? 'text-primary' : 'text-slate-400'"
          >
            {{ formatManwon(milestone.targetAmount) }}원
          </span>
          <span
            class="text-[8px] font-bold sm:text-[11px]"
            :class="milestone.status === 'COMPLETED' ? 'text-primary/70' : 'text-slate-400'"
          >
            {{ milestone.percentage }}%
          </span>
          <span
            v-if="isLastMilestone(milestone)"
            class="mt-0.5 flex items-center gap-1 whitespace-nowrap border-t border-slate-100 pt-1 text-[8px] font-bold text-slate-400 sm:text-[10px]"
          >
            예상 도착일 {{ formatEndDate(goal.period.endDate) }}
          </span>
        </div>
        <span
          class="mt-0.5 flex size-3 translate-y-1/2 items-center justify-center rounded-full border-2 sm:mt-1 sm:size-4"
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
            class="size-[5px] sm:size-[7px]"
          />
        </span>
      </div>

      <!-- 현재 페이스: 토끼와 브로콜리(페이스메이커)가 나란히 도로 위를 함께 달림 -->
      <div
        class="absolute flex -translate-x-1/2 -translate-y-full items-end"
        :style="characterMarkerStyle(goal.progressRate)"
      >
        <img
          :src="goalCharacterImage"
          alt="현재 페이스"
          class="h-9 w-auto drop-shadow-md sm:h-20 md:h-24 lg:h-28 xl:h-36"
          :style="goalCharacterFootStyle"
        />
        <div class="relative ml-1 flex items-end sm:ml-2">
          <!-- 브로콜리 말풍선 -->
          <div
            class="absolute -top-7 left-1/2 z-20 flex w-max -translate-x-1/2 flex-col items-center sm:-top-13 lg:-top-15"
          >
            <div
              class="relative rounded-xl border border-slate-200 bg-white px-2 py-1 text-[8px] font-black text-[#0a192f] shadow-[0_4px_12px_rgba(10,25,47,0.12)] sm:rounded-2xl sm:px-3 sm:py-1.5 sm:text-xs"
            >
              페이스 유지 중!
              <!-- 말풍선 꼬리 (아래쪽 화살표) -->
              <div
                class="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-white sm:-bottom-2 sm:border-x-[6px] sm:border-t-[7px]"
              ></div>
              <div
                class="absolute -bottom-[7px] left-1/2 -z-10 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-slate-200 sm:-bottom-[9px] sm:border-x-[6px] sm:border-t-[7px]"
              ></div>
            </div>
          </div>
          <img
            :src="coliBottomImage"
            alt="페이스메이커"
            class="h-6 w-auto drop-shadow-md sm:h-12 md:h-14 lg:h-16 xl:h-20"
            style="transform: translateY(9.2%)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import roadmapImage from '@/assets/images/roadmap-wide-vector.svg'
import rabbitImage from '@/assets/images/rabbit_new.png'
import lamaImage from '@/assets/images/lama.png'
import bearImage from '@/assets/images/bear.png'
import duckImage from '@/assets/images/duck.png'
import coliBottomImage from '@/assets/images/coli8-thick.png'

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

// 목표 종류(goal.goalType)에 따라 로드맵 메인 캐릭터를 바꿔서 보여줌
// 독립자금(포스아거)/결혼자금(롤로라무)/비상금(심쿵비비)/학자금대출(루나키키), 콜리(페이스메이커)는 종류 무관 고정
const GOAL_TYPE_CHARACTER = {
  INDEPENDENCE: duckImage,
  WEDDING: lamaImage,
  EMERGENCY: bearImage,
  LOAN: rabbitImage,
}

const goalCharacterImage = computed(() => GOAL_TYPE_CHARACTER[props.goal.goalType] ?? rabbitImage)

// 각 PNG의 아래쪽 투명 여백만큼 이미지를 내려 실제 발끝이 공통 기준선에 닿도록 보정
const GOAL_TYPE_FOOT_OFFSET = {
  INDEPENDENCE: 7,
  WEDDING: 2.7,
  EMERGENCY: 1.8,
  LOAN: 8,
}

const goalCharacterFootStyle = computed(() => ({
  transform: `translateY(${GOAL_TYPE_FOOT_OFFSET[props.goal.goalType] ?? 4.6}%)`,
}))

// 마일스톤/페이스 마커 위치: goalAmount 대비 금액 비율(%)
const TRACK_START = 7
const TRACK_END = 93

// 금액 비율(0~1)을 트랙의 실제 표시 구간(7%~93%)으로 변환하는 단일 기준
function toTrackPercent(ratio) {
  const clampedRatio = Math.min(1, Math.max(0, ratio))
  return TRACK_START + clampedRatio * (TRACK_END - TRACK_START)
}

function milestonePosition(milestone) {
  return toTrackPercent(milestone.percentage / 100)
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

// 캐릭터 전용 앵커 좌표 (도로 아스팔트 표면에 발이 닿아 달리는 위치)
const CHARACTER_ROAD_ANCHORS = [
  { t: 0, left: 4, top: 58.81 },
  { t: 0.25, left: 24, top: 52.11 },
  { t: 0.5, left: 48, top: 52.81 },
  { t: 0.75, left: 72, top: 61.18 },
  { t: 1, left: 92, top: 54.27 },
]

// 마일스톤 마커 앵커 좌표: 현재 SVG 중심선에서 외곽선 반두께를 뺀 위쪽 검정 외곽선 실측값
const ROAD_ANCHORS = [
  { t: 0, left: 7, top: 45.49 },
  { t: 0.25, left: 28.5, top: 43.75 },
  { t: 0.5, left: 50, top: 40.04 },
  { t: 0.75, left: 71.5, top: 49.36 },
  { t: 1, left: 93, top: 42.76 },
]

// 앵커 좌표간 선형 보간
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

function markerStyle(trackPercent, isFinish = false) {
  if (isFinish) {
    return { left: '88.536%', top: '42.891%' }
  }

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
