<template>
  <HeroBackground>
    <!-- Header -->
    <StepHeader :show-back="false">
      <nav class="flex items-center gap-3 md:gap-6">
        <a href="#service-intro" class="hidden text-sm text-gray-700 sm:inline">서비스 소개</a>
        <RouterLink :to="{ name: ROUTE_NAMES.LOGIN }" class="text-sm text-gray-700">
          로그인
        </RouterLink>
        <RouterLink v-slot="{ navigate }" :to="{ name: ROUTE_NAMES.SIGNUP }" custom>
          <BaseButton @click="navigate">시작하기</BaseButton>
        </RouterLink>
      </nav>
    </StepHeader>

    <!-- Hero 애니메이션 섹션 -->
    <HeroSection />

    <!-- 서비스 소개 섹션 -->
    <section
      id="service-intro"
      class="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-24 pt-8 md:px-8 lg:px-[80px]"
    >
      <h2 class="text-sm font-bold text-primary">미래로가 도와드리는 것들</h2>

      <div class="mt-6 grid gap-6 sm:grid-cols-3">
        <div
          v-for="feature in FEATURES"
          :key="feature.title"
          class="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary"
            v-html="feature.icon"
          ></div>
          <h3 class="mt-4 text-lg font-bold text-gray-900">{{ feature.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ feature.description }}</p>
        </div>
      </div>
    </section>
  </HeroBackground>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import StepHeader from '@/shared/ui/StepHeader.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'

import HeroSection from './HeroSection.vue'

// 서비스 소개 정적 데이터
const ICON_MAP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M9 3 4 5v16l5-2 6 2 5-2V3l-5 2-6-2Z" /><path d="M9 3v16" /><path d="M15 5v16" /></svg>`
const ICON_CALCULATOR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><rect x="5" y="3" width="14" height="18" rx="2" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="12" y1="16" x2="12" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>`
const ICON_WALLET = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /><path d="M16 12h.01" /><path d="M3 10h18" /></svg>`

const FEATURES = [
  {
    icon: ICON_MAP,
    title: '안 쓸 돈을 알아서 모아요',
    description:
      '생활비와 고정 지출을 고려해 남는 여유 자금을 자동으로 저축하고, 목표에 맞게 차곡차곡 모아드려요.',
  },
  {
    icon: ICON_CALCULATOR,
    title: '월 납입액 무리 없는 페이스를 유지해요',
    description:
      '소비 패턴과 월별 지출을 분석해 적금을 넣고도 다음 달이 부담되지 않는 저축 페이스를 만들어드려요.',
  },
  {
    icon: ICON_WALLET,
    title: '써도 변화가 와도 목표를 지켜요',
    description:
      '예상보다 지출이 늘어나거나 수입이 달라져도 목표를 향한 계획과 페이스를 다시 조정해드려요.',
  },
]
</script>
