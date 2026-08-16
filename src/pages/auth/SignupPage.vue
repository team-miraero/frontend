<!-- 회원가입 페이지 (AUTH-01) - 1단계: 약관 동의 ➔ 2단계: 계정 정보 입력 -->
<template>
  <HeroBackground>
    <StepHeader :show-back="true" @back="handleBack" />

    <main class="flex justify-center px-4 pb-16 pt-6 sm:pt-10">
      <div class="w-full max-w-[420px]">
        <!-- 단계 인디케이터 -->
        <div class="mb-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary">
          <span
            class="flex size-5 items-center justify-center rounded-full text-[11px] font-bold transition-colors"
            :class="currentStep === 1 ? 'bg-primary text-white' : 'bg-blue-100 text-primary'"
          >
            1
          </span>
          <span class="h-0.5 w-6 rounded-full bg-blue-100" />
          <span
            class="flex size-5 items-center justify-center rounded-full text-[11px] font-bold transition-colors"
            :class="currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'"
          >
            2
          </span>
        </div>

        <!-- 헤더 영역 -->
        <div class="flex flex-col items-center text-center">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-[26px] [word-break:keep-all] break-keep">
            {{ currentStep === 1 ? '미래로 시작하기' : '계정 정보를 입력해 주세요' }}
          </h1>
          <p class="mt-2 text-xs sm:text-sm leading-relaxed text-gray-500 [word-break:keep-all] break-keep">
            {{
              currentStep === 1
                ? 'KB스타뱅킹에서 확인된 정보로 미래로 이용을 등록해요.'
                : '로그인에 사용할 이메일과 비밀번호를 입력해 주세요.'
            }}
          </p>
          <div
            class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
            </svg>
            KB스타뱅킹 인증 완료
          </div>
        </div>

        <form class="mt-7" @submit.prevent="handleSubmit">
          <!-- Step 1: 약관 및 금융정보 연결 동의 -->
          <div v-if="currentStep === 1" class="space-y-6">
            <TermsAgreement v-model="agreedTerms" :terms="SIGNUP_TERMS" />

            <div class="space-y-3">
              <BaseButton
                type="button"
                full-width
                size="lg"
                :disabled="!allRequiredAgreed"
                @click="goToStep2"
              >
                다음
              </BaseButton>

              <p class="mt-4 text-center text-sm text-gray-500">
                이미 계정이 있으신가요?
                <RouterLink :to="{ name: ROUTE_NAMES.LOGIN }" class="font-semibold text-primary">
                  로그인
                </RouterLink>
              </p>
            </div>
          </div>

          <!-- Step 2: 계정 정보 입력 -->
          <div v-else class="space-y-6">
            <div class="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 shadow-xs">
              <h2 class="text-sm font-bold text-gray-900">계정 정보</h2>

              <div class="mt-4 space-y-4">
                <BaseInput
                  id="email"
                  ref="emailInputRef"
                  v-model="form.email"
                  label="이메일"
                  type="email"
                  placeholder="example@email.com"
                  :error="errors.email"
                  @input="handleEmailInput"
                  @blur="validateEmail"
                />

                <PasswordInput
                  id="password"
                  v-model="form.password"
                  label="비밀번호"
                  placeholder="8자 이상 입력해 주세요"
                  :error="errors.password"
                  @input="handlePasswordInput"
                  @blur="validatePassword"
                />

                <PasswordInput
                  id="passwordConfirm"
                  v-model="form.passwordConfirm"
                  label="비밀번호 확인"
                  placeholder="비밀번호를 한 번 더 입력해 주세요"
                  :error="errors.passwordConfirm"
                  @input="handlePasswordConfirmInput"
                  @blur="validatePasswordConfirm"
                />

                <p
                  v-if="isPasswordMatched"
                  class="flex items-center gap-1 text-xs font-medium text-emerald-600 animate-fade-in"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="size-3.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  비밀번호가 일치해요
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <p
                v-if="authFeatureStore.signupError"
                class="text-center text-sm font-medium text-red-500 [word-break:keep-all] break-keep"
              >
                {{ authFeatureStore.signupError }}
              </p>
              <BaseButton
                type="submit"
                full-width
                size="lg"
                :disabled="!canSubmit || authFeatureStore.isSubmittingSignup"
              >
                {{
                  authFeatureStore.isSubmittingSignup ? '회원가입 처리 중...' : '회원가입 완료'
                }}
              </BaseButton>

              <p class="mt-4 text-center text-sm text-gray-500">
                이미 계정이 있으신가요?
                <RouterLink
                  :to="{ name: ROUTE_NAMES.LOGIN }"
                  class="font-semibold text-primary transition hover:underline"
                >
                  로그인
                </RouterLink>
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>

    <BaseModal v-model="isConnectionGuideOpen" hide-default-close>
      <div class="p-5 text-center sm:p-6">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50 text-primary"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="size-7"
            aria-hidden="true"
          >
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M7 10h10M7 14h6" />
          </svg>
        </div>

        <h2 class="mt-4 text-lg font-bold text-gray-900 [word-break:keep-all] break-keep">
          내 금융 자산을 바로 분석할까요?
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-gray-500 [word-break:keep-all] break-keep">
          KB스타뱅킹과 연결된 금융 데이터를 분석하여<br />
          회원님만을 위한 1:1 맞춤 로드맵을 설계해 드려요.
        </p>

        <ul class="mt-5 grid grid-cols-3 gap-2 text-xs font-medium text-slate-600">
          <li class="rounded-xl bg-slate-50 px-2 py-3">계좌·자산</li>
          <li class="rounded-xl bg-slate-50 px-2 py-3">소득·소비</li>
          <li class="rounded-xl bg-slate-50 px-2 py-3">대출 현황</li>
        </ul>

        <div class="mt-6">
          <BaseButton full-width size="lg" @click="startFinancialConnection">
            자산 분석 시작하기
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </HeroBackground>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
import { PasswordInput, TermsAgreement, useAuthFeatureStore } from '@/features/auth'
import { SIGNUP_TERMS } from '@/features/auth/constants/auth.constants'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const router = useRouter()
const authFeatureStore = useAuthFeatureStore()

const currentStep = ref(1)
const isConnectionGuideOpen = ref(false)
const emailInputRef = ref(null)

const form = ref({ email: '', password: '', passwordConfirm: '' })
const errors = ref({ email: '', password: '', passwordConfirm: '' })
const agreedTerms = ref(SIGNUP_TERMS.reduce((acc, term) => ({ ...acc, [term.id]: false }), {}))

onMounted(() => {
  authFeatureStore.resetSignupError()
})

function handleBack() {
  if (currentStep.value === 2) {
    currentStep.value = 1
  } else {
    router.push({ name: ROUTE_NAMES.ONBOARDING })
  }
}

const isPasswordMatched = computed(() => {
  return (
    form.value.password.length >= 8 &&
    form.value.passwordConfirm.length >= 8 &&
    form.value.password === form.value.passwordConfirm
  )
})

function handleEmailInput() {
  if (authFeatureStore.signupError) {
    authFeatureStore.resetSignupError()
  }
  if (errors.value.email && EMAIL_PATTERN.test(form.value.email)) {
    errors.value.email = ''
  }
}

function handlePasswordInput() {
  if (authFeatureStore.signupError) {
    authFeatureStore.resetSignupError()
  }
  if (errors.value.password && form.value.password.length >= 8) {
    errors.value.password = ''
  }
  if (form.value.passwordConfirm) {
    if (form.value.password === form.value.passwordConfirm) {
      errors.value.passwordConfirm = ''
    }
  }
}

function handlePasswordConfirmInput() {
  if (form.value.password && form.value.passwordConfirm) {
    if (form.value.password === form.value.passwordConfirm) {
      errors.value.passwordConfirm = ''
    }
  }
}

function validateEmail() {
  errors.value.email = EMAIL_PATTERN.test(form.value.email)
    ? ''
    : '올바른 이메일 형식을 입력해 주세요'
}

function validatePassword() {
  errors.value.password = form.value.password.length >= 8 ? '' : '비밀번호는 8자 이상 입력해 주세요'
  if (form.value.passwordConfirm) {
    validatePasswordConfirm()
  }
}

function validatePasswordConfirm() {
  errors.value.passwordConfirm =
    form.value.passwordConfirm === form.value.password ? '' : '비밀번호가 일치하지 않아요'
}

const allRequiredAgreed = computed(() =>
  SIGNUP_TERMS.filter((term) => term.required).every((term) => agreedTerms.value[term.id])
)

const canSubmit = computed(() => {
  if (currentStep.value === 1) {
    return allRequiredAgreed.value
  }
  return (
    EMAIL_PATTERN.test(form.value.email) &&
    form.value.password.length >= 8 &&
    form.value.password === form.value.passwordConfirm &&
    allRequiredAgreed.value &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.passwordConfirm
  )
})

function goToStep2() {
  if (!allRequiredAgreed.value) return
  currentStep.value = 2
  nextTick(() => {
    emailInputRef.value?.focus()
  })
}

async function handleSubmit() {
  if (currentStep.value === 1) {
    goToStep2()
    return
  }

  validateEmail()
  validatePassword()
  validatePasswordConfirm()
  if (!canSubmit.value) return

  try {
    await authFeatureStore.submitSignup({
      email: form.value.email,
      password: form.value.password,
    })

    // 가입 성공 즉시 자동 로그인하되, 금융정보 연결은 사용자가 직접 시작한다.
    try {
      await authFeatureStore.submitLogin({
        email: form.value.email,
        password: form.value.password,
      })
      isConnectionGuideOpen.value = true
    } catch {
      // 자동 로그인 실패 시 로그인 페이지로 연결
      router.push({ name: ROUTE_NAMES.LOGIN })
    }
  } catch {
    // signupError는 store에서 관리
  }
}

function startFinancialConnection() {
  isConnectionGuideOpen.value = false
  router.push({ name: ROUTE_NAMES.MYDATA_LOADING })
}
</script>
