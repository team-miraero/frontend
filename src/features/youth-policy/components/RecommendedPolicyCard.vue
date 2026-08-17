<!-- "내게 맞는 추천 정책" 카드. 정책 선택에 필요한 핵심 정보만 간결하게 보여준다. -->
<template>
  <article
    class="group flex h-full w-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
  >
    <!-- 상단: 키워드 태그 배지 + 마감일 배지 -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex min-w-0 flex-wrap items-center gap-1.5">
        <span
          v-for="keyword in keywordTags"
          :key="keyword"
          class="truncate rounded-md bg-[#eef5ff] px-2.5 py-0.5 text-[11px] font-bold text-primary"
        >
          {{ keyword }}
        </span>
      </div>
      <span
        class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
        :class="deadlineBadge.className"
      >
        {{ deadlineBadge.label }}
      </span>
    </div>

    <h3
      class="mt-3.5 line-clamp-2 min-h-12 text-base font-black leading-6 text-gray-900 group-hover:text-primary transition-colors"
    >
      {{ policy.policyName }}
    </h3>

    <p
      v-if="policy.supportContent"
      class="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500 font-medium"
    >
      {{ policy.supportContent }}
    </p>

    <dl class="mt-4 space-y-2 border-t border-slate-100 pt-3.5 text-xs">
      <div v-if="policy.providerInstitutionName" class="flex items-center justify-between">
        <dt class="font-semibold text-slate-400">제공기관</dt>
        <dd class="font-bold text-slate-700 truncate max-w-[180px]">
          {{ policy.providerInstitutionName }}
        </dd>
      </div>
      <div class="flex items-center justify-between">
        <dt class="font-semibold text-slate-400">신청기간</dt>
        <dd class="font-bold text-slate-700 truncate max-w-[180px]">
          {{ policy.applicationPeriod || '별도 공지' }}
        </dd>
      </div>
      <div v-if="ageLabel" class="flex items-center justify-between">
        <dt class="font-semibold text-slate-400">지원연령</dt>
        <dd class="font-bold text-slate-700">{{ ageLabel }}</dd>
      </div>
    </dl>

    <div class="mt-auto pt-5">
      <button
        type="button"
        class="flex w-full items-center justify-center rounded-xl bg-[#eaf2ff] py-2.5 text-xs sm:text-sm font-black text-primary transition-all duration-150 hover:bg-primary hover:text-white active:scale-98 cursor-pointer select-none"
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

const keywordTags = computed(() => {
  const tags = (props.policy.policyKeyword || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
  return tags.length > 0 ? tags : (props.policy.policyCategory ? [props.policy.policyCategory] : [])
})

const ageLabel = computed(() => {
  const { minAge, maxAge } = props.policy
  if (minAge != null && maxAge != null) return `만 ${minAge}~${maxAge}세`
  if (minAge != null) return `만 ${minAge}세 이상`
  if (maxAge != null) return `만 ${maxAge}세 이하`
  return ''
})

const deadlineBadge = computed(() => {
  const applicationEndDate = toLocalDate(props.policy.applicationEndDate)
  if (!applicationEndDate) {
    return props.policy.applicationPeriod?.includes('상시')
      ? { label: '상시 모집', className: 'bg-slate-100 text-slate-600' }
      : { label: '기간 확인', className: 'bg-slate-100 text-slate-500' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysLeft = Math.ceil((applicationEndDate.getTime() - today.getTime()) / 86400000)

  if (daysLeft < 0) return { label: '마감', className: 'bg-slate-100 text-slate-400' }
  if (daysLeft === 0) return { label: '오늘 마감', className: 'bg-red-50 text-red-600 font-bold' }
  if (daysLeft <= 7)
    return { label: `마감 D-${daysLeft}`, className: 'bg-orange-50 text-orange-600 font-bold' }
  return { label: `마감 D-${daysLeft}`, className: 'bg-blue-50 text-primary font-bold' }
})

function toLocalDate(value) {
  const dateParts =
    typeof value === 'string'
      ? value.split('-').map(Number)
      : Array.isArray(value)
        ? value.map(Number)
        : []

  const [year, month, day] = dateParts
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null
  }

  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}
</script>
