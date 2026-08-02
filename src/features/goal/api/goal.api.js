import { GOAL_PRESETS } from '@/features/goal/constants/goal.constants.js'
import { client } from '@/shared/api/client'

/**
 * @typedef {import('@/features/goal/constants/goal.constants.js').GoalPreset} GoalPreset
 */

/**
 * 목표 프리셋 데이터를 조회하는 Mock API 함수
 * @returns {Promise<GoalPreset[]>}
 */
export async function getGoalPresets() {
  // TODO: 실제 API 연동 시 client.get('/goals/presets') 등으로 교체
  return Promise.resolve([...GOAL_PRESETS])
}

/**
 * @typedef {Object} GoalAssetInput
 * @property {number} [assetId] 연결할 자산 ID (새로 만드는 저금통처럼 아직 없는 자산은 생략)
 * @property {'MONEYBOX' | 'ACCOUNT' | 'LOAN'} assetType
 */

/**
 * @typedef {Object} CreateGoalPayload
 * @property {string} [goalName] 목표명
 * @property {'INDEPENDENCE' | 'EMERGENCY' | 'WEDDING' | 'LOAN'} goalType
 * @property {number} goalAmount 목표 금액
 * @property {number} goalMonths 목표 기간(개월)
 * @property {number} startAmount 목표 시작 금액
 * @property {GoalAssetInput[]} assets 연결할 자산 목록 (저금통 타입이면 서버가 저금통도 함께 생성)
 */

/**
 * @param {CreateGoalPayload} payload
 * @returns {Promise<{ goalId: number }>}
 */
export async function createGoal(payload) {
  const { data } = await client.post('/goals', payload)
  return data
}

/**
 * @typedef {Object} FeasibilityParams
 * @property {number} goalAmount 목표금액
 * @property {number} goalMonths 목표 개월수
 * @property {number} startAmount 이미 모아둔 금액
 */

/**
 * @typedef {Object} FeasibilityResponse
 * @property {number} requiredMonthly 월 저축·상환 여력에 필요한 금액
 * @property {number} availableMonthly 월 저축·상환 가능 금액
 * @property {boolean} possible 실현 가능 여부
 */

/**
 * @param {FeasibilityParams} params
 * @returns {Promise<FeasibilityResponse>}
 */
export async function getFeasibility(params) {
  const { data } = await client.get('/goals/feasibility', { params })
  return data
}

// 계좌 목록 조회 API (GOAL-04: 출금계좌 선택 / 기존 저축계좌 연결)
/**
 * @typedef {Object} AccountItem
 * @property {number} accountId
 * @property {string} institutionName
 * @property {'CHECKING' | 'SAVING' | 'DEPOSIT'} accountType
 * @property {string} accountName
 * @property {string} maskedAccountNumber
 * @property {number} balance
 * @property {number | null} interestRate
 */

/**
 * @param {{ accountType?: 'CHECKING' | 'SAVING' | 'DEPOSIT' }} [params]
 * @returns {Promise<{ totalBalance: number, accounts: AccountItem[] }>}
 */
export async function getAccounts(params) {
  const { data } = await client.get('/accounts', { params })
  return data
}

// 저금통 개설 API (GOAL-04)
/**
 * @typedef {Object} MoneyBoxPayload
 * @property {'GOAL' | 'AUTO_SAVING'} type
 * @property {string} name
 * @property {{ amount: number, transferDay: number, withdrawalAccountId: number }} autoTransfer
 */

/**
 * @typedef {Object} MoneyBoxResponse
 * @property {number} moneyBoxId
 * @property {number} userId
 * @property {string} type
 * @property {number} balance
 * @property {string} maskedAccountNumber
 * @property {string} createdAt
 * @property {'MONEY_BOX'} assetType
 */

/**
 * @param {MoneyBoxPayload} payload
 * @returns {Promise<MoneyBoxResponse>}
 */
export async function createMoneyBox(payload) {
  const { data } = await client.post('/money-boxes', payload)
  return data
}

// 목표 목록 조회 API
/**
 * @typedef {Object} GoalListItem
 * @property {number} goalId
 * @property {string} goalName
 * @property {string} goalType
 * @property {number} progressRate
 * @property {string} status
 */

/**
 * @returns {Promise<GoalListItem[]>}
 */
export async function getGoals() {
  const { data } = await client.get('/goals')
  return data.goals
}

// 목표 상세 조회 API
/**
 * @typedef {Object} GoalDetail
 * @property {number} goalId
 * @property {string} goalType
 * @property {string} goalName
 * @property {number} goalAmount
 * @property {number} currentAmount
 * @property {number} startAmount
 * @property {number} progressRate
 * @property {{ goalMonths: number, startDate: string, endDate: string, remainMonths: number }} period
 * @property {'ACTIVE' | 'PAUSE' | 'COMPLETED'} status
 * @property {{ expectedAmount: number, differenceAmount: number, paceStatus: 'AHEAD' | 'ON_TRACK' | 'BEHIND' }} pace
 */

/**
 * @param {number} goalId
 * @returns {Promise<GoalDetail>}
 */
export async function getGoalDetail(goalId) {
  const { data } = await client.get(`/goals/${goalId}`)
  return data
}

// 연결 자산 조회 API
/**
 * @typedef {Object} GoalAsset
 * @property {'MONEY_BOX' | 'ACCOUNT' | 'LOAN'} assetType
 * @property {number} assetId
 * @property {string} assetName
 * @property {string} bankName
 * @property {string} accountNumberMasked
 * @property {number | null} balance
 * @property {{ interestRate: number, maturityDate: string } | null} assetDetail
 * @property {{ amount: number, transferDay: number, withdrawalAccount: { bankName: string, accountNumberMasked: string } | null }} autoTransfer
 */

/**
 * @param {number} goalId
 * @returns {Promise<GoalAsset[]>}
 */
export async function getGoalAssets(goalId) {
  const { data } = await client.get(`/goals/${goalId}/assets`)
  return data.assets
}

// 여유자금 조회 API
/**
 * @param {number} goalId
 * @returns {Promise<AvailableMoney>}
 */
export async function getAvailableMoney(goalId) {
  const { data } = await client.get(`/goals/${goalId}/available-money`)
  return data
}

/**
 * @param {number} goalId
 * @param {'ACTIVE' | 'PAUSE'} status
 * @returns {Promise<{ goalId: number, status: string, changedAt: string }>}
 */
export async function updateGoalStatus(goalId, status) {
  const { data } = await client.patch(`/goals/${goalId}/status`, { status })
  return data
}
