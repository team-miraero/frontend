<template>
  <!-- 배경 래퍼: 소프트 블루 은은한 배경 -->
  <div class="min-h-screen bg-[#F7FAFC] flex flex-col justify-between font-sans">
    <!-- 1. 상단 네비게이션 헤더 & 진행바 영역 -->
    <header class="w-full max-w-5xl mx-auto px-6 pt-6 pb-2">
      <!-- 로고 및 이전 버튼 -->
      <div class="flex items-center justify-between mb-8">
        <!-- 로고 -->
        <div
          class="flex items-center gap-2 cursor-pointer"
          @click="router.push({ name: 'onboarding' })"
        >
          <img :src="logo" alt="미래로" class="w-8 h-8 object-contain" />
          <span class="font-extrabold text-lg tracking-tight text-gray-900">미래로</span>
        </div>

        <!-- 이전 버튼 -->
        <button
          class="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          @click="router.back()"
        >
          <svg class="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          이전
        </button>
      </div>

      <!-- 진행바 (Progress Bar with Animation) -->
      <div class="flex items-center gap-4 max-w-2xl mx-auto">
        <div class="relative flex-1 h-2 bg-gray-200/70 rounded-full overflow-hidden">
          <div
            class="h-full bg-[#0066FF] rounded-full ease-out"
            :style="{
              width: progressWidth,
              transition: 'width 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
            }"
          ></div>
        </div>
        <span class="text-xs font-bold text-gray-400 whitespace-nowrap">1 / 3</span>
      </div>
    </header>

    <!-- 2. 중앙 컨텐츠 영역 -->
    <main
      class="w-full max-w-2xl mx-auto px-6 py-6 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <!-- 메인 타이틀 영역 -->
      <div class="text-center mb-8">
        <p class="text-xs sm:text-sm font-bold text-[#0066FF] tracking-wider mb-2">
          STEP 1 — 목표 선택
        </p>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          어떤 목표를 향해 달릴까요?
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
          지금 가장 집중하고 싶은 목표를 하나 선택해 주세요.
        </p>
      </div>

      <!-- 목표 카드 그리드 (2열) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GoalCard
          v-for="preset in presets"
          :key="preset.id"
          v-bind="preset"
          :is-selected="goalStore.selectedGoalId === preset.id"
          @select="toggleGoal(preset.id)"
        />
      </div>

      <!-- 하단 CTA 버튼 -->
      <div class="mt-8 flex flex-col items-center">
        <button
          :disabled="!selectedGoal"
          class="w-full max-w-md bg-[#0066FF] hover:bg-blue-600 active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          @click="handleNext"
        >
          <span>{{ buttonText }}</span>
          <svg class="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <p class="text-xs text-gray-400 font-medium mt-3">
          나중에 목표를 추가하거나 변경할 수 있어요
        </p>
      </div>
    </main>

    <!-- 하단 여백 바닥 받침 -->
    <footer class="py-4"></footer>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import GoalCard from '@/features/goal/components/GoalCard.vue'
import { useGoalStore } from '@/features/goal/store/goal.store'
import { getGoalPresets } from '@/features/goal/api/goal.api'
import logo from '@/assets/images/logo.png'

const router = useRouter()
const goalStore = useGoalStore()
const presets = ref([])

// 진행바 애니메이션을 위한 반응형 수치
const progressWidth = ref('0%')

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

onMounted(async () => {
  // 진행바 0% -> 33.3% 부드러운 애니메이션 트리거
  nextTick(() => {
    setTimeout(() => {
      progressWidth.value = '33.333%'
    }, 100)
  })

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
