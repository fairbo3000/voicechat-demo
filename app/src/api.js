export async function getChats() {
  const res = await fetch('/api/chats')
  return res.json()
}

export async function getMessages(chatId) {
  const res = await fetch(`/api/chats/${chatId}/messages`)
  return res.json()
}

export async function getEarnings() {
  const res = await fetch('/api/earnings')
  return res.json()
}
