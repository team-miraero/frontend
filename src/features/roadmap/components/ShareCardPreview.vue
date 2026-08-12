<!-- 친구에게 공유하기 카드 미리보기: 목표별 캐릭터 + 대시보드 진행률 -->
<template>
  <div
    ref="cardRef"
    class="relative overflow-hidden rounded-3xl border border-[#dbeafe] bg-[#f4f8ff] px-5 py-5"
  >
    <div
      class="relative z-20 flex min-w-0 items-center justify-center gap-1.5 pb-2 text-center whitespace-nowrap"
    >
      <input
        v-if="isEditingTitle"
        ref="titleInputRef"
        v-model="titleText"
        type="text"
        maxlength="20"
        class="w-40 whitespace-nowrap border-b border-primary bg-transparent text-center text-sm font-bold text-[#0a192f] outline-none"
        @blur="isEditingTitle = false"
        @keyup.enter="isEditingTitle = false"
      />
      <p v-else class="shrink-0 whitespace-nowrap text-sm font-bold text-[#0a192f]">
        {{ titleText }}
      </p>
      <button type="button" class="shrink-0" data-html2canvas-ignore="true" @click="startEditTitle">
        <img src="@/assets/images/pencil.png" alt="편집" class="size-3.5 object-contain" />
      </button>
    </div>

    <!-- 기존 모달 오픈 시 실행되는 canvas-confetti 애니메이션을 그대로 사용 -->
    <canvas
      ref="confettiCanvasRef"
      class="pointer-events-none absolute inset-0 z-10 size-full"
      data-html2canvas-ignore="true"
    />

    <!-- 100%: 목표 캐릭터와 콜리가 가까이 붙어 완주를 축하 -->
    <div
      v-if="isCompleted"
      class="relative z-0 mx-auto mt-1 flex h-44 max-w-[235px] items-end justify-center pb-3 sm:h-48 sm:max-w-[255px]"
    >
      <img
        :src="goalCharacterImage"
        :alt="`${goal.goalName} 캐릭터`"
        class="celebration-character h-[130px] w-[55%] object-contain sm:h-[144px]"
      />
      <div class="-ml-8 flex w-[48%] items-end sm:-ml-9" :style="celebrationColiStyle">
        <img
          :src="coliFriendImage"
          alt="페이스메이커 콜리"
          class="celebration-character h-[120px] w-full object-contain sm:h-[134px]"
        />
      </div>
    </div>

    <!-- 100% 미만: 메인 대시보드와 동일한 목표별 달리기 캐릭터 + 콜리 페이스메이커 -->
    <div
      v-else
      class="relative z-0 mx-auto mt-1 flex h-40 max-w-[230px] items-end justify-center pb-0.5 sm:h-44"
    >
      <img
        :src="runningGoalCharacterImage"
        :alt="`${goal.goalName} 달리기 캐릭터`"
        class="running-character h-[112px] w-[54%] object-contain sm:h-[124px]"
        :style="runningGoalCharacterStyle"
      />
      <div
        class="relative -ml-7 flex h-[94px] w-[32%] items-end justify-center sm:-ml-8 sm:h-[104px]"
      >
        <img
          :src="coliRunningImage"
          alt="페이스메이커 콜리"
          class="running-character h-[72px] w-full object-contain sm:h-[80px]"
        />
      </div>
    </div>

    <div class="relative z-20 mt-0 px-1">
      <div class="relative h-20">
        <div class="absolute left-[5%] right-[5%] top-5 h-[3px] rounded-full bg-slate-300" />
        <div
          class="absolute left-[5%] top-5 h-[3px] rounded-full bg-primary transition-[width] duration-500"
          :style="{ width: `${progressFillWidth}%` }"
        />

        <div
          v-for="milestone in shareMilestones"
          :key="milestone.id"
          class="absolute top-[12px] flex -translate-x-1/2 flex-col items-center"
          :style="{ left: `${milestone.position}%` }"
        >
          <span
            class="flex size-[18px] items-center justify-center rounded-full border-2"
            :class="
              milestone.completed
                ? '!border-primary !bg-primary text-white'
                : milestone.current
                  ? 'border-primary bg-white shadow-[0_0_0_4px_rgba(0,102,255,0.12)]'
                  : 'border-slate-300 bg-white'
            "
          >
            <svg v-if="milestone.completed" viewBox="0 0 16 16" class="size-3" aria-hidden="true">
              <path
                d="m3 8.2 3 3L13 4.8"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.2"
              />
            </svg>
            <span v-else-if="milestone.current" class="size-2 rounded-full bg-primary" />
          </span>
          <span
            class="mt-2.5 whitespace-nowrap text-[11px] font-bold"
            :class="milestone.completed || milestone.current ? 'text-primary' : 'text-slate-500'"
          >
            {{ milestone.percent }}%
          </span>
          <span
            class="mt-0.5 whitespace-nowrap text-[10px]"
            :class="milestone.current ? 'font-bold text-primary' : 'text-slate-500'"
          >
            {{ milestone.label }}
          </span>
        </div>
      </div>
    </div>

    <p class="relative z-20 mt-1 text-center text-5xl font-black tracking-tight text-primary">
      {{ normalizedProgress }}<span class="ml-1 text-2xl">%</span>
    </p>
    <p
      class="relative z-20 mx-auto mt-2 w-max max-w-full shrink-0 whitespace-nowrap rounded-full bg-[#eaf2ff] px-5 py-2 text-center text-xs font-bold text-[#0a192f]"
    >
      {{ achievementMessage }}
    </p>

    <div class="relative z-20 mt-4 border-t border-blue-100 pt-3">
      <div class="mx-auto flex w-max items-center justify-center gap-1.5 whitespace-nowrap">
        <img src="@/assets/images/logo.png" alt="" class="block size-4 shrink-0 object-contain" />
        <span class="shrink-0 text-xs font-bold tracking-[-0.2px] text-primary">미래로</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import confetti from 'canvas-confetti'
import duckFriendImage from '@/assets/images/duck_friend.png'
import lamaFriendImage from '@/assets/images/lama_friend.png'
import bearFriendImage from '@/assets/images/bear_friend.png'
import rabbitFriendImage from '@/assets/images/rabbit_friend.png'
import coliFriendImage from '@/assets/images/coli_friend.png'
import duckRunningImage from '@/assets/images/duck.png'
import lamaRunningImage from '@/assets/images/lama.png'
import bearRunningImage from '@/assets/images/bear.png'
import rabbitRunningImage from '@/assets/images/rabbit_new.png'
import coliRunningImage from '@/assets/images/coli8-thick.png'

const props = defineProps({
  goal: { type: Object, required: true },
  milestones: { type: Array, required: true },
})

const GOAL_TYPE_CHARACTER = {
  INDEPENDENCE: duckFriendImage,
  WEDDING: lamaFriendImage,
  EMERGENCY: bearFriendImage,
  LOAN: rabbitFriendImage,
}

const GOAL_TYPE_RUNNING_CHARACTER = {
  INDEPENDENCE: duckRunningImage,
  WEDDING: lamaRunningImage,
  EMERGENCY: bearRunningImage,
  LOAN: rabbitRunningImage,
}

const GOAL_TYPE_FOOT_OFFSET = {
  INDEPENDENCE: 7,
  WEDDING: 2.7,
  EMERGENCY: 1.8,
  LOAN: 8,
}

// friend PNG별 하단 투명 여백 차이를 보정해 콜리의 발끝을 왼쪽 캐릭터 기준선에 맞춘다.
const CELEBRATION_COLI_FOOT_OFFSET = {
  INDEPENDENCE: 6,
  WEDDING: 0,
  EMERGENCY: -4,
  LOAN: 4,
}

const goalCharacterImage = computed(
  () => GOAL_TYPE_CHARACTER[props.goal.goalType] ?? rabbitFriendImage
)
const normalizedProgress = computed(() =>
  Math.min(100, Math.max(0, Math.round(Number(props.goal.progressRate) || 0)))
)
const isCompleted = computed(() => normalizedProgress.value >= 100)
const celebrationColiStyle = computed(() => ({
  transform: `translateY(${CELEBRATION_COLI_FOOT_OFFSET[props.goal.goalType] ?? 0}px)`,
}))
const runningGoalCharacterImage = computed(
  () => GOAL_TYPE_RUNNING_CHARACTER[props.goal.goalType] ?? rabbitRunningImage
)
const runningGoalCharacterStyle = computed(() => ({
  transform: `translateY(${GOAL_TYPE_FOOT_OFFSET[props.goal.goalType] ?? 4.6}%)`,
}))

// 대시보드와 동일하게 목표 금액 대비 마일스톤 목표 금액의 비율을 사용한다.
const shareMilestones = computed(() => {
  const fallbackPercents = [25, 50, 75, 100]
  const source = props.milestones.length
    ? props.milestones.slice(0, 4).map((milestone, index) => ({
        id: milestone.milestoneId ?? index,
        percent: Math.round((milestone.targetAmount / props.goal.goalAmount) * 100),
      }))
    : fallbackPercents.map((percent) => ({ id: percent, percent }))

  return source.map((milestone, index) => {
    const completed = isCompleted.value || normalizedProgress.value >= milestone.percent
    const previousPercent = source[index - 1]?.percent ?? 0
    const current = !completed && normalizedProgress.value >= previousPercent

    return {
      ...milestone,
      completed,
      current,
      position: 8 + index * (84 / Math.max(1, source.length - 1)),
      label:
        milestone.percent >= 100
          ? completed
            ? '완주!'
            : '완주'
          : current
            ? `${index + 1}단계 (현재)`
            : `${index + 1}단계`,
    }
  })
})

const progressFillWidth = computed(() => (normalizedProgress.value / 100) * 90)
const achievementMessage = computed(() =>
  normalizedProgress.value >= 100 ? '멋지게 목표를 완주했어요!' : '목표까지 잘 달려가고 있어요!'
)

const cardRef = ref(null)
const confettiCanvasRef = ref(null)
let confettiRainTimer = null
const titleText = ref('이번 목표 자랑하기')
const isEditingTitle = ref(false)
const titleInputRef = ref(null)

async function startEditTitle() {
  isEditingTitle.value = true
  await nextTick()
  titleInputRef.value?.focus()
}

function fireConfetti() {
  if (!isCompleted.value || !confettiCanvasRef.value) return

  stopConfetti()

  const myConfetti = confetti.create(confettiCanvasRef.value, { resize: true, useWorker: true })
  const colors = [
    '#FFC542',
    '#0066FF',
    '#66B2FF',
    '#FF4D4D',
    '#FF8FAB',
    '#8B5CF6',
    '#10B981',
    '#FFD700',
  ]

  myConfetti({
    particleCount: 55,
    spread: 90,
    startVelocity: 35,
    origin: { x: 0.5, y: 0.25 },
    colors,
    ticks: 220,
    gravity: 0.8,
    decay: 0.92,
    scalar: 0.9,
  })

  setTimeout(() => {
    myConfetti({
      particleCount: 35,
      spread: 110,
      startVelocity: 28,
      origin: { x: 0.5, y: 0.25 },
      colors: colors.slice(0, 6),
      ticks: 180,
      gravity: 0.75,
      decay: 0.91,
      scalar: 0.75,
    })
  }, 120)

  // 첫 폭죽 뒤에는 작은 조각을 위에서 계속 내려 축하 분위기를 유지한다.
  confettiRainTimer = setInterval(() => {
    myConfetti({
      particleCount: 8,
      angle: 270,
      spread: 75,
      startVelocity: 5,
      origin: { x: 0.15 + Math.random() * 0.7, y: -0.05 },
      colors,
      ticks: 240,
      gravity: 0.55,
      drift: (Math.random() - 0.5) * 0.8,
      decay: 0.94,
      scalar: 0.65,
    })
  }, 420)
}

function stopConfetti() {
  if (!confettiRainTimer) return
  clearInterval(confettiRainTimer)
  confettiRainTimer = null
}

onBeforeUnmount(() => {
  stopConfetti()
})

defineExpose({ cardRef, fireConfetti, stopConfetti })
</script>

<style scoped>
.celebration-character {
  animation: characterPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.running-character {
  animation: runnerEnter 0.5s cubic-bezier(0.34, 1.3, 0.64, 1) both;
}

@keyframes characterPop {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.82);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes runnerEnter {
  from {
    opacity: 0;
    scale: 0.88;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
</style>
