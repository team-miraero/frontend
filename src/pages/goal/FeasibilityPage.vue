<template>
  <div class="mx-auto max-w-md px-4 space-y-6 pb-32">
    <!-- 헤더 -->
    <header class="space-y-2">
      <div
        class="inline-flex items-center space-x-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600"
      >
        <span>🎓</span>
        <span>학자금 대출 상환</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 whitespace-pre-line">
        내 여력으로 가능한<br />목표일까요
      </h1>
    </header>

    <!-- 1. 마이데이터 분석 결과 -->
    <BaseCard>
      <div class="text-xs text-gray-500 mb-4">마이데이터 분석 결과</div>

      <!-- 월 상환 여력 -->
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600 font-medium">월 상환 여력</span>
          <span class="font-bold text-gray-900">62만원</span>
        </div>
        <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-blue-400" style="width: 100%"></div>
        </div>
      </div>

      <!-- 필요 월 상환액 -->
      <div class="mb-6">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600 font-medium">필요 월 상환액</span>
          <!-- 상태에 따라 텍스트 색상 변경 (현실적: 파랑, 빠듯: 주황, 무리: 빨강) -->
          <span
            class="font-bold"
            :class="
              feasibilityStatus === 'REALISTIC'
                ? 'text-blue-600'
                : feasibilityStatus === 'TIGHT'
                  ? 'text-orange-500'
                  : 'text-red-500'
            "
          >
            22만원
          </span>
        </div>
        <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <!-- 상태에 따라 막대 색상 및 길이 변경 -->
          <div
            class="h-full"
            :class="
              feasibilityStatus === 'REALISTIC'
                ? 'bg-blue-600 w-[35%]'
                : feasibilityStatus === 'TIGHT'
                  ? 'bg-orange-500 w-[90%]'
                  : 'bg-red-500 w-full'
            "
          ></div>
        </div>
      </div>

      <!-- 상태 알림 박스 -->
      <div
        class="rounded-lg p-4"
        :class="
          feasibilityStatus === 'REALISTIC'
            ? 'bg-blue-50 border border-blue-100'
            : feasibilityStatus === 'TIGHT'
              ? 'bg-orange-50 border border-orange-100'
              : 'bg-red-50 border border-red-100'
        "
      >
        <div
          class="font-bold mb-1"
          :class="
            feasibilityStatus === 'REALISTIC'
              ? 'text-blue-600'
              : feasibilityStatus === 'TIGHT'
                ? 'text-orange-500'
                : 'text-red-500'
          "
        >
          {{
            feasibilityStatus === 'REALISTIC'
              ? '현실적이에요'
              : feasibilityStatus === 'TIGHT'
                ? '살짝 빠듯해요'
                : '지금은 무리에요'
          }}
        </div>
        <div class="text-xs text-gray-500">
          {{
            feasibilityStatus === 'REALISTIC'
              ? '충분히 가능한 목표예요'
              : feasibilityStatus === 'TIGHT'
                ? '조금만 조정하면 가능해요'
                : '목표를 조정해봐요'
          }}
        </div>
      </div>
    </BaseCard>

    <!-- 2. 결과 또는 대안 -->
    <!-- 2. 결과 또는 대안 -->
    <BaseCard>
      <!-- 현실적일 때 (REALISTIC) -->
      <div v-if="feasibilityStatus === 'REALISTIC'">
        <!-- 상단 아이콘 뱃지 -->
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-lg">
            🎓
          </div>
          <div class="text-xs text-gray-500">
            완납 예측 <br /><span class="font-bold text-gray-900 text-sm"
              >충분히 갚을 수 있어요 🎉</span
            >
          </div>
        </div>

        <!-- 강조 타이틀 -->
        <h2 class="text-xl font-bold text-gray-900 mb-6">
          매달 <span class="text-blue-600">{{ format(requiredPayment) }}원</span>이면<br />
          <span class="text-blue-600">{{ estimatedCompletion }} 뒤</span> 완납 가능해요
        </h2>

        <!-- 요약 칩 3개 (가로 정렬: flex-row 적용) -->
        <div class="flex flex-row justify-between space-x-2">
          <div class="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p class="text-xs text-gray-500 mb-1">남은 대출</p>
            <p class="font-bold text-gray-900 text-sm">1,240만원</p>
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
        <!-- 상단 경고 뱃지 -->
        <div class="flex items-center space-x-2 mb-4">
          <div
            class="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500"
          >
            ⚠️
          </div>
          <div class="text-xs text-gray-500">
            조정이 필요해요 <br /><span class="font-bold text-gray-900 text-sm"
              >조금만 조정하면 충분해요</span
            >
          </div>
        </div>

        <!-- 설명 텍스트 -->
        <p class="text-sm text-gray-600 mb-6">
          현재 월 여력
          <span class="font-bold text-gray-900">{{ format(mydataCapacity) }}원</span> 대비
          <span class="font-bold text-red-500">{{ format(requiredPayment) }}원</span>이 필요해요.
          아래 대안 중 하나를 선택하면 바로 재계산돼요.
        </p>

        <!-- 클릭 가능한 대안 버튼 리스트 -->
        <div class="flex flex-col space-y-3">
          <button
            @click="handleSelectAlternative('period')"
            class="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center"
          >
            <span class="text-2xl mr-3">🕒</span>
            <div>
              <p class="font-bold text-gray-900">기간 늘리기</p>
              <p class="text-sm text-gray-500">+12개월</p>
            </div>
          </button>

          <button
            @click="handleSelectAlternative('amount')"
            class="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center"
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
    <BottomFixedButton :disabled="feasibilityData.status !== 'REALISTIC'">
      {{ feasibilityData.status === 'REALISTIC' ? '계좌 연결하기 >' : '대안을 선택해 주세요' }}
    </BottomFixedButton>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BottomFixedButton from '@/shared/ui/BottomFixedButton.vue'

// TODO: 향후 POST API 응답 데이터로 교체할 것
const feasibilityData = ref({
  mydataCapacity: 620000,
  requiredPayment: 220000,
  status: 'REALISTIC',
  estimatedCompletion: '4년 10개월',
  remainingAmount: '1,240만원',
})

const statusColorClass = computed(() => {
  if (feasibilityData.value.status === 'REALISTIC') return 'text-blue-500'
  if (feasibilityData.value.status === 'TIGHT') return 'text-yellow-500'
  return 'text-red-500'
})

const statusBgClass = computed(() => {
  if (feasibilityData.value.status === 'REALISTIC') return 'bg-blue-500'
  if (feasibilityData.value.status === 'TIGHT') return 'bg-yellow-500'
  return 'bg-red-500'
})
</script>
