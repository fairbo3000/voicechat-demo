import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Bot, Coins, Keyboard, MessageSquareMore, MicOff, Phone, PhoneOff, Search, Settings, Users, Volume2, Wallet,
} from 'lucide-react'
import { getChats, getEarnings, getMessages } from './api'

export default function App() {
  const [chats, setChats] = useState([])
  const [messagesByChat, setMessagesByChat] = useState({})
  const [earnings, setEarnings] = useState(null)

  useEffect(() => {
    getChats().then(setChats)
    getEarnings().then(setEarnings)
  }, [])

  const loadMessages = async (chatId) => {
    if (messagesByChat[chatId]) return
    const data = await getMessages(chatId)
    setMessagesByChat((prev) => ({ ...prev, [chatId]: data }))
  }

  const appendMessage = (chatId, message) => {
    setMessagesByChat((prev) => ({ ...prev, [chatId]: [...(prev[chatId] || []), message] }))
  }

  return (
    <Routes>
      <Route path="/" element={<HomeScreen chats={chats} />} />
      <Route path="/chat/:chatId" element={<ChatScreen chats={chats} messagesByChat={messagesByChat} loadMessages={loadMessages} appendMessage={appendMessage} />} />
      <Route path="/call/:chatId" element={<CallScreen chats={chats} appendMessage={appendMessage} />} />
      <Route path="/earnings" element={<EarningsScreen earnings={earnings} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function HomeScreen({ chats }) {
  const navigate = useNavigate()
  return (
    <section className="screen">
      <header className="header"><h1>Messages</h1><div className="icon-row"><Search size={22} /><Settings size={22} /></div></header>
      <div className="content px5 space-y">
        <button className="agent-cta" onClick={() => navigate('/chat/c2')}>
          <span className="agent-icon"><Bot size={20} /></span>
          <span><b>Start Chat with AI Agent</b><small>Earn from natural conversations</small></span>
        </button>
        <div className="search-pill"><Search size={18} /> Search conversations...</div>

        {chats.map((chat) => (
          <button key={chat.id} className="chat-card" onClick={() => navigate(`/chat/${chat.id}`)}>
            <div className="avatar">{chat.isAgent ? <Bot size={20} /> : chat.name.slice(0, 2)}</div>
            <div className="grow">
              <div className="between"><strong>{chat.name}</strong><small>{chat.time}</small></div>
              <p>{chat.preview}</p>
            </div>
            {chat.unread > 0 && <span className="badge">{chat.unread}</span>}
          </button>
        ))}
      </div>
      <footer className="bottom-nav">
        <button className="active"><MessageSquareMore size={22} /><span>Chats</span></button>
        <button><Users size={22} /><span>Contacts</span></button>
        <button onClick={() => navigate('/earnings')}><Wallet size={22} /><span>Earnings</span></button>
        <button><Settings size={22} /><span>Profile</span></button>
      </footer>
    </section>
  )
}

function ChatScreen({ chats, messagesByChat, loadMessages, appendMessage }) {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const chat = chats.find((c) => c.id === chatId)
  const [showInput, setShowInput] = useState(false)
  const [draft, setDraft] = useState('')

  const messages = messagesByChat[chatId] || []

  useEffect(() => { if (chatId) loadMessages(chatId) }, [chatId])

  if (!chat) return <section className="screen"><p className="px5">Loading chat…</p></section>

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    appendMessage(chatId, { id: Date.now(), role: 'sent', text, time: 'Now' })
    setDraft('')

    if (chat.isAgent) {
      setTimeout(() => {
        appendMessage(chatId, { id: Date.now() + 1, role: 'received', text: '🎙️ Agent audio response generated based on your message.', time: 'Now' })
      }, 650)
    }
  }

  return (
    <section className="screen">
      <header className="chat-header">
        <button className="icon-btn" onClick={() => navigate('/')}><ArrowLeft size={22} /></button>
        <div><h2>{chat.name}</h2><p>{chat.isAgent ? 'AI Agent • voice-first' : 'Last call: 4m 32s'}</p></div>
      </header>

      <div className="thread">
        <div className="date-pill">Today</div>
        {messages.map((m, idx) => {
          const prev = messages[idx - 1]
          const isSpeakerChange = !prev || prev.role !== m.role

          if (m.role === 'system') {
            return (
              <article key={m.id} className="summary-card summary-spaced">
                <p className="title">✦ AI Conversation Summary</p>
                <p>{m.summary}</p>
                <div className="chips"><span>✓ {m.quality}</span><span>⛁ {m.earned} earned</span></div>
                <button>Approve for Training Data</button>
              </article>
            )
          }

          if (m.role === 'call_event') {
            return <div key={m.id} className="call-event call-event-spaced">📞 {m.text}</div>
          }

          return (
            <div key={m.id} className={`msg-row ${m.role === 'sent' ? 'sent-row' : 'received-row'} ${isSpeakerChange ? 'speaker-break' : 'speaker-stack'}`}>
              <article className={`bubble ${m.role === 'sent' ? 'sent' : 'received'}`}><p>{m.text}</p><small>{m.time}</small></article>
            </div>
          )
        })}
      </div>

      <div className="controls px5">
        <div className="earn-pill"><Coins size={16} /> Current potential: {chat.earningHint}</div>
        {chat.inactiveHours >= 24 && (
          <button className="starter" onClick={() => { appendMessage(chatId, { id: Date.now(), role: 'received', text: 'Try this mini-game: 2 truths and a lie about your week.', time: 'Now' }) }}>
            Need help getting started? Try a conversation game.
          </button>
        )}

        {showInput && <div className="input-wrap"><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..." /><button onClick={sendMessage}>Send</button></div>}

        <div className="call-row">
          <button className="call-btn" onClick={() => navigate(`/call/${chatId}`)}><Phone size={20} /> Start Call</button>
          <button className="kbd-btn" onClick={() => setShowInput((v) => !v)}><Keyboard size={20} /></button>
        </div>
      </div>
    </section>
  )
}

function CallScreen({ chats, appendMessage }) {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const chat = chats.find((c) => c.id === chatId)

  if (!chat) return <Navigate to="/" replace />

  const endCall = () => {
    appendMessage(chatId, {
      id: Date.now(),
      role: 'system',
      summary: 'You discussed weekend plans and travel logistics. Tone was natural and collaborative. Audio quality: high.',
      earned: '$1.09',
      quality: 'High quality',
    })
    navigate(`/chat/${chatId}`)
  }

  return (
    <section className="screen call-screen">
      <button className="back-lite" onClick={() => navigate(`/chat/${chatId}`)}><ArrowLeft size={20} /></button>
      <div className="call-center">
        <div className="ring" />
        <h2>{chat.name}</h2>
        <p>04:32</p>
        <div className="call-pill"><span className="dot" /> Recording for training data</div>
        <div className="call-pill"><Coins size={16} /> Earning {chat.earningHint}</div>
      </div>
      <div className="call-controls">
        <button><MicOff size={20} /><span>Mute</span></button>
        <button className="end" onClick={endCall}><PhoneOff size={24} /></button>
        <button><Volume2 size={20} /><span>Speaker</span></button>
      </div>
    </section>
  )
}

function EarningsScreen({ earnings }) {
  const navigate = useNavigate()
  const data = earnings || { rating: 0, verifiedSubmissions: 0, currentRate: 10, totalEarned: 0, weekEarned: 0, monthEarned: 0 }

  return (
    <section className="screen">
      <header className="chat-header"><button className="icon-btn" onClick={() => navigate('/')}><ArrowLeft size={22} /></button><div><h2>Earnings</h2></div></header>
      <div className="content px5 space-y earnings-content">
        <article className="balance-card">
          <p className="balance-label">Total Balance</p>
          <h3>${data.totalEarned.toFixed(2)}</h3>
          <div className="balance-foot">
            <span className="up">↗ +${(data.thisWeekDelta ?? 0).toFixed(2)} this week</span>
            <span className="next">Next payout: {data.nextPayout ?? 'TBD'}</span>
          </div>
        </article>

        <div className="top-cards-grid">
          <article className="panel center top-card"><p className="stars">★★★★☆</p><h3>{data.rating.toFixed(1)}</h3><p>{data.verifiedSubmissions} verified submissions</p></article>
          <article className="panel dark top-card"><h3>${data.currentRate.toFixed(2)}/hr</h3><p>Current earning rate</p></article>
        </div>
        <article className="panel"><h4>How it works</h4><p>Base rate is $10/hr. Higher verified quality increases your star score and multiplier. Repeated unusable submissions can reduce earnings to $0/hr.</p></article>
        <div className="stats-grid">
          <article className="panel"><h4>Total</h4><p>${data.totalEarned.toFixed(2)}</p></article>
          <article className="panel"><h4>This Week</h4><p>${data.weekEarned.toFixed(2)}</p></article>
          <article className="panel"><h4>This Month</h4><p>${data.monthEarned.toFixed(2)}</p></article>
        </div>

        <section className="history-section">
          <div className="history-head">
            <h4>Previous Earnings</h4>
            <button>View All</button>
          </div>

          <div className="history-list">
            {(data.previousRecordings || []).map((row) => (
              <article key={row.id} className="history-item">
                <div className={`status-dot ${row.status.toLowerCase()}`}>
                  <span className="status-glyph">{row.status === 'Completed' ? '✓' : row.status === 'Pending' ? '◷' : '!'}</span>
                  {row.score != null && <span className="status-score">{row.score}</span>}
                </div>
                <div className="history-meta">
                  <strong>{row.date}</strong>
                  <p>Voice Recording • {row.status}</p>
                </div>
                <div className={`history-amount ${row.amount > 0 ? 'pos' : 'zero'}`}>{row.amount > 0 ? `+$${row.amount.toFixed(2)}` : '$0.00'}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
