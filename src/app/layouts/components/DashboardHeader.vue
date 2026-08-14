<template>
  <header
    class="z-30 shrink-0 border-b border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,35,70,0.05)]"
  >
    <!-- 모바일/태블릿 헤더 (lg:hidden) -->
    <div class="page-container flex h-16 items-center justify-between gap-3 lg:hidden">
      <!-- 좌측: 태블릿 햄버거 메뉴 + 미래로 로고 & 서비스명 -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="-ml-2 hidden size-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 md:flex"
          aria-label="메뉴 열기"
          :aria-expanded="uiStore.sidebarOpen"
          @click="uiStore.toggleSidebar()"
        >
          <svg viewBox="0 0 24 24" fill="none" class="size-5" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <RouterLink
          :to="{ name: ROUTE_NAMES.DASHBOARD }"
          class="flex shrink-0 items-center gap-2 text-primary"
        >
          <img src="@/assets/images/logo.png" alt="미래로 로고" class="size-7 object-contain" />
          <strong class="text-lg font-black tracking-[-0.6px] text-primary">미래로</strong>
        </RouterLink>
      </div>

      <!-- 우측: 알림 센터 종 아이콘 & 마이페이지 아바타 -->
      <div class="flex shrink-0 items-center gap-2.5">
        <!-- 🔔 모바일 알림 종 아이콘 & 알림 드롭다운 -->
        <div ref="mobileDropdownRef" class="relative">
          <button
            type="button"
            class="relative flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 focus:outline-none"
            aria-label="알림 센터 열기"
            @click="toggleDropdown"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>

            <!-- 읽지 않은 알림 빨간 뱃지 -->
            <span v-if="hasUnread" class="absolute top-1 right-1 flex size-2.5">
              <span
                class="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"
              />
              <span class="relative inline-flex size-2.5 rounded-full bg-red-500" />
            </span>
          </button>

          <!-- 모바일 알림 센터 드롭다운 메뉴 -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-2"
          >
            <div
              v-if="isDropdownOpen"
              class="fixed inset-x-4 top-16 z-50 max-h-[80vh] rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[360px]"
            >
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <span class="font-black text-sm text-[#0a192f]">알림 센터</span>
                  <span
                    v-if="notificationHistory.length > 0"
                    class="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
                  >
                    {{ notificationHistory.length }}
                  </span>
                </div>
                <button
                  v-if="notificationHistory.length > 0"
                  type="button"
                  class="text-[11px] text-slate-400 transition hover:text-slate-600"
                  @click="clearHistory"
                >
                  전체 지우기
                </button>
              </div>

              <!-- 알림 목록 -->
              <div class="mt-3 flex max-h-72 flex-col gap-2.5 overflow-y-auto pr-1">
                <div
                  v-if="notificationHistory.length === 0"
                  class="py-8 text-center text-xs text-slate-400"
                >
                  수신된 알림이 없습니다.
                </div>

                <div
                  v-for="item in notificationHistory"
                  :key="item.id"
                  class="group relative flex min-h-[64px] cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-[#f8fbff] p-3 transition hover:bg-blue-50/60 hover:border-blue-200"
                  @click="handleNotificationClick(item)"
                >
                  <!-- 이모지 뱃지 아이콘 -->
                  <div
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-base shadow-sm ring-1 ring-slate-200/80"
                  >
                    <span>{{ item.badgeIcon || '💬' }}</span>
                  </div>

                  <!-- 내용 -->
                  <div class="flex-1 min-w-0 self-center">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-xs font-bold text-[#0a192f] truncate">{{ item.title }}</p>
                      <button
                        type="button"
                        class="text-slate-400 hover:text-slate-600"
                        aria-label="알림 제거"
                        @click.stop="removeHistoryItem(item.id)"
                      >
                        <svg
                          class="size-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <p class="mt-0.5 text-[11px] text-slate-500 leading-tight truncate">
                      {{ item.body }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <RouterLink
          :to="{ name: ROUTE_NAMES.MYPAGE }"
          class="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#66b2ff] text-sm font-bold text-white transition hover:ring-2 hover:ring-primary/25"
          aria-label="마이페이지로 이동"
        >
          {{ userInitial }}
        </RouterLink>
      </div>
    </div>

    <!-- 데스크탑 헤더 (lg:flex) -->
    <div class="page-container hidden h-20 items-center gap-5 lg:flex">
      <RouterLink
        :to="{ name: ROUTE_NAMES.DASHBOARD }"
        class="mr-4 flex shrink-0 items-center gap-2 text-primary"
      >
        <img src="@/assets/images/logo.png" alt="미래로 로고" class="size-8 object-contain" />
        <strong class="text-xl tracking-[-0.8px]">미래로</strong>
      </RouterLink>

      <nav class="flex min-w-0 flex-1 items-stretch justify-center gap-5 self-stretch xl:gap-8">
        <div ref="roadmapDropdownRef" class="relative flex shrink-0 items-stretch">
          <button
            type="button"
            class="group relative flex items-center justify-center gap-1.5 px-2 text-sm font-bold transition hover:text-primary"
            :class="isRoadmapActive ? 'text-primary' : 'text-[#0a192f]'"
            aria-haspopup="menu"
            :aria-expanded="isRoadmapDropdownOpen"
            @click="isRoadmapDropdownOpen = !isRoadmapDropdownOpen"
          >
            로드맵
            <svg
              viewBox="0 0 20 20"
              fill="none"
              class="size-3.5 transition-transform"
              :class="isRoadmapDropdownOpen ? 'rotate-180' : ''"
            >
              <path
                d="m5 7.5 5 5 5-5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              class="absolute inset-x-1 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"
              :class="isRoadmapActive ? 'scale-x-100' : 'scale-x-0'"
            />
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="-translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-1 opacity-0"
          >
            <div
              v-if="isRoadmapDropdownOpen"
              class="absolute left-0 top-[calc(100%+10px)] z-50 w-[286px] rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,35,70,0.14)]"
              role="menu"
            >
              <div class="max-h-[310px] space-y-1 overflow-y-auto">
                <RouterLink
                  v-for="goal in goalStore.goals"
                  :key="goal.goalId"
                  :to="{ name: ROUTE_NAMES.DASHBOARD_GOAL, params: { goalId: goal.goalId } }"
                  class="block rounded-xl px-3 py-3 transition hover:bg-[#f4f8ff]"
                  :class="isSelectedGoal(goal) ? 'bg-[#eaf2ff]' : ''"
                  role="menuitem"
                  @click="isRoadmapDropdownOpen = false"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="size-2 shrink-0 rounded-full"
                      :class="isSelectedGoal(goal) ? 'bg-primary' : 'bg-slate-300'"
                    />
                    <span
                      class="min-w-0 flex-1 truncate text-sm font-bold"
                      :class="isSelectedGoal(goal) ? 'text-primary' : 'text-slate-700'"
                    >
                      {{ goal.goalName }}
                    </span>
                    <span
                      class="text-sm font-bold"
                      :class="isSelectedGoal(goal) ? 'text-primary' : 'text-slate-400'"
                    >
                      {{ goal.progressRate }}%
                    </span>
                  </div>
                  <div class="ml-4 mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      class="h-full rounded-full"
                      :class="isSelectedGoal(goal) ? 'bg-primary' : 'bg-[#b9d3ff]'"
                      :style="{ width: `${Math.min(100, Math.max(0, goal.progressRate))}%` }"
                    />
                  </div>
                </RouterLink>
              </div>

              <RouterLink
                :to="{ name: ROUTE_NAMES.GOAL_SELECT }"
                class="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-[#b9d3ff] px-3 py-3 text-sm font-bold text-primary transition hover:bg-[#f4f8ff]"
                role="menuitem"
                @click="isRoadmapDropdownOpen = false"
              >
                <span class="text-lg font-light">＋</span>
                새 로드맵 추가
              </RouterLink>
            </div>
          </Transition>
        </div>

        <RouterLink
          v-for="item in headerNavItems"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          class="group relative flex shrink-0 items-center justify-center px-2 text-center text-sm font-bold text-[#0a192f] transition hover:text-primary"
          :class="isActive(item.routeName) ? 'text-primary' : ''"
        >
          {{ item.label }}
          <span
            class="absolute inset-x-1 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"
            :class="isActive(item.routeName) ? 'scale-x-100' : 'scale-x-0'"
          />
        </RouterLink>
      </nav>

      <div class="flex shrink-0 items-center gap-3">
        <!-- 🔔 알림 종 아이콘 & 알림 센터 드롭다운 -->
        <div ref="dropdownRef" class="relative">
          <button
            type="button"
            class="relative flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 focus:outline-none"
            aria-label="알림 센터 열기"
            @click="toggleDropdown"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>

            <!-- 읽지 않은 알림 빨간 뱃지 (Pulsing Red Dot) -->
            <span v-if="hasUnread" class="absolute top-1.5 right-1.5 flex size-2.5">
              <span
                class="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"
              />
              <span class="relative inline-flex size-2.5 rounded-full bg-red-500" />
            </span>
          </button>

          <!-- 알림 센터 드롭다운 메뉴 (헤더 우측 경계선에 짝! 맞춤) -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-2"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute -right-12 sm:-right-12 mt-3 z-50 w-[320px] sm:w-[380px] rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            >
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <span class="font-black text-sm text-[#0a192f]">알림 센터</span>
                  <span
                    v-if="notificationHistory.length > 0"
                    class="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
                  >
                    {{ notificationHistory.length }}
                  </span>
                </div>
                <button
                  v-if="notificationHistory.length > 0"
                  type="button"
                  class="text-[11px] text-slate-400 transition hover:text-slate-600"
                  @click="clearHistory"
                >
                  전체 지우기
                </button>
              </div>

              <!-- 알림 목록 -->
              <div class="mt-3 flex max-h-80 flex-col gap-2.5 overflow-y-auto pr-1">
                <div
                  v-if="notificationHistory.length === 0"
                  class="py-8 text-center text-xs text-slate-400"
                >
                  수신된 알림이 없습니다.
                </div>

                <div
                  v-for="item in notificationHistory"
                  :key="item.id"
                  class="group relative flex min-h-[68px] cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-[#f8fbff] p-3 transition hover:bg-blue-50/60 hover:border-blue-200"
                  @click="handleNotificationClick(item)"
                >
                  <!-- 큼직한 이모지 뱃지 아이콘 -->
                  <div
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-base shadow-sm ring-1 ring-slate-200/80"
                  >
                    <span>{{ item.badgeIcon || '💬' }}</span>
                  </div>

                  <!-- 내용 -->
                  <div class="flex-1 min-w-0 self-center">
                    <!-- 1행: 알림 타이틀 + (평소: '방금' ➔ Hover 시: X 버튼 교체) -->
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-xs font-bold text-[#0a192f] truncate">{{ item.title }}</p>

                      <!-- Hover Swap 영역 -->
                      <div class="relative shrink-0 flex items-center justify-end min-w-[28px] h-4">
                        <span
                          class="text-[11px] text-slate-400 transition-opacity duration-200 group-hover:opacity-0"
                        >
                          방금
                        </span>
                        <button
                          type="button"
                          class="absolute inset-0 flex items-center justify-end text-slate-300 opacity-0 transition-opacity duration-200 hover:text-slate-600 group-hover:opacity-100"
                          aria-label="알림 제거"
                          @click.stop="removeHistoryItem(item.id)"
                        >
                          <svg
                            class="size-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- 2행: 알림 본문 -->
                    <p class="mt-0.5 text-[11px] text-slate-500 leading-tight truncate">
                      {{ item.body }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <RouterLink
          :to="{ name: ROUTE_NAMES.MYPAGE }"
          class="flex size-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-white transition hover:ring-2 hover:ring-primary/25"
          aria-label="마이페이지로 이동"
        >
          {{ userInitial }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useGoalStore } from '@/features/goal'
import { usePacemakerToast } from '@/features/pacemaker'
import { NAV_ITEMS } from '@/shared/constants/navigation'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const goalStore = useGoalStore()
const {
  notificationHistory,
  hasUnread,
  markAllAsRead,
  removeHistoryItem,
  clearHistory,
  openBalanceModal,
} = usePacemakerToast()

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const mobileDropdownRef = ref(null)
const isRoadmapDropdownOpen = ref(false)
const roadmapDropdownRef = ref(null)

const userName = computed(() => authStore.user?.name ?? '')
const userInitial = computed(() => userName.value.charAt(0))

const headerNavOrder = [
  ROUTE_NAMES.COLLECTION,
  ROUTE_NAMES.PACEMAKER,
  ROUTE_NAMES.SPENDING,
  ROUTE_NAMES.PRODUCTS,
  ROUTE_NAMES.YOUTH_POLICY,
  ROUTE_NAMES.COACH,
]
const headerNavItems = headerNavOrder.map((routeName) =>
  NAV_ITEMS.find((item) => item.routeName === routeName)
)
const isActive = (routeName) => route.name === routeName || route.meta.navRouteName === routeName
const isRoadmapActive = computed(() =>
  [ROUTE_NAMES.DASHBOARD, ROUTE_NAMES.DASHBOARD_GOAL].includes(route.name)
)

function isSelectedGoal(goal) {
  return String(goal.goalId) === String(goalStore.selectedGoalId)
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    markAllAsRead()
  }
}

function handleNotificationClick(item) {
  isDropdownOpen.value = false

  if (item.type === 'SAVING') {
    openBalanceModal()
    if (route.name !== ROUTE_NAMES.PACEMAKER) {
      router.push({ name: ROUTE_NAMES.PACEMAKER })
    }
  } else if (item.type === 'STREAK') {
    if (route.name !== ROUTE_NAMES.PACEMAKER) {
      router.push({ name: ROUTE_NAMES.PACEMAKER })
    }
  }
}

function handleClickOutside(event) {
  const isOutsideDesktop = !dropdownRef.value || !dropdownRef.value.contains(event.target)
  const isOutsideMobile =
    !mobileDropdownRef.value || !mobileDropdownRef.value.contains(event.target)

  if (isOutsideDesktop && isOutsideMobile) {
    isDropdownOpen.value = false
  }
  if (roadmapDropdownRef.value && !roadmapDropdownRef.value.contains(event.target)) {
    isRoadmapDropdownOpen.value = false
  }
}

onMounted(() => {
  goalStore.fetchGoals()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
