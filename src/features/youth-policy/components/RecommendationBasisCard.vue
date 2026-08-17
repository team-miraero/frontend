<!-- 조건 일치 정책을 찾는 데 사용한 프로필 정보를 명확하게 보여주는 안내 카드 -->
<template>
  <aside
    class="mt-4 overflow-hidden rounded-2xl border border-blue-100/90 bg-gradient-to-r from-[#f0f6ff] via-[#f8fbff] to-[#ffffff] p-4 sm:p-5 shadow-xs"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex min-w-0 items-start sm:items-center gap-3.5">
        <!-- 타깃 뱃지 아이콘 -->
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-xs ring-1 ring-primary/15"
          aria-hidden="true"
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
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>

        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span
              class="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary"
            >
              내 맞춤 추천
            </span>
            <p class="text-xs font-semibold text-slate-400">{{ todayLabel }} 기준</p>
          </div>
          <p class="mt-1 text-sm sm:text-base font-black text-[#0a192f]">
            {{
              hasProfileBasis
                ? '회원님의 나이와 소득 조건을 분석해 딱 맞는 정책을 찾았어요'
                : '내 정보를 등록하고 조건에 맞는 정책을 찾아보세요'
            }}
          </p>
        </div>
      </div>

      <RouterLink
        :to="{ name: ROUTE_NAMES.MYPAGE }"
        class="inline-flex shrink-0 items-center justify-center rounded-xl border border-blue-200/80 bg-white px-3.5 py-2 text-xs font-bold text-primary shadow-2xs transition-all hover:bg-blue-50 hover:border-primary/40 active:scale-95"
      >
        {{ hasProfileBasis ? '내 조건 수정' : '내 조건 등록' }}
      </RouterLink>
    </div>

    <!-- 조건 칩 목록 -->
    <div
      v-if="basisItems.length > 0"
      class="mt-3.5 flex flex-wrap items-center gap-2 border-t border-blue-100/70 pt-3"
    >
      <span class="text-xs font-semibold text-slate-400">적용된 조건:</span>
      <span
        v-for="item in basisItems"
        :key="item"
        class="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs"
      >
        <span class="text-primary font-black">✓</span>
        {{ item }}
      </span>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { calculateAge } from '@/features/youth-policy/composables/useEligibilityCheck'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatDate } from '@/shared/lib/date'
import { formatKRWCompact } from '@/shared/lib/money'

const props = defineProps({
  /** @type {import('vue').PropType<{ birthDate?: string, monthlyIncome?: number } | null>} */
  profile: { type: Object, default: null },
})

const age = computed(() => calculateAge(props.profile?.birthDate))
const todayLabel = formatDate(new Date())
const hasProfileBasis = computed(() => age.value != null || props.profile?.monthlyIncome != null)

const basisItems = computed(() => {
  const items = []
  if (age.value != null) items.push(`만 ${age.value}세`)
  if (props.profile?.monthlyIncome != null) {
    items.push(`월소득 ${formatKRWCompact(props.profile.monthlyIncome)}`)
  }
  return items
})
</script>
