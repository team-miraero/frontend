<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 overflow-hidden rounded-t-[24px] border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,35,70,0.08)] backdrop-blur-xl md:hidden"
    aria-label="모바일 주요 메뉴"
  >
    <div class="grid h-[66px] grid-cols-5 px-1.5">
      <RouterLink
        v-for="item in primaryItems"
        :key="item.routeName"
        :to="{ name: item.routeName }"
        class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-bold transition duration-200"
        :class="isActive(item.routeName) ? 'text-primary' : 'text-slate-400'"
      >
        <span
          class="flex size-8 items-center justify-center rounded-xl transition-colors"
          :class="isActive(item.routeName) ? 'bg-primary/10' : ''"
        >
          <img :src="item.icon" alt="" class="size-5" :class="isActive(item.routeName) ? '' : 'opacity-50 grayscale'" />
        </span>
        <span class="max-w-full truncate">{{ item.label }}</span>
      </RouterLink>

      <button
        type="button"
        class="flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-bold transition duration-200"
        :class="isMoreActive || isMoreOpen ? 'text-primary' : 'text-slate-400'"
        :aria-expanded="isMoreOpen"
        aria-controls="mobile-more-menu"
        @click="isMoreOpen = true"
      >
        <span class="flex size-8 items-center justify-center rounded-xl" :class="isMoreActive || isMoreOpen ? 'bg-primary/10' : ''">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="size-5" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </span>
        <span>더보기</span>
      </button>
    </div>
  </nav>

  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isMoreOpen" class="fixed inset-0 z-40 bg-black/40 md:hidden" @click="isMoreOpen = false" />
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
        <h2 class="text-lg font-black text-[#0a192f]">더보기</h2>
        <button type="button" class="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500" aria-label="더보기 닫기" @click="isMoreOpen = false">✕</button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <RouterLink
          v-for="item in moreItems"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          class="flex items-center gap-3 rounded-2xl border px-4 py-4 text-sm font-bold"
          :class="isActive(item.routeName) ? 'border-primary/20 bg-[#eaf2ff] text-primary' : 'border-slate-200 text-slate-600'"
          @click="isMoreOpen = false"
        >
          <img :src="item.icon" alt="" class="size-5" />
          {{ item.label }}
        </RouterLink>
      </div>
    </section>
  </Transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { NAV_ITEMS } from '@/shared/constants/navigation'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const route = useRoute()
const isMoreOpen = ref(false)

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

watch(() => route.fullPath, () => { isMoreOpen.value = false })
</script>
