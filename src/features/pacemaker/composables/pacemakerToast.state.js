// 페이스메이커 토스트/알림 히스토리의 전역 싱글톤 상태.
// 로그아웃 정리 코드(@/stores/reset-user-stores)가 store를 거치지 않고 직접 비울 수 있도록
// composable에서 분리했다. 이 모듈은 vue 외의 의존성을 갖지 않는다.
import { ref } from 'vue'

export const toastList = ref([]) // 실시간 슬라이드인 토스트 알림
export const notificationHistory = ref([]) // 헤더 알림 종 드롭다운 히스토리
export const hasUnread = ref(false) // 읽지 않은 알림 빨간 뱃지 표시 여부
export const isBalanceModalOpen = ref(false) // 여유자금 상세 모달 열림 여부

/**
 * 계정이 바뀌어도 이전 사용자의 알림이 남지 않도록 토스트 상태를 모두 비운다.
 */
export function resetPacemakerToastState() {
  toastList.value = []
  notificationHistory.value = []
  hasUnread.value = false
  isBalanceModalOpen.value = false
}
