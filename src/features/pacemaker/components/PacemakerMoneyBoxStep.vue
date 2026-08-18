<!-- 페이스메이커 개설 1단계: 전용 저금통 안내 -->
<template>
  <section
    class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,38,70,0.1)] motion-safe:animate-fade-in-up"
    aria-labelledby="money-box-title"
  >
    <div class="border-b border-slate-100 px-6 py-7 text-center sm:px-8">
      <div
        class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eaf2ff] to-[#fff0f9] text-[32px]"
        aria-hidden="true"
      >
        🪣
      </div>
      <p class="mt-5 text-xs font-bold tracking-wider text-primary">페이스메이커 설정 1/2</p>
      <h2 id="money-box-title" class="mt-2 text-xl font-bold tracking-tight text-[#0a192f]">
        페이스메이커 전용 저금통
      </h2>
      <p class="mt-2 text-sm leading-6 text-slate-500">
        여유자금을 안전하게 모아두는 전용 공간이에요.<br class="hidden sm:block" />
        언제든 꺼내 목표 계좌로 입금할 수 있어요.
      </p>
    </div>

    <ul class="flex flex-col gap-3 px-5 py-6 sm:px-8">
      <li
        v-for="item in moneyBoxFeatures"
        :key="item.title"
        class="flex items-center gap-4 rounded-[14px] border border-[#edf2ff] bg-[#f8fbff] px-4 py-3.5"
      >
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F6] text-primary"
        >
          <AppIcon :name="item.icon" />
        </span>
        <div>
          <h3 class="text-sm font-bold text-[#0a192f]">{{ item.title }}</h3>
          <p class="mt-0.5 text-xs leading-5 text-slate-400">{{ item.description }}</p>
        </div>
      </li>
    </ul>

    <div class="flex flex-col gap-3 px-5 pb-7 sm:px-8">
      <button
        type="button"
        class="min-h-12 w-full rounded-2xl bg-gradient-to-br from-primary to-[#66b2ff] px-5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(0,102,255,0.28)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-[0.99]"
        @click="$emit('next')"
      >
        저금통 개설하기 →
      </button>
      <button
        type="button"
        class="min-h-11 w-full rounded-2xl text-sm font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
        @click="$emit('back')"
      >
        돌아가기
      </button>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/shared/ui/AppIcon.vue'
defineEmits(['next', 'back'])

const moneyBoxFeatures = [
  {
    icon: '🔒',
    title: '별도 분리 보관',
    description: '일반 지출과 완전히 분리된 전용 공간',
  },
  {
    icon: '💸',
    title: '수시 입출금',
    description: '언제든 자유롭게 인출하고 목표 계좌로 입금',
  },
  {
    icon: '📊',
    title: '자동 집계',
    description: '일별 저축 내역과 연속 기록을 자동으로 관리',
  },
]
</script>
