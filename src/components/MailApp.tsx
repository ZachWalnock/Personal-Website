'use client'

import { useState, useRef, useCallback } from 'react'

interface MailAppProps {
  isFocused: boolean
  onExitFocused: () => void
}

const INBOX = [
  { from: 'GitHub', subject: 'New pull request opened', time: '10:42 AM', preview: 'A new PR was opened on your repository...', unread: true },
  { from: 'Vercel', subject: 'Deployment successful', time: '9:15 AM', preview: 'Your latest deployment to production is live.', unread: false },
  { from: 'Linear', subject: 'Issue assigned to you', time: 'Yesterday', preview: 'BUG-123: Fix navigation scroll behavior', unread: true },
  { from: 'Figma', subject: 'Design file shared', time: 'Yesterday', preview: 'Someone shared "Homepage Redesign" with you', unread: false },
  { from: 'npm', subject: 'Package update available', time: 'Mon', preview: 'motion v11.2.0 is available', unread: false },
]

type SendState = 'idle' | 'sending' | 'success' | 'error'

export default function MailApp({ isFocused, onExitFocused }: MailAppProps) {
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sendState, setSendState] = useState<SendState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const exitDelta = useRef(0)

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!isFocused) return
      const el = scrollRef.current
      if (!el) return

      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
      if (atBottom && e.deltaY > 0) {
        exitDelta.current += e.deltaY
        if (exitDelta.current > 120) {
          exitDelta.current = 0
          onExitFocused()
        }
      } else {
        exitDelta.current = 0
        el.scrollTop += e.deltaY
      }
    },
    [isFocused, onExitFocused],
  )

  const canSend = senderName && senderEmail && subject && body && sendState !== 'sending'

  const handleSend = async () => {
    if (!canSend) return
    setSendState('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName, senderEmail, subject, body }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.')
        setSendState('error')
        return
      }

      setSendState('success')
      setSenderName('')
      setSenderEmail('')
      setSubject('')
      setBody('')
      setTimeout(() => setSendState('idle'), 4000)
    } catch {
      setErrorMsg('Network error. Please try again.')
      setSendState('error')
      setTimeout(() => setSendState('idle'), 4000)
    }
  }

  return (
    <div className="flex h-full" style={{ background: '#1c1c1e', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Sidebar */}
      <div
        className="flex-shrink-0"
        style={{ width: 160, background: '#252525', borderRight: '1px solid #3a3a3a' }}
      >
        <div className="px-3 pt-4">
          <p className="text-[10px] font-semibold mb-2" style={{ color: '#8a8a8a' }}>
            MAILBOXES
          </p>
          {[
            { label: 'Inbox', count: 2 },
            { label: 'Sent', count: 0 },
            { label: 'Drafts', count: 1 },
            { label: 'Junk', count: 0 },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-2 py-[5px] rounded-md mb-[2px]"
              style={{
                background: item.label === 'Inbox' ? '#3a3a3a' : 'transparent',
                color: '#e8e8e8',
              }}
            >
              <span className="text-[12px]">{item.label}</span>
              {item.count > 0 && (
                <span
                  className="text-[10px] font-bold px-[6px] py-[1px] rounded-full"
                  style={{ background: '#0a84ff', color: '#fff' }}
                >
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message list */}
      <div
        className="flex-shrink-0 overflow-y-auto"
        style={{ width: 220, background: '#212121', borderRight: '1px solid #3a3a3a' }}
      >
        <div className="px-3 py-3 sticky top-0" style={{ background: '#212121' }}>
          <p className="text-[14px] font-semibold" style={{ color: '#f0f0f0' }}>Inbox</p>
          <p className="text-[10px]" style={{ color: '#8a8a8a' }}>2 unread</p>
        </div>
        {INBOX.map((msg) => (
          <div
            key={msg.subject}
            className="px-3 py-3 border-b"
            style={{ borderColor: '#2d2d2d', cursor: 'default' }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {msg.unread && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#0a84ff' }} />}
                <span className="text-[12px] font-medium truncate" style={{ color: msg.unread ? '#f0f0f0' : '#a0a0a0' }}>
                  {msg.from}
                </span>
              </div>
              <span className="text-[10px] flex-shrink-0" style={{ color: '#666' }}>{msg.time}</span>
            </div>
            <p className="text-[11px] font-medium truncate mb-[2px]" style={{ color: '#c8c8c8' }}>{msg.subject}</p>
            <p className="text-[10px] truncate" style={{ color: '#666' }}>{msg.preview}</p>
          </div>
        ))}
      </div>

      {/* Compose */}
      <div ref={scrollRef} className="flex-1 flex flex-col overflow-y-auto" onWheel={handleWheel}>
        <div className="px-6 pt-5 pb-3" style={{ borderBottom: '1px solid #3a3a3a' }}>
          <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#f0f0f0' }}>New Message</h3>
          <p className="text-[12px]" style={{ color: '#8a8a8a' }}>Send me a message — I&apos;d love to hear from you.</p>
        </div>

        <div className="flex-1 p-5 flex flex-col gap-0">
          {/* From name */}
          <div className="flex items-center gap-3 py-[10px]" style={{ borderBottom: '1px solid #2d2d2d' }}>
            <span className="text-[12px] w-20 text-right flex-shrink-0" style={{ color: '#8a8a8a' }}>Your name:</span>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Jane Smith"
              className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-[#444]"
              style={{ color: '#e8e8e8' }}
            />
          </div>

          {/* From email */}
          <div className="flex items-center gap-3 py-[10px]" style={{ borderBottom: '1px solid #2d2d2d' }}>
            <span className="text-[12px] w-20 text-right flex-shrink-0" style={{ color: '#8a8a8a' }}>Your email:</span>
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-[#444]"
              style={{ color: '#e8e8e8' }}
            />
          </div>

          {/* To */}
          <div className="flex items-center gap-3 py-[10px]" style={{ borderBottom: '1px solid #2d2d2d' }}>
            <span className="text-[12px] w-20 text-right flex-shrink-0" style={{ color: '#8a8a8a' }}>To:</span>
            <span className="text-[13px]" style={{ color: '#0a84ff' }}>zach.walnock@gmail.com</span>
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3 py-[10px]" style={{ borderBottom: '1px solid #2d2d2d' }}>
            <span className="text-[12px] w-20 text-right flex-shrink-0" style={{ color: '#8a8a8a' }}>Subject:</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-[#444]"
              style={{ color: '#e8e8e8' }}
            />
          </div>

          {/* Body */}
          <div className="pt-4 flex-1">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              rows={7}
              className="w-full bg-transparent outline-none resize-none text-[13px] leading-relaxed placeholder:text-[#444]"
              style={{ color: '#e8e8e8' }}
            />
          </div>

          {/* Send button + status */}
          <div className="flex items-center justify-between pt-4 pb-2">
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all"
              style={{
                background: canSend ? '#0a84ff' : '#2a2a2a',
                color: canSend ? '#fff' : '#555',
                opacity: sendState === 'sending' ? 0.7 : 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              {sendState === 'sending' ? 'Sending…' : 'Send'}
            </button>

            {sendState === 'success' && (
              <span className="text-[12px]" style={{ color: '#30d158' }}>✓ Message sent!</span>
            )}
            {sendState === 'error' && (
              <span className="text-[12px]" style={{ color: '#ff453a' }}>✗ {errorMsg}</span>
            )}
          </div>
        </div>

        {isFocused && (
          <p className="text-[11px] text-center py-4" style={{ color: '#333' }}>
            ↓ Scroll to return to overview
          </p>
        )}
      </div>
    </div>
  )
}
