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
        {{ currentStep === 'money-box' ? '소개로 돌아가기' : '이전으로' }}
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
        @complete="completeSetup"
        @back="currentStep = 'money-box'"
      />
      <PacemakerSetupCompleteStep v-else :max-amount="maxAmount" @open-dashboard="goToDashboard" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  PacemakerLimitStep,
  PacemakerMoneyBoxStep,
  PacemakerSetupCompleteStep,
  usePacemakerStore,
} from '@/features/pacemaker'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
const pacemakerStore = usePacemakerStore()
const currentStep = ref('money-box')
const maxAmount = ref(10000)
const isSubmitting = ref(false)
const submitError = ref('')

function goToIntro() {
  router.push({ name: ROUTE_NAMES.PACEMAKER })
}

function goBack() {
  if (currentStep.value === 'limit') {
    currentStep.value = 'money-box'
    return
  }

  goToIntro()
}

async function completeSetup() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = ''

  try {
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
