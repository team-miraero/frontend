<!-- /goal/select를 기준으로 한 목표 유형 공통 SVG -->
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="sizeClass"
    aria-hidden="true"
  >
    <path
      v-if="normalizedType === 'INDEPENDENCE'"
      d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"
    />
    <path
      v-else-if="normalizedType === 'EMERGENCY'"
      d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2m2 4h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm7-5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
    />
    <path
      v-else-if="normalizedType === 'MARRIAGE'"
      d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z"
    />
    <template v-else-if="normalizedType === 'STUDENT_LOAN'">
      <path d="m12 14 9-5-9-5-9 5 9 5Z" />
      <path
        d="m12 14 6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 1 12 20.055a11.952 11.952 0 0 1-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14Z"
      />
      <path d="M12 14v6.5" />
    </template>
    <circle v-else cx="12" cy="12" r="8" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const TYPE_ALIASES = {
  WEDDING: 'MARRIAGE',
  LOAN: 'STUDENT_LOAN',
  HOUSE: 'INDEPENDENCE',
  HOME: 'INDEPENDENCE',
  UMBRELLA: 'EMERGENCY',
  RING: 'MARRIAGE',
  CAP: 'STUDENT_LOAN',
  '🏠': 'INDEPENDENCE',
  '☂️': 'EMERGENCY',
  '💍': 'MARRIAGE',
  '🎓': 'STUDENT_LOAN',
}

const props = defineProps({
  goalType: { type: String, default: '' },
  size: { type: String, default: 'md' },
})
const normalizedType = computed(() => {
  const value = props.goalType.toUpperCase()
  return TYPE_ALIASES[value] || TYPE_ALIASES[props.goalType] || value
})
const sizeClass = computed(
  () => ({ sm: 'size-4', md: 'size-5', lg: 'size-6', xl: 'size-8' })[props.size] || 'size-5'
)
</script>
