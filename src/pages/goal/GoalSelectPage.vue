<template>
  <div class="mx-auto max-w-4xl px-6 py-12">
    <!-- 헤더 섹션 -->
    <header class="mb-12 text-center">
      <span class="mb-2 block text-sm font-bold text-blue-600">STEP 1 — 목표 선택</span>
      <h1 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        어떤 목표를 향해 달릴까요?
      </h1>
      <p class="text-lg text-gray-600">준비하고 계신 소중한 미래를 선택해 주세요.</p>
    </header>

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

    <!-- 하단 액션 버튼 -->
    <div class="mt-16 flex flex-col items-center space-y-4">
      <BaseButton
        class="min-w-[280px] py-4 text-lg font-bold shadow-lg"
        :disabled="!selectedGoal"
        @click="handleNext"
      >
        {{ buttonText }}
      </BaseButton>
      <p class="text-sm text-gray-500">나중에 목표를 추가하거나 변경할 수 있어요</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import GoalCard from '@/features/goal/components/GoalCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useGoalStore } from '@/features/goal/store/goal.store'
import { getGoalPresets } from '@/features/goal/api/goal.api'

const router = useRouter()
const goalStore = useGoalStore()
const presets = ref([])

const selectedGoal = computed(() => {
  return presets.value.find((p) => p.id === goalStore.selectedGoalId)
})

const buttonText = computed(() => {
  if (!selectedGoal.value) return '선택 완료'
  return `'${selectedGoal.value.title}' 목표로 시작하기 >`
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
