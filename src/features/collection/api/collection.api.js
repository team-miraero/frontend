// collection 도메인 API 함수 (COLL-01~02)

/**
 * @typedef {Object} CollectionStatus
 * @property {string} goalId
 * @property {number} collectedAmount
 * @property {number} targetAmount
 */

/**
 * @typedef {Object} AchievedGoal
 * @property {number | string} id
 * @property {string} title
 * @property {number} achievedAmount
 * @property {string} achievedDate
 * @property {string} accountName
 * @property {string} badgeIcon
 * @property {number} progress
 * @property {'INDEPENDENCE' | 'EMERGENCY' | 'MARRIAGE' | 'LOAN'} [goalType]
 */

/**
 * @param {string} goalId
 * @returns {Promise<CollectionStatus>}
 */
export async function getCollectionStatus(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/goals/${goalId}/collection`)로 교체
  return { goalId: goalId ?? '', collectedAmount: 0, targetAmount: 0 }
}

/**
 * @param {{ goalId: string, amount: number }} payload
 * @returns {Promise<void>}
 */
export async function addManualDeposit(payload) {
  // TODO: 실제 API 연동 시 client.post(`/goals/${payload?.goalId}/collection/deposit`, payload)로 교체
}

/**
 * 달성한 목표 목록 조회 (Mock API)
 * @returns {Promise<AchievedGoal[]>}
 */
export async function getAchievedGoals() {
  return Promise.resolve([
    {
      id: 1,
      title: '유럽 여행자금',
      achievedAmount: 3000000,
      achievedDate: '2026.07',
      accountName: '미래로 저금통',
      badgeIcon: '✈️',
      progress: 100,
      goalType: 'INDEPENDENCE',
    },
    {
      id: 2,
      title: '비상금 500만원 모으기',
      achievedAmount: 5000000,
      achievedDate: '2026.05',
      accountName: 'KB 국민은행 입출금',
      badgeIcon: '💰',
      progress: 100,
      goalType: 'EMERGENCY',
    },
    {
      id: 3,
      title: '학자금 대출 1차 원금 완제',
      achievedAmount: 2500000,
      achievedDate: '2026.03',
      accountName: 'KB 독립적금',
      badgeIcon: '🎓',
      progress: 100,
      goalType: 'LOAN',
    },
  ])
}
