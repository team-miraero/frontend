<template>
  <div class="mx-auto max-w-4xl px-6 py-8 pb-32">
    <!-- 🌟 1. 공통 StepHeader 적용 -->
    <!-- 목표 '선택' 단계이므로 goal-label은 생략하고 진행률(1/3)과 라벨만 전달합니다 -->
    <StepHeader
      :current-step="1"
      :total-steps="3"
      step-label="STEP 1 — 목표 선택"
      @back="router.back()"
    />

    <!-- 🌟 2. 메인 타이틀 영역 (헤더 바로 아래 배치) -->
    <div class="text-center mt-8 mb-12">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        어떤 목표를 향해 달릴까요?
      </h1>
      <p class="text-lg text-gray-600 mt-4">준비하고 계신 소중한 미래를 선택해 주세요.</p>
    </div>

    <!-- 목표 카드 그리드 -->
    <div class="grid grid-cols-2 gap-4 sm:gap-6">
      <GoalCard
        v-for="preset in presets"
        :key="preset.id"
        v-bind="preset"
        :is-selected="goalStore.selectedGoalId === preset.id"
        @select="goalStore.selectGoal(preset.id)"
      />
    </div>

    <!-- 🌟 3. 공통 BottomCTA 적용 (하단 고정 액션 버튼) -->
    <BottomCTA
      :label="buttonText"
      :disabled="!selectedGoal"
      caption="나중에 목표를 추가하거나 변경할 수 있어요"
      @click="handleNext"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import GoalCard from '@/features/goal/components/GoalCard.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
import { useGoalStore } from '@/features/goal/store/goal.store'
import { getGoalPresets } from '@/features/goal/api/goal.api'

const router = useRouter()
const goalStore = useGoalStore()
const presets = ref([])

const selectedGoal = computed(() => {
  return presets.value.find((p) => p.id === goalStore.selectedGoalId)
})

// 💡 수정됨: BottomCTA 내부에 화살표(›)가 이미 존재하므로 텍스트에서 ' >' 기호를 제거했습니다.
const buttonText = computed(() => {
  if (!selectedGoal.value) return '선택 완료'
  return `'${selectedGoal.value.title}' 목표로 시작하기`
})

onMounted(async () => {
  try {
    presets.value = await getGoalPresets()
  } catch (error) {
    console.error('Failed to fetch goal presets:', error)
  }
})

function handleNext() {
  if (goalStore.selectedGoalId === 'STUDENT_LOAN') {
    router.push('/goal/student-loan')
  } else {
    goalStore.moveToNextStep()
  }
}
</script>
