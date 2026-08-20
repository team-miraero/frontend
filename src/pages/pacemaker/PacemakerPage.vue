<template>
  <div class="flex min-h-[calc(100vh-80px)] justify-center bg-[#f8fafc] pb-6">
    <section
      v-if="isLoading"
      class="w-full"
    >
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
      class="page-container-narrow flex flex-col gap-3 pb-10 pt-4 sm:gap-8 sm:pb-14 sm:pt-6"
    >
      <!-- 와이어프레임 Hero card -->
      <section
        class="relative overflow-hidden rounded-[28px] px-6 py-7 text-white shadow-[0_16px_48px_rgba(0,102,255,0.22)] motion-safe:animate-fade-in-up sm:px-8 sm:py-8"
        style="background: linear-gradient(135deg, #0066ff 0%, #66b2ff 100%)"
        aria-labelledby="pacemaker-intro-title"
      >
        <div
          class="pointer-events-none absolute right-0 top-0 size-48 translate-x-[30%] -translate-y-[30%] rounded-full bg-white opacity-10"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute bottom-0 right-12 size-28 translate-y-[40%] rounded-full bg-white opacity-10"
          aria-hidden="true"
        />

        <div class="relative z-[1]">
          <div class="mb-4 flex items-center gap-2">
            <span
              class="flex size-8 items-center justify-center rounded-xl bg-white/20"
              aria-hidden="true"
            >
              <svg
                class="size-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M2.7 9.3 9.3 2.5 8 6.7h5.3l-6.6 6.8L8 9.3H2.7Z" />
              </svg>
            </span>
            <span class="text-sm font-bold text-white/90">페이스메이커</span>
          </div>
          <h2
            id="pacemaker-intro-title"
            class="text-[26px] font-bold leading-[1.2] tracking-tight"
          >
            다음달 자금,<br />자동으로 마련해드려요
          </h2>
          <p class="mt-3 text-sm leading-relaxed text-white/80">
            오늘 하루 발생한 여유자금을 분석해<br class="hidden sm:block" />
            목표 달성을 위한 자금을 자동으로 저축해요
          </p>
        </div>
      </section>

      <!-- 와이어프레임 Feature cards -->
      <section aria-labelledby="pacemaker-feature-title">
        <h2 id="pacemaker-feature-title" class="sr-only">페이스메이커 주요 기능</h2>
        <ul class="grid gap-3 sm:gap-4 md:grid-cols-3">
          <li
            v-for="(feature, index) in featureItems"
            :key="feature.title"
            class="flex gap-4 rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] motion-safe:animate-fade-in-up md:flex-col md:gap-3"
            :style="{ animationDelay: `${100 + index * 80}ms` }"
          >
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F6] text-primary"
            >
              <AppIcon :name="feature.icon" />
            </span>
            <div>
              <h3 class="mb-1 text-sm font-bold text-[#0a192f]">{{ feature.title }}</h3>
              <p class="text-xs leading-relaxed text-slate-500">{{ feature.description }}</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- 와이어프레임 How it works -->
      <section
        class="rounded-[20px] border border-slate-200 bg-white px-5 py-5 sm:px-6"
        aria-labelledby="pacemaker-how-title"
      >
        <h2 id="pacemaker-how-title" class="mb-4 text-sm font-bold text-[#0a192f]">
          어떻게 작동하나요?
        </h2>
        <ol class="flex flex-col gap-3.5">
          <li v-for="step in howItWorks" :key="step.step" class="flex items-start gap-4">
            <span
              class="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style="background: linear-gradient(135deg, #0066ff 0%, #66b2ff 100%)"
              aria-hidden="true"
            >
              {{ step.step }}
            </span>
            <div>
              <h3 class="text-sm font-semibold text-[#0a192f]">{{ step.title }}</h3>
              <p class="mt-0.5 text-xs text-slate-400">{{ step.description }}</p>
            </div>
          </li>
        </ol>

        <div class="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4">
          <svg
            class="mt-0.5 size-4 shrink-0 text-primary"
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
          <p class="text-xs leading-relaxed text-slate-500">
            하루 상한선은 언제든 수정할 수 있고, 필요하면 자동저축을 바로 일시정지할 수 있어요.
          </p>
        </div>
      </section>

      <!-- 와이어프레임 CTA -->
      <button
        type="button"
        class="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[18px] px-5 text-base font-bold tracking-tight text-white shadow-[0_8px_28px_rgba(0,102,255,0.3)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 motion-safe:animate-fade-in-up motion-safe:transition motion-safe:hover:scale-[1.01] motion-safe:active:scale-[0.98]"
        style="
          background: linear-gradient(135deg, #0066ff 0%, #66b2ff 100%);
          animation-delay: 400ms;
        "
        @click="goToSetup"
      >
        <svg
          class="size-[18px]"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2.7 9.3 9.3 2.5 8 6.7h5.3l-6.6 6.8L8 9.3H2.7Z" />
        </svg>
        페이스메이커 전용 저금통 개설하기
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
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'
import AppIcon from '@/shared/ui/AppIcon.vue'

const router = useRouter()
const pacemakerStore = usePacemakerStore()
const isLoading = ref(true)
const errorMessage = ref('')

const featureItems = [
  {
    icon: '💡',
    title: '여유자금 자동 감지',
    description: '매일 오전 8시, 어제의 일일 한도에서 실제 지출을 뺀 여유자금을 계산해요.',
  },
  {
    icon: '💰',
    title: '자동 저금통 저축',
    description: '설정한 상한선 이내에서 매일 자동으로 저금통에 저축해요.',
  },
  {
    icon: '🎯',
    title: '목표 연동 입금',
    description: '쌓인 여유자금을 목표와 연결된 자산에 원하는 시점에 입금해요.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: '매일 오전 8시, 어제 하루 여유자금 계산',
    description: '일일 한도 − 실제 지출 = 여유자금',
  },
  {
    step: '02',
    title: '설정 상한선 이내 금액을 자동으로 저금통에 저축',
    description: '최대 상한선 초과 시 상한선 금액만 저축',
  },
  {
    step: '03',
    title: '쌓인 금액을 목표 연결 자산에 직접 입금',
    description: '원하는 목표의 연결 자산으로 즉시 이동',
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
