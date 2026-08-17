<!-- 지출 카테고리 공통 라인 아이콘: 동일한 크기와 선 굵기, 카테고리별 강조색 사용 -->
<template>
  <span
    class="inline-flex shrink-0 select-none items-center justify-center transition-all duration-200"
    :class="[sizeClasses.container, active ? 'ring-2 ring-primary/20 shadow-xs' : '', customClass]"
    :style="{ backgroundColor: customBg || '#F2F4F6', color: accent || palette.color }"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="[sizeClasses.icon, active ? 'scale-105' : '']"
    >
      <template v-if="normalizedId === 'housing'">
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </template>
      <template v-else-if="normalizedId === 'telecommunication'">
        <rect x="6.5" y="2" width="11" height="20" rx="2.5" />
        <path d="M10 5h4M11 18.5h2" />
      </template>
      <template v-else-if="normalizedId === 'insurance'">
        <path d="M12 3 5 6v5c0 4.5 2.8 8.3 7 10 4.2-1.7 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </template>
      <template v-else-if="normalizedId === 'subscription'">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m10 9 5 3-5 3V9Z" />
      </template>
      <template v-else-if="normalizedId === 'loanrepayment'">
        <path d="m3 9 9-5 9 5M5 10v7M9 10v7M15 10v7M19 10v7M3 20h18" />
      </template>
      <template v-else-if="normalizedId === 'savings'">
        <path
          d="M6 10a7 7 0 0 1 12.5 1H21v5h-2.5a7 7 0 0 1-3.5 3v2h-3v-2H9v2H6v-3.5A6 6 0 0 1 6 10Z"
        />
        <path d="M9 8V5h5M16.5 12h.01" />
      </template>
      <template v-else-if="normalizedId === 'investment'">
        <path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6" />
        <path d="M15 7h4v4" />
      </template>
      <template v-else-if="normalizedId === 'food'">
        <path d="M7 3v7M4 3v4a3 3 0 0 0 6 0V3M7 10v11M16 3v18M16 3c3 2 4 5 4 8h-4" />
      </template>
      <template v-else-if="normalizedId === 'cafe'">
        <path d="M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z" />
        <path d="M17 10h1a3 3 0 0 1 0 6h-2M8 3v2M12 3v2" />
      </template>
      <template v-else-if="normalizedId === 'transportation'">
        <rect x="5" y="3" width="14" height="16" rx="3" />
        <path d="M5 11h14M8 7h8M8 19v2M16 19v2M8 15h.01M16 15h.01" />
      </template>
      <template v-else-if="normalizedId === 'shopping'">
        <path d="M5 8h14l-1 13H6L5 8Z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </template>
      <template v-else-if="normalizedId === 'culture'">
        <path d="M4 7h16v13H4zM4 7l3-4h4L8 7M12 7l3-4h4l-3 4" />
        <path d="m10 11 5 3-5 3v-6Z" />
      </template>
      <template v-else-if="normalizedId === 'medical'">
        <path d="M9 3v5a3 3 0 0 0 6 0V3M7 3h4M13 3h4M12 11v3a5 5 0 0 0 5 5" />
        <circle cx="19" cy="17" r="2" />
      </template>
      <template v-else>
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M2 10h20M6 15h3" />
      </template>
    </svg>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const CATEGORY_PALETTE = {
  housing: { color: '#3D8BFF', soft: '#EEF5FF' },
  telecommunication: { color: '#0EA5E9', soft: '#F0F9FF' },
  insurance: { color: '#6366F1', soft: '#EEF2FF' },
  subscription: { color: '#8B5CF6', soft: '#F5F3FF' },
  loanrepayment: { color: '#64748B', soft: '#F1F5F9' },
  savings: { color: '#10B981', soft: '#ECFDF5' },
  investment: { color: '#14B8A6', soft: '#F0FDFA' },
  food: { color: '#FF6B6B', soft: '#FFF1F2' },
  cafe: { color: '#F59E0B', soft: '#FFF7E8' },
  transportation: { color: '#3B82F6', soft: '#EFF6FF' },
  shopping: { color: '#EC4899', soft: '#FDF2F8' },
  culture: { color: '#A855F7', soft: '#FAF5FF' },
  medical: { color: '#EF4444', soft: '#FEF2F2' },
  other: { color: '#64748B', soft: '#F1F5F9' },
}

const props = defineProps({
  icon: { type: String, default: '' },
  categoryId: { type: String, default: '' },
  accent: { type: String, default: '' },
  size: { type: String, default: 'md' },
  active: { type: Boolean, default: false },
  customBg: { type: String, default: '' },
  customClass: { type: String, default: '' },
})

const normalizedId = computed(() => (props.categoryId || '').toLowerCase().replace(/[-_]/g, ''))
const palette = computed(() => CATEGORY_PALETTE[normalizedId.value] || CATEGORY_PALETTE.other)
const sizeClasses = computed(() => {
  if (props.size === 'sm')
    return {
      container: 'size-7 rounded-[10px] sm:size-8 sm:rounded-xl',
      icon: 'size-4 sm:size-[18px]',
    }
  if (props.size === 'lg')
    return { container: 'size-11 rounded-2xl sm:size-12', icon: 'size-6 sm:size-7' }
  if (props.size === 'xl') return { container: 'size-14 rounded-2xl', icon: 'size-8' }
  return { container: 'size-9 rounded-xl sm:size-10 sm:rounded-[14px]', icon: 'size-5 sm:size-6' }
})
</script>
