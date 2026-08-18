<!-- 토스 스타일 모바일/태블릿 전체 메뉴 페이지 -->
<template>
  <div class="min-h-full bg-[#f8fbff] pb-12">
    <!-- 상단 페이지 헤더 타이틀 (PC/데스크톱 전용, 모바일은 상단 헤더에 표시되므로 숨김) -->
    <div class="hidden lg:block border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6 md:px-8">
      <div class="mx-auto max-w-2xl">
        <h1 class="text-lg sm:text-xl font-bold tracking-tight text-[#0a192f]">전체 메뉴</h1>
        <p class="mt-0.5 text-xs text-slate-500">미래로의 모든 기능과 설정을 한눈에 확인하세요</p>
      </div>
    </div>

    <div class="mx-auto max-w-2xl px-4 py-5 sm:px-6 space-y-5">
      <!-- 1. 최상단 사용자 프로필 & 자산 요약 카드 (클릭 시 마이페이지 이동) -->
      <RouterLink
        :to="{ name: ROUTE_NAMES.MYPAGE }"
        class="group relative flex items-center justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-[#f4f8ff] to-[#eaf2ff] p-4 sm:p-5 shadow-xs transition-all hover:shadow-md hover:border-primary/40 active:scale-[0.99]"
      >
        <div class="flex items-center gap-3.5">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#66b2ff] text-base font-bold text-white shadow-sm ring-2 ring-white"
          >
            {{ userInitial }}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <strong class="text-base font-bold text-[#0a192f]">{{ userName || '회원' }} 님</strong>
              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                마이페이지
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500">
              진행 중인 목표 <span class="font-bold text-primary">{{ goalStore.goals.length }}</span>개
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">
          <span>내 정보 관리</span>
          <svg class="size-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </div>
      </RouterLink>

      <!-- 2. 맞춤 혜택 & 추천 금융 (하이라이트 섹션) -->
      <section class="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">맞춤 혜택 & 금융</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <!-- 청년 정책 -->
          <RouterLink
            :to="{ name: ROUTE_NAMES.YOUTH_POLICY }"
            class="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-[#fbfdff] p-3.5 transition-all hover:bg-[#f4f8ff] hover:border-primary/30 active:scale-[0.98]"
          >
            <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <img :src="iconMap.policy" alt="" class="size-5 object-contain" />
            </div>
            <div class="min-w-0 flex-1">
              <strong class="text-sm font-bold text-[#0a192f]">청년 정책 지원금</strong>
              <p class="text-xs text-slate-400 truncate">나에게 맞는 청년 혜택 모아보기</p>
            </div>
          </RouterLink>

          <!-- 금융 상품 추천 -->
          <RouterLink
            :to="{ name: ROUTE_NAMES.PRODUCTS }"
            class="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-[#fbfdff] p-3.5 transition-all hover:bg-[#f4f8ff] hover:border-primary/30 active:scale-[0.98]"
          >
            <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <img :src="iconMap.products" alt="" class="size-5 object-contain" />
            </div>
            <div class="min-w-0 flex-1">
              <strong class="text-sm font-bold text-[#0a192f]">맞춤 금융 상품</strong>
              <p class="text-xs text-slate-400 truncate">금리 높은 적금·예금 비교</p>
            </div>
          </RouterLink>
        </div>
      </section>

      <!-- 3. 성취 & 도감 (컬렉션) -->
      <section class="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">성취 & 도감</h2>
        <RouterLink
          :to="{ name: ROUTE_NAMES.COLLECTION }"
          class="flex items-center justify-between rounded-xl border border-slate-100 bg-[#fbfdff] p-3.5 transition-all hover:bg-[#f4f8ff] hover:border-primary/30 active:scale-[0.98]"
        >
          <div class="flex items-center gap-3.5">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <img :src="iconMap.collection" alt="" class="size-5 object-contain" />
            </div>
            <div>
              <strong class="text-sm font-bold text-[#0a192f]">나의 컬렉션</strong>
              <p class="text-xs text-slate-400">획득한 캐릭터 뱃지와 성취 도감</p>
            </div>
          </div>
          <svg class="size-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </RouterLink>
      </section>

      <!-- 4. 핵심 서비스 바로가기 (주요 기능) -->
      <section class="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">핵심 기능 바로가기</h2>
        <div class="grid grid-cols-2 gap-2.5">
          <RouterLink
            :to="{ name: ROUTE_NAMES.DASHBOARD }"
            class="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#fbfdff] p-3 text-xs font-bold text-slate-700 hover:bg-[#f4f8ff] hover:text-primary transition"
          >
            <img :src="iconMap.roadmap" alt="" class="size-4.5 object-contain" />
            <span>목표 로드맵</span>
          </RouterLink>

          <RouterLink
            :to="{ name: ROUTE_NAMES.SPENDING }"
            class="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#fbfdff] p-3 text-xs font-bold text-slate-700 hover:bg-[#f4f8ff] hover:text-primary transition"
          >
            <img :src="iconMap.spending" alt="" class="size-4.5 object-contain" />
            <span>지출 관리</span>
          </RouterLink>

          <RouterLink
            :to="{ name: ROUTE_NAMES.PACEMAKER }"
            class="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#fbfdff] p-3 text-xs font-bold text-slate-700 hover:bg-[#f4f8ff] hover:text-primary transition"
          >
            <img :src="iconMap.pacemaker" alt="" class="size-4.5 object-contain" />
            <span>페이스메이커</span>
          </RouterLink>

          <RouterLink
            :to="{ name: ROUTE_NAMES.COACH }"
            class="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#fbfdff] p-3 text-xs font-bold text-slate-700 hover:bg-[#f4f8ff] hover:text-primary transition"
          >
            <img :src="iconMap.coach" alt="" class="size-4.5 object-contain" />
            <span>AI 목표 코치</span>
          </RouterLink>
        </div>
      </section>

      <!-- 5. 계정 & 설정 -->
      <section class="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <h2 class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">계정 & 설정</h2>
        <ul class="divide-y divide-slate-100 text-sm font-bold text-slate-700">
          <li>
            <RouterLink :to="{ name: ROUTE_NAMES.MYPAGE }" class="flex items-center justify-between py-3 hover:text-primary transition">
              <span>계정 및 마이데이터 관리</span>
              <svg class="size-4 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </RouterLink>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full items-center justify-between py-3 text-rose-500 hover:text-rose-600 transition cursor-pointer"
              @click="logoutModalOpen = true"
            >
              <span>로그아웃</span>
              <svg class="size-4 text-rose-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l2.47-2.47a.75.75 0 10-1.06-1.06l-3.75 3.75a.75.75 0 000 1.06l3.75 3.75a.75.75 0 101.06-1.06l-2.47-2.47H18.25A.75.75 0 0019 10z" clip-rule="evenodd" />
              </svg>
            </button>
          </li>
        </ul>
      </section>
    </div>

    <!-- 마이페이지와 100% 동일한 로그아웃 확인 모달 -->
    <LogoutConfirmModal v-model="logoutModalOpen" :pending="isSubmittingLogout" @confirm="logout" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useAuthFeatureStore } from '@/features/auth'
import { useGoalStore } from '@/features/goal'
import { LogoutConfirmModal } from '@/features/mypage'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { NAV_ITEMS } from '@/shared/constants/navigation'
import '@/features/mypage/styles/mypage.css'

const router = useRouter()
const authStore = useAuthStore()
const authFeatureStore = useAuthFeatureStore()
const { isSubmittingLogout } = storeToRefs(authFeatureStore)
const goalStore = useGoalStore()

const logoutModalOpen = ref(false)

const userName = computed(() => authStore.user?.name ?? '')
const userInitial = computed(() => (userName.value ? userName.value.charAt(0) : 'M'))

const iconMap = {
  roadmap: NAV_ITEMS.find((i) => i.routeName === ROUTE_NAMES.DASHBOARD)?.icon,
  spending: NAV_ITEMS.find((i) => i.routeName === ROUTE_NAMES.SPENDING)?.icon,
  pacemaker: NAV_ITEMS.find((i) => i.routeName === ROUTE_NAMES.PACEMAKER)?.icon,
  coach: NAV_ITEMS.find((i) => i.routeName === ROUTE_NAMES.COACH)?.icon,
  collection: NAV_ITEMS.find((i) => i.routeName === ROUTE_NAMES.COLLECTION)?.icon,
  products: NAV_ITEMS.find((i) => i.routeName === ROUTE_NAMES.PRODUCTS)?.icon,
  policy: NAV_ITEMS.find((i) => i.routeName === ROUTE_NAMES.YOUTH_POLICY)?.icon,
}

async function logout() {
  await authFeatureStore.submitLogout()
  logoutModalOpen.value = false
  await router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>
