import { ref, onMounted } from 'vue'
import { usePacemakerStore } from '@/features/pacemaker/store/pacemaker.store'

/**
 * 페이스메이커 전용 브라우저 시스템 알림(Notification API) Composable
 */
export function usePacemakerNotification() {
  // 로그아웃 시 store가 폐기되므로 setup 시점에 캡처하지 않고 사용하는 함수 안에서 가져온다.
  const isSupported = typeof window !== 'undefined' && 'Notification' in window
  const permission = ref(isSupported ? Notification.permission : 'denied')

  // 숫자를 한국 원화 형식으로 포맷팅 (ex: 12500 -> "12,500원")
  const formatWon = (val) => (val ? `${Number(val).toLocaleString()}원` : '0원')

  /**
   * 1. 브라우저 알림 권한 요청 (onMounted 등에서 호출)
   * @returns {Promise<NotificationPermission>}
   */
  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('이 브라우저는 Notification API를 지원하지 않습니다.')
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      permission.value = 'granted'
      return 'granted'
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission()
      permission.value = result
      return result
    }

    permission.value = Notification.permission
    return permission.value
  }

  /**
   * 2. 시스템 알림 전송 (알림 클릭 시 window.focus 포함)
   * @param {string} title - 알림 제목
   * @param {NotificationOptions & { onClick?: (e: Event) => void }} options
   * @returns {Notification | null}
   */
  const sendNotification = (title, options = {}) => {
    if (!isSupported) return null
    if (permission.value !== 'granted' && Notification.permission !== 'granted') {
      console.warn('알림 권한이 허용되지 않았습니다.')
      return null
    }

    const { body = '', icon, tag, onClick, ...otherOptions } = options

    // tag가 같으면 브라우저가 동일 알림으로 인식해 재팝업을 막으므로 고유 타임스탬프를 부여
    const uniqueTag = tag ? `${tag}-${Date.now()}` : `pacemaker-notification-${Date.now()}`

    const notification = new Notification(title, {
      body,
      icon,
      tag: uniqueTag,
      requireInteraction: false,
      ...otherOptions,
    })

    // 클릭 시 창 활성화(window.focus) 및 콜백 수행
    notification.onclick = (event) => {
      event.preventDefault()
      if (typeof window !== 'undefined') {
        window.focus()
      }

      if (typeof onClick === 'function') {
        onClick(event)
      }
      notification.close()
    }

    return notification
  }

  /**
   * 3. 페이스메이커 데이터 조건 충족 시 알림 트리거 (여유자금, 연속 모으는 중 등)
   */
  const checkAndNotifyPacemakerStatus = () => {
    const viewData = usePacemakerStore().pacemakerView
    if (!viewData) return

    const { todaySavingAmount, currentStreak, moneyBoxBalance } = viewData

    // (1) 오늘 모인 여유자금이 있는 경우 알림
    if (todaySavingAmount > 0) {
      sendNotification('💬 [페이스메이커] 오늘의 여유자금 자동 저축!', {
        body: `오늘 ${formatWon(todaySavingAmount)}의 여유자금이 모냈습니다.\n현재 저금통 잔액: ${formatWon(moneyBoxBalance)}`,
        tag: 'pacemaker-today-saving',
      })
    }
    // (2) 연속 모으기 기록(Streak) 알림
    else if (currentStreak > 0) {
      sendNotification(`🔥 [페이스메이커] ${currentStreak}일 연속 모으는 중!`, {
        body: `매일매일 꾸준히 저축하고 있어요. 계속해서 목표를 향해 달려봐요!`,
        tag: `pacemaker-streak-${currentStreak}`,
      })
    }
  }

  /**
   * 4. 버튼 클릭 등 수동 테스트용 즉시 알림 발송
   */
  const sendTestNotification = () => {
    const viewData = usePacemakerStore().pacemakerView
    const amount = viewData?.todaySavingAmount || viewData?.moneyBoxBalance || 15000
    const streak = viewData?.currentStreak || 3

    return sendNotification('💬 [페이스메이커] 알림 테스트!', {
      body: `오늘 모인 여유자금: ${formatWon(amount)}\n🔥 연속 ${streak}일째 저축 중!`,
      tag: 'pacemaker-test-notification',
      onClick: () => {
        alert('알림 클릭 성공! 현재 창으로 포커스가 이동되었습니다.')
      },
    })
  }

  onMounted(() => {
    if (isSupported) {
      permission.value = Notification.permission
    }
  })

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    checkAndNotifyPacemakerStatus,
    sendTestNotification,
  }
}
