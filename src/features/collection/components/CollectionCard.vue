<!-- 달성 목표 컬렉션 카드 컴포넌트 -->
<template>
  <div
    class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_30px_rgb(0,102,255,0.08)]"
  >
    <!-- 상단 영역: 배지 아이콘, 목표 이름, 달성 금액 -->
    <div>
      <div class="flex items-start justify-between gap-3">
        <!-- 뱃지 아이콘 -->
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-light text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
        >
          {{ goal?.badgeIcon || '🏆' }}
        </div>

        <!-- 달성 금액 태그 -->
        <span
          class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-200/50"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ formattedAmount }} 달성</span>
        </span>
      </div>

      <!-- 목표 제목 -->
      <h3 class="mt-4 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
        {{ goal?.title || '달성된 목표' }}
      </h3>
    </div>

    <!-- 하단 상세 정보 & 진행바 & 액션 -->
    <div class="mt-6">
      <!-- 상세 정보 (달성 시기, 연동 계좌) -->
      <div class="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
        <span class="flex items-center gap-1">
          <span class="text-gray-400">달성 시기:</span>
          <span class="font-semibold text-gray-700">{{ goal?.achievedDate || '-' }}</span>
        </span>
        <span class="flex items-center gap-1">
          <span class="text-gray-400">연동 계좌:</span>
          <span class="font-semibold text-gray-700">{{ goal?.accountName || '-' }}</span>
        </span>
      </div>

      <!-- 진행률 바 (100%) -->
      <div class="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          class="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>

      <!-- 액션 링크/버튼 -->
      <div class="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span class="text-xs font-bold text-primary flex items-center gap-1">
          <span>달성 완료</span>
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </span>

        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs font-bold text-gray-600 transition-colors hover:text-primary"
          @click="$emit('view-roadmap', goal)"
        >
          <span>로드맵 보기</span>
          <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatKRWCompact } from '@/shared/lib/money'

const props = defineProps({
  goal: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['view-roadmap'])

const formattedAmount = computed(() => {
  const amount = Number(props.goal?.achievedAmount) || 0
  return amount > 0 ? formatKRWCompact(amount) : '0원'
})

const progressPercent = computed(() => {
  const p = Number(props.goal?.progress)
  return Number.isFinite(p) ? Math.min(100, Math.max(0, p)) : 100
})
</script>
