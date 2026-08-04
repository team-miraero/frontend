<!-- 회원가입 페이지 (AUTH-01) -->
<template>
  <HeroBackground>
    <StepHeader back-label="로그인으로" @back="router.push({ name: ROUTE_NAMES.LOGIN })" />

    <main class="flex justify-center px-4 pb-16 pt-8">
      <div class="w-full max-w-[380px]">
        <div class="flex flex-col items-center text-center">
          <img :src="logo" alt="" class="h-14 w-14" />
          <h1 class="mt-4 text-xl font-bold text-gray-900">미래로 시작하기</h1>
          <p class="mt-2 text-sm leading-relaxed text-gray-500">
            KB Pay 마이데이터로 내 자산을 불러와<br />
            맞춤 로드맵을 설계해 드려요.
          </p>
        </div>

        <form class="mt-6 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 class="text-sm font-bold text-gray-900">계정 정보</h2>

            <div class="mt-4 space-y-4">
              <BaseInput
                id="email"
                v-model="form.email"
                label="이메일"
                type="email"
                placeholder="hello@miraero.io"
                :error="errors.email"
                @blur="validateEmail"
              />

              <PasswordInput
                id="password"
                v-model="form.password"
                label="비밀번호"
                placeholder="비밀번호"
                :error="errors.password"
                @blur="validatePassword"
              />

              <PasswordInput
                id="passwordConfirm"
                v-model="form.passwordConfirm"
                label="비밀번호 확인"
                placeholder="비밀번호 확인"
                :error="errors.passwordConfirm"
                @blur="validatePasswordConfirm"
              />
            </div>
          </div>

          <TermsAgreement v-model="agreedTerms" :terms="SIGNUP_TERMS" />

          <div class="space-y-3">
            <p v-if="authFeatureStore.signupError" class="text-center text-sm text-red-500">
              {{ authFeatureStore.signupError }}
            </p>
            <BaseButton
              type="submit"
              full-width
              size="lg"
              :disabled="!canSubmit || authFeatureStore.isSubmittingSignup"
            >
              {{
                authFeatureStore.isSubmittingSignup ? '회원가입 처리 중...' : '동의하고 회원가입'
              }}
            </BaseButton>

            <p class="mt-4 text-center text-sm text-gray-500">
              이미 계정이 있으신가요?
              <RouterLink :to="{ name: ROUTE_NAMES.LOGIN }" class="font-semibold text-primary">
                로그인
              </RouterLink>
            </p>
          </div>
        </form>
      </div>
    </main>

    <!-- 회원가입 완료 모달 -->
    <BaseModal v-model="isSuccessModalOpen" hide-default-close>
      <div class="p-6 text-center">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-4"
        >
          <svg
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900">회원가입이 완료되었어요!</h3>
        <p class="mt-2 text-sm leading-relaxed text-gray-500">
          미래로의 회원이 되신 것을 환영합니다 🎉<br />
          로그인 후 맞춤 자산 관리 서비스를 시작해 보세요.
        </p>
        <div class="mt-6">
          <BaseButton full-width size="lg" @click="handleGoToLogin"> 로그인하러 가기 </BaseButton>
        </div>
      </div>
    </BaseModal>
  </HeroBackground>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
import { PasswordInput, TermsAgreement, useAuthFeatureStore } from '@/features/auth'
import { SIGNUP_TERMS } from '@/features/auth/constants/auth.constants'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import logo from '@/assets/images/logo.png'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const router = useRouter()
const authFeatureStore = useAuthFeatureStore()

const isSuccessModalOpen = ref(false)

const form = ref({ email: '', password: '', passwordConfirm: '' })
const errors = ref({ email: '', password: '', passwordConfirm: '' })
const agreedTerms = ref(SIGNUP_TERMS.reduce((acc, term) => ({ ...acc, [term.id]: false }), {}))

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

const isFormFilled = computed(
  () => form.value.email && form.value.password && form.value.passwordConfirm
)
const hasNoError = computed(
  () => !errors.value.email && !errors.value.password && !errors.value.passwordConfirm
)
const allRequiredAgreed = computed(() =>
  SIGNUP_TERMS.filter((term) => term.required).every((term) => agreedTerms.value[term.id])
)
const canSubmit = computed(() => isFormFilled.value && hasNoError.value && allRequiredAgreed.value)

async function handleSubmit() {
  validateEmail()
  validatePassword()
  validatePasswordConfirm()
  if (!canSubmit.value) return

  try {
    await authFeatureStore.submitSignup({
      email: form.value.email,
      password: form.value.password,
    })
    isSuccessModalOpen.value = true
  } catch {
    // signupError는 store에서 관리
  }
}

function handleGoToLogin() {
  isSuccessModalOpen.value = false
  router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>
