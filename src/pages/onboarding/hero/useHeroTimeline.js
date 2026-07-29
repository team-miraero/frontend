// 히어로 섹션의 전체 애니메이션 시퀀스(타이핑 → 온점 → 이동 → 스토리보드 진행 → 브랜드/CTA) 타이밍 로직
import { ref, computed, onMounted, onUnmounted } from 'vue'

const LINE1_TEXT = '목표만 정하면,'
const LINE2_PART1 = '페이스는 '
const LINE2_MIRAERO = '미래로'
const LINE2_PART2 = '가 맞출게요'

const TYPE_SPEED = 75
const LINE_PAUSE = 250
const STATS_COUNT_DURATION = 1000

const HOLD_TEXT_DOT = 400
const GROW_DURATION = 500
const SHRINK_PULSE_DURATION = 500
const BOUNCE_PULSE_DURATION = 450
const MOVE_TO_START_DURATION = 1400

const TRAIL_SPAWN_INTERVAL = 40
const TRAIL_LIFETIME = 180

const BRAND_DELAY = 1200

/**
 * @typedef {Object} HeroStat
 * @property {number} target
 * @property {string} suffix
 * @property {number} decimals
 * @property {string} label
 */

/** @type {HeroStat[]} */
const STATS = [
  { target: 23, suffix: '만+', decimals: 0, label: '사회초년생 회원' },
  { target: 92, suffix: '%', decimals: 0, label: '목표 달성률' },
  { target: 4.8, suffix: '★', decimals: 1, label: '앱스토어 평점' },
]

/**
 * @param {{ mainRef: import('vue').Ref, dotRef: import('vue').Ref }} refs
 */
export function useHeroTimeline({ mainRef, dotRef }) {
  const typedLine1 = ref('')
  const typedPart1 = ref('')
  const typedMiraero = ref('')
  const typedPart2 = ref('')
  const statValues = ref(STATS.map(() => 0))
  const showRipple = ref(false)
  const trailDots = ref([])

  const scene = ref({
    showIntroText: true,
    showLine1: false,
    showLine2: false,
    showLine1Visible: true,
    showLine2TextVisible: true,
    showDot: false,
    isBlueTint: false,
    isPrimaryColor: false,
    isGrowing: false,
    isGlow: false,
    showStartRipple: false,
    showTrackBar: false,
    showTrackDot: false,
    step: 0,
    displayStep: 0,
    isFinalTravel: false,
    showBrand: false,
    showCTA: false,
  })

  const currentDotLeft = computed(() => {
    if (scene.value.isFinalTravel) return '50%'
    if (scene.value.step <= 1) return '30%'
    if (scene.value.step === 2) return '43.3%'
    if (scene.value.step === 3) return '56.6%'
    return '70%'
  })

  const currentDotTop = computed(() => {
    if (scene.value.isFinalTravel) return '38%'
    return '52%'
  })

  const progressPercent = computed(() => {
    if (scene.value.step <= 1) return 0
    if (scene.value.step === 2) return 33.3
    if (scene.value.step === 3) return 66.6
    return 100
  })

  let stopped = false
  const timers = []
  let statsIntervalId = null
  let trailIntervalId = null

  function wait(ms) {
    return new Promise((resolve) => {
      const id = setTimeout(resolve, ms)
      timers.push(id)
    })
  }

  async function typeText(text, onUpdate) {
    let current = ''
    for (const ch of text) {
      if (stopped) return
      current += ch
      onUpdate(current)
      await wait(TYPE_SPEED)
    }
  }

  function animateStats() {
    const start = Date.now()
    statsIntervalId = setInterval(() => {
      if (stopped) return
      const progress = Math.min((Date.now() - start) / STATS_COUNT_DURATION, 1)
      statValues.value = STATS.map((stat) => stat.target * progress)
      if (progress >= 1) {
        clearInterval(statsIntervalId)
      }
    }, 16)
  }

  // ⭐️ CSS 트랜지션이 "진짜로" 끝나는 시점(transitionend)에 맞춰 resolve → 탄성 오버슈트가
  // 덜 끝난 채로 트랙 점과 핸드오프되어 위치가 어긋나는 문제 방지 (고정 setTimeout 대신 이벤트 동기화)
  function moveDotToTrackStart() {
    return new Promise((resolve) => {
      if (!mainRef.value || !dotRef.value) {
        resolve()
        return
      }

      const el = dotRef.value
      const mainRect = mainRef.value.getBoundingClientRect()
      const dotRect = el.getBoundingClientRect()

      const targetX = mainRect.left + mainRect.width * 0.3
      const targetY = mainRect.top + mainRect.height * 0.52

      const dotCenterX = dotRect.left + dotRect.width / 2
      const dotCenterY = dotRect.top + dotRect.height / 2

      const dx = targetX - dotCenterX
      const dy = targetY - dotCenterY

      const finish = () => {
        el.removeEventListener('transitionend', onTransitionEnd)
        resolve()
      }
      const onTransitionEnd = (e) => {
        if (e.target !== el || e.propertyName !== 'transform') return
        finish()
      }
      el.addEventListener('transitionend', onTransitionEnd)
      // 안전장치: transitionend가 어떤 이유로든 발화하지 않을 경우를 대비한 타임아웃 폴백
      const fallbackId = setTimeout(finish, MOVE_TO_START_DURATION + 150)
      timers.push(fallbackId)

      //Ease-In-Out 곡선 (1.4초)
      el.style.transition = 'transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`
    })
  }

  //이동 중인 온점이 지나간 자리에 옅은 잔상을 남기는 트레일 효과
  function spawnTrailDot(x, y) {
    const id = `${Date.now()}-${Math.random()}`
    trailDots.value.push({ id, x, y })
    const timeoutId = setTimeout(() => {
      trailDots.value = trailDots.value.filter((dot) => dot.id !== id)
    }, TRAIL_LIFETIME)
    timers.push(timeoutId)
  }

  function startTrailEffect(durationMs) {
    trailIntervalId = setInterval(() => {
      if (stopped || !mainRef.value || !dotRef.value) return
      const mainRect = mainRef.value.getBoundingClientRect()
      const dotRect = dotRef.value.getBoundingClientRect()
      spawnTrailDot(
        dotRect.left + dotRect.width / 2 - mainRect.left,
        dotRect.top + dotRect.height / 2 - mainRect.top
      )
    }, TRAIL_SPAWN_INTERVAL)

    const stopId = setTimeout(() => {
      clearInterval(trailIntervalId)
    }, durationMs)
    timers.push(stopId)
  }

  function triggerRipple() {
    showRipple.value = true
    setTimeout(() => {
      showRipple.value = false
    }, 400)
  }

  async function runFullStepsFlow() {
    const STEP_DURATION = 2800 // 1~3단계 각 문구가 여유롭고 차분하게 유지되는 시간 (2.8초)
    const TOTAL_TRAVEL_DURATION = 9600 // 프로그레스 바가 우측 끝까지 가는 총 시간 (9.6초)
    const FINAL_STEP_HOLD = 2400

    // 1. 프로그레스 바와 점이 맨 오른쪽 끝(100% / 70% 위치)을 향해 9.6초간 여유롭게 이동 시작
    scene.value.step = 4

    // 2. 1단계 ~ 3단계 문구가 8.4초 동안 (2.8초씩) 여유있게 전환
    for (let s = 1; s <= 3; s++) {
      scene.value.displayStep = s
      triggerRipple()
      await wait(STEP_DURATION)
      if (stopped) return
    }

    // 3. 8.4초 시점: '목표 도착!' 문구가 먼저 화면에 확연히 등장!
    // (점이 끝에 도달하기 전 8.4초~9.6초 사이에 문구가 먼저 켜짐)
    scene.value.displayStep = 4
    triggerRipple()

    // 4. 9.6초 시점에 점이 맨 오른쪽 끝(100%)에 부드럽게 '착' 안착하며 연출 완성
    await wait(FINAL_STEP_HOLD)
    if (stopped) return

    // 4단계 완료 후 0.4초 여유를 두고 중앙 사선 이동 및 브랜드 화면으로 전환
    await wait(400)
    if (stopped) return

    // 6단계(목표 도착) 종료 후: 우측 끝의 파란 점이 중앙으로 사선 슬라이딩하며 커짐
    scene.value.step = 0
    scene.value.displayStep = 0
    scene.value.isFinalTravel = true
    scene.value.showBrand = true

    await wait(BRAND_DELAY)
    if (stopped) return

    scene.value.showCTA = true
    animateStats()
  }

  async function runTimeline() {
    await wait(200)
    if (stopped) return

    // 1. Line 1
    scene.value.showLine1 = true
    scene.value.typingLine = 'line1'
    await typeText(LINE1_TEXT, (val) => {
      typedLine1.value = val
    })
    if (stopped) return

    await wait(LINE_PAUSE)
    if (stopped) return

    // 2. Line 2
    scene.value.showLine2 = true
    scene.value.typingLine = 'line2'

    await typeText(LINE2_PART1, (val) => {
      typedPart1.value = val
    })
    if (stopped) return

    await typeText(LINE2_MIRAERO, (val) => {
      typedMiraero.value = val
    })
    if (stopped) return

    await typeText(LINE2_PART2, (val) => {
      typedPart2.value = val
    })
    if (stopped) return

    scene.value.typingLine = null

    // 1) 기본 검정 온점 밀착 등장 (.)
    scene.value.showDot = true
    scene.value.isBlueTint = false
    scene.value.isPrimaryColor = false
    scene.value.isGrowing = false
    scene.value.isGlow = false

    await wait(280)
    if (stopped) return

    // 2) 살짝 파란 빛 스림 / 변색 (•)
    scene.value.isBlueTint = true

    await wait(250)
    if (stopped) return

    // 3) 파란색으로 변하고 크기 커짐 (●)
    scene.value.isBlueTint = false
    scene.value.isPrimaryColor = true
    scene.value.isGrowing = true

    await wait(250)
    if (stopped) return

    // 4) 은은한 글로우 뿜음 ◉ (Glow) (0.3초 추가 여유: 총 600ms)
    scene.value.isGlow = true

    await wait(600)
    if (stopped) return

    // 5) 대각선 왼쪽 아래로 이동 + 잔상 효과
    scene.value.showLine1Visible = false
    scene.value.showLine2TextVisible = false
    startTrailEffect(MOVE_TO_START_DURATION)
    await moveDotToTrackStart()
    if (stopped) return

    // 6) 프로그레스바 시작점 도착 → 트랙 연결 & 은은한 Ripple 1회 발화
    if (dotRef.value) {
      dotRef.value.style.transition = 'none'
      dotRef.value.style.opacity = '0'
    }

    scene.value.showIntroText = false
    scene.value.showDot = false
    scene.value.showTrackDot = true
    scene.value.showTrackBar = true
    scene.value.showStartRipple = true

    await wait(350)
    scene.value.showStartRipple = false
    if (stopped) return

    // 7) 수평 점 이동 및 스토리보드 시작
    runFullStepsFlow()
  }

  onMounted(() => runTimeline())

  onUnmounted(() => {
    stopped = true
    timers.forEach(clearTimeout)
    if (statsIntervalId !== null) clearInterval(statsIntervalId)
    if (trailIntervalId !== null) clearInterval(trailIntervalId)
  })

  return {
    scene,
    typedLine1,
    typedPart1,
    typedMiraero,
    typedPart2,
    statValues,
    showRipple,
    trailDots,
    STATS,
    currentDotLeft,
    currentDotTop,
    progressPercent,
  }
}
