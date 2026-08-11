<!-- 조건 일치 정책을 찾는 데 사용한 프로필 정보를 명확하게 보여주는 안내 카드 -->
<template>
  <aside class="mt-4 rounded-2xl border border-gray-200 bg-[#f2f4f6] px-4 py-4 sm:px-5">
    <div class="min-w-0">
      <p class="text-xs font-semibold text-gray-500">{{ todayLabel }} 기준</p>
      <p class="mt-1 text-sm font-black text-gray-900">
        {{
          hasProfileBasis
            ? '회원님의 나이와 월소득 조건을 충족한 정책이에요'
            : '내 정보를 등록하고 조건에 맞는 정책을 찾아보세요'
        }}
      </p>

      <div class="mt-2 flex items-center justify-between gap-3">
        <div
          v-if="basisItems.length > 0"
          class="min-w-0 flex flex-wrap items-center text-xs font-bold text-gray-600"
        >
          <template v-for="(item, index) in basisItems" :key="item">
            <span v-if="index > 0" class="mx-2 text-gray-300" aria-hidden="true">·</span>
            <span>{{ item }}</span>
          </template>
        </div>
        <p v-else class="min-w-0 text-xs text-gray-500">
          생년월일과 월소득을 등록하면 조건을 충족하는 정책을 찾아드려요.
        </p>

        <RouterLink
          :to="{ name: ROUTE_NAMES.MYPAGE }"
          class="inline-flex shrink-0 items-center text-xs font-bold text-primary"
        >
          {{ hasProfileBasis ? '정보 수정' : '정보 등록' }}
        </RouterLink>
      </div>
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
