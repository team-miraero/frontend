<template>
  <!-- 1. 배경 래퍼: 너비 제한 없이 화면 전체를 덮습니다 -->
  <HeroBackground>
    <!-- 2. 콘텐츠 래퍼: 이 녀석이 내용물들을 모아서 중앙 정렬(mx-auto) 시키고 너비를 제한(max-w-3xl)합니다 -->
    <div
      class="mx-auto w-full max-w-3xl px-6 pt-10 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700"
    >
      <!-- 공통 StepHeader -->
      <StepHeader :current-step="1" :total-steps="3" @back="router.back()" />

      <!-- 메인 타이틀 영역 -->
      <div class="text-center mt-10 mb-12">
        <p class="text-sm font-bold text-blue-600 mb-3">STEP 1 — 목표 선택</p>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          어떤 목표를 향해 달릴까요?
        </h1>
        <p class="text-lg text-gray-500 mt-3">지금 가장 집중하고 싶은 목표를 하나 선택해 주세요.</p>
      </div>

      <!-- 목표 카드 그리드 (2열) -->
      <div class="grid grid-cols-2 gap-4 sm:gap-6">
        <GoalCard
          v-for="preset in presets"
          :key="preset.id"
          v-bind="preset"
          :is-selected="goalStore.selectedGoalId === preset.id"
          @select="toggleGoal(preset.id)"
        />
      </div>
    </div>

    <!-- 하단 고정 버튼 (컴포넌트 내부에 fixed가 있으므로 배경 래퍼 바로 안쪽에 배치) -->
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
import GoalCard from '@/features/goal/components/GoalCard.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
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
