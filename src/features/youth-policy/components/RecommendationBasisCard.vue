<!-- 조건 일치 정책을 찾는 데 사용한 프로필 정보를 깔끔하게 보여주는 인라인 바 -->
<template>
  <aside
    class="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-100/90 bg-gradient-to-r from-[#f2f7ff] via-[#f8fbff] to-white px-3.5 py-2 text-xs shadow-2xs"
  >
    <div class="flex flex-wrap items-center gap-2 min-w-0">
      <span class="font-bold text-slate-700 shrink-0">적용된 조건:</span>
      <div v-if="basisItems.length > 0" class="flex flex-wrap items-center gap-1.5">
        <span
          v-for="item in basisItems"
          :key="item"
          class="inline-flex shrink-0 whitespace-nowrap items-center gap-1 rounded-md border border-blue-200/70 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs"
        >
          <span class="text-primary font-black">✓</span>
          {{ item }}
        </span>
      </div>
      <span v-else class="text-slate-400 text-[11px]">등록된 조건 정보 없음</span>
    </div>

    <RouterLink
      :to="{ name: ROUTE_NAMES.MYPAGE }"
      class="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-primary hover:text-blue-700 transition-colors ml-auto sm:ml-0"
    >
      {{ hasProfileBasis ? '내 조건 수정' : '내 조건 등록' }}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
      </svg>
    </RouterLink>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { calculateAge } from '@/features/youth-policy/composables/useEligibilityCheck'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatKRWCompact } from '@/shared/lib/money'

const props = defineProps({
  /** @type {import('vue').PropType<{ birthDate?: string, monthlyIncome?: number } | null>} */
  profile: { type: Object, default: null },
  region: { type: String, default: '전체' },
})

const age = computed(() => calculateAge(props.profile?.birthDate))
const hasProfileBasis = computed(() => age.value != null || props.profile?.monthlyIncome != null)

const basisItems = computed(() => {
  const items = []
  if (age.value != null) items.push(`만 ${age.value}세`)
  if (props.profile?.monthlyIncome != null) {
    items.push(`월소득 ${formatKRWCompact(props.profile.monthlyIncome)}`)
  }
  if (props.region && props.region !== '전체') {
    items.push(props.region)
  }
  return items
})
</script>
