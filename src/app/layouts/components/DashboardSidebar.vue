<!-- 대시보드 좌측 사이드바: 로고 + 네비게이션 + 프로필 -->
<template>
  <!-- 모바일 오버레이 배경: 사이드바 펼침 상태에서만 표시, 클릭 시 닫힘 -->
  <div
    v-if="uiStore.sidebarOpen"
    class="fixed inset-0 z-30 bg-black/40 lg:hidden"
    @click="uiStore.toggleSidebar()"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex h-screen w-[248px] shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:translate-x-0"
    :class="uiStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- 로고 + 마이데이터 연동 배지 -->
    <div class="border-b border-[#f0f4fb] px-6 pt-7 pb-5">
      <div class="flex items-center gap-2.5 pb-3">
        <div class="flex size-8 items-center justify-center rounded-[14px] bg-primary">
          <img src="@/assets/icons/logo.svg" alt="미래로" class="size-[18px]" />
        </div>
        <span class="text-lg font-black tracking-[-0.45px] text-[#0a192f]">미래로</span>
      </div>
      <div
        class="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1"
      >
        <span class="size-1.5 rounded-full bg-emerald-600/90" />
        <span class="text-xs font-bold text-emerald-600">마이데이터 연동됨</span>
      </div>
    </div>

    <!-- 네비게이션 -->
    <nav class="flex flex-1 flex-col gap-0.5 px-3 py-4">
      <div>
        <div
          class="flex w-full items-center gap-1 rounded-[14px] pr-2"
          :class="isRoadmapSectionActive ? 'bg-[#eaf2ff]' : ''"
        >
          <RouterLink
            :to="{ name: roadmapNav.routeName }"
            class="flex flex-1 items-center gap-3 px-4 py-2.5"
            @click="closeMobileSidebar"
          >
            <img :src="roadmapNav.icon" alt="" class="size-4" />
            <span
              class="flex-1 text-left text-sm font-bold"
              :class="isRoadmapSectionActive ? 'text-primary' : 'text-slate-500'"
            >
              {{ roadmapNav.label }}
            </span>
          </RouterLink>
          <button
            type="button"
            class="flex size-6 shrink-0 items-center justify-center"
            aria-label="로드맵 목록 펼치기/접기"
            @click="isRoadmapListExpanded = !isRoadmapListExpanded"
          >
            <img
              src="@/assets/icons/chevron-down.svg"
              alt=""
              class="size-[13px] transition-transform"
              :class="isRoadmapListExpanded ? 'rotate-90' : ''"
            />
          </button>
        </div>

        <!-- 로드맵(목표) 목록: 클릭하면 해당 목표의 대시보드로 이동 -->
        <div v-if="isRoadmapListExpanded" class="pt-1 pl-4">
          <div class="flex flex-col gap-1 border-l border-[#e8effe] pl-3">
            <RouterLink
              v-for="goal in goalStore.goals"
              :key="goal.goalId"
              :to="{ name: ROUTE_NAMES.DASHBOARD_GOAL, params: { goalId: goal.goalId } }"
              class="rounded-xl px-3 py-2.5"
              :class="isSelectedGoal(goal) ? 'bg-[#eaf2ff]' : ''"
              @click="closeMobileSidebar"
            >
              <div class="flex items-center gap-2">
                <span
                  class="size-1.5 shrink-0 rounded-full"
                  :class="isSelectedGoal(goal) ? 'bg-primary' : 'bg-slate-300'"
                />
                <div class="flex min-w-0 flex-1 items-center justify-between gap-1">
                  <span
                    class="truncate text-xs font-bold"
                    :class="isSelectedGoal(goal) ? 'text-primary' : 'text-slate-600'"
                  >
                    {{ goal.goalName }}
                  </span>
                  <span
                    class="shrink-0 text-xs font-bold"
                    :class="isSelectedGoal(goal) ? 'text-primary' : 'text-slate-400'"
                  >
                    {{ goal.progressRate }}%
                  </span>
                </div>
              </div>
              <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-1 rounded-full"
                  :class="isSelectedGoal(goal) ? 'bg-primary' : 'bg-[#c5dcff]'"
                  :style="{ width: `${goal.progressRate}%` }"
                />
              </div>
            </RouterLink>

            <button
              type="button"
              class="flex items-center gap-2 rounded-xl border border-dashed border-[#c5dcff] px-3 py-2.5 text-xs font-bold text-primary"
            >
              <img src="@/assets/icons/plus.svg" alt="" class="size-3" />
              새 로드맵 추가
            </button>
          </div>
        </div>
      </div>

      <!-- 목표 컬렉션 -->
      <RouterLink
        :to="{ name: collectionNav.routeName }"
        class="mt-2 flex h-11 items-center gap-3 rounded-[14px] px-4 py-3"
        :class="isActive(collectionNav.routeName) ? 'bg-[#eaf2ff]' : ''"
        @click="closeMobileSidebar"
      >
        <img :src="collectionNav.icon" alt="" class="size-[18px]" />
        <span
          class="flex-1 text-left text-sm font-medium"
          :class="isActive(collectionNav.routeName) ? 'text-primary' : 'text-slate-500'"
        >
          {{ collectionNav.label }}
        </span>
        <span class="text-xs font-medium text-slate-300">{{ collectionCount }}</span>
      </RouterLink>

      <!-- 페이스메이커 -->
      <RouterLink
        :to="{ name: pacemakerNav.routeName }"
        class="flex items-center gap-3 rounded-[14px] px-4 py-2.5"
        :class="isActive(pacemakerNav.routeName) ? 'bg-[#eaf2ff]' : ''"
        @click="closeMobileSidebar"
      >
        <img :src="pacemakerNav.icon" alt="" class="size-4" />
        <span
          class="text-sm font-bold"
          :class="isActive(pacemakerNav.routeName) ? 'text-primary' : 'text-slate-500'"
        >
          {{ pacemakerNav.label }}
        </span>
      </RouterLink>

      <!-- 하단 메뉴 그룹 -->
      <div class="mt-1 flex flex-col border-t border-[#f0f4fb] pt-2">
        <RouterLink
          v-for="item in bottomNavItems"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          class="flex items-center gap-3 rounded-[14px] px-4 py-2.5"
          :class="isActive(item.routeName) ? 'bg-[#eaf2ff]' : ''"
          @click="closeMobileSidebar"
        >
          <img :src="item.icon" alt="" class="size-4" />
          <span
            class="flex-1 text-left text-sm font-bold"
            :class="isActive(item.routeName) ? 'text-primary' : 'text-slate-500'"
          >
            {{ item.label }}
          </span>
          <span
            v-if="item.isNew"
            class="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white"
          >
            NEW
          </span>
        </RouterLink>
      </div>
    </nav>

    <!-- 프로필 -->
    <div class="flex items-center gap-3 border-t border-slate-200 px-5 py-5">
      <div
        class="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#66b2ff] text-sm font-bold text-white"
      >
        {{ userInitial }}
      </div>
      <p class="min-w-0 flex-1 truncate text-sm font-bold text-[#0a192f]">{{ userName }}</p>
      <img src="@/assets/icons/settings.svg" alt="" class="size-4 shrink-0" />
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useGoalStore } from '@/features/goal'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { NAV_ITEMS } from '@/shared/constants/navigation'

defineProps({
  collectionCount: {
    type: [String, Number],
    default: 0,
  },
})

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()
const goalStore = useGoalStore()

const userName = computed(() => authStore.user?.name ?? '')
const userInitial = computed(() => userName.value.charAt(0))

const isActive = (routeName) =>
  route.name === routeName || route.meta.navRouteName === routeName

const isRoadmapListExpanded = ref(true)

const isRoadmapSectionActive = computed(() =>
  [ROUTE_NAMES.DASHBOARD, ROUTE_NAMES.DASHBOARD_GOAL].includes(route.name)
)

function isSelectedGoal(goal) {
  return goal.goalId === goalStore.selectedGoalId
}

const closeMobileSidebar = () => {
  if (uiStore.sidebarOpen) uiStore.toggleSidebar()
}

onMounted(() => {
  goalStore.fetchGoals()
})

const roadmapNav = NAV_ITEMS.find((item) => item.routeName === ROUTE_NAMES.DASHBOARD)
const pacemakerNav = NAV_ITEMS.find((item) => item.routeName === ROUTE_NAMES.PACEMAKER)
const collectionNav = NAV_ITEMS.find((item) => item.routeName === ROUTE_NAMES.COLLECTION)

const bottomNavItems = NAV_ITEMS.filter((item) =>
  [
    ROUTE_NAMES.SPENDING,
    ROUTE_NAMES.PRODUCTS,
    ROUTE_NAMES.YOUTH_POLICY,
    ROUTE_NAMES.COACH,
    ROUTE_NAMES.MYPAGE,
  ].includes(item.routeName)
)
</script>
