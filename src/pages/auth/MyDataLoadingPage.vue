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
                <span
                  v-if="statusOf(index) === 'done'"
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
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary"
                >
                  <span
                    class="h-2.5 w-2.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
                  />
                </span>
                <span v-else class="h-5 w-5 shrink-0 rounded-full border-2 border-gray-200" />

                <span
                  class="text-sm"
                  :class="statusOf(index) === 'pending' ? 'text-gray-400' : 'font-medium text-gray-900'"
                >
                  {{ item.label }}
                </span>
              </span>

              <span v-if="statusOf(index) === 'done'" class="shrink-0 text-xs font-semibold text-primary">
                완료
              </span>
            </li>
          </ul>
        </div>

        <div class="mt-5 h-1.5 w-full rounded-full bg-gray-100">
          <div
            class="h-1.5 rounded-full bg-primary transition-all duration-500"
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
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BrandHeader from '@/shared/ui/BrandHeader.vue'
import { MYDATA_SYNC_ITEMS } from '@/features/auth/constants/auth.constants'

const STEP_INTERVAL_MS = 1000
const NAVIGATE_DELAY_MS = 1000

// 완료된 항목 수(이 개수만큼 앞에서부터 'done', 그다음 하나가 'active', 나머지는 'pending')
const completedCount = ref(0)
let stepTimer = null
let navigateTimer = null

const progressPercent = computed(() =>
  Math.min((completedCount.value / MYDATA_SYNC_ITEMS.length) * 100, 100),
)

function statusOf(index) {
  if (index < completedCount.value) return 'done'
  if (index === completedCount.value) return 'active'
  return 'pending'
}

function goToNextStep() {
  // TODO: 실제 연동 완료 후 이동할 페이지가 정해지면 router.push({ name: ROUTE_NAMES.GOAL_SELECT }) 등으로 교체
}

onMounted(() => {
  stepTimer = setInterval(() => {
    if (completedCount.value >= MYDATA_SYNC_ITEMS.length) {
      clearInterval(stepTimer)
      navigateTimer = setTimeout(goToNextStep, NAVIGATE_DELAY_MS)
      return
    }
    completedCount.value += 1
  }, STEP_INTERVAL_MS)
})

onBeforeUnmount(() => {
  clearInterval(stepTimer)
  clearTimeout(navigateTimer)
})
</script>
