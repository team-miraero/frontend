// AI 목표 코치 대화방 관련 MSW 핸들러
import { http, HttpResponse } from 'msw'

let mockConversations = [
  {
    conversationId: 12,
    title: '독립자금 목표 상담',
    lastMessageAt: '2026-07-22T09:30:00',
    createdAt: '2026-07-20T14:20:00',
    updatedAt: '2026-07-22T09:30:00',
  },
  {
    conversationId: 8,
    title: '이번 달 소비 점검',
    lastMessageAt: '2026-07-19T18:15:00',
    createdAt: '2026-07-19T18:00:00',
    updatedAt: '2026-07-19T18:15:00',
  },
]

const mockMessagesByConversation = {
  12: [
    {
      messageId: 101,
      senderType: 'USER',
      content: '이번 달 소비가 목표에 얼마나 영향을 줄까?',
      createdAt: '2026-07-22T09:29:50',
    },
    {
      messageId: 102,
      senderType: 'ASSISTANT',
      content: '현재 소비 흐름이 유지되면 목표 달성이 약 한 달 늦어질 수 있어요.',
      createdAt: '2026-07-22T09:30:00',
    },
  ],
  8: [],
}

let nextConversationId = 13

export const coachHandlers = [
  http.post('*/api/ai-coach/conversations', async ({ request }) => {
    const url = new URL(request.url)
    const title = url.searchParams.get('title') ?? '새 대화'
    const now = new Date().toISOString()
    const conversation = {
      conversationId: nextConversationId++,
      title,
      lastMessageAt: null,
      createdAt: now,
      updatedAt: now,
    }
    mockConversations = [conversation, ...mockConversations]
    mockMessagesByConversation[conversation.conversationId] = []
    return HttpResponse.json({ success: true, data: conversation, error: null })
  }),

  http.get('*/api/ai-coach/conversations', async () => {
    return HttpResponse.json({
      success: true,
      data: { conversations: mockConversations },
      error: null,
    })
  }),

  http.get('*/api/ai-coach/conversations/:conversationId/messages', async ({ params }) => {
    const conversationId = Number(params.conversationId)
    const conversation = mockConversations.find((item) => item.conversationId === conversationId)
    return HttpResponse.json({
      success: true,
      data: {
        conversation,
        messages: mockMessagesByConversation[conversationId] ?? [],
      },
      error: null,
    })
  }),

  http.delete('*/api/ai-coach/conversations/:conversationId', async ({ params }) => {
    const conversationId = Number(params.conversationId)
    mockConversations = mockConversations.filter((item) => item.conversationId !== conversationId)
    delete mockMessagesByConversation[conversationId]
    return HttpResponse.json({ success: true, data: { conversationId }, error: null })
  }),
]
