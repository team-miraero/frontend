<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 overflow-hidden rounded-t-[20px] border-t border-slate-200/50 bg-white/80 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(15,35,70,0.05)] backdrop-blur-2xl md:hidden"
    aria-label="모바일 주요 메뉴"
  >
    <div class="grid h-[66px] grid-cols-5 px-1.5">
      <!-- 1. 로드맵 탭 -->
      <button
        type="button"
        class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] transition duration-200 active:scale-95 cursor-pointer"
        :class="
          isRoadmapActiveTab
            ? 'text-primary font-bold'
            : 'text-slate-400 font-medium hover:text-slate-600'
        "
        @click="handleRoadmapClick"
      >
        <span
          class="relative flex size-8 items-center justify-center rounded-xl transition-all duration-200"
          :class="
            isRoadmapActiveTab
              ? 'bg-blue-50 text-primary shadow-2xs ring-1 ring-blue-200/60'
              : ''
          "
        >
          <!-- 활성: Solid Primary Blue Fill 깃발 / 비활성: Outline 깃발 -->
          <svg
            viewBox="0 0 24 24"
            class="size-5 transition-transform duration-200"
            :class="isRoadmapActiveTab ? 'scale-105 fill-primary stroke-primary' : 'fill-none stroke-current'"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" stroke-width="1.8" />
          </svg>
        </span>
        <span class="max-w-full truncate tracking-tight">로드맵</span>
      </button>

      <!-- 2. 지출 탭 -->
      <RouterLink
        :to="{ name: ROUTE_NAMES.SPENDING }"
        class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] transition duration-200 active:scale-95"
        :class="isActive(ROUTE_NAMES.SPENDING) ? 'text-primary font-bold' : 'text-slate-400 font-medium hover:text-slate-600'"
      >
        <span
          class="flex size-8 items-center justify-center rounded-xl transition-all duration-200"
          :class="isActive(ROUTE_NAMES.SPENDING) ? 'bg-blue-50 text-primary shadow-2xs ring-1 ring-blue-200/60' : ''"
        >
          <!-- 활성: Solid Primary Blue Fill 카드 / 비활성: Outline 카드 -->
          <svg
            viewBox="0 0 24 24"
            class="size-5 transition-transform duration-200"
            :class="isActive(ROUTE_NAMES.SPENDING) ? 'scale-105 fill-primary stroke-primary' : 'fill-none stroke-current'"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" :stroke="isActive(ROUTE_NAMES.SPENDING) ? '#ffffff' : 'currentColor'" stroke-width="1.8" />
          </svg>
        </span>
        <span class="max-w-full truncate tracking-tight">지출</span>
      </RouterLink>

      <!-- 3. 페이스메이커 탭 -->
      <RouterLink
        :to="{ name: ROUTE_NAMES.PACEMAKER }"
        class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] transition duration-200 active:scale-95"
        :class="isActive(ROUTE_NAMES.PACEMAKER) ? 'text-primary font-bold' : 'text-slate-400 font-medium hover:text-slate-600'"
      >
        <span
          class="flex size-8 items-center justify-center rounded-xl transition-all duration-200"
          :class="isActive(ROUTE_NAMES.PACEMAKER) ? 'bg-blue-50 text-primary shadow-2xs ring-1 ring-blue-200/60' : ''"
        >
          <!-- 활성: Solid Primary Blue Fill 시계 / 비활성: Outline 시계 -->
          <svg
            viewBox="0 0 24 24"
            class="size-5 transition-transform duration-200"
            :class="isActive(ROUTE_NAMES.PACEMAKER) ? 'scale-105 fill-primary stroke-primary' : 'fill-none stroke-current'"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M10 2h4" stroke-width="1.8" />
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2.5" :stroke="isActive(ROUTE_NAMES.PACEMAKER) ? '#ffffff' : 'currentColor'" stroke-width="1.8" />
          </svg>
        </span>
        <span class="max-w-full truncate tracking-tight">페이스</span>
      </RouterLink>

      <!-- 4. AI 목표 코치 탭 -->
      <RouterLink
        :to="{ name: ROUTE_NAMES.COACH }"
        class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] transition duration-200 active:scale-95"
        :class="isActive(ROUTE_NAMES.COACH) ? 'text-primary font-bold' : 'text-slate-400 font-medium hover:text-slate-600'"
      >
        <span
          class="flex size-8 items-center justify-center rounded-xl transition-all duration-200"
          :class="isActive(ROUTE_NAMES.COACH) ? 'bg-blue-50 text-primary shadow-2xs ring-1 ring-blue-200/60' : ''"
        >
          <!-- 활성: Solid Primary Blue Fill Sparkle / 비활성: Outline Sparkle -->
          <svg
            viewBox="0 0 24 24"
            class="size-5 transition-transform duration-200"
            :class="isActive(ROUTE_NAMES.COACH) ? 'scale-105 fill-primary stroke-primary' : 'fill-none stroke-current'"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
            <path d="M19 2l.8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2z" />
          </svg>
        </span>
        <span class="max-w-full truncate tracking-tight">AI 코치</span>
      </RouterLink>

      <!-- 5. 전체 메뉴 탭 -->
      <RouterLink
        :to="{ name: ROUTE_NAMES.MENU }"
        class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] transition duration-200 active:scale-95"
        :class="isActive(ROUTE_NAMES.MENU) ? 'text-primary font-bold' : 'text-slate-400 font-medium hover:text-slate-600'"
      >
        <span
          class="flex size-8 items-center justify-center rounded-xl transition-all duration-200"
          :class="isActive(ROUTE_NAMES.MENU) ? 'bg-blue-50 text-primary shadow-2xs ring-1 ring-blue-200/60' : ''"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-5 transition-transform duration-200"
            :class="isActive(ROUTE_NAMES.MENU) ? 'scale-105 stroke-primary' : 'stroke-current'"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </span>
        <span class="max-w-full truncate tracking-tight">전체</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { useGoalStore } from '@/features/goal/store/goal.store'

const route = useRoute()
const router = useRouter()
const goalStore = useGoalStore()

const activeRouteName = computed(() => route.meta.navRouteName ?? route.name)
const isActive = (routeName) => activeRouteName.value === routeName

const isRoadmapActiveTab = computed(() =>
  [ROUTE_NAMES.DASHBOARD, ROUTE_NAMES.DASHBOARD_GOAL].includes(activeRouteName.value)
)

function handleRoadmapClick() {
  const targetGoalId = goalStore.selectedGoalId
  if (targetGoalId) {
    router.push({ name: ROUTE_NAMES.DASHBOARD_GOAL, params: { goalId: targetGoalId } })
  } else {
    router.push({ name: ROUTE_NAMES.DASHBOARD })
  }
}

onMounted(() => {
  if (!goalStore.goals.length) {
    goalStore.fetchGoals().catch(() => undefined)
  }
})
</script>
