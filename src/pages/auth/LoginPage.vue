<!-- 로그인 페이지 (AUTH-02) -->
<template>
  <HeroBackground>
    <StepHeader back-label="처음으로" @back="router.push({ name: ROUTE_NAMES.ONBOARDING })" />

    <main class="flex justify-center px-4 pb-16 pt-8">
      <div class="w-full max-w-[380px] rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div class="flex flex-col items-center text-center">
          <img :src="logo" alt="" class="h-14 w-14" />
          <h1 class="mt-4 text-xl font-bold text-gray-900">로그인</h1>
          <p class="mt-2 text-sm text-gray-500">미래로 계정으로 시작하세요</p>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
          <BaseInput
            id="email"
            v-model="form.email"
            label="이메일"
            type="email"
            placeholder="이메일"
            :error="errors.email"
            @blur="validateEmail"
          />

          <PasswordInput
            id="password"
            v-model="form.password"
            label="비밀번호"
            placeholder="비밀번호"
          >
            <template #action>
              <button type="button" class="text-xs font-medium text-primary">비밀번호 찾기</button>
            </template>
          </PasswordInput>

          <p v-if="authFeatureStore.loginError" class="text-xs text-red-500">
            {{ authFeatureStore.loginError }}
          </p>
          <BaseButton
            type="submit"
            full-width
            size="lg"
            :disabled="authFeatureStore.isSubmittingLogin"
          >
            {{ authFeatureStore.isSubmittingLogin ? '로그인 중...' : '로그인' }}
          </BaseButton>
        </form>

        <p class="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-3.5 w-3.5 shrink-0"
          >
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span>마이데이터로 내 금융정보를 불러와요</span>
        </p>

        <div class="my-5 flex items-center gap-3">
          <span class="h-px flex-1 bg-gray-200" />
          <span class="text-xs text-gray-400">또는</span>
          <span class="h-px flex-1 bg-gray-200" />
        </div>

        <p class="text-center text-sm text-gray-500">
          아직 계정이 없으신가요?
          <RouterLink :to="{ name: ROUTE_NAMES.SIGNUP }" class="font-semibold text-primary">
            회원가입하기
          </RouterLink>
        </p>
      </div>
    </main>
  </HeroBackground>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
import { PasswordInput, useAuthFeatureStore } from '@/features/auth'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import logo from '@/assets/images/logo.png'

const router = useRouter()
const authFeatureStore = useAuthFeatureStore()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const form = ref({ email: '', password: '' })
const errors = ref({ email: '' })

onMounted(() => {
  authFeatureStore.resetLoginError()
})

function validateEmail() {
  errors.value.email = EMAIL_PATTERN.test(form.value.email)
    ? ''
    : '올바른 이메일 형식을 입력해 주세요.'
}

async function handleLogin() {
  if (authFeatureStore.isSubmittingLogin) return

  validateEmail()

  if (errors.value.email) return

  try {
    await authFeatureStore.submitLogin(form.value)
    router.push({ name: ROUTE_NAMES.MYDATA_LOADING })
  } catch {
    // loginError는 store에서 관리
  }
}
</script>
