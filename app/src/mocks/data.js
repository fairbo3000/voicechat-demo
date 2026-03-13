export const chats = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    preview: 'Hey, free for a quick catch-up call?',
    time: '2:35 PM',
    unread: 1,
    online: true,
    isAgent: false,
    earningHint: '$14.50/hr',
  },
  {
    id: 'c2',
    name: 'Data Collection Bot',
    preview: 'Ready for your next practice session!',
    time: '2:30 PM',
    unread: 3,
    online: true,
    isAgent: true,
    earningHint: '$10.00/hr',
  },
  {
    id: 'c3',
    name: 'Miguel Ortiz',
    preview: 'Let’s do another conversation challenge later.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    isAgent: false,
    earningHint: '$12.20/hr',
  },
]

export const messagesByChat = {
  c1: [
    { id: 1, role: 'received', text: 'Hey! Are you free for a call? I wanted to catch up about the weekend trip 🏔️', time: '2:34 PM' },
    { id: 2, role: 'sent', text: 'Yes! Let me call you now 😊', time: '2:35 PM' },
    { id: 3, role: 'call_event', text: 'Voice call · 4m 32s · 2:39 PM' },
    {
      id: 4,
      role: 'system',
      summary:
        'You and Sarah discussed weekend hiking plans at Mount Tamalpais. Key points: meeting Saturday at 9am, Sarah will bring trail snacks, and you will handle transportation. Both were excited about the waterfall route.',
      earned: '$1.09',
      quality: 'High quality',
    },
  ],
  c2: [
    { id: 1, role: 'received', text: 'I can help with natural conversation prompts. Want to start with a quick game?', time: '2:30 PM' },
    { id: 2, role: 'received', text: 'Try: describe your day using only movie titles.', time: '2:31 PM' },
  ],
  c3: [{ id: 1, role: 'received', text: 'Ping me when you want to record another sample.', time: 'Yesterday' }],
}

export const earnings = {
  rating: 4.2,
  verifiedSubmissions: 47,
  currentRate: 14.5,
  totalEarned: 842.5,
  weekEarned: 87,
  monthEarned: 342,
}
