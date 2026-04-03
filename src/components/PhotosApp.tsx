'use client'

import { useRef, useCallback } from 'react'

interface PhotosAppProps {
  isFocused: boolean
  onExitFocused: () => void
}

// Placeholder colors for photo grid — replace with real photos later
const PHOTO_COLORS = [
  '#2d4a3e', '#4a2d3e', '#3e4a2d', '#2d3e4a',
  '#4a3d2d', '#3d2d4a', '#2d4a4a', '#4a4a2d',
  '#3a2a4a', '#2a4a3a', '#4a3a2a', '#2a3a4a',
  '#3e3a2d', '#2d3e3a', '#3a3e2d', '#2d2d4a',
  '#4a2d2d', '#2d4a2d', '#3a4a3a', '#4a3a4a',
]

const ALBUMS = ['Recents', 'Favorites', 'Videos', 'Portraits', 'Panoramas', 'Bursts']

export default function PhotosApp({ isFocused, onExitFocused }: PhotosAppProps) {
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
        className="flex-shrink-0 py-4 overflow-y-auto"
        style={{ width: 170, background: '#252525', borderRight: '1px solid #3a3a3a' }}
      >
        <div className="px-3 mb-3">
          <p className="text-[10px] font-semibold mb-2" style={{ color: '#8a8a8a' }}>LIBRARY</p>
          {['Photos', 'Memories', 'Featured Photos'].map((item, i) => (
            <div
              key={item}
              className="px-2 py-[5px] rounded-md text-[12px] mb-[2px]"
              style={{ background: i === 0 ? '#3a3a3a' : 'transparent', color: i === 0 ? '#fff' : '#aaa' }}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="px-3 mb-3">
          <p className="text-[10px] font-semibold mb-2" style={{ color: '#8a8a8a' }}>MY ALBUMS</p>
          {ALBUMS.map((album) => (
            <div key={album} className="flex items-center gap-2 px-2 py-[4px] text-[12px]" style={{ color: '#aaa' }}>
              <div className="w-7 h-7 rounded-md flex-shrink-0" style={{ background: '#333' }} />
              <span className="truncate">{album}</span>
            </div>
          ))}
        </div>
        <div className="px-3">
          <p className="text-[10px] font-semibold mb-2" style={{ color: '#8a8a8a' }}>PEOPLE</p>
          <div className="flex flex-wrap gap-2 px-1">
            {['Zach', 'Friends', 'Family'].map((name) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #333, #444)' }} />
                <span className="text-[9px]" style={{ color: '#666' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main photo grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" onWheel={handleWheel}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between sticky top-0 z-10" style={{ background: '#1c1c1e' }}>
          <h2 className="text-[16px] font-semibold" style={{ color: '#f0f0f0' }}>Library</h2>
          <div className="flex gap-3">
            {['Photos', 'Memories', 'Places'].map((tab) => (
              <button
                key={tab}
                className="text-[12px] px-3 py-1 rounded-full"
                style={{
                  background: tab === 'Photos' ? '#3a3a3a' : 'transparent',
                  color: tab === 'Photos' ? '#fff' : '#8a8a8a',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          <p className="text-[11px] font-semibold mb-3" style={{ color: '#8a8a8a' }}>
            April 2025
          </p>
          <div className="grid grid-cols-5 gap-1">
            {PHOTO_COLORS.map((color, i) => (
              <div
                key={i}
                className="rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
                style={{ paddingTop: '100%', background: color, position: 'relative' }}
              >
                {i === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg">🏔️</span>
                  </div>
                )}
                {i === 4 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg">🏄</span>
                  </div>
                )}
                {i === 7 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg">🎸</span>
                  </div>
                )}
                {i === 11 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg">✈️</span>
                  </div>
                )}
                {i === 15 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg">🎿</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-[11px] font-semibold mb-3 mt-5" style={{ color: '#8a8a8a' }}>
            March 2025
          </p>
          <div className="grid grid-cols-5 gap-1">
            {PHOTO_COLORS.slice().reverse().map((color, i) => (
              <div
                key={i}
                className="rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
                style={{ paddingTop: '100%', background: color }}
              />
            ))}
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
