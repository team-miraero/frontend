<template>
  <main ref="mainRef" class="relative min-h-screen flex-1 overflow-hidden px-4">
    <!-- 1. 질문/타이핑 문장 -->
    <div
      class="absolute left-1/2 top-[38%] w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center"
    >
      <div v-if="scene.showIntroText" class="space-y-2">
        <!-- "목표만 정하면," -->
        <p
          v-if="scene.showLine1"
          class="text-[clamp(34px,6.5vw,56px)] font-black text-gray-900"
          :style="{ visibility: scene.showLine1Visible ? 'visible' : 'hidden' }"
        >
          {{ typedLine1 }}
          <span v-if="scene.typingLine === 'line1'" class="typing-cursor" aria-hidden="true"></span>
        </p>

        <!-- "페이스는 미래로가 맞출게요." -->
        <p
          v-if="scene.showLine2"
          class="text-[clamp(34px,6.5vw,56px)] font-black leading-[1.45] tracking-[-0.02em] text-gray-900"
        >
          <span :style="{ visibility: scene.showLine2TextVisible ? 'visible' : 'hidden' }">
            {{ typedPart1 }}<span v-if="typedMiraero" class="text-primary">{{ typedMiraero }}</span
            >{{ typedPart2 }}
          </span>

          <!-- 문장 속 진짜 온점 -->
          <span
            v-if="scene.showDot"
            ref="dotRef"
            class="sentence-dot inline-block rounded-full"
            :class="[
              scene.isPrimaryColor
                ? 'bg-primary'
                : scene.isBlueTint
                  ? 'bg-blue-600'
                  : 'bg-gray-900',
              scene.isGlow
                ? 'scale-150 shadow-[0_0_22px_8px_rgba(0,102,255,0.85)]'
                : scene.isGrowing
                  ? 'scale-135 shadow-[0_0_12px_4px_rgba(0,102,255,0.5)]'
                  : 'scale-100 shadow-none',
            ]"
          ></span>

          <span v-if="scene.typingLine === 'line2'" class="typing-cursor" aria-hidden="true"></span>
        </p>
      </div>
    </div>

    <!-- 온점이 대각선으로 이동하는 동안 남기는 잔상(트레일) -->
    <span
      v-for="trail in trailDots"
      :key="trail.id"
      class="trail-ghost pointer-events-none absolute rounded-full bg-primary"
      :style="{ left: trail.x + 'px', top: trail.y + 'px' }"
    ></span>

    <!-- 2. 스토리보드 6단계 아이콘 + 문구 -->
    <div
      class="absolute left-1/2 top-[34%] w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center"
    >
      <Transition name="icon-pop" mode="out-in">
        <div
          v-if="currentStoryStep"
          :key="scene.displayStep"
          class="flex flex-col items-center gap-2"
        >
          <div
            class="icon-bounce flex h-16 w-16 items-center justify-center rounded-full shadow-sm"
            :class="
              currentStoryStep.final
                ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                : 'bg-blue-50 text-primary'
            "
          >
            <svg
              class="h-8 w-8"
              :class="{ 'animate-pulse': currentStoryStep.final }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              :stroke-width="currentStoryStep.final ? 2.5 : 2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" :d="currentStoryStep.iconPath" />
            </svg>
          </div>
          <p class="text-[clamp(24px,4vw,34px)] font-black tracking-[-0.02em] text-gray-900">
            {{ currentStoryStep.label }}
          </p>
        </div>
      </Transition>
    </div>

    <!-- 3. 프로그레스 바 + 이동하는 점 -->
    <ProgressTrack
      :show-track-bar="scene.showTrackBar"
      :show-track-dot="scene.showTrackDot"
      :show-start-ripple="scene.showStartRipple"
      :is-final-travel="scene.isFinalTravel"
      :progress-percent="progressPercent"
      :dot-left="currentDotLeft"
      :dot-top="currentDotTop"
      :flag-active="scene.displayStep === 4"
    />

    <!-- 4. 최종 브랜드 메시지 + CTA + STATS -->
    <div
      class="z-10 absolute left-1/2 top-[38%] w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center"
    >
      <Transition name="flow-enter">
        <div v-if="scene.showBrand" class="space-y-2">
          <p
            class="text-[clamp(30px,5.5vw,52px)] font-black leading-[1.3] tracking-[-0.02em] text-gray-900"
          >
            내 금융을,
          </p>
          <p
            class="text-[clamp(30px,5.5vw,52px)] font-black leading-[1.3] tracking-[-0.02em] text-gray-900"
          >
            내
            <span class="text-primary drop-shadow-[0_0_20px_rgba(0,102,255,0.5)]"> 미래로</span>.
          </p>
          <p class="pt-3 text-sm leading-relaxed text-gray-500 md:text-base">
            월급부터 미래 목표까지,<br />
            현실적인 계획을 세우고 끝까지 도와드려요.
          </p>
        </div>
      </Transition>

      <Transition name="fade-blur">
        <div v-if="scene.showCTA" class="mt-8 md:mt-10">
          <div class="flex items-center justify-center gap-3">
            <RouterLink v-slot="{ navigate }" :to="{ name: ROUTE_NAMES.SIGNUP }" custom>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                @click="navigate"
              >
                무료로 시작하기
                <span aria-hidden="true">→</span>
              </button>
            </RouterLink>
            <a
              href="#service-intro"
              class="inline-flex items-center rounded-lg bg-accent-light px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-accent"
            >
              서비스 둘러보기
            </a>
          </div>

          <div class="mt-8 flex items-center justify-center gap-8 sm:gap-12 md:mt-10">
            <div v-for="(stat, index) in STATS" :key="stat.label" class="text-center">
              <p class="text-xl font-black text-gray-900 sm:text-2xl">
                {{ statValues[index].toFixed(stat.decimals) }}{{ stat.suffix }}
              </p>
              <p class="mt-1 text-xs text-gray-500 sm:text-sm">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 5. 아래 스크롤 안내 화살표 (화면 하단 fixed 고정으로 스크롤 없이 첫 화면 뷰포트에 바로 노출) -->
    <a
      href="#service-intro"
      class="pointer-events-auto fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center transition-all hover:opacity-100 opacity-75"
      aria-label="아래로 스크롤하여 바로 이동"
    >
      <div
        class="animate-chevron-bounce flex flex-col items-center -space-y-2 rounded-full bg-white/80 px-3.5 py-1.5 shadow-sm border border-gray-200/60 backdrop-blur-sm"
      >
        <svg
          class="h-4 w-4 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
        <svg
          class="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </a>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import ProgressTrack from './hero/ProgressTrack.vue'
import { STORY_STEPS } from './hero/storySteps'
import { useHeroTimeline } from './hero/useHeroTimeline'

const mainRef = ref(null)
const dotRef = ref(null)

const {
  scene,
  typedLine1,
  typedPart1,
  typedMiraero,
  typedPart2,
  statValues,
  trailDots,
  STATS,
  currentDotLeft,
  currentDotTop,
  progressPercent,
} = useHeroTimeline({ mainRef, dotRef })

const currentStoryStep = computed(() => STORY_STEPS[scene.value.displayStep - 1] ?? null)
</script>

<style scoped>
.sentence-dot {
  width: 0.22em;
  height: 0.22em;
  margin-left: 0.02em;
  vertical-align: baseline;
  transform-origin: center center;
  /* 팽창/수축 시 천천히 부드럽게 전환 */
  transition:
    transform 0.75s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.6s ease-out,
    box-shadow 0.6s ease-out;
}

/* 온점이 지나간 자리에 남는 아주 옅은 잔상 */
.trail-ghost {
  width: 8px;
  height: 8px;
  transform: translate(-50%, -50%);
  animation: trail-fade 0.25s ease-out forwards;
}

@keyframes trail-fade {
  from {
    opacity: 0.22;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4);
  }
}

/* 아이콘 등장 모션 */
.icon-bounce {
  animation: icon-subtle-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes icon-subtle-scale {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  60% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 카드 전환 트랜지션 */
.icon-pop-enter-active,
.icon-pop-leave-active {
  transition:
    opacity 0.45s ease-in-out,
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.45s ease-in-out;
}

.icon-pop-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
  filter: blur(4px);
}

.icon-pop-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
  filter: blur(4px);
}

.flow-enter-enter-active {
  transition:
    opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    transform 1s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.9s ease-out;
}

.flow-enter-enter-from {
  opacity: 0;
  transform: translate(60px, 30px) scale(0.9);
  filter: blur(10px);
}

.fade-blur-enter-active,
.fade-blur-leave-active {
  transition:
    opacity 0.55s ease-in-out,
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.55s ease-in-out;
}

.fade-blur-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  filter: blur(4px);
}

.fade-blur-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
  filter: blur(4px);
}

.typing-cursor {
  display: inline-block;
  width: 0.15em;
  height: 0.85em;
  margin-left: 0.08em;
  background: #000000;
  border-radius: 2px;
  vertical-align: -0.05em;
  animation: typing-blink 0.9s steps(1) infinite;
}

@keyframes typing-blink {
  0%,
  50% {
    opacity: 1;
  }
  50.01%,
  100% {
    opacity: 0;
  }
}
.animate-chevron-bounce {
  animation: chevron-pulse-bounce 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes chevron-pulse-bounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.55;
  }
  50% {
    transform: translateY(5px);
    opacity: 0.9;
  }
}
</style>
