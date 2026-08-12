<!-- 로드맵 메인 대시보드 -->
<template>
  <div v-if="goalStore.currentGoal" class="flex justify-center bg-[#f8fbff] pb-8">
    <div class="w-full max-w-[1440px] px-8 py-3">
      <GoalPausedBanner v-if="isGoalPaused" class="mb-3" @resume-click="openResumeConfirm" />
      <PaceBanner
        :pace="goalStore.currentGoal.pace"
        :progress-rate="goalStore.currentGoal.progressRate"
        :disabled="isGoalPaused"
        :current-amount="goalStore.currentGoal.currentAmount"
        :daily-available-money="goalStore.dailyAvailableMoney"
        :monthly-available-money="goalStore.monthlyAvailableMoney"
        @cta-click="handlePacemakerCtaClick"
        @pause="openPauseConfirm"
        @open-today="openTodayAvailableMoneyModal"
        @open-month="openMonthlyAvailableMoneyModal"
      />
      <!-- 목표가 일시정지 상태면 아래 액션 영역 전체를 흐리게 하고 클릭이 통하지 않도록 막음 -->
      <div :class="isGoalPaused ? 'pointer-events-none opacity-45' : ''">
        <div class="mt-2 sm:mt-3">
          <MilestoneProgressBar
            :goal="goalStore.currentGoal"
            :milestones="roadmapStore.milestones"
          />

          <!-- 스플릿 기록: 예전엔 토글로 접어뒀는데 굳이 숨길 필요 없어서 항상 노출 -->
          <div class="mt-3 flex flex-col gap-3">
            <!-- NextMilestoneCard: SPLIT 2(진행 중) 카드 안에 동일한 진행률 정보가 이미 있어 중복이라 잠시 주석 처리.
                 나중에 다시 쓸 수도 있어서 삭제하지 않고 남겨둠. -->
            <!--
            <NextMilestoneCard
              :goal="goalStore.currentGoal"
              :milestones="roadmapStore.milestones"
            />
            -->
            <MilestoneList :milestones="roadmapStore.milestones" :goal="goalStore.currentGoal" />
          </div>
        </div>

        <!-- 요약 통계 그룹: 도로/스플릿과 이어지는 하나의 카드로 묶음 -->
        <div class="pt-1">
          <RaceRecordSummary
            :goal="goalStore.currentGoal"
            :assets="goalStore.assets"
            :pacemaker="pacemakerStore.pacemakerView"
            :is-toggling="pacemakerStore.isToggling"
            :toggle-error-message="pacemakerStore.toggleError?.message ?? ''"
            :dashboard-error-message="dashboardErrorMessage"
            @open-detail="openLinkedAssetsModal"
            @toggle="handlePacemakerToggle"
            @open="openShareGoalModal"
            @retry-dashboard="retryPacemakerDashboard"
          />
        </div>
      </div>
    </div>
    <PacemakerSetupModal v-model="isPacemakerModalOpen" />
    <PacemakerBalanceModal
      v-model="isPacemakerBalanceModalOpen"
      :pacemaker="pacemakerStore.pacemakerView"
      :deposit-targets="pacemakerStore.depositTargets"
      :is-deposit-targets-loading="pacemakerStore.isDepositTargetsLoading"
      :deposit-targets-error="pacemakerStore.depositTargetsError"
      :is-toggling="pacemakerStore.isToggling"
      :toggle-error-message="pacemakerStore.toggleError?.message ?? ''"
      @toggle-auto-saving="pacemakerStore.togglePacemaker"
      @deposit="handleOpenDeposit"
      @view-history="handleOpenHistory"
      @retry-deposit-targets="retryDepositTargets"
    />
    <PacemakerDepositModal
      v-model="isPacemakerDepositModalOpen"
      :target="selectedDepositTarget"
      :available-balance="pacemakerStore.pacemakerView.moneyBoxBalance"
      :is-submitting="isDepositing"
      :error-message="depositErrorMessage"
      @deposit="handleDeposit"
    />
    <PacemakerHistoryModal
      v-model="isPacemakerHistoryModalOpen"
      :histories="pacemakerStore.histories"
      :is-loading="pacemakerStore.isHistoriesLoading"
      :error="pacemakerStore.historiesError"
      @retry="retryHistories"
    />
    <PacemakerDepositSuccessModal
      v-model="isPacemakerDepositSuccessModalOpen"
      :target="selectedDepositTarget"
      :amount="depositedAmount"
    />
    <TodayAvailableMoneyModal
      v-if="goalStore.dailyAvailableMoney"
      v-model="isTodayAvailableMoneyModalOpen"
      :daily="goalStore.dailyAvailableMoney"
    />
    <MonthlyAvailableMoneyModal
      v-if="goalStore.monthlyAvailableMoney"
      v-model="isMonthlyAvailableMoneyModalOpen"
      :monthly="goalStore.monthlyAvailableMoney"
    />
    <LinkedAssetsModal v-model="isLinkedAssetsModalOpen" :assets="goalStore.assets" />
    <GoalStatusConfirmModal
      v-model="isStatusConfirmModalOpen"
      :mode="statusConfirmMode"
      @confirm="handleStatusConfirm"
    />
    <ShareGoalModal
      v-model="isShareGoalModalOpen"
      :goal="goalStore.currentGoal"
      :milestones="roadmapStore.milestones"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGoalStore } from '@/features/goal'
import {
  useRoadmapStore,
  PaceBanner,
  MilestoneProgressBar,
  // NextMilestoneCard, // 템플릿에서 주석 처리한 것과 짝 — 나중에 다시 쓰면 여기도 같이 복원
  MilestoneList,
  TodayAvailableMoneyModal,
  MonthlyAvailableMoneyModal,
  LinkedAssetsModal,
  GoalPausedBanner,
  GoalStatusConfirmModal,
  RaceRecordSummary,
  ShareGoalModal,
} from '@/features/roadmap'
import {
  usePacemakerStore,
  usePacemakerDeposit,
  PacemakerSetupModal,
  PacemakerBalanceModal,
  PacemakerDepositModal,
  PacemakerHistoryModal,
  PacemakerDepositSuccessModal,
} from '@/features/pacemaker'
import { useModal } from '@/shared/composables/useModal'

const route = useRoute()
const goalStore = useGoalStore()
const roadmapStore = useRoadmapStore()
const pacemakerStore = usePacemakerStore()
const { isOpen: isPacemakerModalOpen, open: openPacemakerModal } = useModal()
const { isOpen: isPacemakerBalanceModalOpen, open: openPacemakerBalanceModal } = useModal()
const { isOpen: isPacemakerDepositModalOpen, open: openPacemakerDepositModal } = useModal()
const { isOpen: isPacemakerHistoryModalOpen, open: openPacemakerHistoryModal } = useModal()
const { isOpen: isPacemakerDepositSuccessModalOpen, open: openPacemakerDepositSuccessModal } =
  useModal()
const { isOpen: isTodayAvailableMoneyModalOpen, open: openTodayAvailableMoneyModal } = useModal()
const { isOpen: isMonthlyAvailableMoneyModalOpen, open: openMonthlyAvailableMoneyModal } =
  useModal()
const { isOpen: isLinkedAssetsModalOpen, open: openLinkedAssetsModal } = useModal()
const { isOpen: isStatusConfirmModalOpen, open: openStatusConfirmModal } = useModal()
const { isOpen: isShareGoalModalOpen, open: openShareGoalModal } = useModal()

const {
  selectedDepositTarget,
  depositedAmount,
  isDepositing,
  depositErrorMessage,
  openDeposit,
  submitDeposit,
  retryDepositTargets,
  retryHistories,
} = usePacemakerDeposit()
const statusConfirmMode = ref('pause')

const isGoalPaused = computed(() => goalStore.currentGoal?.status === 'PAUSE')
const dashboardErrorMessage = computed(() =>
  pacemakerStore.dashboardError ? '정보를 불러오지 못했어요' : ''
)

// 대시보드 카드의 작은 토글 스위치: 개설됐으면 그냥 ON/OFF, 안 됐으면 개설 안내 모달
function handlePacemakerToggle() {
  if (pacemakerStore.pacemakerStatus?.registered) {
    pacemakerStore.togglePacemaker()
  } else {
    openPacemakerModal()
  }
}

// 페이스메이커 카드의 "다시 시도": 대시보드 조회만 다시 시도
async function retryPacemakerDashboard() {
  await pacemakerStore.fetchPacemakerDashboard().catch(() => undefined)
}

// 페이스메이커 CTA, 아직 전용 저금통이 있으면 개설 안내 모달, 있으면 토글 동작
function handlePacemakerCtaClick() {
  if (pacemakerStore.pacemakerStatus?.registered) {
    openPacemakerBalanceModal()
  } else {
    openPacemakerModal()
  }
}

// 잔액 모달의 "입금" 클릭: 어떤 목표 계좌로 입금할지 선택하고 입금 모달을 염
function handleOpenDeposit(goal) {
  openDeposit(goal)
  openPacemakerDepositModal()
}

// 입금 모달의 "입금하기" 클릭: 실제 입금 처리 후 완료 모달로 전환
function handleDeposit(payload) {
  submitDeposit(payload, () => {
    isPacemakerDepositModalOpen.value = false
    openPacemakerDepositSuccessModal()
  })
}

// 잔액 모달의 "전체 자동 저축 내역 보기" 클릭: 필요할 때만 조회
async function handleOpenHistory() {
  openPacemakerHistoryModal()
  await retryHistories()
}

// "목표 일시정지" 버튼: 바로 멈추지 않고 확인 모달을 먼저 염
function openPauseConfirm() {
  statusConfirmMode.value = 'pause'
  openStatusConfirmModal()
}

// 일시정지 배너의 "목표 재개하기" 버튼
function openResumeConfirm() {
  statusConfirmMode.value = 'resume'
  openStatusConfirmModal()
}

// 확인 모달의 "확인" 클릭: 실제 상태 변경
async function handleStatusConfirm() {
  await goalStore.updateCurrentGoalStatus(statusConfirmMode.value === 'pause' ? 'PAUSE' : 'ACTIVE')
  isStatusConfirmModalOpen.value = false
}

// 목표 상세(대시보드 데이터+마일스톤)를 불러오고 사이드바 로드맵 목록과 선택 상태를 맞춤
async function loadGoalDashboard(goalId) {
  goalStore.selectGoal(goalId)
  await goalStore.fetchDashboardData(goalId)
  await roadmapStore.fetchMilestones(goalId)
}

onMounted(async () => {
  await goalStore.fetchGoals()

  const goalId = route.params.goalId ? Number(route.params.goalId) : goalStore.selectedGoalId
  if (!goalId) return

  await loadGoalDashboard(goalId)
  await pacemakerStore.fetchPacemakerStatus()

  const pacemakerRequests = [pacemakerStore.fetchDepositTargets()]
  if (pacemakerStore.pacemakerStatus?.registered) {
    pacemakerRequests.push(
      pacemakerStore.fetchPacemakerDashboard(),
      pacemakerStore.fetchHistories({ page: 0, size: 31 })
    )
  }

  await Promise.all(pacemakerRequests.map((request) => request.catch(() => undefined)))
})

// 사이드바 로드맵 목록에서 다른 목표를 클릭하면 라우트 파라미터만 바뀌고
// 같은 페이지 컴포넌트가 재사용되므로(onMounted가 다시 안 불림) 별도로 감시
watch(
  () => route.params.goalId,
  (newGoalId, oldGoalId) => {
    if (!newGoalId || newGoalId === oldGoalId) return
    loadGoalDashboard(Number(newGoalId))
  }
)
</script>
