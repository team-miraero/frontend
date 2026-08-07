<!-- 페이스메이커 개설 페이지: 단계 전환과 설정값만 관리 -->
<template>
  <div class="min-h-full bg-[#f8fbff] px-4 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
    <div class="mx-auto flex w-full max-w-[520px] flex-col">
      <button
        v-if="currentStep !== 'complete'"
        type="button"
        class="mb-5 inline-flex w-fit items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-[#0a192f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isSubmitting"
        @click="goBack"
      >
        <span aria-hidden="true">←</span>
        {{
          isEditMode
            ? '대시보드로 돌아가기'
            : currentStep === 'money-box'
              ? '소개로 돌아가기'
              : '이전으로'
        }}
      </button>

      <PacemakerMoneyBoxStep
        v-if="currentStep === 'money-box'"
        @next="currentStep = 'limit'"
        @back="goToIntro"
      />
      <PacemakerLimitStep
        v-else-if="currentStep === 'limit'"
        v-model="maxAmount"
        :is-submitting="isSubmitting"
        :error-message="submitError"
        :is-edit-mode="isEditMode"
        @complete="completeSetup"
        @back="goBack"
      />
      <PacemakerSetupCompleteStep v-else :max-amount="maxAmount" @open-dashboard="goToDashboard" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PacemakerLimitStep,
  PacemakerMoneyBoxStep,
  PacemakerSetupCompleteStep,
  usePacemakerStore,
} from '@/features/pacemaker'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const route = useRoute()
const router = useRouter()
const pacemakerStore = usePacemakerStore()
const isEditMode = computed(() => route.query.mode === 'max-amount')
const currentStep = ref(isEditMode.value ? 'limit' : 'money-box')
const maxAmount = ref(10000)
const isSubmitting = ref(false)
const submitError = ref('')

onMounted(async () => {
  document.querySelector('main')?.scrollTo({ top: 0 })
  if (!isEditMode.value) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    const status = pacemakerStore.pacemakerStatus ?? (await pacemakerStore.fetchPacemakerStatus())

    if (!status.registered) {
      goToIntro()
      return
    }

    if (!pacemakerStore.pacemakerDashboard) {
      await pacemakerStore.fetchPacemakerDashboard()
    }

    maxAmount.value = pacemakerStore.pacemakerDashboard.maxAmount
  } catch (error) {
    submitError.value = error?.message ?? '현재 상한액을 불러오지 못했어요.'
  } finally {
    isSubmitting.value = false
  }
})

function goToIntro() {
  router.push({ name: ROUTE_NAMES.PACEMAKER })
}

function goBack() {
  if (isEditMode.value) {
    goToDashboard()
    return
  }

  if (currentStep.value === 'limit') {
    currentStep.value = 'money-box'
    return
  }

  goToIntro()
}

async function completeSetup() {
  if (isSubmitting.value) return

  if (
    !Number.isInteger(maxAmount.value) ||
    maxAmount.value < 1000 ||
    maxAmount.value > 50000 ||
    maxAmount.value % 1000 !== 0
  ) {
    submitError.value = '1,000원 이상 50,000원 이하의 금액을 1,000원 단위로 설정해 주세요.'
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  try {
    if (isEditMode.value) {
      await pacemakerStore.updateMaxAmount(maxAmount.value)
      goToDashboard()
      return
    }

    await pacemakerStore.setupPacemaker(maxAmount.value)
    currentStep.value = 'complete'
  } catch (error) {
    submitError.value =
      error?.message ?? '페이스메이커 개설에 실패했어요. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSubmitting.value = false
  }
}

function goToDashboard() {
  router.push({ name: ROUTE_NAMES.PACEMAKER })
}
</script>
