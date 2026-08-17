// src/features/pacemaker/composables/usePacemakerToast.js
import { ref } from 'vue'
import { usePacemakerStore } from '@/features/pacemaker/store/pacemaker.store'

// 전역 싱글톤 상태
const toastList = ref([]) // 실시간 슬라이드인 토스트 알림
const notificationHistory = ref([]) // 헤더 알림 종 드롭다운 히스토리
const hasUnread = ref(false) // 읽지 않은 알림 빨간 뱃지 표시 여부
const isBalanceModalOpen = ref(false) // 여유자금 상세 모달 열림 여부

export function usePacemakerToast() {
  const pacemakerStore = usePacemakerStore()

  // 숫자를 한국 원화 형식으로 포맷팅 (ex: 40000 -> "40,000원")
  const formatWon = (val) => (val ? `${Number(val).toLocaleString()}원` : '0원')

  /**
   * 토스트 알림 항목 추가 (badgeIcon: '💰', '🔥' 등)
   */
  const addToast = ({ type, badgeIcon, title, body, duration = 7000 }) => {
    const id = Date.now() + Math.random()
    const newToast = { id, type, badgeIcon, title, body, createdAt: new Date() }

    // 1. 실시간 팝업 카드 추가
    toastList.value.push(newToast)

    // 2. 헤더 알림 센터 히스토리에 추가 & 읽지 않음 뱃지 ON
    notificationHistory.value.unshift(newToast)
    hasUnread.value = true

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  /**
   * 실시간 토스트 팝업 카드 제거
   */
  const removeToast = (id) => {
    toastList.value = toastList.value.filter((item) => item.id !== id)
  }

  /**
   * 히스토리 알림 항목 제거
   */
  const removeHistoryItem = (id) => {
    notificationHistory.value = notificationHistory.value.filter((item) => item.id !== id)
    removeToast(id)
  }

  /**
   * 읽음 처리
   */
  const markAllAsRead = () => {
    hasUnread.value = false
  }

  /**
   * 히스토리 알림 전체 비우기
   */
  const clearHistory = () => {
    notificationHistory.value = []
    toastList.value = []
    hasUnread.value = false
  }

  /**
   * 여유자금 모달 제어
   */
  const openBalanceModal = () => {
    isBalanceModalOpen.value = true
  }

  const closeBalanceModal = () => {
    isBalanceModalOpen.value = false
  }

  /**
   * 💰, 🔥 큼직한 이모지 뱃지 알림 2종 발송
   */
  const showDualNotifications = () => {
    const viewData = pacemakerStore.pacemakerView

    const todayAmount = viewData?.todaySavingAmount || 40000
    const monthlyRemaining = viewData?.monthlySecuredAmount || 350000
    const streak = viewData?.currentStreak || 52
    const moneyBoxBalance = viewData?.moneyBoxBalance || 270000

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
    const initialDelay = 1200 // 페이지 로드 후 실제 알림이 도착하듯 1.2초 뒤 첫 알림 팝업

    if (isMobile) {
      // 📱 모바일: 첫 번째 알림이 뜨고 사라진 후, 두 번째 알림이 순차적으로 등장 (진짜 스마트폰 푸시 알림 형태)
      const firstDuration = 3500
      const transitionGap = 400

      // 1. 첫 번째 알림: 페이지 진입 1.2초 후 도착
      setTimeout(() => {
        addToast({
          type: 'SAVING',
          badgeIcon: '💰',
          title: `오늘의 권장 여유자금: ${formatWon(todayAmount)}`,
          body: `안전한 완주를 위해 계산된 오늘 하루 지출 예산이에요!`,
          duration: firstDuration,
        })
      }, initialDelay)

      // 2. 두 번째 알림: 첫 번째 알림이 완전히 퇴장한 후 등장
      setTimeout(() => {
        addToast({
          type: 'STREAK',
          badgeIcon: '🔥',
          title: `연속 ${streak}일째 페이스 달성 중!`,
          body: `오늘도 저금통에 여유자금 ${formatWon(moneyBoxBalance)} 확보 완료!`,
          duration: 4000,
        })
      }, initialDelay + firstDuration + transitionGap)
    } else {
      // 💻 데스크톱: 페이지 진입 1.2초 후 1번 알림 ➔ 1.2초 뒤 2번 알림 스택
      setTimeout(() => {
        addToast({
          type: 'SAVING',
          badgeIcon: '💰',
          title: `오늘의 권장 여유자금: ${formatWon(todayAmount)}`,
          body: `안전한 완주를 위해 계산된 오늘 하루 지출 예산이에요!`,
          duration: 7000,
        })
      }, initialDelay)

      setTimeout(() => {
        addToast({
          type: 'STREAK',
          badgeIcon: '🔥',
          title: `연속 ${streak}일째 페이스 달성 중!`,
          body: `오늘도 저금통에 여유자금 ${formatWon(moneyBoxBalance)} 확보 완료!`,
          duration: 8500,
        })
      }, initialDelay + 1200)
    }
  }

  return {
    toastList,
    notificationHistory,
    hasUnread,
    isBalanceModalOpen,
    addToast,
    removeToast,
    removeHistoryItem,
    markAllAsRead,
    clearHistory,
    openBalanceModal,
    closeBalanceModal,
    showDualNotifications,
  }
}
