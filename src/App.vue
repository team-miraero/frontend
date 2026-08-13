<!-- 루트 컴포넌트: 전역 레이아웃 및 대시보드 진입 후 알림 / 모달 관리 -->
<template>
  <div class="relative min-h-screen">
    <!-- 페이지 라우터 뷰 -->
    <RouterView />

    <!-- 🌐 대시보드 영역 전역 알림 토스트 (퍼널/로그인 화면 제외) -->
    <PacemakerToastNotification
      v-if="isDashboardRoute"
      :toast-list="toastList"
      @remove="removeToast"
      @click-toast="handleNotificationClick"
    />

    <!-- 💰 여유자금 알림 클릭 시 띄워주는 여유자금 상세 모달 -->
    <PacemakerBalanceModal
      :show="isBalanceModalOpen"
      @close="closeBalanceModal"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import {
  PacemakerToastNotification,
  PacemakerBalanceModal,
  usePacemakerNotification,
  usePacemakerToast,
} from '@/features/pacemaker'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const route = useRoute()
const router = useRouter()
const { requestPermission } = usePacemakerNotification()
const {
  toastList,
  removeToast,
  showDualNotifications,
  isBalanceModalOpen,
  openBalanceModal,
  closeBalanceModal,
} = usePacemakerToast()

// 퍼널 화면 제외 (루트 '/', 로그인, 회원가입, 온보딩, 목표설정 단계 등)
const EXCLUDED_PREFIXES = ['/login', '/signup', '/mydata', '/onboarding', '/goal']

// 대시보드 / 서비스 영역 라우트 여부 확인
const isDashboardRoute = computed(() => {
  if (!route.path || route.path === '/') return false
  return !EXCLUDED_PREFIXES.some((prefix) => route.path.startsWith(prefix))
})

function handleNotificationClick(item) {
  if (item.type === 'SAVING') {
    openBalanceModal()
    if (route.name !== ROUTE_NAMES.PACEMAKER) {
      router.push({ name: ROUTE_NAMES.PACEMAKER })
    }
  } else if (item.type === 'STREAK') {
    if (route.name !== ROUTE_NAMES.PACEMAKER) {
      router.push({ name: ROUTE_NAMES.PACEMAKER })
    }
  }
}

// [초기 접속 / 새로고침 시 1회 발송]
onMounted(async () => {
  await requestPermission()

  const TODAY_DATE = new Date().toISOString().slice(0, 10)
  const lastNoticeDate = localStorage.getItem('miraero_last_notice_date')

  // 💡 개발 환경(npm run dev)에서는 새로고침마다 팀원들이 언제든 테스트 가능하도록 발송하고,
  // 💡 실서비스 배포 환경에서는 오늘 하루 아직 보지 않은 경우 1회만 발송!
  if (import.meta.env.DEV || lastNoticeDate !== TODAY_DATE) {
    if (!import.meta.env.DEV) {
      localStorage.setItem('miraero_last_notice_date', TODAY_DATE)
    }
    showDualNotifications()
  }
})

// [페이지 이동 시] 퍼널/로그인 화면일 때만 알림을 지우고, 대시보드 간 이동 시엔 떠 있던 알림이 유지됨
watch(
  () => route.path,
  (newPath) => {
    if (!newPath) return
    if (!isDashboardRoute.value) {
      toastList.value = []
    }
  }
)
</script>
