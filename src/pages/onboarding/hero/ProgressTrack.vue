<!-- 프로그레스 바 트랙 + 이동하는 파란 점 + 도착 시 Spark & Ripple 효과 -->
<template>
  <!-- 1. 프로그레스 바 트랙 -->
  <Transition name="fade-blur">
    <div
      v-if="showTrackBar && !isFinalTravel"
      class="pointer-events-none absolute left-[30%] top-[52%] h-2 w-[40%] -translate-y-1/2 overflow-hidden rounded-full bg-blue-100/70"
    >
      <div
        class="smooth-track-fill h-full rounded-full bg-primary"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>
  </Transition>

  <!-- 2. 파란 점 모션 + Ripple 2~3회 + Spark 효과 -->
  <div
    v-if="showTrackDot"
    class="pointer-events-none absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
    :class="isFinalTravel ? 'travel-to-center' : 'smooth-dot-move'"
    :style="{
      left: isFinalTravel ? '50%' : dotLeft,
      top: isFinalTravel ? '38%' : dotTop,
    }"
  >
    <!-- 시작점 도착 시 은은한 Ripple 1회 -->
    <template v-if="showStartRipple">
      <span
        class="ripple-wave wave-start pointer-events-none absolute rounded-full border border-blue-400/70"
      ></span>
    </template>

    <!-- 은은한 Ripple 링 (도착 순간 flagActive일 때 발화) -->
    <template v-if="flagActive && !isFinalTravel">
      <span
        class="ripple-wave wave-1 pointer-events-none absolute rounded-full border border-blue-400/60"
      ></span>
      <span
        class="ripple-wave wave-2 pointer-events-none absolute rounded-full border border-blue-400/50"
      ></span>
      <span
        class="ripple-wave wave-3 pointer-events-none absolute rounded-full border border-blue-400/40"
      ></span>

      <!-- 은은하고 투명한 Spark 입자 4개 (도착 시 톡! 퍼짐) -->
      <span
        class="spark-particle spark-1 absolute rounded-full bg-blue-300/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
      ></span>
      <span
        class="spark-particle spark-2 absolute rounded-full bg-blue-300/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
      ></span>
      <span
        class="spark-particle spark-3 absolute rounded-full bg-blue-300/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
      ></span>
      <span
        class="spark-particle spark-4 absolute rounded-full bg-blue-300/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
      ></span>
    </template>

    <!-- 파란 점 본체 (도착 시 1.1배 커짐) -->
    <span
      class="relative block rounded-full transition-all duration-700 ease-out"
      :class="[
        isFinalTravel
          ? 'z-0 h-80 w-80 sm:h-[400px] sm:w-[400px] bg-gradient-to-tr from-blue-500/5 via-primary/5 to-sky-300/5 blur-3xl opacity-60 shadow-[0_0_100px_rgba(0,102,255,0.08)]'
          : 'z-20 h-4 w-4 bg-primary shadow-[0_0_12px_3px_rgba(0,102,255,0.45)] dot-pulse',
        flagActive && !isFinalTravel ? 'scale-110 shadow-[0_0_24px_8px_rgba(0,102,255,0.85)]' : '',
      ]"
    ></span>
  </div>
</template>

<script setup>
defineProps({
  showTrackBar: { type: Boolean, required: true },
  showTrackDot: { type: Boolean, required: true },
  showStartRipple: { type: Boolean, default: false },
  isFinalTravel: { type: Boolean, required: true },
  progressPercent: { type: Number, required: true },
  dotLeft: { type: String, required: true },
  dotTop: { type: String, required: true },
  flagActive: { type: Boolean, required: true },
})
</script>

<style scoped>
/* 프로그레스바 트랙 따라 0% -> 100% (9.6초 동안) 여유롭게 다가가며 수평 이동하는 linear 트랜지션 */
.smooth-dot-move {
  transition:
    left 9.6s linear,
    top 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.8s ease-out,
    height 0.8s ease-out;
}

/* 우측 끝에서 중앙으로 부드럽게 사선 이동 및 확장하는 트랜지션 */
.travel-to-center {
  transition:
    left 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    top 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.smooth-track-fill {
  transition: width 9.6s linear;
}

.wave-start {
  animation: ripple-out-once 0.9s ease-out forwards;
}

@keyframes ripple-out-once {
  0% {
    width: 16px;
    height: 16px;
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    width: 72px;
    height: 72px;
    opacity: 0;
    transform: scale(4.5);
  }
}

/* 점 펄스 애니메이션 */
.dot-pulse {
  animation: pulse-breathing 2s ease-in-out infinite;
}

@keyframes pulse-breathing {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 16px 4px rgba(0, 102, 255, 0.5);
  }
  50% {
    transform: scale(1.25);
    box-shadow: 0 0 24px 8px rgba(0, 102, 255, 0.75);
  }
}

/* 은은한 Ripple 링 애니메이션 */
.ripple-wave {
  width: 16px;
  height: 16px;
  animation: ripple-out 1.8s ease-out infinite;
}
.wave-1 {
  animation-delay: 0s;
}
.wave-2 {
  animation-delay: 0.5s;
}
.wave-3 {
  animation-delay: 1s;
}

@keyframes ripple-out {
  0% {
    width: 16px;
    height: 16px;
    opacity: 0.8;
    transform: scale(1);
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
    transform: scale(3.8);
  }
}

/* 은은하고 투명한 Spark 빛 입자 애니메이션 */
.spark-particle {
  width: 4px;
  height: 4px;
  opacity: 0;
  pointer-events: none;
}
.spark-1 {
  animation: spark-pop-1 1.6s ease-out infinite;
  animation-delay: 0.1s;
}
.spark-2 {
  animation: spark-pop-2 1.6s ease-out infinite;
  animation-delay: 0.4s;
}
.spark-3 {
  animation: spark-pop-3 1.6s ease-out infinite;
  animation-delay: 0.7s;
}
.spark-4 {
  animation: spark-pop-4 1.6s ease-out infinite;
  animation-delay: 0.3s;
}

@keyframes spark-pop-1 {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  40% {
    opacity: 0.85;
    transform: translate(-14px, -14px) scale(1.4);
  }
  80%,
  100% {
    opacity: 0;
    transform: translate(-24px, -24px) scale(0.2);
  }
}
@keyframes spark-pop-2 {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  40% {
    opacity: 0.85;
    transform: translate(14px, -12px) scale(1.4);
  }
  80%,
  100% {
    opacity: 0;
    transform: translate(24px, -20px) scale(0.2);
  }
}
@keyframes spark-pop-3 {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  40% {
    opacity: 0.85;
    transform: translate(-8px, 14px) scale(1.4);
  }
  80%,
  100% {
    opacity: 0;
    transform: translate(-16px, 22px) scale(0.2);
  }
}
@keyframes spark-pop-4 {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  40% {
    opacity: 0.85;
    transform: translate(10px, 12px) scale(1.4);
  }
  80%,
  100% {
    opacity: 0;
    transform: translate(18px, 20px) scale(0.2);
  }
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
</style>
