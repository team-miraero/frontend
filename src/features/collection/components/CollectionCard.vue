<!-- 달성 목표 컬렉션 카드 (GoalSummaryCard / MilestoneList 디자인 결 반영) -->
<template>
  <div
    class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_7px_rgba(0,102,255,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_6px_18px_rgba(0,102,255,0.08)]"
  >
    <!-- 상단 영역: 목표 마스코트 & 완주 배지 -->
    <div>
      <div class="flex items-start justify-between gap-3">
        <!-- 목표 캐릭터/아이콘 아바타 -->
        <div
          class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-[#f8fbff] p-1.5 shadow-sm transition-transform duration-200 group-hover:scale-105"
        >
          <img
            v-if="characterImage"
            :src="characterImage"
            :alt="goal?.title"
            class="size-9 object-contain drop-shadow-sm"
          />
          <span v-else class="text-2xl">{{ goal?.badgeIcon || '🏆' }}</span>
        </div>

        <!-- 완주 완료 배지 -->
        <span
          class="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-[#eaf2ff] px-2.5 py-1 text-xs font-bold text-primary"
        >
          <span class="size-1.5 rounded-full bg-primary" />
          <span>완주 완료</span>
        </span>
      </div>

      <!-- 목표 제목 & 달성 금액 -->
      <div class="mt-3.5">
        <span class="text-[11px] font-bold text-slate-400">
          {{ goalTypeLabel }}
        </span>
        <h3
          class="mt-0.5 text-base font-black text-[#0a192f] transition-colors group-hover:text-primary sm:text-lg"
        >
          {{ goal?.title || '달성된 목표' }}
        </h3>
        <p class="mt-1 text-xl font-black tracking-[-0.5px] text-[#0a192f]">
          {{ formattedAmount }}
          <span class="text-xs font-bold text-slate-400">달성</span>
        </p>
      </div>
    </div>

    <!-- 하단 상세 정보 박스 & 액션 -->
    <div class="mt-4">
      <!-- 완주 메타 데이터 박스 (대시보드 스타일) -->
      <div
        class="flex flex-col gap-1.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-xs"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium text-slate-400">완주 시기</span>
          <span class="font-bold text-[#0a192f]">{{ goal?.achievedDate || '-' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium text-slate-400">연동 자산</span>
          <span class="font-bold text-slate-700">{{ goal?.accountName || '연동 계좌' }}</span>
        </div>
      </div>

      <!-- 하단 링크 버튼 -->
      <div class="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
          <span>✓ 마일스톤 100% 완주</span>
        </span>

        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:underline"
          @click="$emit('view-roadmap', goal)"
        >
          <span>로드맵 보기</span>
          <span class="text-xs">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatKRWCompact } from '@/shared/lib/money'
import duckImage from '@/assets/images/duck.png'
import lamaImage from '@/assets/images/lama.png'
import bearImage from '@/assets/images/bear.png'
import rabbitImage from '@/assets/images/rabbit_new.png'

const props = defineProps({
  goal: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['view-roadmap'])

const GOAL_TYPE_CHARACTER = {
  INDEPENDENCE: duckImage,
  WEDDING: lamaImage,
  EMERGENCY: bearImage,
  LOAN: rabbitImage,
}

const GOAL_TYPE_LABEL = {
  INDEPENDENCE: '독립자금 로드맵',
  WEDDING: '결혼자금 로드맵',
  EMERGENCY: '비상금 로드맵',
  LOAN: '학자금대출 로드맵',
}

const characterImage = computed(() => {
  return GOAL_TYPE_CHARACTER[props.goal?.goalType] ?? null
})

const goalTypeLabel = computed(() => {
  return GOAL_TYPE_LABEL[props.goal?.goalType] || '목표 로드맵'
})

const formattedAmount = computed(() => {
  const amount = Number(props.goal?.achievedAmount) || 0
  return amount > 0 ? formatKRWCompact(amount) : '0원'
})
</script>
