import { chats, earnings, messagesByChat } from './mocks/data'

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms))

async function safeFetch(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    return null
  }
}

export async function getChats() {
  const remote = await safeFetch('/api/chats')
  if (remote) return remote
  await delay()
  return chats
}

export async function getMessages(chatId) {
  const remote = await safeFetch(`/api/chats/${chatId}/messages`)
  if (remote) return remote
  await delay()
  return messagesByChat[chatId] || []
}

export async function getEarnings() {
  const remote = await safeFetch('/api/earnings')
  if (remote) return remote
  await delay()
  return earnings
}
