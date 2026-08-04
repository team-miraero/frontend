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
 * @property {number} [assetId] 연결할 자산 ID
 * @property {'MONEY_BOX' | 'ACCOUNT' | 'LOAN'} assetType
 */

/**
 * @typedef {Object} CreateGoalPayload
 * @property {string} [goalName] 목표명
 * @property {'INDEPENDENCE' | 'EMERGENCY' | 'WEDDING' | 'LOAN'} goalType
 * @property {number} goalAmount 목표 금액
 * @property {number} goalMonths 목표 기간(개월)
 * @property {number} startAmount 목표 시작 금액
 * @property {GoalAssetInput[]} assets 연결할 자산 목록
 */

/**
 * @param {CreateGoalPayload} payload
 * @returns {Promise<{ goalId: number }>}
 */
export async function createGoal(payload) {
  try {
    const { data: responseBody } = await client.post('/goals', payload)
    const unwrapped = unwrapApiData(responseBody)
    return unwrapped && unwrapped.goalId ? unwrapped : { goalId: 1 }
  } catch (err) {
    console.warn('API createGoal failed, using fallback goalId:', err)
    return { goalId: 1 }
  }
}

/**
 * @typedef {Object} FeasibilityParams
 * @property {number} goalAmount 목표금액
 * @property {number} goalMonths 목표 개월수
 * @property {number} startAmount 이미 모아둔 금액
 * @property {boolean} [isStudentLoan] 학자금 대출 여부
 */

/**
 * @typedef {Object} FeasibilityResponse
 * @property {number} requiredMonthly 월 저축·상환 여력에 필요한 금액
 * @property {number} availableMonthly 월 저축·상환 가능 금액
 * @property {boolean} possible 실현 가능 여부
 */

const FALLBACK_ACCOUNTS = [
  {
    accountId: 1,
    institutionName: 'KB국민은행',
    accountType: 'CHECKING',
    accountName: 'KB 국민은행 입출금',
    maskedAccountNumber: '···2291',
    balance: 1250000,
    interestRate: null,
  },
  {
    accountId: 2,
    institutionName: 'NH농협은행',
    accountType: 'CHECKING',
    accountName: 'NH 농협은행 입출금',
    maskedAccountNumber: '···5548',
    balance: 320000,
    interestRate: null,
  },
  {
    accountId: 3,
    institutionName: 'KB국민은행',
    accountType: 'SAVING',
    accountName: 'KB 스타적금',
    maskedAccountNumber: '···3821',
    balance: 640000,
    interestRate: 4.5,
  },
  {
    accountId: 4,
    institutionName: '카카오뱅크',
    accountType: 'SAVING',
    accountName: '카카오뱅크 적금',
    maskedAccountNumber: '···0047',
    balance: 1200000,
    interestRate: 3.8,
  },
  {
    accountId: 5,
    institutionName: '토스뱅크',
    accountType: 'SAVING',
    accountName: '토스뱅크 저금통',
    maskedAccountNumber: '···7193',
    balance: 320000,
    interestRate: 2.3,
  },
  {
    accountId: 6,
    institutionName: 'KB국민은행',
    accountType: 'SAVING',
    accountName: 'KB 독립적금',
    maskedAccountNumber: '***456',
    balance: 3000000,
    interestRate: 3.5,
  },
  {
    accountId: 7,
    institutionName: 'KB국민은행',
    accountType: 'DEPOSIT',
    accountName: 'KB Star 정기예금',
    maskedAccountNumber: '***7890',
    balance: 5000000,
    interestRate: 3.5,
  },
]

/**
 * @param {FeasibilityParams} params
 * @returns {Promise<FeasibilityResponse>}
 */
export async function getFeasibility(params) {
  try {
    const { data } = await client.post('/goals/possibility', params)
    return data
  } catch (err) {
    const amount = Number(params?.goalAmount) || 12400000
    const months = Number(params?.goalMonths) || 24
    const start = Number(params?.startAmount) || 0
    const isLoan = params?.isStudentLoan
    let req = 0
    if (isLoan) {
      const monthlyRate = 0.017 / 12
      const compound = Math.pow(1 + monthlyRate, months)
      req = Math.round((amount * monthlyRate * compound) / (compound - 1)) || 525866
    } else {
      req = Math.max(0, Math.round((amount - start) / months)) || 416666
    }

    return {
      requiredMonthly: req,
      availableMonthly: 620000,
      possible: req <= 620000,
    }
  }
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
  try {
    const { data: responseBody } = await client.get('/accounts', { params })
    const data = unwrapApiData(responseBody)

    if (data && Array.isArray(data.accounts) && data.accounts.length > 0) {
      return data
    }
  } catch (err) {
    console.warn('API getAccounts failed, using fallback mock accounts:', err)
  }

  // Fail-safe Fallback
  const filtered = params?.accountType
    ? FALLBACK_ACCOUNTS.filter((acc) => acc.accountType === params.accountType)
    : FALLBACK_ACCOUNTS

  return {
    totalBalance: filtered.reduce((sum, acc) => sum + acc.balance, 0),
    accounts: filtered,
  }
}

// 저금통 개설 API (GOAL-04)
/**
 * @typedef {Object} MoneyBoxPayload
 * @property {'GOAL' | 'SAVING'} type
 * @property {string} name
 * @property {number} amount 자동이체 금액
 * @property {number} transferDay 자동이체 날짜
 * @property {number} withdrawalAccountId 출금 계좌 ID
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
  try {
    const { data } = await client.post('/moneyBoxes', payload)
    return data
  } catch {
    return { moneyBoxId: 101, userId: 1, type: payload.type, balance: 0 }
  }
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
 * @property {'ACTIVE' | 'PAUSE' | 'PAUSED' | 'COMPLETED'} status
 * @property {{ expectedAmount: number, differenceAmount: number, paceStatus: 'AHEAD' | 'ON_TRACK' | 'BEHIND' }} pace
 */

const DEFAULT_GOAL_DETAIL = {
  goalId: 1,
  goalType: 'INDEPENDENCE',
  goalName: '독립 자금',
  goalAmount: 30000000,
  startAmount: 0,
  currentAmount: 11500000,
  progressRate: 38.0,
  period: {
    goalMonths: 10,
    startDate: '2026-06',
    endDate: '2028-03',
    remainMonths: 9,
  },
  status: 'ACTIVE',
  pace: {
    expectedAmount: 10810000,
    differenceAmount: 690000,
    paceStatus: 'AHEAD',
  },
}

const DEFAULT_GOAL_ASSETS = [
  {
    assetType: 'MONEY_BOX',
    assetId: 1,
    assetName: '미래로 저금통',
    bankName: 'KB국민',
    accountNumberMasked: '***123',
    balance: 8500000,
    assetDetail: null,
    autoTransfer: {
      amount: 250000,
      transferDay: 10,
      withdrawalAccount: {
        bankName: 'KB국민',
        accountNumberMasked: '***789',
      },
    },
  },
  {
    assetType: 'ACCOUNT',
    assetId: 2,
    assetName: 'KB 독립적금',
    bankName: 'KB국민',
    accountNumberMasked: '***456',
    balance: 3500000,
    assetDetail: {
      interestRate: 4.5,
      maturityDate: '2028-03-15',
    },
    autoTransfer: {
      amount: 100000,
      transferDay: 10,
      withdrawalAccount: {
        bankName: 'KB국민',
        accountNumberMasked: '***789',
      },
    },
  },
]

/**
 * @param {number} goalId
 * @returns {Promise<GoalDetail>}
 */
export async function getGoalDetail(goalId) {
  try {
    const { data: responseBody } = await client.get(`/goals/${goalId}`)
    const unwrapped = unwrapApiData(responseBody)
    if (unwrapped && (unwrapped.goalId || unwrapped.goalName)) {
      return { ...DEFAULT_GOAL_DETAIL, ...unwrapped, goalId: Number(goalId) || unwrapped.goalId || 1 }
    }
  } catch (err) {
    console.warn('API getGoalDetail failed, using fallback:', err)
  }
  return { ...DEFAULT_GOAL_DETAIL, goalId: Number(goalId) || 1 }
}

/**
 * @typedef {Object} UpdateGoalPayload
 * @property {string} goalDate 목표일(YYYY-MM-DD)
 * @property {number} goalAmount 목표 금액
 * @property {'ACTIVE' | 'PAUSED'} status 목표 상태
 */

/**
 * 목표 금액·목표일·상태를 간단 수정한다.
 * @param {number} goalId
 * @param {UpdateGoalPayload} payload
 * @returns {Promise<{ goalId: number }>}
 */
export async function updateGoal(goalId, payload) {
  const { data } = await client.patch(`/goals/${goalId}`, payload)
  return data
}
/**
 * 자산 연결 API (POST /goals/{goalId}/assets)
 * @param {number} goalId
 * @param {GoalAssetInput[]} assets
 * @returns {Promise<{ success: boolean }>}
 */
export async function linkAssetsToGoal(goalId, assets) {
  try {
    const { data: responseBody } = await client.post(`/goals/${goalId}/assets`, { assets })
    const unwrapped = unwrapApiData(responseBody)
    return unwrapped ?? { success: true }
  } catch (err) {
    console.warn('API linkAssetsToGoal failed, using fallback:', err)
    return { success: true }
  }
}

/**
 * @param {number} goalId
 * @returns {Promise<GoalAsset[]>}
 */
export async function getGoalAssets(goalId) {
  try {
    const { data: responseBody } = await client.get(`/goals/${goalId}/assets`)
    const unwrapped = unwrapApiData(responseBody)
    const list = unwrapped?.assets ?? (Array.isArray(unwrapped) ? unwrapped : null)
    if (list && Array.isArray(list) && list.length > 0) {
      return list
    }
  } catch (err) {
    console.warn('API getGoalAssets failed, using fallback:', err)
  }
  return DEFAULT_GOAL_ASSETS
}

/**
 * @typedef {Object} LinkedGoalAsset
 * @property {'MONEY_BOX' | 'ACCOUNT'} assetType
 * @property {number} assetId
 * @property {string} assetName
 * @property {string | null} institutionName
 * @property {string | null} maskedAccountNumber
 * @property {number} balance
 * @property {number | null} interestRate
 */

/**
 * @typedef {Object} LinkedGoalAssets
 * @property {number} goalId
 * @property {number} totalLinkedBalance
 * @property {LinkedGoalAsset[]} linkedAssets
 */

function unwrapApiData(responseBody) {
  if (
    responseBody &&
    typeof responseBody === 'object' &&
    Object.hasOwn(responseBody, 'success') &&
    Object.hasOwn(responseBody, 'data')
  ) {
    if (!responseBody.success) {
      throw new Error(responseBody.error?.message ?? 'API 요청에 실패했습니다.')
    }
    return responseBody.data
  }

  return responseBody
}

/**
 * 상품 추천 화면용 목표 연결 자산 조회
 *
 * @param {number} goalId
 * @returns {Promise<LinkedGoalAssets>}
 */
export async function getGoalLinkedAssets(goalId) {
  const { data: responseBody } = await client.get(`/goals/${goalId}/linked-assets`)
  const data = unwrapApiData(responseBody)

  if (!data || !Array.isArray(data.linkedAssets)) {
    throw new TypeError('연결 자산 API 응답 형식이 올바르지 않습니다.')
  }

  return data
}

/**
 * @typedef {Object} AvailableMoneyBreakdown
 * @property {number} income
 * @property {number} fixedExpense
 * @property {number} targetGoalAutoTransfer
 * @property {number} otherGoalAutoTransfer
 * @property {number} variableExpense
 * @property {number} availableMoney
 */

// 월 여유자금 조회 API
/**
 * @param {number} goalId
 * @returns {Promise<AvailableMoneyBreakdown>}
 */
export async function getMonthlyAvailableMoney(goalId) {
  const { data } = await client.get(`/goals/${goalId}/monthly-available`)
  return data.monthly
}

// 일 여유자금 조회 API
/**
 * @param {number} goalId
 * @returns {Promise<AvailableMoneyBreakdown>}
 */
export async function getDailyAvailableMoney(goalId) {
  const { data } = await client.get(`/goals/${goalId}/daily-available`)
  return data.daily
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
