<template>
  <div class="mx-auto max-w-md px-4 space-y-6 pb-32">
    <!-- 헤더 -->
    <header class="space-y-2 mt-4">
      <div
        class="inline-flex items-center space-x-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600"
      >
        <span>🎓</span>
        <span>학자금 대출 상환</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 whitespace-pre-line">
        내 여력으로 가능한<br />목표일까요?
      </h1>
    </header>

    <!-- 1. 마이데이터 분석 결과 -->
    <BaseCard>
      <div class="text-xs text-gray-500 mb-4">마이데이터 분석 결과</div>

      <!-- 월 상환 여력 -->
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600 font-medium">월 상환 여력</span>
          <!-- 하드코딩 제거: 포맷 함수 적용 -->
          <span class="font-bold text-gray-900">{{ format(mydataCapacity / 10000) }}만원</span>
        </div>
        <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-blue-300" style="width: 100%"></div>
        </div>
      </div>

      <!-- 필요 월 상환액 -->
      <div class="mb-6">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600 font-medium">필요 월 상환액</span>
          <span :class="statusTextColor" class="font-bold">
            {{ format(requiredPayment / 10000) }}만원
          </span>
        </div>
        <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <!-- 비율(ratio) 계산을 통한 동적 게이지 바 적용 -->
          <div
            class="h-full transition-all duration-500"
            :class="statusBgColor"
            :style="{ width: ratio + '%' }"
          ></div>
        </div>
      </div>

      <!-- 상태 알림 박스 (단순화된 클래스 바인딩) -->
      <div class="rounded-lg p-4 border" :class="statusBoxStyle">
        <div class="font-bold mb-1" :class="statusTextColor">
          {{ statusTitle }}
        </div>
        <div class="text-xs text-gray-600">
          {{ statusDescription }}
        </div>
      </div>
    </BaseCard>

    <!-- 2. 결과 또는 대안 -->
    <BaseCard>
      <!-- 현실적일 때 (REALISTIC) -->
      <div v-if="feasibilityStatus === 'REALISTIC'">
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-lg">
            🎓
          </div>
          <div class="text-xs text-gray-500">
            완납 예측 <br />
            <span class="font-bold text-gray-900 text-sm">충분히 갚을 수 있어요 🎉</span>
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-6">
          매달 <span class="text-blue-600">{{ format(requiredPayment) }}원</span>이면<br />
          <span class="text-blue-600">{{ estimatedCompletion }} 뒤</span> 완납 가능해요
        </h2>

        <div class="flex flex-row justify-between space-x-2">
          <div class="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p class="text-xs text-gray-500 mb-1">남은 대출</p>
            <p class="font-bold text-gray-900 text-sm">{{ remainingAmount }}</p>
          </div>
          <div class="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p class="text-xs text-gray-500 mb-1">완납 기간</p>
            <p class="font-bold text-gray-900 text-sm">{{ estimatedCompletion }}</p>
          </div>
          <div class="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p class="text-xs text-gray-500 mb-1">월 상환액</p>
            <p class="font-bold text-gray-900 text-sm">{{ format(requiredPayment / 10000) }}만원</p>
          </div>
        </div>
      </div>

      <!-- 빠듯하거나 무리일 때 대안 제시 (TIGHT / IMPOSSIBLE) -->
      <div v-else>
        <div class="flex items-center space-x-2 mb-4">
          <div
            class="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500"
          >
            ⚠️
          </div>
          <div class="text-xs text-gray-500">
            조정이 필요해요 <br />
            <span class="font-bold text-gray-900 text-sm">조금만 조정하면 충분해요</span>
          </div>
        </div>

        <p class="text-sm text-gray-600 mb-6">
          현재 월 여력
          <span class="font-bold text-gray-900">{{ format(mydataCapacity) }}원</span> 대비
          <span class="font-bold text-red-500">{{ format(requiredPayment) }}원</span>이 필요해요.
          아래 대안 중 하나를 선택하면 바로 재계산돼요.
        </p>

        <div class="flex flex-col space-y-3">
          <button
            class="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center"
            @click="handleSelectAlternative('period')"
          >
            <span class="text-2xl mr-3">🕒</span>
            <div>
              <p class="font-bold text-gray-900">기간 늘리기</p>
              <p class="text-sm text-gray-500">+12개월</p>
            </div>
          </button>

          <button
            class="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center"
            @click="handleSelectAlternative('amount')"
          >
            <span class="text-2xl mr-3">⚡</span>
            <div>
              <p class="font-bold text-gray-900">추가 상환 늘리기</p>
              <p class="text-sm text-gray-500">+10만원/월</p>
            </div>
          </button>
        </div>
      </div>
    </BaseCard>

    <!-- 하단 고정 버튼 -->
    <BottomFixedButton :disabled="feasibilityStatus !== 'REALISTIC'">
      {{ feasibilityStatus === 'REALISTIC' ? '계좌 연결하기 >' : '대안을 선택해 주세요' }}
    </BottomFixedButton>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BottomFixedButton from '@/shared/ui/BottomFixedButton.vue'

// 1. Mock 데이터 (향후 API 응답으로 교체)
const feasibilityData = ref({
  mydataCapacity: 620000,
  requiredPayment: 220000,
  status: 'REALISTIC',
  estimatedCompletion: '4년 10개월',
  remainingAmount: '1,240만원',
})

// 2. 템플릿 사용을 위한 반응형 데이터 분해
const mydataCapacity = computed(() => feasibilityData.value.mydataCapacity)
const requiredPayment = computed(() => feasibilityData.value.requiredPayment)
const feasibilityStatus = computed(() => feasibilityData.value.status)
const estimatedCompletion = computed(() => feasibilityData.value.estimatedCompletion)
const remainingAmount = computed(() => feasibilityData.value.remainingAmount)

// 3. 프로그레스 바 비율 계산 로직 (최대 100%)
const ratio = computed(() => {
  return Math.min((requiredPayment.value / mydataCapacity.value) * 100, 100)
})

// 4. 상태별 UI 다이내믹 바인딩 (템플릿의 복잡한 로직을 스크립트로 분리)
const statusTitle = computed(() => {
  if (feasibilityStatus.value === 'REALISTIC') return '현실적이에요'
  if (feasibilityStatus.value === 'TIGHT') return '살짝 빠듯해요'
  return '지금은 무리에요'
})

const statusDescription = computed(() => {
  if (feasibilityStatus.value === 'REALISTIC') return '충분히 가능한 목표예요'
  if (feasibilityStatus.value === 'TIGHT') return '조금만 조정하면 가능해요'
  return '목표를 조정해봐요'
})

const statusTextColor = computed(() => {
  if (feasibilityStatus.value === 'REALISTIC') return 'text-blue-600'
  if (feasibilityStatus.value === 'TIGHT') return 'text-orange-500'
  return 'text-red-500'
})

const statusBgColor = computed(() => {
  if (feasibilityStatus.value === 'REALISTIC') return 'bg-blue-600'
  if (feasibilityStatus.value === 'TIGHT') return 'bg-orange-500'
  return 'bg-red-500'
})

const statusBoxStyle = computed(() => {
  if (feasibilityStatus.value === 'REALISTIC') return 'bg-blue-50 border-blue-100'
  if (feasibilityStatus.value === 'TIGHT') return 'bg-orange-50 border-orange-100'
  return 'bg-red-50 border-red-100'
})

// 5. 공통 함수
const format = (val) => {
  if (!val) return '0'
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const handleSelectAlternative = (type) => {
  console.log('대안 선택됨:', type)
  // TODO: 대안 클릭 시 데이터 재계산(API 호출) 로직 추가
}
</script>
