<!-- 친구에게 공유하기 카드 미리보기 (트로피/달성률/마일스톤 로드맵/후광 애니메이션) -->
<template>
  <div
    ref="cardRef"
    class="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-[#eaf2ff] via-white to-white px-5 py-5"
  >
    <!-- 카드 제목 (이번 목표 자랑하기) -->
    <div class="relative z-10 flex items-center justify-center gap-1.5 pb-3 text-center whitespace-nowrap">
      <input
        v-if="isEditingTitle"
        ref="titleInputRef"
        v-model="titleText"
        type="text"
        maxlength="20"
        class="whitespace-nowrap border-b border-primary bg-transparent text-center text-sm font-bold text-slate-700 outline-none"
        @blur="isEditingTitle = false"
        @keyup.enter="isEditingTitle = false"
      />
      <p v-else class="whitespace-nowrap text-sm font-bold leading-none text-slate-600">{{ titleText }}</p>
      <button
        type="button"
        class="shrink-0"
        data-html2canvas-ignore="true"
        @click="startEditTitle"
      >
        <img src="@/assets/images/pencil.png" alt="편집" class="size-3.5 object-contain" />
      </button>
    </div>

    <!-- 컨페티: canvas-confetti 물리 엔진을 이용한 극도로 자연스러운 축하 폭죽 연출 -->
    <canvas
      ref="confettiCanvasRef"
      class="pointer-events-none absolute inset-0 z-10 size-full"
      data-html2canvas-ignore="true"
    />

    <div class="relative z-10 mx-auto mt-3 flex size-32 items-center justify-center">
      <!-- 후광: 황금빛 펄스 글로우 + 회전하는 빛줄기 모션 -->
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2"
        data-html2canvas-ignore="true"
      >
        <!-- 1. 은은한 블루/화이트 펄스 글로우 -->
        <div
          class="absolute inset-0 animate-halo-pulse rounded-full"
          style="
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.85) 0%,
              rgba(153, 197, 255, 0.45) 40%,
              rgba(102, 178, 255, 0) 70%
            );
            filter: blur(6px);
          "
        />
        <!-- 2. 은은하게 회전하는 빛줄기 -->
        <div
          class="absolute inset-0 animate-halo-spin rounded-full opacity-50"
          style="
            background: conic-gradient(
              from 0deg,
              rgba(153, 197, 255, 0.35) 0deg 18deg,
              transparent 18deg 36deg,
              rgba(153, 197, 255, 0.35) 36deg 54deg,
              transparent 54deg 72deg,
              rgba(153, 197, 255, 0.35) 72deg 90deg,
              transparent 90deg 108deg,
              rgba(153, 197, 255, 0.35) 108deg 126deg,
              transparent 126deg 144deg,
              rgba(153, 197, 255, 0.35) 144deg 162deg,
              transparent 162deg 180deg,
              rgba(153, 197, 255, 0.35) 180deg 198deg,
              transparent 198deg 216deg,
              rgba(153, 197, 255, 0.35) 216deg 234deg,
              transparent 234deg 252deg,
              rgba(153, 197, 255, 0.35) 252deg 270deg,
              transparent 270deg 288deg,
              rgba(153, 197, 255, 0.35) 288deg 306deg,
              transparent 306deg 324deg,
              rgba(153, 197, 255, 0.35) 324deg 342deg,
              transparent 342deg 360deg
            );
            filter: blur(2px);
            mask-image: radial-gradient(circle, black 30%, transparent 70%);
            -webkit-mask-image: radial-gradient(circle, black 30%, transparent 70%);
          "
        />
      </div>
      <!-- 반짝이는 별 장식 -->
      <span
        v-for="sparkle in SPARKLES"
        :key="sparkle.id"
        class="pointer-events-none absolute animate-twinkle"
        :style="{
          left: sparkle.left,
          top: sparkle.top,
          fontSize: sparkle.size,
          color: sparkle.color,
          animationDelay: sparkle.delay,
        }"
        >✦</span
      >

      <svg class="absolute inset-0" viewBox="0 0 100 100">
        <g transform="rotate(-90 50 50)">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="6" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#0066FF"
            stroke-width="6"
            stroke-linecap="round"
            :stroke-dasharray="`${(goal.progressRate / 100) * 282.7} 282.7`"
          />
        </g>
      </svg>
      <div class="relative z-10 size-28">
        <img
          src="@/assets/images/gold_trophy_3d.png"
          alt="목표 트로피"
          class="trophy-image size-28 object-contain animate-trophy-pop"
        />

        <div
          class="trophy-shine pointer-events-none absolute inset-0"
          data-html2canvas-ignore="true"
        />
      </div>
    </div>

    <p class="relative z-10 pt-2 text-center text-4xl font-black text-primary">
      {{ goal.progressRate }}<span class="text-2xl">%</span>
    </p>
    <p class="relative z-10 pt-1 text-center text-xs text-slate-500">
      {{ formatWon(goal.goalAmount) }} 목표
    </p>
    <p class="relative z-10 pt-1 text-center text-xs font-bold text-primary">
      {{ goal.pace.paceStatus === 'BEHIND' ? '▼' : '▲' }}
      {{ formatWon(Math.abs(goal.pace.differenceAmount)) }}
      {{ goal.pace.paceStatus === 'BEHIND' ? '뒤처짐' : '앞섬' }}
    </p>

    <div
      class="relative z-10 mt-2.5 rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-2"
    >
      <p class="text-center text-[11px] font-bold text-slate-400">목표 진행 로드맵</p>
      <div class="relative mt-2 h-14">
        <!-- 트랙: 대시보드 MilestoneProgressBar와 동일하게 좌우 7%씩 여백 -->
        <div
          class="absolute top-6 h-[5px] rounded-full bg-slate-200"
          style="left: 7%; right: 7%"
        />
        <div
          class="absolute top-6 h-[5px] rounded-full bg-primary"
          :style="{ left: `${TRACK_START}%`, width: `${progressFillWidth()}%` }"
        />

        <!-- 마일스톤 동그라미 마커 -->
        <span
          v-for="milestone in milestones"
          :key="`dot-${milestone.milestoneId}`"
          class="absolute top-[17px] flex size-[19px] -translate-x-1/2 items-center justify-center rounded-full border-2"
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
            class="size-2 block shrink-0"
          />
          <img
            v-else-if="isLastMilestone(milestone)"
            src="@/assets/icons/milestone-final-flag.svg"
            alt=""
            class="size-[7px] block shrink-0"
          />
        </span>

        <!-- 목표 페이스 마커 -->
        <span
          class="absolute top-[12px] flex size-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-dashed border-[#639bde] bg-slate-200"
          :style="{ left: `${pacePositions().target}%` }"
        >
          <img src="@/assets/icons/pace-target-runner.svg" alt="목표 페이스" class="size-4 block shrink-0" />
        </span>

        <!-- 현재 페이스 마커 -->
        <span
          class="absolute top-[12px] flex size-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-dashed border-primary bg-[rgba(0,102,255,0.6)] shadow-[0_4px_14px_rgba(0,102,255,0.31)] animate-pace-glow"
          :style="{ left: `${pacePositions().current}%` }"
        >
          <img
            src="@/assets/icons/pace-current-runner.svg"
            alt="현재 페이스"
            class="size-3.5 block shrink-0"
          />
        </span>
      </div>

      <div
        class="mt-1.5 flex flex-wrap items-center justify-center border-t border-slate-100 pt-1.5"
      >
        <div class="my-1 table mx-1.5">
          <span class="table-cell w-[15px] align-middle">
            <span
              class="flex size-[15px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-primary bg-[rgba(0,102,255,0.6)]"
            >
              <img src="@/assets/icons/pace-current-runner-sm.svg" alt="" class="size-2 block shrink-0" />
            </span>
          </span>
          <span class="table-cell whitespace-nowrap pl-1.5 align-middle text-[10px] font-medium leading-none text-slate-500">
            현재 · {{ formatWon(goal.currentAmount) }}
          </span>
        </div>
        <div class="my-1 table mx-1.5">
          <span class="table-cell w-[15px] align-middle">
            <span
              class="flex size-[15px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#639bde] bg-slate-200"
            >
              <img src="@/assets/icons/pace-target-runner-sm.svg" alt="" class="size-2 block shrink-0" />
            </span>
          </span>
          <span class="table-cell whitespace-nowrap pl-1.5 align-middle text-[10px] font-medium leading-none text-slate-400">
            목표 페이스 · {{ formatWon(goal.pace.expectedAmount) }}
          </span>
        </div>
      </div>
    </div>

    <div class="relative z-10 mt-2.5 flex justify-center">
      <span class="table">
        <span class="table-cell align-middle">
          <img
            src="@/assets/images/logo.png"
            alt="미래로"
            class="h-4 w-auto shrink-0 object-contain"
          />
        </span>
        <span class="table-cell whitespace-nowrap pl-1.5 align-middle text-[10px] leading-none text-slate-400"
          >| 내 금융을, 내 미래로</span
        >
      </span>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import confetti from 'canvas-confetti'

const props = defineProps({
  goal: { type: Object, required: true },
  milestones: { type: Array, required: true },
})

const cardRef = ref(null)
const confettiCanvasRef = ref(null)
const titleText = ref('이번 목표 자랑하기')
const isEditingTitle = ref(false)
const titleInputRef = ref(null)

async function startEditTitle() {
  isEditingTitle.value = true
  await nextTick()
  titleInputRef.value?.focus()
}

const TRACK_START = 7
const TRACK_END = 93

function toTrackPercent(ratio) {
  const clampedRatio = Math.min(1, Math.max(0, ratio))
  return TRACK_START + clampedRatio * (TRACK_END - TRACK_START)
}

function milestonePosition(milestone) {
  return toTrackPercent(milestone.targetAmount / props.goal.goalAmount)
}

function isLastMilestone(milestone) {
  return props.milestones[props.milestones.length - 1]?.milestoneId === milestone.milestoneId
}

function progressFillWidth() {
  return toTrackPercent(props.goal.progressRate / 100) - TRACK_START
}

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

function formatWon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만원`
}

const SPARKLES = [
  { id: 1, left: '2%', top: '10%', size: '14px', color: '#66B2FF', delay: '0s' },
  { id: 2, left: '88%', top: '6%', size: '10px', color: '#FFC542', delay: '0.4s' },
  { id: 3, left: '92%', top: '55%', size: '12px', color: '#0066FF', delay: '0.8s' },
  { id: 4, left: '4%', top: '62%', size: '9px', color: '#8B5CF6', delay: '1.2s' },
  { id: 5, left: '50%', top: '-4%', size: '11px', color: '#66B2FF', delay: '0.2s' },
]

function fireConfetti() {
  if (!confettiCanvasRef.value) return

  const myConfetti = confetti.create(confettiCanvasRef.value, {
    resize: true,
    useWorker: true,
  })

  myConfetti({
    particleCount: 55,
    spread: 90,
    startVelocity: 35,
    origin: { x: 0.5, y: 0.25 },
    colors: ['#FFC542', '#0066FF', '#66B2FF', '#FF4D4D', '#FF8FAB', '#8B5CF6', '#10B981', '#FFD700'],
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
      colors: ['#FFC542', '#0066FF', '#66B2FF', '#FF8FAB', '#8B5CF6'],
      ticks: 180,
      gravity: 0.75,
      decay: 0.91,
      scalar: 0.75,
    })
  }, 120)
}

defineExpose({
  cardRef,
  fireConfetti,
})
</script>

<style scoped>
.animate-trophy-pop {
  animation: trophyPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes trophyPop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.trophy-shine {
  position: absolute;
  inset: 0;

  background: linear-gradient(
    115deg,
    transparent 38%,
    rgba(255, 255, 255, 0.75) 50%,
    transparent 62%
  );

  background-size: 220% 220%;
  animation: trophyShine 3.5s ease-in-out infinite;
  opacity: 0.9;

  -webkit-mask-image: url('/src/assets/images/gold_trophy_3d.png');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;

  mask-image: url('/src/assets/images/gold_trophy_3d.png');
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

@keyframes trophyShine {
  0% {
    background-position: -180% 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  35% {
    background-position: 180% 0;
    opacity: 1;
  }
  45% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.animate-pace-glow {
  animation: paceGlow 1.8s ease-in-out infinite;
}

@keyframes paceGlow {
  0%,
  100% {
    box-shadow:
      0 4px 14px rgba(0, 102, 255, 0.31),
      0 0 0 0 rgba(0, 102, 255, 0.35);
  }
  50% {
    box-shadow:
      0 4px 14px rgba(0, 102, 255, 0.31),
      0 0 0 6px rgba(0, 102, 255, 0.12);
  }
}

.animate-halo-pulse {
  animation: haloPulse 2.4s ease-in-out infinite;
}

@keyframes haloPulse {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}

.animate-halo-spin {
  animation: haloSpin 14s linear infinite;
}

@keyframes haloSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-twinkle {
  animation: twinkle 2.2s ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.75) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.15) rotate(15deg);
  }
}
</style>
