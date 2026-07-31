<template>
  <div>
    <RoadmapSelector
      :goals="goals"
      :selected-goal-id="selectedGoalId"
      :disabled="areGoalsLoading"
      :helper-text="roadmapHelperText"
      @update:selected-goal-id="goalStore.selectGoal"
    />

    <div
      class="mx-auto w-full max-w-[1660px] px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-12 md:pt-7 lg:px-10"
    >
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="text-xl font-bold text-[#0a192f]">KB 상품 추천 · KB-01~02</h2>
        <p class="mt-2 text-sm text-slate-500">
          {{ selectedGoalName }} 로드맵에 맞는 상품을 준비하고 있어요.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoalStore } from '@/features/goal'
import RoadmapSelector from '@/shared/ui/RoadmapSelector.vue'

const goalStore = useGoalStore()
const { goals, selectedGoalId, selectedGoal, areGoalsLoading } = storeToRefs(goalStore)
const selectedGoalName = computed(() => selectedGoal.value?.goalName ?? '선택한')
const roadmapHelperText = computed(() =>
  selectedGoal.value
    ? `이 페이지의 모든 단축 효과는 ${selectedGoal.value.goalName} 로드맵 기준으로 계산돼요`
    : ''
)

onMounted(() => {
  goalStore.fetchGoals()
})
</script>
