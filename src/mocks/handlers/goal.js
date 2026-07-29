// goal 관련 MSW 핸들러 샘플 (마이데이터 mock 포함)
import { http, HttpResponse } from 'msw'
import mydata from '@/mocks/fixtures/mydata.json'

export const goalHandlers = [
  http.post('*/api/goals', async () => {
    return HttpResponse.json({ id: 'g1' }, { status: 201 })
  }),

  http.get('*/api/goals/:goalId/feasibility', async () => {
    return HttpResponse.json({ result: '현실적' })
  }),

  http.get('*/api/mydata', async () => {
    return HttpResponse.json(mydata)
  }),

  // 메인 대시보드용 mock 호출 핸들러
  http.get('*/api/goals', async () => {
    return HttpResponse.json({
      goals: [
        {
          goalId: 1,
          goalName: '독립 자금',
          goalType: 'INDEPENDENCE',
          progressRate: 42.0,
          status: 'ACTIVE',
        },
        {
          goalId: 2,
          goalName: '학자금 대출 상환',
          goalType: 'LOAN',
          progressRate: 45.0,
          status: 'ACTIVE',
        },
        {
          goalId: 3,
          goalName: '결혼 자금',
          goalType: 'WEDDING',
          progressRate: 20.0,
          status: 'ACTIVE',
        },
      ],
    })
  }),

  http.get('*/api/goals/:goalId', async ({ params }) => {
    return HttpResponse.json({
      goalId: Number(params.goalId),
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
        paceStatus: 'AHEAD', // 'AHEAD' | 'ON_TRACK' | 'BEHIND'로 바꿔가며 배너 색상 확인 가능
      },
    })
  }),

  http.get('*/api/goals/:goalId/assets', async ({ params }) => {
    if (params.goalId === '3') {
      return HttpResponse.json({
        assets: [
          {
            assetType: 'ACCOUNT',
            assetId: 4,
            assetName: '카카오뱅크 결혼자금통',
            bankName: '카카오뱅크',
            accountNumberMasked: '***7890',
            balance: 5000000,
            assetDetail: { interestRate: 3.5, maturityDate: '2027-12-31' },
            autoTransfer: {
              amount: 150000,
              transferDay: 15,
              withdrawalAccount: { bankName: 'KB국민', accountNumberMasked: '***789' },
            },
          },
        ],
      })
    }

    if (params.goalId === '2') {
      return HttpResponse.json({
        assets: [
          {
            assetType: 'LOAN',
            assetId: 3,
            assetName: '학자금 대출',
            bankName: 'KB국민',
            accountNumberMasked: '***321',
            balance: null,
            assetDetail: { interestRate: 3.0, maturityDate: '2026-08-25' },
            autoTransfer: {
              amount: 1000000,
              transferDay: 10,
              withdrawalAccount: { bankName: 'KB국민', accountNumberMasked: '***789' },
            },
          },
        ],
      })
    }

    return HttpResponse.json({
      assets: [
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
            withdrawalAccount: { bankName: 'KB국민', accountNumberMasked: '***789' },
          },
        },
        {
          assetType: 'ACCOUNT',
          assetId: 2,
          assetName: 'IBK기업은행 독립자금계좌',
          bankName: 'IBK기업은행',
          accountNumberMasked: '***9012',
          balance: 3500000,
          assetDetail: { interestRate: 4.5, maturityDate: '2028-03-15' },
          autoTransfer: {
            amount: 100000,
            transferDay: 10,
            withdrawalAccount: { bankName: 'KB국민', accountNumberMasked: '***789' },
          },
        },
      ],
    })
  }),

  http.get('*/api/goals/:goalId/available-money', async () => {
    return HttpResponse.json({
      availableMoney: 350000,
      monthlyIncome: 2800000,
      targetGoalAutoTransfer: 300000,
      otherGoalAutoTransfer: 300000,
      fixedExpense: 900000,
      variableExpense: 950000,
    })
  }),

  http.get('*/api/goals/:goalId/milestones', async () => {
    return HttpResponse.json({
      milestones: [
        {
          milestoneId: 1,
          order: 1,
          targetAmount: 7500000,
          targetDate: '2026-06',
          title: '첫 목돈 750만원 달성',
          tags: ['비상금 완성', '목돈 보유'],
          status: 'COMPLETED',
        },
        {
          milestoneId: 2,
          order: 2,
          targetAmount: 15000000,
          targetDate: '2027-01',
          title: '중간 목표 1,500만원 달성',
          tags: ['전세 탐색', '대출 준비'],
          status: 'IN_PROGRESS',
        },
        {
          milestoneId: 3,
          order: 3,
          targetAmount: 22500000,
          targetDate: '2027-09',
          title: '전세 준비금 2,250만원 달성',
          tags: ['대출 최소화', '청약 가점'],
          status: 'UPCOMING',
        },
        {
          milestoneId: 4,
          order: 4,
          targetAmount: 30000000,
          targetDate: '2028-03',
          title: '독립자금 3,000만원 완성 🏠',
          tags: ['독립 가능', '자산 성장'],
          status: 'UPCOMING',
        },
      ],
    })
  }),

  http.patch('*/api/goals/:goalId/status', async ({ params, request }) => {
    const { status } = await request.json()
    return HttpResponse.json({
      goalId: Number(params.goalId),
      status,
      changedAt: new Date().toISOString().slice(0, 19),
    })
  }),
]
