<template>
  <HeroBackground class="font-['Noto_Sans_KR',sans-serif]">
    <!-- 목표설정 퍼널 공통 상단 헤더 -->
    <StepHeader @back="handleBack" />

    <!-- 본문 콘텐츠 -->
    <div
      class="relative z-10 mx-auto w-full max-w-[660px] animate-fade-in-up px-4 pb-28 md:pb-4 pt-1"
    >
      <ProgressBar :current-step="1" :total-steps="4" />

      <!-- 메인 헤드라인 & 서브 텍스트 -->
      <h1
        class="mt-3 text-2xl sm:text-[28px] font-black tracking-tight leading-snug text-gray-900 break-keep"
      >
        어떤 목표를 향해 <br class="sm:hidden" />달려볼까요?
      </h1>
      <p class="mt-2 sm:mt-2.5 text-xs sm:text-sm font-medium text-slate-500 break-keep">
        지금 가장 집중하고 싶은 목표를 선택해 주세요.
      </p>

      <!-- 1) 로딩 스켈레톤 UI -->
      <div v-if="isLoading" class="mt-4 sm:mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
        <div
          v-for="i in 4"
          :key="i"
          class="h-[120px] rounded-2xl bg-[#F4F7FA] p-5 animate-pulse flex flex-col justify-between"
        >
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-slate-200/70" />
            <div class="w-6 h-6 rounded-full bg-slate-200/70" />
          </div>
          <div class="space-y-2">
            <div class="h-4 w-24 rounded bg-slate-200/70" />
            <div class="h-3 w-40 rounded bg-slate-200/50" />
          </div>
        </div>
      </div>

      <!-- 2) 에러 발생 시 재시도 UI -->
      <div
        v-else-if="isError"
        class="mt-8 rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-xs"
      >
        <div
          class="mx-auto w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-3"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 class="text-base font-bold text-gray-900 mb-1">목표 목록을 불러오지 못했어요</h3>
        <p class="text-xs text-gray-500 mb-4">네트워크 연결 상태를 확인하고 다시 시도해 주세요.</p>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold transition-transform active:scale-95"
          @click="fetchPresets"
        >
          다시 시도
        </button>
      </div>

      <!-- 3) 목표 카드 그리드 (모바일 1열 세로 스크롤, 태블릿/PC 2열) -->
      <div v-else class="mt-4 sm:mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
        <GoalCard
          v-for="preset in presets"
          :key="preset.id"
          v-bind="preset"
          :is-selected="goalStore.selectedGoalPresetId === preset.id"
          @select="selectGoal(preset.id)"
        />
      </div>
    </div>

    <!-- 하단 반응형 CTA (모바일: 화면 고정 / 데스크톱: 카드 아래 인라인) -->
    <BottomCTA :label="buttonText" :disabled="!selectedGoal" desktop-static @click="handleNext" />
  </HeroBackground>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
import ProgressBar from '@/shared/ui/ProgressBar.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import GoalCard from '@/features/goal/components/GoalCard.vue'
import { useGoalStore } from '@/features/goal/store/goal.store'
import { getGoalPresets } from '@/features/goal/api/goal.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
const goalStore = useGoalStore()
const presets = ref([])
const isLoading = ref(true)
const isError = ref(false)

const selectedGoal = computed(() => {
  return presets.value.find((p) => p.id === goalStore.selectedGoalPresetId)
})

// CTA 문구 단순화
const buttonText = computed(() => {
  if (!selectedGoal.value) return '목표를 선택해 주세요'
  return '선택한 목표로 시작하기'
})

// 선택 해제 방지: 항상 해당 목표를 선택 상태로 유지
function selectGoal(id) {
  goalStore.selectGoalPreset(id)
}

function handleBack() {
  router.push({ name: ROUTE_NAMES.ONBOARDING })
}

async function fetchPresets() {
  isLoading.value = true
  isError.value = false
  try {
    presets.value = await getGoalPresets()
  } catch (error) {
    console.error('Failed to fetch goal presets:', error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPresets()
})

function handleNext() {
  goalStore.moveToNextStep()
}
</script>
