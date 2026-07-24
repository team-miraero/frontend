<template>
  <div class="mx-auto max-w-4xl px-6 py-12">
    <!-- 헤더 섹션 -->
    <header class="mb-12 text-center">
      <h1 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        이루고 싶은 목표가 무엇인가요?
      </h1>
      <p class="text-lg text-gray-600">준비하고 계신 소중한 미래를 선택해 주세요.</p>
    </header>

    <!-- 목표 카드 그리드 -->
    <div class="grid gap-6 sm:grid-cols-2">
      <GoalCard
        v-for="preset in presets"
        :key="preset.id"
        v-bind="preset"
        :is-selected="goalStore.selectedGoalId === preset.id"
        @select="goalStore.selectGoal(preset.id)"
      />
    </div>

    <!-- 하단 액션 버튼 -->
    <div class="mt-16 flex justify-center">
      <BaseButton
        class="min-w-[200px] py-4 text-lg font-bold shadow-lg"
        :disabled="!goalStore.selectedGoalId"
        @click="handleNext"
      >
        선택 완료
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import GoalCard from '@/features/goal/components/GoalCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useGoalStore } from '@/features/goal/store/goal.store'
import { getGoalPresets } from '@/features/goal/api/goal.api'

const goalStore = useGoalStore()
const presets = ref([])

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
