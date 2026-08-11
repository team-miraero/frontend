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
        <div
          v-if="mydataSyncError"
          class="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg"
          role="alert"
        >
          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              class="h-7 w-7"
              aria-hidden="true"
            >
              <path d="M12 8v5" />
              <path d="M12 17h.01" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <h1 class="mt-5 text-xl font-bold text-gray-900">마이데이터를 연동하지 못했어요</h1>
          <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ mydataSyncError }}</p>
          <button
            type="button"
            class="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isMydataLoading"
            @click="runMydataSync(true)"
          >
            다시 시도하기
          </button>
        </div>

        <template v-else>
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
                    <span
                      v-else
                      key="pending"
                      class="h-5 w-5 shrink-0 rounded-full border-2 border-gray-200"
                    />
                  </Transition>

                  <span
                    class="text-sm"
                    :class="
                      statusOf(index) === 'pending' ? 'text-gray-400' : 'font-medium text-gray-900'
                    "
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
        </template>
      </div>
    </main>
  </HeroBackground>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BrandHeader from '@/shared/ui/BrandHeader.vue'
import { useAuthFeatureStore } from '@/features/auth'
import { MYDATA_SYNC_ITEMS } from '@/features/auth/constants/auth.constants'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const PROGRESS_INTERVAL_MS = 500
const NAVIGATE_DELAY_MS = 600

const router = useRouter()
const authFeatureStore = useAuthFeatureStore()
const { isMydataLoading, mydataSyncError } = storeToRefs(authFeatureStore)

const doneCount = ref(0)
let isMounted = false
let runId = 0
let progressIntervalId = null
let navigationTimeoutId = null

function wait(ms) {
  return new Promise((resolve) => {
    navigationTimeoutId = window.setTimeout(resolve, ms)
  })
}

const progressPercent = computed(() =>
  Math.min((doneCount.value / MYDATA_SYNC_ITEMS.length) * 100, 100)
)

function statusOf(index) {
  if (index < doneCount.value) return 'done'
  if (index === doneCount.value) return 'active'
  return 'pending'
}

function stopProgress() {
  window.clearInterval(progressIntervalId)
  progressIntervalId = null
}

function startProgress() {
  stopProgress()
  doneCount.value = 0
  progressIntervalId = window.setInterval(() => {
    doneCount.value = Math.min(doneCount.value + 1, MYDATA_SYNC_ITEMS.length - 1)
  }, PROGRESS_INTERVAL_MS)
}

async function runMydataSync(isRetry = false) {
  const currentRunId = ++runId
  startProgress()

  try {
    if (isRetry) {
      await authFeatureStore.retryMydataInitialization()
    } else {
      await authFeatureStore.initializeMydata()
    }
    if (!isMounted || currentRunId !== runId) return

    stopProgress()
    doneCount.value = MYDATA_SYNC_ITEMS.length
    await wait(NAVIGATE_DELAY_MS)

    if (isMounted && currentRunId === runId) {
      router.replace({ name: ROUTE_NAMES.GOAL_SELECT })
    }
  } catch {
    stopProgress()
  }
}

onMounted(() => {
  isMounted = true
  runMydataSync()
})

onBeforeUnmount(() => {
  isMounted = false
  runId += 1
  stopProgress()
  window.clearTimeout(navigationTimeoutId)
})
</script>
