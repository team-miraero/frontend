<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 overflow-hidden rounded-t-[20px] border-t border-slate-200/50 bg-white/80 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(15,35,70,0.05)] backdrop-blur-2xl md:hidden"
    aria-label="모바일 주요 메뉴"
  >
    <div class="grid h-[66px] grid-cols-5 px-1.5">
      <template v-for="item in primaryItems" :key="item.routeName">
        <!-- A. 로드맵 탭 (다른 탭에선 바로 이동, 로드맵 탭에선 바텀시트 토글) -->
        <button
          v-if="item.routeName === ROUTE_NAMES.DASHBOARD"
          type="button"
          class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-bold transition duration-200 active:scale-95 cursor-pointer"
          :class="
            isRoadmapActiveTab || isRoadmapOpen
              ? 'text-primary'
              : 'text-slate-400 hover:text-slate-600'
          "
          :aria-expanded="isRoadmapOpen"
          aria-controls="mobile-roadmap-menu"
          @click="handleRoadmapClick"
        >
          <span
            class="relative flex size-8 items-center justify-center rounded-xl transition-all duration-200"
            :class="
              isRoadmapActiveTab || isRoadmapOpen
                ? 'bg-primary/10 shadow-xs ring-1 ring-primary/10'
                : ''
            "
          >
            <img
              :src="item.icon"
              alt=""
              class="size-5 transition-transform duration-200"
              :class="
                isRoadmapActiveTab || isRoadmapOpen
                  ? 'scale-105'
                  : 'opacity-50 grayscale'
              "
            />
            <!-- 복수 목표 보유 시 전환 가능 힌트 닷 -->
            <span
              v-if="isRoadmapActiveTab && goalStore.goals.length > 1"
              class="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary ring-2 ring-white"
            />
          </span>
          <span class="flex max-w-full items-center gap-0.5 truncate">
            {{ getNavLabel(item) }}
            <svg
              viewBox="0 0 20 20"
              fill="none"
              class="size-2.5 transition-transform duration-200"
              :class="isRoadmapOpen ? 'rotate-180 text-primary' : 'text-slate-400'"
            >
              <path
                d="m5 7.5 5 5 5-5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>

        <!-- B. 일반 탭 (지출, 페이스, AI 코치) -->
        <RouterLink
          v-else
          :to="{ name: item.routeName }"
          class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-bold transition duration-200 active:scale-95"
          :class="isActive(item.routeName) ? 'text-primary' : 'text-slate-400 hover:text-slate-600'"
        >
          <span
            class="flex size-8 items-center justify-center rounded-xl transition-all duration-200"
            :class="isActive(item.routeName) ? 'bg-primary/10 shadow-xs ring-1 ring-primary/10' : ''"
          >
            <img
              :src="item.icon"
              alt=""
              class="size-5 transition-transform duration-200"
              :class="isActive(item.routeName) ? 'scale-105' : 'opacity-50 grayscale'"
            />
          </span>
          <span class="max-w-full truncate">{{ getNavLabel(item) }}</span>
        </RouterLink>
      </template>

      <!-- 5. 더보기 탭 -->
      <button
        type="button"
        class="flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-bold transition duration-200 active:scale-95 cursor-pointer"
        :class="isMoreActive || isMoreOpen ? 'text-primary' : 'text-slate-400 hover:text-slate-600'"
        :aria-expanded="isMoreOpen"
        aria-controls="mobile-more-menu"
        @click="isMoreOpen = true"
      >
        <span
          class="flex size-8 items-center justify-center rounded-xl transition-all duration-200"
          :class="isMoreActive || isMoreOpen ? 'bg-primary/10 shadow-xs ring-1 ring-primary/10' : ''"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-5 transition-transform duration-200"
            :class="isMoreActive || isMoreOpen ? 'scale-105 text-primary' : 'opacity-60'"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </span>
        <span class="max-w-full truncate">더보기</span>
      </button>
    </div>
  </nav>

  <!-- 1. 로드맵 목록 & 추가 바텀시트 -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isRoadmapOpen"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
      @click="isRoadmapOpen = false"
    />
  </Transition>

  <Transition
    enter-active-class="transition duration-250 ease-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transition duration-180 ease-in"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <section
      v-if="isRoadmapOpen"
      id="mobile-roadmap-menu"
      class="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-4 shadow-2xl md:hidden"
      aria-label="나의 로드맵 목록"
    >
      <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
      <div class="mb-3.5 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-black text-[#0a192f]">나의 로드맵</h2>
          <span
            v-if="goalStore.goals.length > 0"
            class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary"
          >
            {{ goalStore.goals.length }}개
          </span>
        </div>
        <button
          type="button"
          class="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          aria-label="로드맵 목록 닫기"
          @click="isRoadmapOpen = false"
        >
          ✕
        </button>
      </div>

      <!-- 로드맵 목록 -->
      <div class="max-h-[50vh] space-y-2 overflow-y-auto pr-0.5">
        <div
          v-if="goalStore.goals.length === 0"
          class="rounded-2xl border border-dashed border-slate-200 py-8 text-center"
        >
          <p class="text-sm font-bold text-slate-400">아직 등록된 로드맵이 없어요</p>
        </div>

        <RouterLink
          v-for="goal in goalStore.goals"
          :key="goal.goalId"
          :to="{ name: ROUTE_NAMES.DASHBOARD_GOAL, params: { goalId: goal.goalId } }"
          class="block rounded-2xl border p-3.5 transition active:scale-[0.99]"
          :class="
            isSelectedGoal(goal)
              ? 'border-primary/40 bg-[#eaf2ff] shadow-xs'
              : 'border-slate-200/80 bg-[#f8fbff] hover:bg-white'
          "
          @click="isRoadmapOpen = false"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <span
                class="size-2 shrink-0 rounded-full"
                :class="isSelectedGoal(goal) ? 'bg-primary ring-2 ring-primary/30' : 'bg-slate-300'"
              />
              <strong
                class="truncate text-sm font-bold"
                :class="isSelectedGoal(goal) ? 'text-primary' : 'text-[#0a192f]'"
              >
                {{ goal.goalName }}
              </strong>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <span
                v-if="isSelectedGoal(goal)"
                class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary"
              >
                선택됨
              </span>
              <span
                class="text-sm font-black tabular-nums"
                :class="isSelectedGoal(goal) ? 'text-primary' : 'text-slate-500'"
              >
                {{ goal.progressRate }}%
              </span>
            </div>
          </div>

          <!-- 진행률 바 -->
          <div class="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="isSelectedGoal(goal) ? 'bg-primary' : 'bg-[#93c5fd]'"
              :style="{ width: `${Math.min(100, Math.max(0, goal.progressRate))}%` }"
            />
          </div>
        </RouterLink>
      </div>

      <!-- 새 로드맵 추가 버튼 -->
      <RouterLink
        :to="{ name: ROUTE_NAMES.GOAL_SELECT }"
        class="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#b9d3ff] bg-[#f4f8ff] py-3.5 text-sm font-black text-primary transition active:scale-[0.99] hover:bg-blue-50"
        @click="isRoadmapOpen = false"
      >
        <span class="text-base leading-none">＋</span>
        새 로드맵 추가
      </RouterLink>
    </section>
  </Transition>

  <!-- 2. 더보기 메뉴 바텀시트 -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isMoreOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden" @click="isMoreOpen = false" />
  </Transition>

  <Transition
    enter-active-class="transition duration-250 ease-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transition duration-180 ease-in"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <section
      v-if="isMoreOpen"
      id="mobile-more-menu"
      class="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-4 shadow-2xl md:hidden"
      aria-label="추가 메뉴"
    >
      <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-black text-[#0a192f]">더보기</h2>
        <button
          type="button"
          class="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 cursor-pointer"
          aria-label="더보기 닫기"
          @click="isMoreOpen = false"
        >
          ✕
        </button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <RouterLink
          v-for="item in moreItems"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          class="flex items-center gap-3 rounded-2xl border p-3.5 text-xs sm:text-sm font-bold transition active:scale-[0.98]"
          :class="
            isActive(item.routeName)
              ? 'border-primary/40 bg-[#eaf2ff] text-primary shadow-xs'
              : 'border-slate-200/90 bg-[#fbfdff] text-slate-700 hover:bg-white hover:border-primary/30'
          "
          @click="isMoreOpen = false"
        >
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors"
            :class="isActive(item.routeName) ? 'bg-white shadow-2xs' : 'bg-slate-100/80'"
          >
            <img
              :src="item.icon"
              alt=""
              class="size-4.5 object-contain transition-all"
              :class="isActive(item.routeName) ? 'scale-105' : 'opacity-60 grayscale'"
            />
          </span>
          <span class="truncate">{{ item.label }}</span>
        </RouterLink>
      </div>
    </section>
  </Transition>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { NAV_ITEMS } from '@/shared/constants/navigation'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { useGoalStore } from '@/features/goal/store/goal.store'

const route = useRoute()
const router = useRouter()
const goalStore = useGoalStore()

const isRoadmapOpen = ref(false)
const isMoreOpen = ref(false)

const BOTTOM_NAV_LABELS = {
  [ROUTE_NAMES.DASHBOARD]: '로드맵',
  [ROUTE_NAMES.SPENDING]: '지출',
  [ROUTE_NAMES.PACEMAKER]: '페이스',
  [ROUTE_NAMES.COACH]: 'AI 코치',
}

function getNavLabel(item) {
  return BOTTOM_NAV_LABELS[item.routeName] ?? item.label
}

const primaryRouteNames = [
  ROUTE_NAMES.DASHBOARD,
  ROUTE_NAMES.SPENDING,
  ROUTE_NAMES.PACEMAKER,
  ROUTE_NAMES.COACH,
]
const moreRouteNames = [
  ROUTE_NAMES.COLLECTION,
  ROUTE_NAMES.PRODUCTS,
  ROUTE_NAMES.YOUTH_POLICY,
  ROUTE_NAMES.MYPAGE,
]

const primaryItems = NAV_ITEMS.filter((item) => primaryRouteNames.includes(item.routeName))
const moreItems = NAV_ITEMS.filter((item) => moreRouteNames.includes(item.routeName))
const activeRouteName = computed(() => route.meta.navRouteName ?? route.name)
const isActive = (routeName) => activeRouteName.value === routeName
const isMoreActive = computed(() => moreRouteNames.includes(activeRouteName.value))

const isRoadmapActiveTab = computed(() =>
  [ROUTE_NAMES.DASHBOARD, ROUTE_NAMES.DASHBOARD_GOAL].includes(activeRouteName.value)
)

const isSelectedGoal = (goal) => String(goal.goalId) === String(goalStore.selectedGoalId)

function handleRoadmapClick() {
  if (isRoadmapActiveTab.value) {
    isRoadmapOpen.value = !isRoadmapOpen.value
  } else {
    isRoadmapOpen.value = false
    const targetGoalId = goalStore.selectedGoalId
    if (targetGoalId) {
      router.push({ name: ROUTE_NAMES.DASHBOARD_GOAL, params: { goalId: targetGoalId } })
    } else {
      router.push({ name: ROUTE_NAMES.DASHBOARD })
    }
  }
}

onMounted(() => {
  if (!goalStore.goals.length) {
    goalStore.fetchGoals().catch(() => undefined)
  }
})

watch(
  () => route.fullPath,
  () => {
    isRoadmapOpen.value = false
    isMoreOpen.value = false
  }
)
</script>
