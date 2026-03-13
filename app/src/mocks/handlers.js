import { http, HttpResponse } from 'msw'
import { chats, messagesByChat, earnings } from './data'

export const handlers = [
  http.get('/api/chats', () => HttpResponse.json(chats)),
  http.get('/api/chats/:id/messages', ({ params }) => {
    const list = messagesByChat[params.id] || []
    return HttpResponse.json(list)
  }),
  http.get('/api/earnings', () => HttpResponse.json(earnings)),
]
