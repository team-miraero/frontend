<!-- 목표 진행 로드맵: 전체 진행바 + 다음 마일스톤 상세 + 전체 마일스톤 리스트 -->
<template>
  <div class="rounded-[24px] border border-slate-200 bg-white px-7 py-6 shadow-[0_2px_7px_rgba(0,102,255,0.06)]">
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold uppercase tracking-[1.2px] text-slate-400">목표 진행 로드맵</p>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2"
        @click="$emit('pause')"
      >
        <img src="@/assets/icons/goal-pause.svg" alt="" class="size-2.5" />
        <span class="text-xs font-bold text-slate-500">목표 일시정지</span>
      </button>
    </div>

    <!-- 전체 진행바 -->
    <div class="pt-8">
      <div class="relative h-6">
        <div class="absolute inset-x-0 top-3 h-1 rounded-full bg-slate-200" />
        <div
          class="absolute left-0 top-3 h-1 rounded-full bg-primary"
          :style="{ width: `${goal.progressRate}%` }"
        />
        <div
          v-for="(milestone, index) in milestones"
          :key="milestone.milestoneId"
          class="absolute top-0 flex -translate-x-1/2 flex-col items-center"
          :style="{ left: `${((index + 1) / milestones.length) * 100}%` }"
        >
          <span
            class="text-[10px] font-black tracking-[-0.1px]"
            :class="milestone.status === 'COMPLETED' ? 'text-primary' : 'text-slate-400'"
          >
            {{ formatManwon(milestone.targetAmount) }}
          </span>
          <span class="pt-px text-[9px]" :class="milestone.status === 'COMPLETED' ? 'text-primary/60' : 'text-slate-300'">
            {{ milestone.targetDate }}
          </span>
          <span
            class="mt-2.5 flex size-[19px] items-center justify-center rounded-full border-2"
            :class="
              milestone.status === 'COMPLETED'
                ? 'border-primary bg-primary'
                : 'border-slate-300 bg-white'
            "
          >
            <img
              v-if="milestone.milestoneId === milestones[milestones.length - 1]?.milestoneId"
              src="@/assets/icons/progress-marker-final.svg"
              alt=""
              class="size-2"
            />
          </span>
        </div>
      </div>
    </div>

    <!-- 다음 마일스톤 상세 -->
    <div v-if="nextMilestone" class="mt-4 border-t border-slate-100 pt-3">
      <div class="flex items-center justify-between">
        <p class="text-xs font-bold text-slate-500">다음 마일스톤 — {{ nextMilestone.order }}단계</p>
        <p class="text-xs text-slate-400">{{ nextMilestone.targetDate }} 예상</p>
      </div>

      <div class="pt-4">
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span>{{ previousMilestone?.order ?? 0 }}단계 ({{ formatManwon(previousMilestone?.targetAmount ?? 0) }})</span>
          <span>{{ nextMilestone.order }}단계 ({{ formatManwon(nextMilestone.targetAmount) }})</span>
        </div>
        <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div class="h-2 rounded-full bg-primary" :style="{ width: `${segmentProgress}%` }" />
        </div>
        <div class="flex items-center justify-between pt-1.5 text-xs">
          <span class="text-slate-500">현재 {{ formatManwon(goal.currentAmount) }} ({{ segmentProgress }}% 도달)</span>
          <span class="text-slate-400">{{ formatManwon(remainingToNext) }} 남음</span>
        </div>
      </div>

      <div class="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs">
        <span class="text-slate-500">현재 · {{ formatManwon(goal.currentAmount) }}</span>
        <span class="text-slate-500">목표 페이스 · {{ formatManwon(goal.pace.expectedAmount) }}</span>
        <span :class="goal.pace.paceStatus === 'BEHIND' ? 'text-rose-600' : 'text-emerald-600'">
          {{ goal.pace.paceStatus === 'BEHIND' ? '▼' : '▲' }} {{ formatManwon(Math.abs(goal.pace.differenceAmount)) }}
          {{ goal.pace.paceStatus === 'BEHIND' ? '뒤처짐' : '앞섬' }}
        </span>
      </div>

      <div class="mt-3 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100">
        <div class="px-3 py-3 text-center">
          <p class="text-xs text-slate-400">현재 잔액</p>
          <p class="pt-1 text-base font-black text-[#0a192f]">{{ formatManwon(goal.currentAmount) }}</p>
        </div>
        <div class="px-3 py-3 text-center">
          <p class="text-xs text-slate-400">다음 목표</p>
          <p class="pt-1 text-base font-black text-[#0a192f]">{{ formatManwon(nextMilestone.targetAmount) }}</p>
        </div>
        <div class="px-3 py-3 text-center">
          <p class="text-xs text-slate-400">남은 금액</p>
          <p class="pt-1 text-base font-black text-[#0a192f]">{{ formatManwon(remainingToNext) }}</p>
        </div>
      </div>
    </div>

    <!-- 전체 마일스톤 리스트 -->
    <div class="mt-6 border-t border-slate-100 pt-6">
      <p class="pb-4 text-sm font-bold text-[#0a192f]">전체 마일스톤</p>
      <ul class="flex flex-col">
        <li v-for="milestone in milestones" :key="milestone.milestoneId" class="flex gap-3">
          <div class="flex w-8 flex-col items-center">
            <span
              class="flex size-7 items-center justify-center rounded-full border"
              :class="milestone.status === 'UPCOMING' ? 'border-slate-200' : 'border-primary bg-primary/10'"
            >
              <img src="@/assets/icons/milestone-status.svg" alt="" class="size-2.5" />
            </span>
            <span class="mt-1 w-px flex-1 bg-slate-200 last:hidden" />
          </div>

          <div class="flex-1 rounded-[18px] border border-slate-100 bg-slate-50 px-4 py-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-black text-[#0a192f]">{{ formatManwon(milestone.targetAmount) }}원</span>
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-bold"
                :class="
                  milestone.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-600'
                    : milestone.status === 'IN_PROGRESS'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-100 text-slate-400'
                "
              >
                {{ milestone.status === 'COMPLETED' ? '완료 ✓' : milestone.status === 'IN_PROGRESS' ? '진행 중' : '예정' }}
              </span>
            </div>
            <p class="pt-1 text-sm text-slate-700">{{ milestone.title }}</p>
            <div v-if="milestone.tags?.length" class="flex gap-2 pt-2">
              <span
                v-for="tag in milestone.tags"
                :key="tag"
                class="rounded-lg bg-white px-2 py-1 text-[11px] text-slate-500"
              >
                {{ tag }}
              </span>
            </div>
            <div class="flex items-center gap-1 pt-2 text-[11px] text-slate-400">
              <img src="@/assets/icons/milestone-date.svg" alt="" class="size-3" />
              {{ milestone.targetDate }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  goal: {
    type: Object,
    required: true,
  },
  milestones: {
    type: Array,
    required: true,
  },
})
defineEmits(['pause'])

const nextMilestone = computed(() => props.milestones.find((m) => m.status === 'IN_PROGRESS') ?? null)
const previousMilestone = computed(() => {
  if (!nextMilestone.value) return null
  const index = props.milestones.indexOf(nextMilestone.value)
  return index > 0 ? props.milestones[index - 1] : null
})

const segmentProgress = computed(() => {
  if (!nextMilestone.value) return 0
  const from = previousMilestone.value?.targetAmount ?? 0
  const to = nextMilestone.value.targetAmount
  return Math.min(100, Math.round(((props.goal.currentAmount - from) / (to - from)) * 100))
})

const remainingToNext = computed(() =>
  nextMilestone.value ? Math.max(0, nextMilestone.value.targetAmount - props.goal.currentAmount) : 0
)

function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만`
}
</script>