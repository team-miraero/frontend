<!-- "내게 맞는 추천 정책" 카드. 정책 선택에 필요한 핵심 정보만 간결하게 보여준다. -->
<template>
  <article
    class="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
  >
    <div class="flex min-h-6 flex-wrap items-center gap-1.5">
      <span
        v-if="representativeKeyword"
        class="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600"
      >
        {{ representativeKeyword }}
      </span>
      <span
        class="ml-auto rounded-full px-2.5 py-1 text-[11px] font-bold"
        :class="deadlineBadge.className"
      >
        {{ deadlineBadge.label }}
      </span>
    </div>

    <h3 class="mt-3 line-clamp-2 min-h-12 text-base font-bold leading-6 text-gray-900">
      {{ policy.policyName }}
    </h3>

    <p
      v-if="policy.supportContent"
      class="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500"
    >
      {{ policy.supportContent }}
    </p>

    <dl class="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs">
      <div v-if="policy.providerInstitutionName">
        <dt class="inline font-semibold text-gray-400">제공기관</dt>
        <dd class="ml-3 inline font-bold text-gray-700">
          {{ policy.providerInstitutionName }}
        </dd>
      </div>
      <div>
        <dt class="inline font-semibold text-gray-400">신청기간</dt>
        <dd class="ml-3 inline font-bold text-gray-700">
          {{ policy.applicationPeriod || '별도 공지' }}
        </dd>
      </div>
      <div v-if="ageLabel">
        <dt class="inline font-semibold text-gray-400">지원연령</dt>
        <dd class="ml-3 inline font-bold text-gray-700">{{ ageLabel }}</dd>
      </div>
    </dl>

    <div class="mt-auto pt-5">
      <button
        type="button"
        class="flex w-full items-center justify-center rounded-xl bg-accent-light py-2.5 text-sm font-bold text-primary transition-colors hover:bg-accent"
        @click="emit('view-detail', policy.youthPolicyId)"
      >
        자세히 보기
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('@/features/youth-policy/api/youthPolicy.api').YouthPolicyDetail>} */
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

const ageLabel = computed(() => {
  const { minAge, maxAge } = props.policy
  if (minAge != null && maxAge != null) return `만 ${minAge}~${maxAge}세`
  if (minAge != null) return `만 ${minAge}세 이상`
  if (maxAge != null) return `만 ${maxAge}세 이하`
  return ''
})

const deadlineBadge = computed(() => {
  if (!props.policy.applicationEndDate) {
    return props.policy.applicationPeriod?.includes('상시')
      ? { label: '상시 모집', className: 'bg-gray-100 text-gray-600' }
      : { label: '기간 확인', className: 'bg-gray-100 text-gray-500' }
  }

  const [year, month, day] = props.policy.applicationEndDate.split('-').map(Number)
  const endDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / 86400000)

  if (daysLeft < 0) return { label: '마감', className: 'bg-gray-100 text-gray-400' }
  if (daysLeft === 0) return { label: '오늘 마감', className: 'bg-red-50 text-red-600' }
  if (daysLeft <= 7)
    return { label: `마감 D-${daysLeft}`, className: 'bg-orange-50 text-orange-600' }
  return { label: `마감 D-${daysLeft}`, className: 'bg-gray-100 text-gray-600' }
})
</script>
