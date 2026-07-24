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

      <div
        class="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#66b2ff] text-sm font-bold text-white"
      >
        {{ userInitial }}
      </div>
    </div>
  </header>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useGoalStore } from '@/features/goal'
import { NAV_ITEMS } from '@/shared/constants/navigation'
import { GOAL_TYPES } from '@/shared/constants/goals'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()
const goalStore = useGoalStore()

const userName = computed(() => authStore.user?.name ?? '')
const userInitial = computed(() => userName.value.charAt(0))

const pageTitle = computed(
  () => NAV_ITEMS.find((item) => item.routeName === route.name)?.pageTitle ?? ''
)

// TODO: goal.sotre에 목표 title 전용 필드가 생기면 selectedGoalType 대신 그 필드로 교체
const goalTitle = computed(() => {
  const matched = GOAL_TYPES.find((type) => type.id === goalStore.selectedGoalType)
  return matched?.label ?? ''
})
</script>
