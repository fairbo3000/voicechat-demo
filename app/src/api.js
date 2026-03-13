import { chats, earnings, messagesByChat } from './mocks/data'

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms))
const USE_REMOTE_MOCK_ENDPOINTS = import.meta.env.DEV

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function getChats() {
  if (!USE_REMOTE_MOCK_ENDPOINTS) {
    await delay()
    return chats
  }
  return fetchJson('/api/chats')
}

export async function getMessages(chatId) {
  if (!USE_REMOTE_MOCK_ENDPOINTS) {
    await delay()
    return messagesByChat[chatId] || []
  }
  return fetchJson(`/api/chats/${chatId}/messages`)
}

export async function getEarnings() {
  if (!USE_REMOTE_MOCK_ENDPOINTS) {
    await delay()
    return earnings
  }
  return fetchJson('/api/earnings')
}
