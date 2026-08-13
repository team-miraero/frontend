<template>
  <header
    class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-5 lg:px-10"
  >
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="사이드바 메뉴 열기"
        @click="uiStore.toggleSidebar()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          class="size-5"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div>
        <p class="text-xs text-slate-500">안녕하세요, {{ userName }}님 👋</p>
        <h1 class="pt-0.5 text-[22px] font-black tracking-[-0.44px] text-[#0a192f]">
          {{ pageTitle }}
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-2.5 text-xs font-bold text-primary"
      >
        <img src="@/assets/icons/roadmap.svg" alt="" class="size-[13px]" />
        {{ goalTitle }}
      </button>

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
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
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
                <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-base shadow-sm ring-1 ring-slate-200/80">
                  <span>{{ item.badgeIcon || '💬' }}</span>
                </div>

                <!-- 내용 -->
                <div class="flex-1 min-w-0 self-center">
                  <!-- 1행: 알림 타이틀 + (평소: '방금' ➔ Hover 시: X 버튼 교체) -->
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-xs font-bold text-[#0a192f] truncate">{{ item.title }}</p>

                    <!-- Hover Swap 영역 -->
                    <div class="relative shrink-0 flex items-center justify-end min-w-[28px] h-4">
                      <span class="text-[11px] text-slate-400 transition-opacity duration-200 group-hover:opacity-0">
                        방금
                      </span>
                      <button
                        type="button"
                        class="absolute inset-0 flex items-center justify-end text-slate-300 opacity-0 transition-opacity duration-200 hover:text-slate-600 group-hover:opacity-100"
                        aria-label="알림 제거"
                        @click.stop="removeHistoryItem(item.id)"
                      >
                        <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- 2행: 알림 본문 -->
                  <p class="mt-0.5 text-[11px] text-slate-500 leading-tight truncate">{{ item.body }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 프로필 Initial -->
      <div
        class="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#66b2ff] text-sm font-bold text-white"
      >
        {{ userInitial }}
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useGoalStore } from '@/features/goal'
import { usePacemakerToast } from '@/features/pacemaker'
import { NAV_ITEMS } from '@/shared/constants/navigation'
import { GOAL_TYPES } from '@/shared/constants/goals'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const goalStore = useGoalStore()
const { notificationHistory, hasUnread, markAllAsRead, removeHistoryItem, clearHistory, openBalanceModal } = usePacemakerToast()

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const userName = computed(() => authStore.user?.name ?? '')
const userInitial = computed(() => userName.value.charAt(0))

const pageTitle = computed(
  () => NAV_ITEMS.find((item) => item.routeName === route.name)?.pageTitle ?? route.meta.pageTitle ?? ''
)

const goalTitle = computed(() => {
  const matched = GOAL_TYPES.find((type) => type.id === goalStore.selectedGoalType)
  return matched?.label ?? ''
})

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
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
