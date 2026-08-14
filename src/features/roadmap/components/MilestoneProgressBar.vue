<!-- 목표 진행 로드맵: 전체 마일스톤 진행바 + 페이스 상태별 주인공-콜리 랠리 주행 (소프트 스카이블루 테마, 정적 클린 뷰) -->
<template>
  <div class="w-full">
    <!-- 모바일: 상단 전체 단계 미니맵 + 현재 목표 구간 클로즈업 뷰 -->
    <section class="sm:hidden" aria-label="현재 마일스톤 진행 상황">
      <!-- 1. 메인 랠리 클로즈업 카드 -->
      <div
        class="relative h-48 overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-b from-[#f0f6ff] via-[#f8fbff] to-white shadow-[0_3px_14px_rgba(0,102,255,0.06)]"
      >
        <!-- 상단 전체 단계 미니맵 스텝 바 -->
        <div class="absolute inset-x-0 top-3 z-30 flex items-center justify-between px-4">
          <div class="flex items-center gap-1.5">
            <span
              v-for="(milestone, idx) in milestones"
              :key="milestone.milestoneId"
              class="flex items-center gap-1.5"
            >
              <span
                class="flex items-center justify-center transition-all"
                :class="[
                  idx === activeMilestoneIndex
                    ? 'h-5 rounded-full bg-primary px-2 text-[9px] font-black text-white shadow-sm ring-2 ring-primary/20'
                    : idx < activeMilestoneIndex
                      ? 'size-3.5 rounded-full bg-primary/20 text-[8px] font-bold text-primary'
                      : 'size-3 rounded-full bg-slate-200 text-[8px] font-bold text-slate-400'
                ]"
              >
                <span v-if="idx < activeMilestoneIndex">✓</span>
                <span v-else-if="idx === activeMilestoneIndex">{{ idx + 1 }}단계</span>
                <span v-else>{{ idx + 1 }}</span>
              </span>
              <span
                v-if="idx < milestones.length - 1"
                class="h-0.5 w-2 rounded-full"
                :class="idx < activeMilestoneIndex ? 'bg-primary/40' : 'bg-slate-200'"
              />
            </span>
          </div>

          <span class="text-[10px] font-bold text-slate-400">
            {{ activeMilestoneIndex + 1 }} / {{ milestones.length }} 단계
          </span>
        </div>

        <!-- 모바일 줌인 도로 트랙 (소프트 스카이블루 프리미엄 트랙) -->
        <svg
          class="absolute inset-x-0 bottom-4 h-28 w-full"
          viewBox="0 0 390 112"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="mobileTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0064ff" />
              <stop offset="100%" stop-color="#38bdf8" />
            </linearGradient>
          </defs>
          <!-- 1. 그림자 -->
          <path
            d="M-18 72 C75 58 135 82 210 68 C286 54 334 62 408 48"
            stroke="#cce1fd"
            stroke-width="28"
            stroke-linecap="round"
            opacity="0.8"
          />
          <!-- 2. 화이트 레일 -->
          <path
            d="M-18 72 C75 58 135 82 210 68 C286 54 334 62 408 48"
            stroke="#ffffff"
            stroke-width="20"
            stroke-linecap="round"
          />
          <!-- 3. 트랙 바닥 -->
          <path
            d="M-18 72 C75 58 135 82 210 68 C286 54 334 62 408 48"
            stroke="#eaf2fe"
            stroke-width="14"
            stroke-linecap="round"
          />
          <!-- 4. 중앙 점선 -->
          <path
            d="M-18 72 C75 58 135 82 210 68 C286 54 334 62 408 48"
            stroke="#93c5fd"
            stroke-width="2"
            stroke-dasharray="10 8"
            stroke-linecap="round"
          />
          <!-- 5. 액티브 주행선 -->
          <path
            d="M-18 72 C75 58 135 82 210 68 C286 54 334 62 408 48"
            pathLength="100"
            stroke="url(#mobileTrackGrad)"
            stroke-width="9"
            stroke-linecap="round"
            :stroke-dasharray="`${mobileSegmentProgress} 100`"
          />
        </svg>

        <!-- 다음 목표 마커 (도로 윗선에 정확히 걸쳐진 마커 핀) -->
        <div class="absolute bottom-[82px] right-4 flex flex-col items-center z-10">
          <div class="mb-1 rounded-xl border border-slate-200/90 bg-white px-2.5 py-1 text-center shadow-sm">
            <span class="block text-[8px] font-bold text-slate-400">
              {{ isActiveMilestoneLast ? '최종 목표' : '다음 목표' }}
            </span>
            <strong class="block text-[11px] font-black text-[#0a192f]">
              {{ formatManwon(activeMilestone.targetAmount) }}원
            </strong>
          </div>
          <span
            v-if="isActiveMilestoneLast"
            class="flex size-6 translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-primary/10 shadow-sm ring-2 ring-primary/15"
          >
            <span class="size-2.5 rounded-full border-[2px] border-primary bg-white" />
          </span>
          <span
            v-else
            class="size-3.5 translate-y-1/2 rounded-full border-[2.5px] border-primary bg-white shadow-sm ring-2 ring-primary/20"
          />
        </div>

        <!-- A. 모바일 순항 중 (ON_TRACK): 완벽하게 나란히 어깨 맞대고 위치 -->
        <div
          v-if="paceStatus === 'ON_TRACK'"
          class="absolute bottom-[44px] flex -translate-x-1/2 items-end z-20 transition-[left] duration-500"
          :style="{ left: `${Math.max(12, Math.min(74, mobilePlayerPosition))}%` }"
        >
          <img
            :src="goalCharacterImage"
            alt="주인공 위치"
            class="h-16 w-auto drop-shadow-md"
            :style="goalCharacterFootStyle"
          />
          <div class="relative ml-0.5 flex items-end">
            <!-- 모바일 콜리 스마트 말풍선 (콜리 머리 위에 넉넉하게 위치) -->
            <div class="absolute -top-11 left-1/2 z-30 flex w-max -translate-x-1/2 flex-col items-center">
              <div class="relative rounded-2xl border border-slate-200/90 bg-white px-2.5 py-1 text-[10px] font-black text-[#0a192f] shadow-[0_4px_12px_rgba(10,25,47,0.1)] whitespace-nowrap">
                {{ paceMessage }}
                <!-- 말풍선 꼬리 (아래쪽 화살표) -->
                <div
                  class="absolute -bottom-1 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-white"
                ></div>
                <div
                  class="absolute -bottom-[5px] left-1/2 -z-10 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-slate-200"
                ></div>
              </div>
            </div>
            <img
              :src="coliBottomImage"
              alt="페이스메이커 콜리"
              class="h-10 w-auto drop-shadow-md"
            />
          </div>
        </div>

        <!-- B. 모바일 분리 주행 (BEHIND / AHEAD) -->
        <template v-else>
          <!-- 모바일 1. 주인공 캐릭터 -->
          <div
            class="absolute bottom-[44px] flex -translate-x-1/2 items-end transition-[left] duration-500"
            :class="paceStatus === 'AHEAD' ? 'z-20' : 'z-10'"
            :style="{ left: `${Math.max(12, Math.min(74, mobilePlayerPosition))}%` }"
          >
            <img
              :src="goalCharacterImage"
              alt="주인공 위치"
              class="h-16 w-auto drop-shadow-md"
              :style="goalCharacterFootStyle"
            />
          </div>

          <!-- 모바일 2. 페이스메이커 콜리 (상태별 앞/뒤 주행) -->
          <div
            class="absolute bottom-[44px] flex -translate-x-1/2 items-end transition-[left] duration-500"
            :class="paceStatus === 'AHEAD' ? 'z-10' : 'z-20'"
            :style="{ left: `${Math.max(12, Math.min(74, mobileColiPosition))}%` }"
          >
            <div class="relative flex flex-col items-center">
              <div class="absolute -top-11 left-1/2 z-30 flex w-max -translate-x-1/2 flex-col items-center">
                <div class="relative rounded-2xl border border-slate-200/90 bg-white px-2.5 py-1 text-[10px] font-black text-[#0a192f] shadow-[0_4px_12px_rgba(10,25,47,0.1)] whitespace-nowrap">
                  {{ paceMessage }}
                  <!-- 말풍선 꼬리 (아래쪽 화살표) -->
                  <div
                    class="absolute -bottom-1 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-white"
                  ></div>
                  <div
                    class="absolute -bottom-[5px] left-1/2 -z-10 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-slate-200"
                  ></div>
                </div>
              </div>
              <img
                :src="coliBottomImage"
                alt="페이스메이커 콜리"
                class="h-10 w-auto drop-shadow-md"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- 2. 하단 스마트 서머리 카드 -->
      <div class="mt-2.5 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[11px] font-bold text-slate-400">
              {{ activeMilestone.title || `다음 ${activeMilestoneIndex + 1}차 마일스톤` }}까지
            </p>
            <p class="mt-0.5 text-sm font-black text-[#0a192f]">
              <span class="text-primary">{{ formatManwon(remainingToActiveMilestone) }}원</span>
              남았어요
            </p>
          </div>
          <span class="shrink-0 rounded-full bg-primary/5 px-2.5 py-1 text-[10px] font-bold text-primary">
            {{ activeMilestone.targetDate || formatEndDate(goal.period.endDate) }} 도착 예정
          </span>
        </div>
      </div>
    </section>

    <!-- 태블릿/데스크톱: 소프트 스카이블루 와이드 트랙 (상하 균형 컴팩트 뷰) -->
    <div class="relative hidden w-full sm:block" style="aspect-ratio: 2172 / 370">
      <div class="absolute top-0 left-0 w-full" style="aspect-ratio: 2172 / 370">
        <svg class="absolute inset-0 size-full" viewBox="0 0 2172 370" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="activeTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0064ff" />
              <stop offset="50%" stop-color="#2563eb" />
              <stop offset="100%" stop-color="#38bdf8" />
            </linearGradient>
          </defs>

          <!-- 도로 베이스 트랙: 시원하고 든든한 볼륨의 마라톤 코스 -->
          <path
            d="M-40 245 C250 210 420 220 650 240 C900 262 1110 210 1360 232 C1600 252 1840 220 2212 242"
            stroke="#cce1fd"
            stroke-width="48"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.9"
          />
          <path
            d="M-40 245 C250 210 420 220 650 240 C900 262 1110 210 1360 232 C1600 252 1840 220 2212 242"
            stroke="#ffffff"
            stroke-width="36"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M-40 245 C250 210 420 220 650 240 C900 262 1110 210 1360 232 C1600 252 1840 220 2212 242"
            stroke="#eaf2fe"
            stroke-width="26"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M-40 245 C250 210 420 220 650 240 C900 262 1110 210 1360 232 C1600 252 1840 220 2212 242"
            stroke="#93c5fd"
            stroke-width="2.5"
            stroke-dasharray="26 22"
            stroke-linecap="round"
          />
          <!-- 달성 구간만 브랜드 블루로 강조 -->
          <path
            d="M-40 245 C250 210 420 220 650 240 C900 262 1110 210 1360 232 C1600 252 1840 220 2212 242"
            pathLength="100"
            stroke="url(#activeTrackGrad)"
            stroke-width="16"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transition-all duration-700 ease-out"
            :stroke-dasharray="`${playerProgress} 100`"
          />
        </svg>

        <!-- 마일스톤 라벨 + 마커: 도로 곡선 위 윗선 지점(pointOnRoad)에 배치 -->
        <div
          v-for="milestone in milestones"
          :key="milestone.milestoneId"
          class="absolute z-10 flex w-max -translate-x-1/2 -translate-y-full flex-col items-center transition-transform hover:scale-105"
          :style="markerStyle(milestonePosition(milestone), isLastMilestone(milestone))"
        >
          <div
            class="hidden flex-col items-center rounded-xl border px-3 py-1.5 shadow-sm transition-all sm:flex"
            :class="
              milestone.status === 'COMPLETED'
                ? 'border-primary/20 bg-white ring-2 ring-primary/10'
                : 'border-slate-200/90 bg-white/95 backdrop-blur-sm'
            "
          >
            <span
              class="text-xs font-black tracking-[-0.1px]"
              :class="milestone.status === 'COMPLETED' ? 'text-primary' : 'text-slate-500'"
            >
              {{ formatManwon(milestone.targetAmount) }}원
            </span>
            <span
              class="text-[11px] font-bold"
              :class="milestone.status === 'COMPLETED' ? 'text-primary/70' : 'text-slate-400'"
            >
              {{ milestone.percentage }}%
            </span>
            <span
              v-if="isLastMilestone(milestone)"
              class="mt-0.5 flex items-center gap-1 whitespace-nowrap border-t border-slate-100 pt-1 text-[10px] font-bold text-slate-400"
            >
              예상 도착일 {{ formatEndDate(goal.period.endDate) }}
            </span>
          </div>
          <span
            class="mt-1 flex size-4 translate-y-1/2 items-center justify-center rounded-full border-2 shadow-sm"
            :class="
              milestone.status === 'COMPLETED'
                ? 'border-primary bg-primary ring-2 ring-primary/20'
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

        <!-- A. 데스크톱 순항 중 (ON_TRACK): 완벽하게 나란히 어깨를 맞대고 함께 위치 -->
        <div
          v-if="paceStatus === 'ON_TRACK'"
          class="absolute flex -translate-x-1/2 -translate-y-full items-end z-20 transition-all duration-500"
          :style="characterMarkerStyle(playerProgress)"
        >
          <!-- 1. 주인공 캐릭터 -->
          <img
            :src="goalCharacterImage"
            alt="현재 위치"
            class="h-9 w-auto drop-shadow-md sm:h-20 md:h-24 lg:h-28 xl:h-36 transition-transform hover:scale-105"
            :style="goalCharacterFootStyle"
          />

          <!-- 2. 페이스메이커 콜리 (나란히 어깨 맞댐: 간격 없이 밀착) -->
          <div class="relative ml-0.5 sm:ml-1 flex items-end">
            <!-- 브로콜리 스마트 말풍선 -->
            <div
              class="absolute -top-7 left-1/2 z-30 flex w-max -translate-x-1/2 flex-col items-center sm:-top-13 lg:-top-15"
            >
              <div
                class="relative rounded-2xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-black text-[#0a192f] shadow-[0_6px_16px_rgba(10,25,47,0.12)] whitespace-nowrap"
              >
                {{ paceMessage }}
                <!-- 말풍선 꼬리 (아래쪽 화살표) -->
                <div
                  class="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-white sm:-bottom-2 sm:border-x-[6px] sm:border-t-[7px]"
                ></div>
                <div
                  class="absolute -bottom-[7px] left-1/2 -z-10 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-slate-200 sm:-bottom-[9px] sm:border-x-[6px] sm:border-t-[7px]"
                ></div>
              </div>
            </div>
            <img
              :src="coliBottomImage"
              alt="페이스메이커 콜리"
              class="h-6 w-auto drop-shadow-md sm:h-12 md:h-14 lg:h-16 xl:h-20 transition-transform hover:scale-105"
            />
          </div>
        </div>

        <!-- B. 데스크톱 분리 주행 (BEHIND / AHEAD): 앞/뒤로 시원하게 분리 -->
        <template v-else>
          <!-- 1. 주인공 캐릭터 (실제 달성 위치에서 주행) -->
          <div
            class="absolute flex -translate-x-1/2 -translate-y-full items-end transition-all duration-500"
            :class="paceStatus === 'AHEAD' ? 'z-20' : 'z-10'"
            :style="characterMarkerStyle(playerProgress)"
          >
            <img
              :src="goalCharacterImage"
              alt="현재 위치"
              class="h-9 w-auto drop-shadow-md sm:h-20 md:h-24 lg:h-28 xl:h-36 transition-transform hover:scale-105"
              :style="goalCharacterFootStyle"
            />
          </div>

          <!-- 2. 페이스메이커 콜리 (앞서서 유도하거나 뒤에서 추적) -->
          <div
            class="absolute flex -translate-x-1/2 -translate-y-full items-end transition-all duration-500"
            :class="paceStatus === 'AHEAD' ? 'z-10' : 'z-20'"
            :style="characterMarkerStyle(coliProgress)"
          >
            <div class="relative flex flex-col items-center">
              <!-- 브로콜리 스마트 말풍선 -->
              <div
                class="absolute -top-7 left-1/2 z-30 flex w-max -translate-x-1/2 flex-col items-center sm:-top-13 lg:-top-15"
              >
                <div
                  class="relative rounded-2xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-black text-[#0a192f] shadow-[0_6px_16px_rgba(10,25,47,0.12)] whitespace-nowrap"
                >
                  {{ paceMessage }}
                  <!-- 말풍선 꼬리 (아래쪽 화살표) -->
                  <div
                    class="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-white sm:-bottom-2 sm:border-x-[6px] sm:border-t-[7px]"
                  ></div>
                  <div
                    class="absolute -bottom-[7px] left-1/2 -z-10 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-slate-200 sm:-bottom-[9px] sm:border-x-[6px] sm:border-t-[7px]"
                  ></div>
                </div>
              </div>
              <img
                :src="coliBottomImage"
                alt="페이스메이커 콜리"
                class="h-6 w-auto drop-shadow-md sm:h-12 md:h-14 lg:h-16 xl:h-20 transition-transform hover:scale-105"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

// 목표 종류(goal.goalType)에 따라 로드맵 메인 캐릭터 매핑
const GOAL_TYPE_CHARACTER = {
  INDEPENDENCE: duckImage,
  WEDDING: lamaImage,
  EMERGENCY: bearImage,
  LOAN: rabbitImage,
}

const goalCharacterImage = computed(() => GOAL_TYPE_CHARACTER[props.goal?.goalType] ?? rabbitImage)

// 페이스 상태 (실제 데이터 및 differenceAmount 연동)
const paceStatus = computed(() => {
  const status = String(props.goal?.pace?.paceStatus ?? '').toUpperCase()
  if (status === 'AHEAD' || status === 'BEHIND' || status === 'ON_TRACK') return status
  const diff = Number(props.goal?.pace?.differenceAmount ?? 0)
  if (diff > 0) return 'AHEAD'
  if (diff < 0) return 'BEHIND'
  return 'ON_TRACK'
})

// 페이스 상태에 따른 스마트 말풍선 메시지 (간결하고 임팩트 있는 숏 문구)
const paceMessage = computed(() => {
  if (paceStatus.value === 'AHEAD') return '폭풍 질주 중!'
  if (paceStatus.value === 'BEHIND') return '조금만 힘내요!'
  return '나이스 페이스!'
})

// 주인공 캐릭터 위치 (실제 달성 진행률 그대로 반영, 3%면 3% 위치)
const playerProgress = computed(() =>
  Math.min(100, Math.max(0, Number(props.goal?.progressRate ?? 0)))
)

// 페이스메이커 콜리 위치 (AHEAD일 때 주인공보다 확실하게 뒤, BEHIND일 때 주인공보다 확실하게 앞)
const coliProgress = computed(() => {
  if (paceStatus.value === 'BEHIND') {
    return Math.min(100, playerProgress.value + 10)
  }
  if (paceStatus.value === 'AHEAD') {
    return playerProgress.value - 10
  }
  return playerProgress.value
})

const activeMilestoneIndex = computed(() => {
  const inProgressIndex = props.milestones.findIndex(
    (milestone) => milestone.status === 'IN_PROGRESS'
  )
  if (inProgressIndex >= 0) return inProgressIndex

  const upcomingIndex = props.milestones.findIndex(
    (milestone) => milestone.status !== 'COMPLETED'
  )
  return upcomingIndex >= 0 ? upcomingIndex : Math.max(0, props.milestones.length - 1)
})

const activeMilestone = computed(
  () => props.milestones[activeMilestoneIndex.value] ?? { targetAmount: props.goal?.goalAmount ?? 0 }
)

const isActiveMilestoneLast = computed(
  () => activeMilestoneIndex.value === Math.max(0, props.milestones.length - 1)
)

const previousMilestoneAmount = computed(
  () => props.milestones[activeMilestoneIndex.value - 1]?.targetAmount ?? 0
)

const remainingToActiveMilestone = computed(() =>
  Math.max(0, (activeMilestone.value.targetAmount ?? 0) - (props.goal?.currentAmount ?? 0))
)

const mobileSegmentProgress = computed(() => {
  const segmentAmount = (activeMilestone.value.targetAmount ?? 0) - previousMilestoneAmount.value
  if (segmentAmount <= 0) return 100
  return Math.min(
    100,
    Math.max(
      0,
      (((props.goal?.currentAmount ?? 0) - previousMilestoneAmount.value) / segmentAmount) * 100
    )
  )
})

// 모바일 위치 계산 (실제 진행률 기준 + 콜리는 확실하게 뒤/앞)
const mobilePlayerPosition = computed(() => 14 + mobileSegmentProgress.value * 0.58)

const mobileColiPosition = computed(() => {
  if (paceStatus.value === 'BEHIND') {
    return Math.min(76, mobilePlayerPosition.value + 14)
  }
  if (paceStatus.value === 'AHEAD') {
    return Math.max(4, mobilePlayerPosition.value - 14)
  }
  return mobilePlayerPosition.value
})

// 각 PNG의 아래쪽 투명 여백 보정 (도로 표면에 정확히 밀착)
const GOAL_TYPE_FOOT_OFFSET = {
  INDEPENDENCE: 0,
  WEDDING: 0,
  EMERGENCY: 0,
  LOAN: 0,
}

const goalCharacterFootStyle = computed(() => ({
  transform: `translateY(${GOAL_TYPE_FOOT_OFFSET[props.goal?.goalType] ?? 0}%)`,
}))

function milestonePosition(milestone) {
  return milestone.percentage
}

function isLastMilestone(milestone) {
  return props.milestones[props.milestones.length - 1]?.milestoneId === milestone.milestoneId
}

function formatManwon(amount) {
  return `${Math.round((amount ?? 0) / 10000).toLocaleString()}만`
}

function formatEndDate(yyyyMM) {
  return (yyyyMM ?? '').replace('-', '.')
}

// 캐릭터 전용 앵커 좌표 (370px 높이 기준 도로 표면 안착)
const CHARACTER_ROAD_ANCHORS = [
  { t: 0, left: 8.5, top: 65.0 },
  { t: 0.25, left: 28, top: 60.8 },
  { t: 0.5, left: 50, top: 65.0 },
  { t: 0.75, left: 72, top: 63.2 },
  { t: 1, left: 91.5, top: 63.2 },
]

// 마일스톤 마커 앵커 좌표 (370px 높이 기준 도로 상단 윗선에 완벽 일치)
const ROAD_ANCHORS = [
  { t: 0, left: 8, top: 57.0 },
  { t: 0.25, left: 28.5, top: 56.8 },
  { t: 0.5, left: 50, top: 57.2 },
  { t: 0.75, left: 71.5, top: 57.0 },
  { t: 1, left: 92, top: 56.8 },
]

// 0~100 사이의 진행률(progress)을 도로 앵커 곡선에 정확히 보간 (0 이하 외삽 지원)
function interpolateAnchors(anchors, progress) {
  const t = Number(progress) / 100
  if (t <= anchors[0].t) {
    const first = anchors[0]
    const second = anchors[1]
    const slopeLeft = (second.left - first.left) / (second.t - first.t)
    const slopeTop = (second.top - first.top) / (second.t - first.t)
    return {
      left: Math.max(3.5, first.left + slopeLeft * (t - first.t)),
      top: first.top + slopeTop * (t - first.t),
    }
  }
  if (t >= anchors[anchors.length - 1].t) {
    return anchors[anchors.length - 1]
  }
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

function pointOnRoad(progress) {
  return interpolateAnchors(ROAD_ANCHORS, progress)
}

function markerStyle(progress, isFinish = false) {
  if (isFinish) {
    return { left: '92%', top: '56.8%' }
  }

  const { left, top } = pointOnRoad(progress)
  return { left: `${left}%`, top: `${top}%` }
}

function characterPointOnRoad(progress) {
  return interpolateAnchors(CHARACTER_ROAD_ANCHORS, progress)
}

function characterMarkerStyle(progress) {
  const { left, top } = characterPointOnRoad(progress)
  return { left: `${left}%`, top: `${top}%` }
}
</script>
