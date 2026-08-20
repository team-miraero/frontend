<template>
  <div
    class="flex justify-center bg-[#f8fafc]"
    :class="
      pacemakerStore.pacemakerStatus?.registered === false
        ? 'h-[calc(100dvh_-_122px_-_env(safe-area-inset-bottom))] sm:h-[calc(100dvh_-_130px_-_env(safe-area-inset-bottom))] md:h-auto md:min-h-[calc(100vh-80px)] md:pb-6'
        : 'min-h-[calc(100vh-80px)] pb-6'
    "
  >
    <section v-if="isLoading" class="w-full">
      <LoadingSpinner
        message="페이스메이커를 확인하고 있어요"
        container-class="min-h-[calc(100dvh-122px)] md:min-h-[calc(100dvh-80px)]"
      />
    </section>

    <section
      v-else-if="errorMessage"
      class="mx-auto flex min-h-[calc(100vh-89px)] w-full max-w-[800px] items-center justify-center px-5 py-16"
      aria-live="assertive"
    >
      <div
        class="w-full max-w-[440px] rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_16px_48px_rgba(15,38,70,0.08)] sm:px-9"
        role="alert"
      >
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"
          aria-hidden="true"
        >
          <svg
            class="size-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
            <path
              d="M10.3 3.8 2.4 17.3A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.7L13.7 3.8a2 2 0 0 0-3.4 0Z"
            />
          </svg>
        </div>
        <h2 class="mt-5 text-xl font-bold tracking-tight text-[#0a192f]">
          페이스메이커를 불러오지 못했어요
        </h2>
        <p class="mt-2 text-sm leading-6 text-slate-500">
          일시적인 오류일 수 있어요.<br />잠시 후 다시 시도해 주세요.
        </p>
        <button
          type="button"
          class="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-sm font-bold text-white shadow-[0_6px_20px_rgba(0,102,255,0.24)] transition hover:bg-[#0055dd] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          @click="loadPacemakerStatus"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 11a8 8 0 1 0-2.3 5.7" />
            <path d="M20 4v7h-7" />
          </svg>
          다시 시도
        </button>
      </div>
    </section>

    <div
      v-else-if="pacemakerStore.pacemakerStatus?.registered === false"
      class="page-container-narrow grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-3 py-3 md:flex md:h-auto md:flex-col md:gap-5 md:pb-0 md:pt-5"
    >
      <!-- 페이스메이커 핵심 설명 -->
      <section
        class="px-1 py-3 motion-safe:animate-fade-in-up sm:px-2 sm:py-4"
        aria-labelledby="pacemaker-intro-title"
      >
        <div>
          <h2
            id="pacemaker-intro-title"
            class="text-[22px] font-bold leading-[1.25] tracking-[-0.02em] text-[#0a192f] sm:text-2xl"
          >
            목표까지<br />차곡차곡 모아요
          </h2>
          <p class="mt-3 text-xs leading-[18px] text-slate-500 sm:text-sm sm:leading-5">
            매일 남은 돈을 계산해 자동으로 저축해요
          </p>
        </div>
      </section>

      <!-- 페이스메이커 서비스 흐름 -->
      <section
        class="flex min-h-0 flex-col rounded-[20px] border border-slate-200 bg-white px-4 py-4 sm:px-5 sm:py-5"
        aria-labelledby="pacemaker-how-title"
      >
        <h2 id="pacemaker-how-title" class="mb-2 text-base font-bold text-[#0a192f]">
          어떻게 모으나요?
        </h2>
        <ul class="flex min-h-0 flex-1 flex-col divide-y divide-slate-100">
          <li
            v-for="step in savingFlow"
            :key="step.title"
            class="flex min-h-0 flex-1 items-center gap-3 py-3"
          >
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-blue-50 text-primary"
              aria-hidden="true"
            >
              <AppIcon :name="step.icon" size="sm" />
            </span>
            <div class="min-w-0">
              <h3 class="text-sm font-semibold text-[#0a192f]">{{ step.title }}</h3>
              <p class="mt-0.5 text-[11px] leading-[15px] text-slate-500">
                {{ step.description }}
              </p>
            </div>
          </li>
        </ul>

        <div class="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
          <svg
            class="size-3.5 shrink-0 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <p class="text-[10px] leading-[14px] text-slate-500 sm:text-[11px]">
            하루 상한선은 언제든 수정할 수 있고,<br />
            필요하면 자동저축을 바로 일시정지할 수 있어요.
          </p>
        </div>
      </section>

      <!-- 저금통 개설 CTA -->
      <button
        type="button"
        class="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[16px] bg-primary px-5 text-[15px] font-bold tracking-tight text-white shadow-[0_7px_20px_rgba(0,102,255,0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 motion-safe:animate-fade-in-up motion-safe:transition motion-safe:hover:bg-[#0055dd] motion-safe:active:scale-[0.98]"
        style="animation-delay: 300ms"
        @click="goToSetup"
      >
        페이스메이커 전용 저금통 개설하기
        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>

    <PacemakerDashboard v-else @edit-max-amount="goToMaxAmountSettings" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PacemakerDashboard, usePacemakerStore } from '@/features/pacemaker'
import { PACEMAKER_HISTORY_PAGE_SIZE } from '@/features/pacemaker/constants/pacemaker.constants'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import AppIcon from '@/shared/ui/AppIcon.vue'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'

const router = useRouter()
const pacemakerStore = usePacemakerStore()
const isLoading = ref(true)
const errorMessage = ref('')

const savingFlow = [
  {
    icon: 'lightbulb',
    title: '남은 돈 계산',
    description: '오늘 쓸 수 있는 여유자금을 계산해요',
  },
  {
    icon: 'money',
    title: '자동으로 모으기',
    description: '설정한 한도 안에서 자동으로 저축해요',
  },
  {
    icon: 'target',
    title: '목표 자산으로 이동',
    description: '원하는 목표 자산에 쌓아서 관리해요',
  },
]

async function loadPacemakerStatus() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await pacemakerStore.fetchPacemakerStatus()
    if (typeof pacemakerStore.pacemakerStatus?.registered !== 'boolean') {
      throw new Error('페이스메이커 상태를 확인할 수 없습니다.')
    }

    if (pacemakerStore.pacemakerStatus.registered) {
      await pacemakerStore.fetchPacemakerDashboard()
      await Promise.all([
        pacemakerStore.fetchDepositTargets().catch(() => undefined),
        pacemakerStore
          .fetchHistories({ page: 0, size: PACEMAKER_HISTORY_PAGE_SIZE })
          .catch(() => undefined),
      ])
    }
  } catch (error) {
    errorMessage.value = error?.message ?? '페이스메이커 상태를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

function goToSetup() {
  router.push({ name: ROUTE_NAMES.PACEMAKER_SETUP })
}

function goToMaxAmountSettings() {
  router.push({ name: ROUTE_NAMES.PACEMAKER_SETUP, query: { mode: 'max-amount' } })
}

onMounted(() => {
  document.querySelector('main')?.scrollTo({ top: 0 })
  loadPacemakerStatus()
})
</script>
