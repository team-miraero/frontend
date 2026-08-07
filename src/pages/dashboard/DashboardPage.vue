<!-- 로드맵 메인 대시보드 -->
<template>
  <div v-if="goalStore.currentGoal" class="flex justify-center bg-[#f8fbff] pb-16">
    <div class="w-full max-w-[1440px] px-10 py-7">
      <GoalPausedBanner v-if="isGoalPaused" class="mb-4" @resume-click="openResumeConfirm" />
      <PaceBanner
        :pace="goalStore.currentGoal.pace"
        :progress-rate="goalStore.currentGoal.progressRate"
        :disabled="isGoalPaused"
        @cta-click="handlePacemakerCtaClick"
      />
      <!-- 목표가 일시정지 상태면 아래 액션 영역 전체를 흐리게 하고 클릭이 통하지 않도록 막음 -->
      <div :class="isGoalPaused ? 'pointer-events-none opacity-45' : ''">
        <!-- ============ 데스크톱 (lg 이상): 기존 3열 + 사이드 패널 구조 유지 ============ -->
        <div class="hidden lg:block">
          <div class="grid grid-cols-3 gap-4 pt-6">
            <GoalSummaryCard :goal="goalStore.currentGoal" />
            <ConnectedAssetsCard :assets="goalStore.assets" @open-detail="openLinkedAssetsModal" />
            <PacemakerToggleCard
              :pacemaker="pacemakerStore.pacemakerView"
              @toggle="handlePacemakerToggle"
            />
          </div>

          <div class="flex gap-5 pt-6">
            <div class="flex flex-1 min-w-0 flex-col gap-4">
              <MilestoneProgressBar
                :goal="goalStore.currentGoal"
                :milestones="roadmapStore.milestones"
                @pause="openPauseConfirm"
              />
              <NextMilestoneCard
                :goal="goalStore.currentGoal"
                :milestones="roadmapStore.milestones"
              />
              <MilestoneList :milestones="roadmapStore.milestones" />
            </div>
            <div class="w-[300px] shrink-0">
              <AvailableMoneyPanel
                v-if="goalStore.monthlyAvailableMoney && goalStore.dailyAvailableMoney"
                :monthly="goalStore.monthlyAvailableMoney"
                :daily="goalStore.dailyAvailableMoney"
                @open-today="openTodayAvailableMoneyModal"
                @open-month="openMonthlyAvailableMoneyModal"
              />
              <div class="mt-7 border-t border-slate-200/70 pt-5">
                <ShareWithFriendsCard @open="openShareGoalModal" />
              </div>
            </div>
          </div>
        </div>

        <!-- ============ 모바일 (lg 미만): 2열 페어 그리드로 재배치 ============ -->
        <div class="lg:hidden">
          <div class="grid grid-cols-2 gap-4 pt-6">
            <GoalSummaryCard :goal="goalStore.currentGoal" />
            <ConnectedAssetsCard :assets="goalStore.assets" @open-detail="openLinkedAssetsModal" />
          </div>

          <div class="grid grid-cols-2 items-start gap-4 pt-4">
            <AvailableMoneyPanel
              v-if="goalStore.monthlyAvailableMoney && goalStore.dailyAvailableMoney"
              :monthly="goalStore.monthlyAvailableMoney"
              :daily="goalStore.dailyAvailableMoney"
              @open-today="openTodayAvailableMoneyModal"
              @open-month="openMonthlyAvailableMoneyModal"
            />
            <div>
              <!-- AvailableMoneyPanel의 "여유자금" 타이틀과 같은 높이의 투명 스페이서-->
              <p class="invisible text-sm font-bold">여유자금</p>
              <div class="mt-2">
                <PacemakerToggleCard
                  :pacemaker="pacemakerStore.pacemakerView"
                  @toggle="handlePacemakerToggle"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4 pt-4">
            <MilestoneProgressBar
              :goal="goalStore.currentGoal"
              :milestones="roadmapStore.milestones"
              @pause="openPauseConfirm"
            />
            <NextMilestoneCard
              :goal="goalStore.currentGoal"
              :milestones="roadmapStore.milestones"
            />
            <ShareWithFriendsCard @open="openShareGoalModal" />
            <MilestoneList :milestones="roadmapStore.milestones" />
          </div>
        </div>
      </div>
    </div>
    <PacemakerSetupModal v-model="isPacemakerModalOpen" />
    <PacemakerBalanceModal
      v-model="isPacemakerBalanceModalOpen"
      :pacemaker="pacemakerStore.pacemakerView"
      :deposit-targets="pacemakerStore.depositTargets"
      @toggle-auto-saving="pacemakerStore.togglePacemaker"
      @deposit="handleOpenDeposit"
      @view-history="handleOpenHistory"
    />
    <PacemakerDepositModal
      v-model="isPacemakerDepositModalOpen"
      :target="selectedDepositTarget"
      :available-balance="pacemakerStore.pacemakerView.moneyBoxBalance"
      @deposit="handleDeposit"
    />
    <PacemakerHistoryModal
      v-model="isPacemakerHistoryModalOpen"
      :histories="pacemakerStore.histories"
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
  GoalSummaryCard,
  ConnectedAssetsCard,
  PacemakerToggleCard,
  MilestoneProgressBar,
  NextMilestoneCard,
  MilestoneList,
  AvailableMoneyPanel,
  TodayAvailableMoneyModal,
  MonthlyAvailableMoneyModal,
  LinkedAssetsModal,
  GoalPausedBanner,
  GoalStatusConfirmModal,
  ShareWithFriendsCard,
  ShareGoalModal,
} from '@/features/roadmap'
import {
  usePacemakerStore,
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

const selectedDepositTarget = ref(null)
const depositedAmount = ref(0)
const statusConfirmMode = ref('pause')

const isGoalPaused = computed(() => goalStore.currentGoal?.status === 'PAUSE')

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

// 잔액 모달의 "입금" 클릭: 어떤 목표 계좌로 입금할지 선택하고 입금 모달을 염
function handleOpenDeposit(goal) {
  const depositOptions = (goal?.depositAssets ?? []).map((asset, index) => {
    const withdrawal = goal?.withdrawalAccounts?.[index] ?? goal?.withdrawalAccounts?.[0]

    return {
      accountId: asset.assetId,
      moneyBoxId: pacemakerStore.pacemakerView.moneyBoxId,
      icon: asset.assetType === 'MONEY_BOX' ? '🪙' : '🏦',
      accountNickname:
        asset.assetType === 'MONEY_BOX'
          ? '저금통'
          : (asset.financialInstitutionName ?? '입금 계좌'),
      accountBalance: asset.balance ?? 0,
      withdrawalBalance: withdrawal?.balance ?? 0,
      bankName: withdrawal?.financialInstitutionName ?? '',
      accountNumberMasked: withdrawal?.maskedAccountNumber ?? '',
    }
  })
  const defaultOption = depositOptions[0]

  selectedDepositTarget.value = {
    goalId: goal?.goalId,
    accountId: defaultOption?.accountId,
    moneyBoxId: pacemakerStore.pacemakerView.moneyBoxId,
    icon: defaultOption?.icon ?? '🎯',
    goalName: goal?.goalName,
    accountNickname: defaultOption?.accountNickname ?? '입금 계좌',
    accountBalance: defaultOption?.accountBalance ?? 0,
    withdrawalBalance: defaultOption?.withdrawalBalance ?? 0,
    bankName: defaultOption?.bankName ?? '',
    accountNumberMasked: defaultOption?.accountNumberMasked ?? '',
    depositOptions,
  }
  openPacemakerDepositModal()
}

// 입금 모달의 "입금하기" 클릭: 실제 입금 처리 후 완료 모달로 전환
async function handleDeposit({ accountId, amount, moneyBoxId }) {
  await pacemakerStore.depositToGoal(accountId, amount, moneyBoxId)
  depositedAmount.value = amount
  isPacemakerDepositModalOpen.value = false
  openPacemakerDepositSuccessModal()
}

// 잔액 모달의 "전체 자동 저축 내역 보기" 클릭: 필요할 때만 조회
async function handleOpenHistory() {
  openPacemakerHistoryModal()
  await pacemakerStore.fetchHistories()
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

  await Promise.allSettled(pacemakerRequests)
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
