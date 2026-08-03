<template>
  <HeroBackground class="font-['Noto_Sans_KR',sans-serif]">
    <div
      class="sticky top-0 z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-6 backdrop-blur-md md:px-8 lg:px-[80px]"
    >
      <BrandHeader />
      <button
        type="button"
        class="flex items-center gap-1 py-3 text-sm text-gray-500 transition-colors hover:text-gray-900"
        @click="handleBack"
      >
        <span aria-hidden="true">‹</span>
        <span>이전</span>
      </button>
    </div>

    <div class="relative z-10 mx-auto w-full max-w-[650px] animate-fade-in-up px-4 pb-40 pt-2">
      <ProgressBar :current-step="1" :total-steps="3" />

      <p class="mt-4 text-xs font-bold text-primary">STEP 1 — 목표 선택</p>

      <h1 class="mt-4 text-[30px] font-bold leading-tight text-gray-900">
        어떤 목표를 향해 달릴까요?
      </h1>
      <p class="mt-2 text-sm font-medium text-gray-500">
        지금 가장 집중하고 싶은 목표를 하나 선택해 주세요.
      </p>

      <!-- 목표 카드 그리드 (2열) -->
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GoalCard
          v-for="preset in presets"
          :key="preset.id"
          v-bind="preset"
          :is-selected="goalStore.selectedGoalId === preset.id"
          @select="toggleGoal(preset.id)"
        />
      </div>
    </div>

    <BottomCTA
      :label="buttonText"
      :disabled="!selectedGoal"
      caption="나중에 목표를 추가하거나 변경할 수 있어요"
      @click="handleNext"
    />
  </HeroBackground>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BrandHeader from '@/shared/ui/BrandHeader.vue'
import ProgressBar from '@/shared/ui/ProgressBar.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import GoalCard from '@/features/goal/components/GoalCard.vue'
import { useGoalStore } from '@/features/goal/store/goal.store'
import { getGoalPresets } from '@/features/goal/api/goal.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
const goalStore = useGoalStore()
const presets = ref([])

const selectedGoal = computed(() => {
  return presets.value.find((p) => p.id === goalStore.selectedGoalId)
})

const buttonText = computed(() => {
  if (!selectedGoal.value) return '목표를 선택해 주세요'
  return `'${selectedGoal.value.title}' 목표로 시작하기`
})

function toggleGoal(id) {
  if (goalStore.selectedGoalId === id) {
    goalStore.selectGoal(null) // 선택 해제
  } else {
    goalStore.selectGoal(id) // 새로운 목표 선택
  }
}

function handleBack() {
  router.push({ name: ROUTE_NAMES.ONBOARDING })
}

onMounted(async () => {
  try {
    presets.value = await getGoalPresets()
  } catch (error) {
    console.error('Failed to fetch goal presets:', error)
  }
})

function handleNext() {
  goalStore.moveToNextStep()
}
</script>
