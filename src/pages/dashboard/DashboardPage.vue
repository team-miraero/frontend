<!-- 로드맵 메인 대시보드 -->
<template>
  <LoadingSpinner
    v-if="isPageLoading || goalStore.areGoalsLoading || goalStore.isLoading"
    message="로드맵을 불러오는 중이에요"
  />

  <div v-else-if="goalStore.currentGoal" class="flex justify-center bg-[#f8fbff] pb-8">
    <div class="w-full max-w-[1440px] px-8 py-3">
      <div
        v-if="hasSupplementaryError"
        class="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
        role="status"
      >
        <p class="text-xs font-bold text-amber-700">일부 부가 정보를 불러오지 못했어요.</p>
        <button type="button" class="text-xs font-black text-amber-800" @click="retryGoalDashboard">
          다시 시도
        </button>
      </div>
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
        @open-today="handleOpenTodayAvailableMoneyModal"
        @open-month="handleOpenMonthlyAvailableMoneyModal"
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
      v-model="isTodayAvailableMoneyModalOpen"
      :daily="goalStore.dailyAvailableMoney ?? EMPTY_DAILY_AVAILABLE_MONEY"
    />
    <MonthlyAvailableMoneyModal
      v-model="isMonthlyAvailableMoneyModalOpen"
      :monthly="goalStore.monthlyAvailableMoney ?? EMPTY_MONTHLY_AVAILABLE_MONEY"
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
    <GoalAchievementModal
      v-model="isGoalAchievementModalOpen"
      :goal="goalStore.currentGoal"
      :is-adding="collectionStore.isAdding"
      :error-message="achievementErrorMessage"
      @add-to-collection="handleAddToCollection"
      @later="handleAchievementLater"
    />
  </div>

  <div
    v-else-if="goalStore.dashboardError || goalStore.goalsError"
    class="flex min-h-[420px] items-center justify-center px-6"
  >
    <div class="text-center" role="alert">
      <p class="text-base font-black text-[#0a192f]">로드맵을 불러오지 못했어요</p>
      <p class="pt-2 text-sm text-slate-500">잠시 후 다시 시도해주세요.</p>
      <button
        type="button"
        class="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
        @click="retryGoalDashboard"
      >
        다시 시도
      </button>
    </div>
  </div>

  <div v-else class="flex min-h-[420px] items-center justify-center px-6 text-center">
    <div>
      <p class="text-base font-black text-[#0a192f]">표시할 목표가 없어요</p>
      <p class="pt-2 text-sm text-slate-500">목표를 만들면 로드맵이 여기에 표시돼요.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGoalStore } from '@/features/goal'
import { useCollectionStore } from '@/features/collection'
import { GOAL_STATUS } from '@/features/goal/constants/goal.constants'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'
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
  GoalAchievementModal,
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
import { ROUTE_NAMES } from '@/shared/constants/routes'

const route = useRoute()
const router = useRouter()
const goalStore = useGoalStore()
const roadmapStore = useRoadmapStore()
const pacemakerStore = usePacemakerStore()
const collectionStore = useCollectionStore()
const isPageLoading = ref(true)
const { isOpen: isPacemakerModalOpen, open: openPacemakerModal } = useModal()
const { isOpen: isPacemakerBalanceModalOpen, open: openPacemakerBalanceModal } = useModal()
const { isOpen: isPacemakerDepositModalOpen, open: openPacemakerDepositModal } = useModal()
const { isOpen: isPacemakerHistoryModalOpen, open: openPacemakerHistoryModal } = useModal()
const { isOpen: isPacemakerDepositSuccessModalOpen, open: openPacemakerDepositSuccessModal } =
  useModal()
const { isOpen: isTodayAvailableMoneyModalOpen } = useModal()
const { isOpen: isMonthlyAvailableMoneyModalOpen } = useModal()
const { isOpen: isLinkedAssetsModalOpen, open: openLinkedAssetsModal } = useModal()
const { isOpen: isStatusConfirmModalOpen, open: openStatusConfirmModal } = useModal()
const { isOpen: isShareGoalModalOpen, open: openShareGoalModal } = useModal()
const {
  isOpen: isGoalAchievementModalOpen,
  open: openGoalAchievementModal,
  close: closeGoalAchievementModal,
} = useModal()

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
const achievementErrorMessage = ref('')
const previousProgressRate = ref(null)

const EMPTY_DAILY_AVAILABLE_MONEY = Object.freeze({
  todayAvailableMoney: 0,
  todayExpense: 0,
  remainingAvailableMoney: 0,
})
const EMPTY_MONTHLY_AVAILABLE_MONEY = Object.freeze({
  income: 0,
  fixedExpense: 0,
  targetGoalAutoTransfer: 0,
  otherGoalAutoTransfer: 0,
  variableExpense: 0,
  availableMoney: 0,
  elapsedDays: 0,
  remainingDays: 0,
  periodDays: 0,
})

const isGoalPaused = computed(() => goalStore.currentGoal?.status === GOAL_STATUS.PAUSED)
const hasSupplementaryError = computed(
  () =>
    Object.keys(goalStore.dashboardSupplementaryErrors).length > 0 || Boolean(roadmapStore.error)
)
const dashboardErrorMessage = computed(() =>
  pacemakerStore.dashboardError ? '정보를 불러오지 못했어요' : ''
)

function handleOpenTodayAvailableMoneyModal() {
  isTodayAvailableMoneyModalOpen.value = true
}

function handleOpenMonthlyAvailableMoneyModal() {
  isMonthlyAvailableMoneyModalOpen.value = true
}

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
  submitDeposit(payload, async () => {
    isPacemakerDepositModalOpen.value = false
    openPacemakerDepositSuccessModal()
    await goalStore.fetchDashboardData(goalStore.currentGoal.goalId).catch(() => undefined)
  })
}

const ACHIEVEMENT_SEEN_KEY_PREFIX = 'miraero:goal-achievement-seen:'

function achievementSeenKey(goalId) {
  return `${ACHIEVEMENT_SEEN_KEY_PREFIX}${goalId}`
}

function hasSeenAchievement(goalId) {
  return localStorage.getItem(achievementSeenKey(goalId)) === 'true'
}

function markAchievementSeen(goalId) {
  localStorage.setItem(achievementSeenKey(goalId), 'true')
}

function showAchievementOnce(goal) {
  if (!goal?.goalId || Number(goal.progressRate) < 100 || hasSeenAchievement(goal.goalId)) return
  achievementErrorMessage.value = ''
  markAchievementSeen(goal.goalId)
  openGoalAchievementModal()
}

function handleAchievementLater() {
  closeGoalAchievementModal()
}

async function handleAddToCollection() {
  const goalId = goalStore.currentGoal?.goalId
  if (!goalId || collectionStore.isAdding) return

  achievementErrorMessage.value = ''
  try {
    await collectionStore.addAchievedGoal(goalId)
    closeGoalAchievementModal()
    await router.push({ name: ROUTE_NAMES.COLLECTION })
  } catch (error) {
    if (error?.response?.status === 409) {
      closeGoalAchievementModal()
      await router.push({ name: ROUTE_NAMES.COLLECTION })
      return
    }
    achievementErrorMessage.value =
      error?.message ?? '컬렉션에 담지 못했어요. 잠시 후 다시 시도해 주세요.'
  }
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
  await goalStore.updateCurrentGoalStatus(
    statusConfirmMode.value === 'pause' ? GOAL_STATUS.PAUSED : GOAL_STATUS.ACTIVE
  )
  isStatusConfirmModalOpen.value = false
}

// 목표 상세(대시보드 데이터+마일스톤)를 불러오고 사이드바 로드맵 목록과 선택 상태를 맞춤
async function loadGoalDashboard(goalId) {
  previousProgressRate.value = null
  goalStore.selectGoal(goalId)
  let goal
  try {
    goal = await goalStore.fetchDashboardData(goalId)
  } catch {
    return false
  }

  if (!goal || String(goalStore.selectedGoalId) !== String(goalId)) return false

  roadmapStore.fetchMilestones(goalId).catch(() => undefined)
  previousProgressRate.value = Number(goal?.progressRate) || 0
  showAchievementOnce(goal)
  return true
}

async function retryGoalDashboard() {
  if (goalStore.goalsError) await goalStore.fetchGoals(true)
  const goalId = route.params.goalId ? Number(route.params.goalId) : goalStore.selectedGoalId
  if (goalId) await loadGoalDashboard(goalId)
}

onMounted(async () => {
  try {
    await goalStore.fetchGoals()

    const goalId = route.params.goalId ? Number(route.params.goalId) : goalStore.selectedGoalId
    if (!goalId) return

    const hasGoal = await loadGoalDashboard(goalId)
    if (!hasGoal) return
    isPageLoading.value = false

    await pacemakerStore.fetchPacemakerStatus().catch(() => undefined)

    const pacemakerRequests = []
    if (pacemakerStore.pacemakerStatus?.registered) {
      pacemakerRequests.push(
        pacemakerStore.fetchDepositTargets(),
        pacemakerStore.fetchPacemakerDashboard(),
        pacemakerStore.fetchHistories({ page: 0, size: 31 })
      )
    }

    await Promise.all(pacemakerRequests.map((request) => request.catch(() => undefined)))
  } finally {
    isPageLoading.value = false
  }
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

watch(
  () => goalStore.currentGoal?.progressRate,
  (progressRate, oldProgressRate) => {
    const current = Number(progressRate) || 0
    const previous =
      oldProgressRate == null ? previousProgressRate.value : Number(oldProgressRate) || 0

    if (previous < 100 && current >= 100) {
      showAchievementOnce(goalStore.currentGoal)
    }
    previousProgressRate.value = current
  }
)
</script>
