// 페이스메이커 API 함수와 최신 응답 모델
import { client } from '@/shared/api/client'

/** @typedef {'ACTIVE' | 'PAUSED' | null} PacemakerStatusValue */

/**
 * @typedef {Object} PacemakerStatus
 * @property {number | null} autoSavingId
 * @property {boolean} registered
 * @property {PacemakerStatusValue} status
 * @property {boolean} enabled
 */

/**
 * @typedef {Object} PacemakerMoneyBox
 * @property {number} moneyBoxId
 * @property {number} balance
 * @property {string} maskedAccountNumber
 */

/**
 * @typedef {Object} PacemakerTodaySaving
 * @property {string} savingDate 'yyyy-MM-dd'
 * @property {number} amount
 * @property {'SUCCESS' | 'FAIL'} status
 */

/**
 * @typedef {Object} PacemakerWeeklyStreakItem
 * @property {string} savingDate 'yyyy-MM-dd'
 * @property {'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'} dayOfWeek
 * @property {'SUCCESS' | 'FAIL'} status
 */

/**
 * @typedef {Object} PacemakerDashboard
 * @property {number} autoSavingId
 * @property {'ACTIVE' | 'PAUSED'} status
 * @property {number} maxAmount 하루 최대 자동 저축 금액
 * @property {PacemakerMoneyBox | null} moneyBox
 * @property {PacemakerTodaySaving | null} todaySaving
 * @property {number} currentStreak
 * @property {PacemakerWeeklyStreakItem[]} weeklyStreak
 * @property {number} monthlySuccessCount
 */

/**
 * @typedef {Object} PacemakerHistoryItem
 * @property {string} date 'yyyy-MM-dd'
 * @property {'SAVED' | 'SKIPPED'} status
 * @property {number | null} amount
 * @property {string | null} description
 */

/**
 * @typedef {Object} PacemakerHistoryPage
 * @property {PacemakerHistoryItem[]} content
 * @property {number} page
 * @property {number} size
 * @property {number} totalElements
 * @property {number} totalPages
 * @property {boolean} first
 * @property {boolean} last
 */

function unwrapApiResponse(payload) {
  return payload?.success === true && payload.data !== undefined ? payload.data : payload
}

/** @returns {Promise<PacemakerStatus>} */
export async function getPacemakerStatus() {
  const { data } = await client.get('/pace-maker')
  return unwrapApiResponse(data)
}

/** @returns {Promise<PacemakerDashboard>} */
export async function getPacemakerDashboard() {
  const { data } = await client.get('/pace-maker/dashboard')
  return unwrapApiResponse(data)
}

/**
 * SAVING 저금통을 개설해 페이스메이커 설정을 생성합니다.
 * @returns {Promise<unknown>}
 */
export async function createPacemakerMoneyBox() {
  const { data } = await client.post('/money-boxes', {
    moneyBoxType: 'SAVING',
    autoTransfer: null,
  })
  return unwrapApiResponse(data)
}

/**
 * @param {number} autoSavingId
 * @param {'ACTIVE' | 'PAUSED'} status
 * @returns {Promise<PacemakerStatus>}
 */
export async function updatePacemakerStatus(autoSavingId, status) {
  const { data } = await client.patch(`/pace-maker/${autoSavingId}/status`, { status })
  return unwrapApiResponse(data)
}

/**
 * 백엔드에서 전달된 경로 표기(max-mount)를 그대로 사용합니다.
 * @param {number} maxAmount
 * @returns {Promise<{ autoSavingId: number, maxAmount: number }>}
 */
export async function updatePacemakerMaxAmount(maxAmount) {
  const { data } = await client.patch('/pace-maker/max-mount', { maxAmount })
  return unwrapApiResponse(data)
}

/**
 * @param {number} goalId
 * @param {number} amount
 * @returns {Promise<{ goalId: number, depositedAmount: number, remainingBalance: number }>}
 */
export async function depositToGoalAccount(goalId, amount) {
  const { data } = await client.post('/pace-maker/deposit', { goalId, amount })
  return unwrapApiResponse(data)
}

/**
 * @param {{ page?: number, size?: number }} [params]
 * @returns {Promise<PacemakerHistoryPage>}
 */
export async function getPacemakerHistories({ page = 0, size = 20 } = {}) {
  const { data } = await client.get('/pace-maker/histories', { params: { page, size } })
  return unwrapApiResponse(data)
}
