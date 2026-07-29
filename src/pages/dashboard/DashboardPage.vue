<!-- 로드맵 메인 대시보드 -->
<template>
  <div v-if="goalStore.currentGoal" class="flex justify-center bg-[#f8fbff] pb-16">
    <div class="w-full max-w-[1440px] px-10 py-7">
      <PaceBanner
        :pace="goalStore.currentGoal.pace"
        :progress-rate="goalStore.currentGoal.progressRate"
        @cta-click="handlePacemakerCtaClick"
      />
      <!-- ============ 데스크톱 (lg 이상): 기존 3열 + 사이드 패널 구조 유지 ============ -->
      <div class="hidden lg:block">
        <div class="grid grid-cols-3 gap-4 pt-6">
          <GoalSummaryCard :goal="goalStore.currentGoal" />
          <ConnectedAssetsCard :assets="goalStore.assets" />
          <PacemakerToggleCard
            :pacemaker="pacemakerStore.pacemakerStatus"
            @toggle="handlePacemakerToggle"
          />
        </div>

        <div class="flex gap-5 pt-6">
          <div class="flex flex-1 min-w-0 flex-col gap-4">
            <MilestoneProgressBar
              :goal="goalStore.currentGoal"
              :milestones="roadmapStore.milestones"
              @pause="goalStore.updateCurrentGoalStatus('PAUSE')"
            />
            <NextMilestoneCard
              :goal="goalStore.currentGoal"
              :milestones="roadmapStore.milestones"
            />
            <MilestoneList :milestones="roadmapStore.milestones" />
          </div>
          <div class="w-[300px] shrink-0">
            <AvailableMoneyPanel
              v-if="goalStore.availableMoney"
              :available-money="goalStore.availableMoney"
            />
          </div>
        </div>
      </div>

      <!-- ============ 모바일 (lg 미만): 2열 페어 그리드로 재배치 ============ -->
      <div class="lg:hidden">
        <div class="grid grid-cols-2 gap-4 pt-6">
          <GoalSummaryCard :goal="goalStore.currentGoal" />
          <ConnectedAssetsCard :assets="goalStore.assets" />
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4">
          <AvailableMoneyPanel
            v-if="goalStore.availableMoney"
            :available-money="goalStore.availableMoney"
          />
          <PacemakerToggleCard
            :pacemaker="pacemakerStore.pacemakerStatus"
            @toggle="handlePacemakerToggle"
          />
        </div>

        <div class="flex flex-col gap-4 pt-4">
          <MilestoneProgressBar
            :goal="goalStore.currentGoal"
            :milestones="roadmapStore.milestones"
            @pause="goalStore.updateCurrentGoalStatus('PAUSE')"
          />
          <NextMilestoneCard :goal="goalStore.currentGoal" :milestones="roadmapStore.milestones" />
          <MilestoneList :milestones="roadmapStore.milestones" />
        </div>
      </div>
    </div>
    <PacemakerSetupModal
      v-model="isPacemakerModalOpen"
      @closed="closePacemakerModal"
    />
    <PacemakerBalanceModal
      v-model="isPacemakerBalanceModalOpen"
      :pacemaker="pacemakerStore.pacemakerStatus ?? {}"
      :deposit-targets="pacemakerStore.depositTargets"
      @toggle-auto-saving="pacemakerStore.togglePacemaker"
    />
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
  MilestoneProgressBar,
  NextMilestoneCard,
  MilestoneList,
  AvailableMoneyPanel,
} from '@/features/roadmap'
import { usePacemakerStore, PacemakerSetupModal, PacemakerBalanceModal } from '@/features/pacemaker'
import { useModal } from '@/shared/composables/useModal'
import * as goalApi from '@/features/goal/api/goal.api'

const route = useRoute()
const goalStore = useGoalStore()
const roadmapStore = useRoadmapStore()
const pacemakerStore = usePacemakerStore()
const {
  isOpen: isPacemakerModalOpen,
  open: openPacemakerModal,
} = useModal()
const {
   isOpen: isPacemakerBalanceModalOpen, 
   open: openPacemakerBalanceModal 
  } = useModal()

// 대시보드 카드의 작은 토글 스위치: 개설됐으면 그냥 ON/OFF, 안 됐으면 개설 안내 모달
function handlePacemakerToggle() {
  if (pacemakerStore.pacemakerStatus?.registered) {
    pacemakerStore.togglePacemaker()
  } else {
    openPacemakerModal()
  }
}

// 페이스메이커 CTA, 아직 전용 저금통이 있으면 개설 안내 모달, 있으면 토글 동작
function handlePacemakerCtaClick() {
  if (pacemakerStore.pacemakerStatus?.registered) {
    openPacemakerBalanceModal()
  } else {
    openPacemakerModal()
  }
}

onMounted(async () => {
  const goalId = route.params.goalId ?? (await resolveDefaultGoalId())
  if (!goalId) return

  await goalStore.fetchDashboardData(goalId)
  await roadmapStore.fetchMilestones(goalId)
  await pacemakerStore.fetchPacemakerStatus()
  await pacemakerStore.fetchDepositTargets()
})

// 라우트에 goalId가 없는 '/dashboard' 진입 시, 첫 번째 목표를 기본으로 보여줌
async function resolveDefaultGoalId() {
  const goals = await goalApi.getGoals()
  return goals[0]?.goalId ?? null
}
</script>
