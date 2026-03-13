import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Bot,
  Coins,
  Keyboard,
  MessageSquareMore,
  MicOff,
  Phone,
  PhoneOff,
  Search,
  Settings,
  Users,
  Volume2,
  Wallet,
} from 'lucide-react'

const mockChats = [
  { id: 'c1', name: 'Sarah Chen', preview: 'Hey, free for a quick catch-up call?', time: '2:35 PM', unread: 1, online: true, isAgent: false },
  { id: 'c2', name: 'Data Collection Bot', preview: 'Ready for your next practice session!', time: '2:30 PM', unread: 3, online: true, isAgent: true },
]

const initialMessages = {
  c1: [
    { id: 1, role: 'received', text: 'Hey! Are you free for a call? I wanted to catch up about the weekend trip 🏔️', time: '2:34 PM' },
    { id: 2, role: 'sent', text: 'Yes! Let me call you now 😊', time: '2:35 PM' },
  ],
  c2: [{ id: 1, role: 'received', text: 'I can help with natural conversation prompts. Want to start with a quick game?', time: '2:30 PM' }],
}

const scoreConfig = {
  baseRate: 10,
  minMultiplier: 0,
  maxMultiplier: 2.5,
}

function computeEarnings(rating) {
  const multiplier = Math.max(scoreConfig.minMultiplier, Math.min(scoreConfig.maxMultiplier, rating / 2.5))
  return (scoreConfig.baseRate * multiplier).toFixed(2)
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeChatId, setActiveChatId] = useState('c1')
  const [messages, setMessages] = useState(initialMessages)
  const [showInput, setShowInput] = useState(false)
  const [draft, setDraft] = useState('')
  const [callSeconds, setCallSeconds] = useState(272)

  const activeChat = useMemo(() => mockChats.find((c) => c.id === activeChatId) ?? mockChats[0], [activeChatId])
  const chatMessages = messages[activeChat.id] || []

  const addMessage = (msg) => {
    setMessages((prev) => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] || []), msg] }))
  }

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return

    addMessage({ id: Date.now(), role: 'sent', text, time: 'Now' })
    setDraft('')

    if (activeChat.isAgent) {
      setTimeout(() => {
        addMessage({ id: Date.now() + 1, role: 'received', text: '🎙️ Agent audio response generated based on your message.', time: 'Now' })
      }, 500)
    }
  }

  const startCall = () => setScreen('call')

  const endCall = () => {
    setScreen('chat')
    const postCall = {
      id: Date.now(),
      role: 'system',
      summary: 'You discussed weekend plans and travel logistics. Tone was natural and collaborative. Audio quality: high.',
      earned: '$1.09',
      quality: 'High quality',
    }
    addMessage(postCall)
  }

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <HomeScreen
          onOpenChat={(id) => {
            setActiveChatId(id)
            setScreen('chat')
          }}
          onOpenEarnings={() => setScreen('earnings')}
        />
      )}

      {screen === 'chat' && (
        <ChatScreen
          chat={activeChat}
          messages={chatMessages}
          showInput={showInput}
          draft={draft}
          setDraft={setDraft}
          onToggleInput={() => setShowInput((v) => !v)}
          onSend={sendMessage}
          onBack={() => setScreen('home')}
          onStartCall={startCall}
          onStarter={() => addMessage({ id: Date.now(), role: 'received', text: 'Try this: “2 truths and a lie” about your last week.', time: 'Now' })}
        />
      )}

      {screen === 'call' && <CallScreen name={activeChat.name} seconds={callSeconds} onEnd={endCall} onBack={() => setScreen('chat')} />}

      {screen === 'earnings' && <EarningsScreen onBack={() => setScreen('home')} />}
    </div>
  )
}

function HomeScreen({ onOpenChat, onOpenEarnings }) {
  return (
    <section className="screen">
      <header className="header">
        <h1>Messages</h1>
        <div className="icon-row"><Search size={22} /><Settings size={22} /></div>
      </header>

      <div className="content px5 space-y">
        <button className="agent-cta" onClick={() => onOpenChat('c2')}>
          <span className="agent-icon"><Bot size={20} /></span>
          <span><b>Start Chat with AI Agent</b><small>Earn from natural conversations</small></span>
        </button>

        <div className="search-pill"><Search size={18} /> Search conversations...</div>

        {mockChats.map((chat) => (
          <button key={chat.id} className="chat-card" onClick={() => onOpenChat(chat.id)}>
            <div className="avatar">{chat.isAgent ? <Bot size={20} /> : chat.name.slice(0, 2)}</div>
            <div className="grow">
              <div className="between"><strong>{chat.name}</strong><small>{chat.time}</small></div>
              <p>{chat.preview}</p>
            </div>
            <span className="badge">{chat.unread}</span>
          </button>
        ))}
      </div>

      <footer className="bottom-nav">
        <button className="active"><MessageSquareMore size={22} /><span>Chats</span></button>
        <button><Users size={22} /><span>Contacts</span></button>
        <button onClick={onOpenEarnings}><Wallet size={22} /><span>Earnings</span></button>
        <button><Settings size={22} /><span>Profile</span></button>
      </footer>
    </section>
  )
}

function ChatScreen({ chat, messages, showInput, draft, setDraft, onToggleInput, onSend, onBack, onStartCall, onStarter }) {
  return (
    <section className="screen">
      <header className="chat-header">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={22} /></button>
        <div><h2>{chat.name}</h2><p>{chat.isAgent ? 'AI Agent • voice-first' : 'Online'}</p></div>
      </header>

      <div className="thread">
        <div className="date-pill">Today</div>
        {messages.map((m) => {
          if (m.role === 'system') {
            return (
              <article key={m.id} className="summary-card">
                <p className="title">✦ AI Conversation Summary</p>
                <p>{m.summary}</p>
                <div className="chips"><span>✓ {m.quality}</span><span>⛁ {m.earned} earned</span></div>
                <button>Approve for Training Data</button>
              </article>
            )
          }

          return (
            <article key={m.id} className={`bubble ${m.role === 'sent' ? 'sent' : 'received'}`}>
              <p>{m.text}</p>
              <small>{m.time}</small>
            </article>
          )
        })}
      </div>

      <div className="controls px5">
        <button className="starter" onClick={onStarter}>Need help getting started? Try a conversation game.</button>

        {showInput && (
          <div className="input-wrap">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..." />
            <button onClick={onSend}>Send</button>
          </div>
        )}

        <div className="call-row">
          <button className="call-btn" onClick={onStartCall}><Phone size={20} /> Start Call</button>
          <button className="kbd-btn" onClick={onToggleInput}><Keyboard size={20} /></button>
        </div>
      </div>
    </section>
  )
}

function CallScreen({ name, seconds, onEnd, onBack }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return (
    <section className="screen call-screen">
      <button className="back-lite" onClick={onBack}><ArrowLeft size={20} /></button>
      <div className="call-center">
        <div className="ring" />
        <h2>{name}</h2>
        <p>{mm}:{ss}</p>
        <div className="call-pill"><span className="dot" /> Recording for training data</div>
        <div className="call-pill"><Coins size={16} /> Earning $14.50/hr</div>
      </div>
      <div className="call-controls">
        <button><MicOff size={20} /><span>Mute</span></button>
        <button className="end" onClick={onEnd}><PhoneOff size={24} /></button>
        <button><Volume2 size={20} /><span>Speaker</span></button>
      </div>
    </section>
  )
}

function EarningsScreen({ onBack }) {
  const rating = 4.2
  return (
    <section className="screen">
      <header className="chat-header">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={22} /></button>
        <div><h2>Earnings</h2></div>
      </header>

      <div className="content px5 space-y">
        <article className="panel center"><p className="stars">★★★★☆</p><h3>{rating}</h3><p>47 verified submissions</p></article>
        <article className="panel dark"><h3>${computeEarnings(rating)}/hr</h3><p>Current earning rate</p></article>
        <article className="panel"><h4>How it works</h4><p>Base is $10/hr. Higher verified quality raises your star score and multiplier. Repeated unusable submissions can reduce rate to $0/hr.</p></article>
      </div>
    </section>
  )
}
