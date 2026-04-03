'use client'

import { useRef, useCallback } from 'react'

interface ProjectsAppProps {
  isFocused: boolean
  onExitFocused: () => void
}

const PROJECTS = [
  { title: 'Project Alpha', desc: 'Full-stack web app', tag: 'React · Node' },
  { title: 'SwiftUI Kit', desc: 'iOS component library', tag: 'Swift · SwiftUI' },
  { title: 'Portfolio v1', desc: 'Personal website', tag: 'Next.js' },
  { title: 'Data Dashboard', desc: 'Analytics platform', tag: 'TypeScript · D3' },
  { title: 'CLI Tool', desc: 'Developer utilities', tag: 'Rust' },
  { title: 'Design System', desc: 'Component library', tag: 'React · Storybook' },
  { title: 'API Gateway', desc: 'Microservices layer', tag: 'Go · Docker' },
  { title: 'Mobile App', desc: 'iOS productivity app', tag: 'Swift' },
  { title: 'Open Source Lib', desc: 'NPM utility package', tag: 'TypeScript' },
]

export default function ProjectsApp({ isFocused, onExitFocused }: ProjectsAppProps) {
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
    <div className="flex h-full" style={{ background: '#0a0a0a', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Sidebar */}
      <div
        className="flex-shrink-0 overflow-y-auto py-4"
        style={{ width: 160, background: '#111', borderRight: '1px solid #222' }}
      >
        <div className="px-3 mb-4">
          <p className="text-[10px] font-semibold mb-2" style={{ color: '#555' }}>
            LIBRARY
          </p>
          {['All Projects', 'Active', 'Archived', 'Open Source'].map((item, i) => (
            <div
              key={item}
              className="px-2 py-[5px] rounded-md text-[12px] mb-[2px]"
              style={{
                background: i === 0 ? '#1e1e1e' : 'transparent',
                color: i === 0 ? '#fff' : '#888',
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="px-3">
          <p className="text-[10px] font-semibold mb-2" style={{ color: '#555' }}>
            TAGS
          </p>
          {['React', 'Swift', 'TypeScript', 'Rust'].map((tag) => (
            <div key={tag} className="flex items-center gap-2 px-2 py-[4px] text-[11px]" style={{ color: '#666' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#333' }} />
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5" onWheel={handleWheel}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-semibold" style={{ color: '#f0f0f0' }}>
            My Projects
          </h2>
          <span className="text-[12px]" style={{ color: '#555' }}>
            {PROJECTS.length} projects
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className="rounded-lg overflow-hidden cursor-pointer group"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
            >
              {/* Thumbnail */}
              <div
                className="relative"
                style={{ paddingTop: '62%', background: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg" style={{ background: '#333' }} />
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-[12px] font-medium mb-[2px]" style={{ color: '#e8e8e8' }}>
                  {project.title}
                </p>
                <p className="text-[10px] mb-1" style={{ color: '#888' }}>
                  {project.desc}
                </p>
                <span
                  className="text-[9px] px-2 py-[2px] rounded-full"
                  style={{ background: '#2a2a2a', color: '#666' }}
                >
                  {project.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {isFocused && (
          <p className="text-[11px] text-center mt-8 pb-2" style={{ color: '#333' }}>
            ↓ Scroll to return to overview
          </p>
        )}
      </div>
    </div>
  )
}
