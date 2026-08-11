<!-- 전체 정책 목록용 가로형 카드. 추천 카드와 구분해 탐색에 필요한 정보만 빠르게 훑게 한다. -->
<template>
  <button
    type="button"
    class="relative flex min-h-[176px] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition-shadow hover:shadow-md"
    @click="emit('view-detail', policy.youthPolicyId)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-wrap gap-1.5">
        <span
          v-if="representativeKeyword"
          class="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600"
        >
          {{ representativeKeyword }}
        </span>
      </div>
      <span
        class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
        :class="deadlineBadge.className"
      >
        {{ deadlineBadge.label }}
      </span>
    </div>

    <h3 class="mt-3 line-clamp-2 text-base font-black leading-6 text-gray-900">
      {{ policy.policyName }}
    </h3>

    <div class="mt-auto flex items-end justify-between gap-4 pt-4">
      <dl class="min-w-0 space-y-1.5 text-xs">
        <div v-if="policy.providerInstitutionName" class="flex min-w-0 gap-2">
          <dt class="shrink-0 font-semibold text-gray-400">제공기관</dt>
          <dd class="truncate font-bold text-gray-600">{{ policy.providerInstitutionName }}</dd>
        </div>
        <div v-if="policy.applicationPeriod" class="flex min-w-0 gap-2">
          <dt class="shrink-0 font-semibold text-gray-400">신청기간</dt>
          <dd class="truncate font-bold text-gray-600">{{ policy.applicationPeriod }}</dd>
        </div>
      </dl>

      <span class="shrink-0 text-xs font-bold text-primary">자세히</span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('@/features/youth-policy/api/youthPolicy.api').YouthPolicyListItem>} */
  policy: { type: Object, required: true },
})
const emit = defineEmits(['view-detail'])

const representativeKeyword = computed(
  () =>
    props.policy.policyKeyword
      ?.split(',')
      .map((tag) => tag.trim())
      .find(Boolean) ?? ''
)

const deadlineBadge = computed(() => {
  const period = props.policy.applicationPeriod ?? ''
  if (period.includes('상시')) {
    return { label: '상시 모집', className: 'bg-gray-100 text-gray-600' }
  }

  const dates = period.match(/\d{4}-\d{2}-\d{2}/g)
  const endDateText = dates?.at(-1)
  if (!endDateText) return { label: '기간 확인', className: 'bg-gray-100 text-gray-500' }

  const [year, month, day] = endDateText.split('-').map(Number)
  const endDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / 86400000)

  if (daysLeft < 0) return { label: '마감', className: 'bg-gray-100 text-gray-400' }
  if (daysLeft === 0) return { label: '오늘 마감', className: 'bg-red-50 text-red-600' }
  if (daysLeft <= 7)
    return { label: `마감 D-${daysLeft}`, className: 'bg-orange-50 text-orange-600' }
  return { label: `D-${daysLeft}`, className: 'bg-gray-100 text-gray-600' }
})
</script>
