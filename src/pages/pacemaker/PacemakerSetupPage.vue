<!-- 후속 설정 플로우를 연결하기 위한 최소 라우트 셸 -->
<template>
  <div class="min-h-full bg-[#f8fbff] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
    <div class="mx-auto w-full max-w-[760px]">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-[#0a192f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
        @click="router.push({ name: ROUTE_NAMES.PACEMAKER })"
      >
        <span aria-hidden="true">←</span>
        소개로 돌아가기
      </button>

      <section
        class="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_55px_rgba(35,70,112,0.08)] sm:px-10 sm:py-14"
        aria-labelledby="setup-shell-title"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#eaf2ff] text-primary"
          aria-hidden="true"
        >
          <svg
            class="size-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 7h16M7 3v4M17 3v4" />
            <rect x="4" y="5" width="16" height="16" rx="3" />
            <path d="m8 14 2.5 2.5L16 11" />
          </svg>
        </div>
        <p class="mt-6 text-xs font-black tracking-[0.12em] text-primary">PACE MAKER SETUP</p>
        <h2
          id="setup-shell-title"
          class="mt-3 text-2xl font-black tracking-[-0.55px] text-[#0a192f] sm:text-[28px]"
        >
          페이스메이커 설정을 준비하고 있어요
        </h2>
        <p class="mx-auto mt-3 max-w-[510px] text-sm leading-6 text-slate-500">
          다음 단계에서 전용 저금통과 하루 자동저축 상한선을 설정할 수 있도록 곧 안내해 드릴게요.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
</script>
