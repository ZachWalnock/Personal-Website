'use client'

import { useState, useRef, useCallback } from 'react'

interface PhotosAppProps {
  isFocused: boolean
  onExitFocused: () => void
  isMobile?: boolean
}

interface Photo {
  src: string
  label: string
}

interface PhotoGroup {
  month: string
  photos: Photo[]
}

const PHOTO_GROUPS: PhotoGroup[] = [
  {
    month: 'March 2025',
    photos: [
      { src: '/photo-whiteout.jpg', label: '2025 Whiteout' },
      { src: '/photo-nyc.jpg', label: 'NYC Hackathon' },
      { src: '/photo-golfcart.jpg', label: 'NittanyAI' },
    ],
  },
  {
    month: 'February 2025',
    photos: [
      { src: '/photo-pinstripe.jpg', label: 'Pinstripe Bowl' },
      { src: '/photo-mlb.jpg', label: 'MLB Lecture' },
    ],
  },
  {
    month: 'January 2025',
    photos: [
      { src: '/photo-princeton.jpg', label: 'Princeton' },
      { src: '/photo-cranium.jpg', label: 'Cranium Volunteering' },
    ],
  },
]

const ALL_PHOTOS = PHOTO_GROUPS.flatMap((g) => g.photos)

const ALBUMS = [
  { label: 'Recents',   thumb: '/photo-whiteout.jpg' },
  { label: 'Favorites', thumb: '/photo-nyc.jpg' },
  { label: 'Videos',    thumb: '/photo-pinstripe.jpg' },
  { label: 'Portraits', thumb: '/photo-cranium.jpg' },
  { label: 'Panoramas', thumb: '/photo-princeton.jpg' },
  { label: 'Bursts',    thumb: '/photo-mlb.jpg' },
]

const PEOPLE = [
  { src: '/people-me.png',      name: 'Zach' },
  { src: '/people-anthony.png', name: 'Anthony' },
  { src: '/people-damien.png',  name: 'Damien' },
  { src: '/people-milo.png',    name: 'Milo' },
]

export default function PhotosApp({ isFocused, onExitFocused, isMobile }: PhotosAppProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
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
          if (selectedPhoto) {
            setSelectedPhoto(null)
          } else {
            onExitFocused()
          }
        }
      } else {
        exitDelta.current = 0
        el.scrollTop += e.deltaY
      }
    },
    [isFocused, onExitFocused, selectedPhoto],
  )

  return (
    <div className="flex h-full" style={{ background: '#1c1c1e', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Sidebar */}
      {!isMobile && <div
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
            <div key={album.label} className="flex items-center gap-2 px-2 py-[4px] text-[12px]" style={{ color: '#aaa' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={album.thumb} alt="" className="w-7 h-7 rounded-md flex-shrink-0 object-cover" draggable={false} />
              <span className="truncate">{album.label}</span>
            </div>
          ))}
        </div>
        <div className="px-3">
          <p className="text-[10px] font-semibold mb-2" style={{ color: '#8a8a8a' }}>PEOPLE</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 px-1">
            {PEOPLE.map((person) => (
              <div key={person.name} className="flex flex-col items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={person.src}
                  alt={person.name}
                  className="rounded-full object-cover"
                  style={{ width: 52, height: 52 }}
                  draggable={false}
                />
                <span className="text-[10px]" style={{ color: '#aaa' }}>{person.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#1c1c1e' }}>
        {/* Toolbar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4"
          style={{ height: 44, borderBottom: '1px solid #2a2a2a', background: '#1c1c1e' }}
        >
          {selectedPhoto ? (
            <button
              onClick={() => setSelectedPhoto(null)}
              className="flex items-center gap-1 text-[12px]"
              style={{ color: '#0a84ff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              All Photos
            </button>
          ) : (
            <h2 className="text-[15px] font-semibold" style={{ color: '#f0f0f0' }}>Photos</h2>
          )}
          <div className="flex gap-3">
            {!selectedPhoto && ['Photos', 'Memories', 'Places'].map((tab) => (
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

        {selectedPhoto ? (
          /* Full photo view */
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto flex flex-col items-center"
            style={{ background: '#111' }}
            onWheel={handleWheel}
          >
            <div className="w-full max-w-2xl px-6 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.label}
                className="w-full rounded-lg"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
                draggable={false}
              />
              <p className="text-[13px] font-medium mt-4 text-center" style={{ color: '#c8c8c8' }}>
                {selectedPhoto.label}
              </p>
            </div>
            {isFocused && !isMobile && (
              <p className="text-[11px] text-center pb-6" style={{ color: '#333' }}>↓ Scroll to go back</p>
            )}
          </div>
        ) : (
          /* Grid view */
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4" onWheel={handleWheel}>
            {/* People strip — mobile only */}
            {isMobile && (
              <div className="pt-4 pb-2 flex gap-4 overflow-x-auto">
                {PEOPLE.map((person) => (
                  <div key={person.name} className="flex flex-col items-center gap-1 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={person.src}
                      alt={person.name}
                      className="rounded-full object-cover"
                      style={{ width: 56, height: 56, border: '2px solid rgba(255,255,255,0.15)' }}
                      draggable={false}
                    />
                    <span className="text-[11px]" style={{ color: '#aaa' }}>{person.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Featured large photo strip */}
            <div className="pt-4 pb-5">
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#8a8a8a' }}>
                {ALL_PHOTOS.length} Photos
              </p>
              <div className={isMobile ? 'grid grid-cols-3 gap-[2px]' : 'grid grid-cols-5 gap-[2px]'}>
                {ALL_PHOTOS.map((photo) => (
                  <button
                    key={photo.src}
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                    style={{ aspectRatio: '1/1' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.label}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* By month */}
            {PHOTO_GROUPS.map((group) => (
              <div key={group.month} className="mb-5">
                <p className="text-[11px] font-semibold mb-2" style={{ color: '#8a8a8a' }}>
                  {group.month}
                </p>
                <div className={isMobile ? 'grid grid-cols-3 gap-[2px]' : 'grid grid-cols-5 gap-[2px]'}>
                  {group.photos.map((photo) => (
                    <button
                      key={photo.src}
                      onClick={() => setSelectedPhoto(photo)}
                      className="relative cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                      style={{ aspectRatio: '1/1' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.src}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {isFocused && !isMobile && (
              <p className="text-[11px] text-center py-4" style={{ color: '#333' }}>
                ↓ Scroll to return to overview
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
