<!-- 로드맵 메인 대시보드 -->
<template>
  <div v-if="goalStore.currentGoal" class="flex justify-center bg-[#f8fbff] pb-16">
    <div class="w-full max-w-[1080px] px-10 py-7">
      <PaceBanner :pace="goalStore.currentGoal.pace" :progress-rate="goalStore.currentGoal.progressRate" />

      <div class="grid grid-cols-3 gap-4 pt-6">
        <GoalSummaryCard :goal="goalStore.currentGoal" />
        <ConnectedAssetsCard :assets="goalStore.assets" />
        <PacemakerToggleCard
          :pacemaker="pacemakerStore.pacemakerStatus"
          @toggle="pacemakerStore.togglePacemaker"
        />
      </div>

      <div class="flex gap-5 pt-6">
        <div class="flex-1">
          <MilestoneRoadmap
            :goal="goalStore.currentGoal"
            :milestones="roadmapStore.milestones"
            @pause="goalStore.updateCurrentGoalStatus('PAUSE')"
          />
        </div>
        <AvailableMoneyPanel v-if="goalStore.availableMoney" :available-money="goalStore.availableMoney" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGoalStore } from '@/features/goal'
import {
  useRoadmapStore,
  PaceBanner,
  GoalSummaryCard,
  ConnectedAssetsCard,
  PacemakerToggleCard,
  MilestoneRoadmap, 
  AvailableMoneyPanel 
} from '@/features/roadmap'
import { usePacemakerStore } from '@/features/pacemaker'
import * as goalApi from '@/features/goal/api/goal.api'

const route = useRoute()
const goalStore = useGoalStore()
const roadmapStore = useRoadmapStore()
const pacemakerStore = usePacemakerStore()

onMounted(async () => {
  const goalId = route.params.goalId ?? (await resolveDefaultGoalId())
  if (!goalId) return

  await goalStore.fetchDashboardData(goalId)
  await roadmapStore.fetchMilestones(goalId)
  await pacemakerStore.fetchPacemakerStatus()
})

// 라우트에 goalId가 없는 '/dashboard' 진입 시, 첫 번째 목표를 기본으로 보여줌
async function resolveDefaultGoalId() {
  const goals = await goalApi.getGoals()
  return goals[0]?.goalId ?? null
}
</script>