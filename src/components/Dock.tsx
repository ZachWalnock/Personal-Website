'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'motion/react'
import { useRef } from 'react'

interface DockProps {
  onMailClick: () => void
}

const DOCK_ITEMS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    bg: '#1a1a1a',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    bg: '#0077b5',
  },
  {
    id: 'mail',
    label: 'Mail',
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    bg: 'linear-gradient(135deg, #2196F3, #1565C0)',
  },
]

function DockIcon({
  item,
  mouseX,
  onMailClick,
}: {
  item: typeof DOCK_ITEMS[0]
  mouseX: ReturnType<typeof useMotionValue<number>>
  onMailClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return 999
    return Math.abs(val - (bounds.left + bounds.width / 2))
  })

  const scaleRaw = useTransform(distance, [0, 80, 140], [1.55, 1.2, 1])
  const scale = useSpring(scaleRaw, { stiffness: 280, damping: 22 })

  const handleClick = () => {
    if (item.id === 'mail') {
      onMailClick()
    } else if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="relative flex flex-col items-center group"
    >
      <motion.div
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        className="w-14 h-14 rounded-[14px] flex items-center justify-center cursor-pointer shadow-lg overflow-hidden"
        style={{ background: typeof item.bg === 'string' && !item.bg.includes('gradient') ? item.bg : undefined }}
      >
        <div
          className="w-14 h-14 rounded-[14px] flex items-center justify-center p-[14px]"
          style={{
            background: item.bg,
            color: '#fff',
          }}
        >
          {item.icon}
        </div>
      </motion.div>

      {/* Label tooltip */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-[3px] rounded-md text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
        style={{ background: 'rgba(30,30,30,0.9)', color: '#fff', backdropFilter: 'blur(8px)' }}
      >
        {item.label}
      </div>

      {/* Active dot */}
      <div className="w-1 h-1 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.4)' }} />
    </motion.div>
  )
}

export default function Dock({ onMailClick }: DockProps) {
  const mouseX = useMotionValue<number>(Infinity)

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[70]"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <div
        className="flex items-end gap-2 px-4 py-2 rounded-2xl"
        style={{
          background: 'rgba(30, 30, 30, 0.55)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            onMailClick={onMailClick}
          />
        ))}
      </div>
    </div>
  )
}
