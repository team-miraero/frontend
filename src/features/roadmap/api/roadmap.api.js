// roadmap 도메인 API 함수 골격: 목표 마일스톤 (/api/goals/{goalId}/milestones)
import { client } from '@/shared/api/client'
import { unwrapApiData } from '@/shared/api/unwrapApiData'
/**
 * @typedef {Object} MilestoneResponse
 * @property {number} step
 * @property {number} percentage
 * @property {number} milestoneAmount
 * @property {boolean} achieved
 * @property {string | null} achievedAt
 * @property {{ title?: string } | null} report
 */

/**
 * @param {number} goalId
 * @returns {Promise<Milestone[]>}
 */

export async function getMilestones(goalId) {
  const { data: responseBody } = await client.get(`/goals/${goalId}/milestones`)
  const data = unwrapApiData(responseBody)
  return mapMilestoneResponses(data.milestones)
}

/**
 * Swagger DTO를 기존 로드맵 컴포넌트가 사용하는 화면 모델로 변환한다.
 * 완료되지 않은 첫 단계만 현재 진행 단계이며, 나머지는 예정 단계다.
 * @param {MilestoneResponse[]} milestones
 */
export function mapMilestoneResponses(milestones) {
  const sorted = [...milestones].sort((a, b) => a.step - b.step)
  const currentStep = sorted.find((milestone) => !milestone.achieved)?.step ?? null

  return sorted.map((milestone) => ({
    milestoneId: milestone.step,
    order: milestone.step,
    targetAmount: milestone.milestoneAmount,
    targetDate: milestone.achievedAt ? milestone.achievedAt.slice(0, 10) : null,
    title: milestone.report?.title ?? '',
    tags: [],
    status: milestone.achieved
      ? 'COMPLETED'
      : milestone.step === currentStep
        ? 'IN_PROGRESS'
        : 'UPCOMING',
    percentage: milestone.percentage,
  }))
}
