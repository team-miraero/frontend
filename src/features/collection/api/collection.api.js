// collection 도메인 API 함수 (COLL-01~02)
import { client } from '@/shared/api/client'

/**
 * @typedef {Object} CollectionItemResponse
 * @property {number} goalId
 * @property {string} goalName
 * @property {'SAVE' | 'LOAN' | 'INDEPENDENCE' | 'EMERGENCY' | 'WEDDING'} goalType
 * @property {number} goalAmount
 * @property {string} completedDate
 */

/**
 * @typedef {Object} AchievedGoal
 * @property {number | string} id
 * @property {string} title
 * @property {number} achievedAmount
 * @property {string} achievedDate
 * @property {string} [accountName]
 * @property {string} [badgeIcon]
 * @property {number} [progress]
 * @property {'SAVE' | 'LOAN' | 'INDEPENDENCE' | 'EMERGENCY' | 'WEDDING'} [goalType]
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

function formatDateToDot(dateStr) {
  if (!dateStr) return '-'
  return String(dateStr).replace(/-/g, '.')
}

/**
 * 목표 컬렉션 조회 API (GET /api/goals/collection)
 * @returns {Promise<AchievedGoal[]>}
 */
export async function getAchievedGoals() {
  try {
    const { data: responseBody } = await client.get('/goals/collection')
    const data = unwrapApiData(responseBody)
    const rawList = data?.collections ?? (Array.isArray(data) ? data : [])

    return rawList.map((item) => ({
      id: item.goalId,
      title: item.goalName,
      goalType: item.goalType,
      achievedAmount: item.goalAmount,
      achievedDate: formatDateToDot(item.completedDate),
      accountName: item.accountName || '완주 저금통',
      progress: 100,
    }))
  } catch (error) {
    console.warn('[Collection API] 실제 서버 통신 대기 중 (Mock 데이터 폴백):', error)
    return [
      {
        id: 12,
        title: '유럽 여행',
        achievedAmount: 3000000,
        achievedDate: '2026.07.21',
        accountName: '미래로 저금통',
        progress: 100,
        goalType: 'SAVE',
      },
      {
        id: 8,
        title: '학자금 대출 상환',
        achievedAmount: 5000000,
        achievedDate: '2026.06.18',
        accountName: 'KB 독립적금',
        progress: 100,
        goalType: 'LOAN',
      },
    ]
  }
}

/**
 * @param {string} goalId
 * @returns {Promise<{ goalId: string, collectedAmount: number, targetAmount: number }>}
 */
export async function getCollectionStatus(goalId) {
  return { goalId: goalId ?? '', collectedAmount: 0, targetAmount: 0 }
}

/**
 * @param {{ goalId: string, amount: number }} payload
 * @returns {Promise<void>}
 */
export async function addManualDeposit(payload) {
  // 수동 입금 필요 시 구현
}
