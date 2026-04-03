'use client'

import { ReactNode } from 'react'

interface AppWindowProps {
  title: string
  children: ReactNode
  isExploded?: boolean
}

export default function AppWindow({ title, children, isExploded }: AppWindowProps) {
  return (
    <div className="flex flex-col h-full w-full rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10">
      {/* Title bar */}
      <div
        className="flex-shrink-0 flex items-center px-3 relative"
        style={{
          height: 28,
          background: 'linear-gradient(to bottom, #3a3a3a, #2d2d2d)',
          borderBottom: '1px solid rgba(0,0,0,0.4)',
        }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-[6px] z-10">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d6a01a]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
        </div>
        {/* Title */}
        <span
          className="absolute left-0 right-0 text-center text-[12px] font-medium pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {title}
        </span>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-hidden relative"
        style={{ pointerEvents: isExploded ? 'none' : 'auto' }}
      >
        {children}
      </div>
    </div>
  )
}
