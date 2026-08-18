// 페이스메이커 저금통 → 목표 계좌 입금 플로우 (대상 선택, 제출, 재시도) 공용 로직
import { ref } from 'vue'
import { usePacemakerStore } from '@/features/pacemaker/store/pacemaker.store'

export function usePacemakerDeposit() {
  // 로그아웃 시 store가 폐기되므로 setup 시점에 캡처하지 않고 사용하는 함수 안에서 가져온다.
  const selectedDepositTarget = ref(null)
  const depositedAmount = ref(0)
  const isDepositing = ref(false)
  const depositErrorMessage = ref('')

  /**
   * 목표(goal)의 API 입금 가능 계좌 목록으로 입금 옵션을 구성합니다.
   * @param {Object} group - { goalId, goalName, withdrawalAccounts }
   * @param {number} [preferredAccountId] - 기본으로 선택해둘 출금계좌 id (없으면 첫 번째 옵션)
   */
  function openDeposit(group, preferredAccountId) {
    const depositOptions = (group?.withdrawalAccounts ?? []).map((withdrawalAccount) => ({
      accountId: withdrawalAccount.accountId,
      moneyBoxId: usePacemakerStore().pacemakerView.moneyBoxId,
      icon: '🏦',
      accountNickname: withdrawalAccount.financialInstitutionName ?? '출금계좌',
      accountBalance: withdrawalAccount.balance ?? 0,
      bankName: withdrawalAccount.financialInstitutionName ?? '',
      accountNumberMasked: withdrawalAccount.maskedAccountNumber ?? '',
    }))
    const selectedOption =
      depositOptions.find((option) => option.accountId === preferredAccountId) ?? depositOptions[0]

    selectedDepositTarget.value = {
      ...selectedOption,
      goalId: group?.goalId,
      goalName: group?.goalName,
      depositOptions,
    }
    depositErrorMessage.value = ''
    return selectedDepositTarget.value
  }

  /**
   * @param {{ accountId: number, amount: number, moneyBoxId: number, option: Object }} payload
   * @param {() => void} [onSuccess] - 입금 성공 후 호출 (입금 모달 닫기 등)
   */
  async function submitDeposit({ accountId, amount, moneyBoxId, option }, onSuccess) {
    if (isDepositing.value) return

    const pacemakerStore = usePacemakerStore()
    isDepositing.value = true
    depositErrorMessage.value = ''
    try {
      await pacemakerStore.depositToGoal(accountId, amount, moneyBoxId)
      selectedDepositTarget.value = { ...selectedDepositTarget.value, ...option }
      depositedAmount.value = amount
      await pacemakerStore.fetchDepositTargets().catch(() => undefined)
      onSuccess?.()
    } catch (error) {
      depositErrorMessage.value =
        error?.message ?? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    } finally {
      isDepositing.value = false
    }
  }

  async function retryDepositTargets() {
    try {
      await usePacemakerStore().fetchDepositTargets()
    } catch {
      // 스토어의 오류 상태를 통해 같은 영역에서 재시도 UI를 유지합니다.
    }
  }

  async function retryHistories() {
    try {
      await usePacemakerStore().fetchHistories({ page: 0, size: 31 })
    } catch {
      // 스토어의 오류 상태를 통해 같은 영역에서 재시도 UI를 유지합니다.
    }
  }

  return {
    selectedDepositTarget,
    depositedAmount,
    isDepositing,
    depositErrorMessage,
    openDeposit,
    submitDeposit,
    retryDepositTargets,
    retryHistories,
  }
}
