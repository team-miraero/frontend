<!-- 마이데이터 연동 로딩 페이지 (AUTH-03) -->
<template>
  <HeroBackground>
    <div
      class="sticky top-0 z-20 mx-auto flex w-full max-w-[1440px] items-center px-4 py-6 backdrop-blur-md md:px-8 lg:px-[80px]"
    >
      <BrandHeader />
    </div>

    <main class="flex justify-center px-4 pb-16 pt-8">
      <div class="w-full max-w-[380px]">
        <div class="flex flex-col items-center text-center">
          <div class="relative flex h-24 w-24 items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-gray-100" />
            <div
              class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"
            />
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-sm font-bold text-white shadow"
            >
              KB
            </div>
          </div>

          <h1 class="mt-6 text-xl font-bold text-gray-900">KB Pay 마이데이터를 연동 중입니다</h1>
          <p class="mt-2 text-sm leading-relaxed text-gray-500">
            회원님의 자산 정보를 안전하게 불러오고 있어요.<br />
            잠시만 기다려 주세요.
          </p>
        </div>

        <div class="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <p class="text-xs font-semibold text-gray-400">연동 중인 데이터</p>

          <ul class="mt-3 divide-y divide-gray-100">
            <li
              v-for="(item, index) in MYDATA_SYNC_ITEMS"
              :key="item.id"
              class="flex items-center justify-between gap-3 py-2.5"
            >
              <span class="flex items-center gap-3">
                <Transition
                  mode="out-in"
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="scale-75 opacity-0"
                  enter-to-class="scale-100 opacity-100"
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="scale-100 opacity-100"
                  leave-to-class="scale-75 opacity-0"
                >
                  <span
                    v-if="statusOf(index) === 'done'"
                    key="done"
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-3 w-3"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span
                    v-else-if="statusOf(index) === 'active'"
                    key="active"
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary"
                  >
                    <span
                      class="h-2.5 w-2.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
                    />
                  </span>
                  <span v-else key="pending" class="h-5 w-5 shrink-0 rounded-full border-2 border-gray-200" />
                </Transition>

                <span
                  class="text-sm"
                  :class="statusOf(index) === 'pending' ? 'text-gray-400' : 'font-medium text-gray-900'"
                >
                  {{ item.label }}
                </span>
              </span>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
              >
                <span
                  v-if="statusOf(index) === 'done'"
                  class="shrink-0 text-xs font-semibold text-primary"
                >
                  완료
                </span>
              </Transition>
            </li>
          </ul>
        </div>

        <div class="mt-5 h-1.5 w-full rounded-full bg-gray-100">
          <div
            class="h-1.5 rounded-full bg-primary transition-all duration-300 ease-out"
            :style="{ width: progressPercent + '%' }"
          />
        </div>

        <p class="mt-3 text-center text-xs text-gray-400">연동 완료 시 자동으로 이동합니다</p>
      </div>
    </main>
  </HeroBackground>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BrandHeader from '@/shared/ui/BrandHeader.vue'
import { MYDATA_SYNC_ITEMS } from '@/features/auth/constants/auth.constants'
import { ROUTE_NAMES } from '@/shared/constants/routes'

// 한 항목당 리듬: ① 연동 중 유지 → ② 완료 체크+진행바 증가(같은 이벤트, 동시) → ③ 유지 → 다음 항목 시작
const STEP_ACTIVE_MS = 800
const STEP_DONE_HOLD_MS = 350
const NAVIGATE_DELAY_MS = 1000

const router = useRouter()

// 완료된 항목 수 — '완료' 표시와 진행바가 이 값 하나를 같이 바라봐서 항상 같은 프레임에 움직임
const doneCount = ref(0)
// true인 동안엔 방금 완료된 항목만 보이고 다음 항목은 아직 'active'로 넘어가지 않음
const isBetweenSteps = ref(false)
let isCancelled = false
let currentTimeoutId = null

function wait(ms) {
  return new Promise((resolve) => {
    currentTimeoutId = setTimeout(resolve, ms)
  })
}

const progressPercent = computed(() =>
  Math.min((doneCount.value / MYDATA_SYNC_ITEMS.length) * 100, 100),
)

function statusOf(index) {
  if (index < doneCount.value) return 'done'
  if (index === doneCount.value && !isBetweenSteps.value) return 'active'
  return 'pending'
}

function goToNextStep() {
  router.push({ name: ROUTE_NAMES.GOAL_SELECT })
}

async function runSyncSteps() {
  for (let i = 0; i < MYDATA_SYNC_ITEMS.length; i++) {
    // ① 연동 중 유지
    await wait(STEP_ACTIVE_MS)
    if (isCancelled) return

    // ② 완료 체크 + 진행바 증가를 같은 프레임에서 함께 반영, 다음 항목은 아직 시작 안 함
    doneCount.value += 1
    isBetweenSteps.value = true
    await wait(STEP_DONE_HOLD_MS)
    if (isCancelled) return

    // 다음 항목 시작
    isBetweenSteps.value = false
  }

  await wait(NAVIGATE_DELAY_MS)
  if (isCancelled) return

  goToNextStep()
}

onMounted(() => {
  runSyncSteps()
})

onBeforeUnmount(() => {
  isCancelled = true
  clearTimeout(currentTimeoutId)
})
</script>
