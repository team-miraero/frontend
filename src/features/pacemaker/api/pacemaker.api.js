// pacemaker 도메인 API 함수 골격: 자동저축(페이스메이커) 조회/토글
import { client } from '@/shared/api/client'
/**
 * @typedef {Object} PacemakerStatus
 * @property {number | null} autoSavingId
 * @property {boolean} registered
 * @property {'ACTIVE' | 'PAUSED' | null} status
 * @property {boolean} enabled
 * @property {number} monthlySecuredAmount 이번 달 자동 확보 금액
 * @property {number} balance 페이스메이커 저금통 잔액
 * @property {number} todayEarned 오늘 적립된 금액
 * @property {number} streakDays 연속 적립일
 * @property {number} dailyLimit 하루 자동저축 상한선
 */

/**
 * @returns {Promise<PacemakerStatus>}
 */
export async function getPacemakerStatus() {
  const { data } = await client.get('/pace-maker')
  return data
}

/**
 * @param {number} autoSavingId
 * @param {'ACTIVE' | 'PAUSED'} status
 * @returns {Promise<{ autoSavingId: number, status: string, changedAt: string }>}
 */
export async function updatePacemakerStatus(autoSavingId, status) {
  const { data } = await client.patch(`/pace-maker/${autoSavingId}/status`, { status })
  return data
}


// TODO: 최초 개설 POST API 명세 확정되면 registerPacemaker() 추가
