// roadmap 도메인 API 함수 골격: 목표 마일스톤 (/api/goals/{goalId}/milestones)
import { client } from '@/shared/api/client'
/**
 * @typedef {Object} MileStone
 * @property {number} milestoneId
 * @property {number} order
 * @property {number} targetAmount
 * @property {string} targetDate 'yyyy-MM'
 * @property {string} title
 * @property {string[] | null} tags
 * @property {'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING'} status
 */

/**
 * @param {number} goalId
 * @returns {Promise<Milestone[]>}
 */

export async function getMilestones(goalId) {
  const { data } = await client.get(`/goals/${goalId}/milestones`)
  return data.milestones
}
