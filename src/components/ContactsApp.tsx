'use client'

import { useRef, useCallback } from 'react'

interface ContactsAppProps {
  isFocused: boolean
  onExitFocused: () => void
}

const CONTACT_NAMES = [
  'A',
  'Aaftab', 'Abdul', 'Abhiram', 'Abs', 'Samuel Adams',
  'Aehren', 'Shamak Agarwal', 'Andres Aguirre',
  'B',
  'Blake Bennett', 'Jordan Bloom', 'Casey Brooks',
  'C',
  'Chris Carter', 'Alex Chen', 'Morgan Clark',
  'D',
  'David Daniels', 'Emily Davis',
  'F',
  'Fehad Alghaslan',
  'G',
  'Chris Garcia', 'Sam Green',
  'J',
  'Jordan James', 'Alex Johnson',
  'K',
  'Krush Amrutiya',
  'L',
  'Lee Lambert',
  'M',
  'Morgan Miller',
  'N',
  'Rakib Anam',
  'P',
  'Alex Park', 'Sam Peterson',
  'R',
  'Riley Roberts',
  'S',
  'Jordan Smith', 'Taylor Stone',
  'T',
  'Tj Andrewlevich',
  'W',
  'Zach Walnock',
]

export default function ContactsApp({ isFocused, onExitFocused }: ContactsAppProps) {
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

  return (
    <div className="flex h-full" style={{ background: '#1c1c1e', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Sidebar */}
      <div
        className="flex-shrink-0 overflow-y-auto"
        style={{ width: 160, background: '#252525', borderRight: '1px solid #3a3a3a' }}
      >
        <div className="px-3 pt-4 pb-1">
          <p className="text-[10px] font-semibold mb-1" style={{ color: '#8a8a8a' }}>
            iCloud
          </p>
          <div
            className="px-2 py-[3px] rounded-md text-[12px] font-medium"
            style={{ background: '#0a84ff', color: '#fff' }}
          >
            All iCloud
          </div>
        </div>
        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold mb-1" style={{ color: '#8a8a8a' }}>
            On My Mac
          </p>
          <div className="px-2 py-[3px] text-[12px]" style={{ color: '#e8e8e8' }}>
            All on My Mac
          </div>
        </div>
        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold mb-1" style={{ color: '#8a8a8a' }}>
            Smart Lists
          </p>
          <div className="px-2 py-[3px] text-[12px]" style={{ color: '#e8e8e8' }}>
            Last Import
          </div>
        </div>
      </div>

      {/* Contact list */}
      <div
        className="flex-shrink-0 overflow-y-auto"
        style={{ width: 180, background: '#2a2a2a', borderRight: '1px solid #3a3a3a' }}
      >
        {/* Search */}
        <div className="px-2 py-2 sticky top-0" style={{ background: '#2a2a2a', zIndex: 10 }}>
          <div
            className="flex items-center gap-1 px-2 rounded-md text-[11px]"
            style={{ background: '#3a3a3a', height: 22, color: '#8a8a8a' }}
          >
            <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            Search All iCloud
          </div>
        </div>

        {CONTACT_NAMES.map((name) => {
          const isLetter = name.length === 1 && name === name.toUpperCase()
          const isSelected = name === 'Zach Walnock'

          if (isLetter) {
            return (
              <div key={name} className="px-3 pt-2 pb-[1px] text-[10px] font-semibold" style={{ color: '#8a8a8a' }}>
                {name}
              </div>
            )
          }
          return (
            <div
              key={name}
              className="px-3 py-[5px] text-[12px] mx-1 rounded-md"
              style={{
                background: isSelected ? '#3a3a3a' : 'transparent',
                color: '#e8e8e8',
              }}
            >
              {name}
            </div>
          )
        })}
      </div>

      {/* Contact detail */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        onWheel={handleWheel}
        style={{ background: '#1c1c1e' }}
      >
        {/* Contact header */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #3a3a3a' }}>
          {/* Avatar */}
          <div
            className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #ff6b9d, #c44dff)' }}
          >
            ZW
          </div>
          <div>
            <h2 className="text-[22px] font-semibold" style={{ color: '#f0f0f0' }}>
              Zach Walnock
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-[12px]" style={{ background: '#2e2e2e', color: '#0a84ff', border: '1px solid #3a3a3a' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                FaceTime
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-[12px]" style={{ background: '#2e2e2e', color: '#0a84ff', border: '1px solid #3a3a3a' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </button>
            </div>
          </div>
        </div>

        {/* Contact fields */}
        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #3a3a3a' }}>
          <div className="flex items-start gap-3">
            <span className="text-[11px] w-16 text-right flex-shrink-0 pt-[2px]" style={{ color: '#8a8a8a' }}>
              home
            </span>
            <div>
              <p className="text-[13px]" style={{ color: '#0a84ff' }}>
                zach.walnock@gmail.com
              </p>
              <p className="text-[10px] mt-[2px]" style={{ color: '#8a8a8a' }}>
                (Siri Found in Accounts)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] w-16 text-right flex-shrink-0" style={{ color: '#8a8a8a' }}>
              location
            </span>
            <p className="text-[13px]" style={{ color: '#e8e8e8' }}>
              San Francisco, CA
            </p>
          </div>
        </div>

        {/* About me */}
        <div className="px-6 py-5">
          <p className="text-[11px] font-semibold mb-3" style={{ color: '#8a8a8a' }}>
            About me
          </p>

          <h3 className="text-[17px] font-semibold mb-2" style={{ color: '#f0f0f0' }}>
            My Digital Journey
          </h3>

          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#c8c8c8' }}>
            A software developer passionate about building intuitive user experiences. I love the intersection of design and engineering — the space where thoughtful code meets beautiful interfaces.
          </p>

          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#c8c8c8' }}>
            Currently focused on building full-stack products with React, Next.js, and Swift. I&apos;m especially drawn to animation, motion design, and the small details that make software feel alive.
          </p>

          <h4 className="text-[14px] font-semibold mb-2" style={{ color: '#f0f0f0' }}>
            Current Goals:
          </h4>
          <ul className="space-y-1 mb-5 pl-4">
            {['Ship meaningful side projects', 'Master SwiftUI & iOS dev', 'Contribute to open source', 'Learn more about system design'].map((goal) => (
              <li key={goal} className="text-[13px] flex items-start gap-2" style={{ color: '#c8c8c8' }}>
                <span style={{ color: '#0a84ff' }}>•</span>
                {goal}
              </li>
            ))}
          </ul>

          <h4 className="text-[14px] font-semibold mb-2" style={{ color: '#f0f0f0' }}>
            Experience:
          </h4>
          <ul className="space-y-1 mb-5 pl-4">
            {[
              'Full-stack web development (React, Next.js, Node)',
              'iOS development (Swift, SwiftUI)',
              'System design & architecture',
              'UI/UX design & prototyping',
            ].map((item) => (
              <li key={item} className="text-[13px] flex items-start gap-2" style={{ color: '#c8c8c8' }}>
                <span style={{ color: '#0a84ff' }}>•</span>
                {item}
              </li>
            ))}
          </ul>

          <p className="text-[13px] leading-relaxed" style={{ color: '#8a8a8a' }}>
            Always building. Always learning. Let&apos;s make something great together.
          </p>

          {isFocused && (
            <p className="text-[11px] text-center mt-8 pb-2" style={{ color: '#555' }}>
              ↓ Scroll to return to overview
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
