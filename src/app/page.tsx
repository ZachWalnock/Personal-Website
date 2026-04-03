'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import AppWindow from '@/components/AppWindow'
import ContactsApp from '@/components/ContactsApp'
import ProjectsApp from '@/components/ProjectsApp'
import MailApp from '@/components/MailApp'
import PhotosApp from '@/components/PhotosApp'
import Dock from '@/components/Dock'

type AppState = 'desktop' | 'exploded' | 'focused'
type AppName = 'contacts' | 'projects' | 'mail' | 'photos'

const APP_TITLES: Record<AppName, string> = {
  contacts: 'Contacts',
  projects: 'My Projects',
  mail: 'Mail',
  photos: 'Photos',
}

// Positions: [left%, top%, width%, height%] of viewport
// Grid: contacts=TL, mail=TR, projects=BL, photos=BR
const EXPLODED: Record<AppName, [string, string, string, string]> = {
  contacts: ['3%', '7%', '45.5%', '43%'],
  mail:     ['51.5%', '7%', '45.5%', '43%'],
  projects: ['3%', '52%', '45.5%', '43%'],
  photos:   ['51.5%', '52%', '45.5%', '43%'],
}

const DESKTOP: Record<AppName, [string, string, string, string]> = {
  contacts: ['14%', '4%', '72%', '85%'],
  mail:     ['51.5%', '7%', '45.5%', '43%'],    // stays at exploded pos, hidden
  projects: ['3%', '52%', '45.5%', '43%'],       // stays at exploded pos, hidden
  photos:   ['51.5%', '52%', '45.5%', '43%'],    // stays at exploded pos, hidden
}

const FOCUSED: [string, string, string, string] = ['1%', '0.5%', '98%', '98%']

function getWindowStyle(app: AppName, appState: AppState, focusedApp: AppName) {
  let pos: [string, string, string, string]

  if (appState === 'desktop') {
    pos = DESKTOP[app]
  } else if (appState === 'exploded') {
    pos = EXPLODED[app]
  } else {
    // focused
    pos = app === focusedApp ? FOCUSED : EXPLODED[app]
  }

  const [left, top, width, height] = pos

  const visible =
    appState === 'desktop'
      ? app === 'contacts'
      : appState === 'exploded'
      ? true
      : app === focusedApp

  return { left, top, width, height, opacity: visible ? 1 : 0 }
}

export default function Page() {
  const [appState, setAppState] = useState<AppState>('desktop')
  const [focusedApp, setFocusedApp] = useState<AppName>('contacts')
  const isAnimating = useRef(false)
  const scrollDelta = useRef(0)

  const triggerTransition = useCallback(
    (newState: AppState, newFocused?: AppName) => {
      if (isAnimating.current) return
      isAnimating.current = true
      scrollDelta.current = 0
      if (newFocused) setFocusedApp(newFocused)
      setAppState(newState)
      setTimeout(() => {
        isAnimating.current = false
      }, 650)
    },
    [],
  )

  // Desktop → Exploded on scroll down
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (appState !== 'desktop') return
      if (e.deltaY <= 0) {
        scrollDelta.current = Math.max(0, scrollDelta.current + e.deltaY)
        return
      }
      scrollDelta.current += e.deltaY
      if (scrollDelta.current > 150) {
        triggerTransition('exploded')
      }
    }
    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [appState, triggerTransition])

  // Escape key exits focused state
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && appState === 'focused') {
        triggerTransition('exploded')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [appState, triggerTransition])

  const handleFocusApp = useCallback(
    (app: AppName) => {
      if (appState !== 'exploded') return
      triggerTransition('focused', app)
    },
    [appState, triggerTransition],
  )

  const handleExitFocused = useCallback(() => {
    if (appState !== 'focused') return
    triggerTransition('exploded')
  }, [appState, triggerTransition])

  const handleMailFromDock = useCallback(() => {
    if (appState === 'exploded') {
      triggerTransition('focused', 'mail')
    } else if (appState === 'desktop') {
      triggerTransition('focused', 'mail')
    } else if (appState === 'focused' && focusedApp !== 'mail') {
      triggerTransition('focused', 'mail')
    }
  }, [appState, focusedApp, triggerTransition])

  const windowTransition = {
    duration: 0.55,
    ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ cursor: 'default' }}>
      {/* Wallpaper */}
      <Image
        src="/wallpaper.jpg"
        alt="Desktop"
        fill
        priority
        className="object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Subtle gradient overlay (always on, gives depth) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)',
          zIndex: 1,
        }}
      />

      {/* Dark overlay (exploded / focused states) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: appState === 'desktop' ? 0 : 0.48 }}
        transition={{ duration: 0.4 }}
        style={{ background: 'rgba(0,0,0,1)', zIndex: 5 }}
      />

      {/* macOS menu bar (desktop state) */}
      <AnimatePresence>
        {appState === 'desktop' && (
          <motion.div
            key="menubar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-4"
            style={{
              height: 24,
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 30,
              fontSize: 13,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <div className="flex items-center gap-5">
              <span style={{ fontSize: 15 }}>&#63743;</span>
              {['Contacts', 'File', 'Edit', 'View', 'Card', 'Window', 'Help'].map((item) => (
                <span
                  key={item}
                  className={item === 'Contacts' ? 'font-semibold' : ''}
                  style={{ fontSize: 12, opacity: 0.9 }}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4" style={{ fontSize: 12 }}>
              <span>Fri Apr 3 12:49 PM</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Control hint */}
      <AnimatePresence>
        {appState === 'exploded' && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none"
            style={{ zIndex: 60 }}
          >
            <span
              className="px-3 py-1 rounded-full text-[12px]"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Click an app to open it
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Escape hint in focused state */}
      <AnimatePresence>
        {appState === 'focused' && (
          <motion.div
            key="escape-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="absolute top-4 right-4 pointer-events-none"
            style={{ zIndex: 60 }}
          >
            <span
              className="px-2 py-1 rounded text-[11px]"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              esc to go back
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint (desktop) */}
      <AnimatePresence>
        {appState === 'desktop' && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="absolute pointer-events-none left-1/2 -translate-x-1/2"
            style={{ bottom: 90, zIndex: 30 }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                scroll to explore
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
              >
                <path d="M7 10l5 5 5-5" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Windows */}
      {(['contacts', 'projects', 'mail', 'photos'] as AppName[]).map((app, index) => {
        const style = getWindowStyle(app, appState, focusedApp)
        const isFocused = appState === 'focused' && focusedApp === app
        const isExploded = appState === 'exploded'
        const isCurrentlyFocused = appState === 'focused'
        const zIndex =
          isFocused ? 50 : isCurrentlyFocused ? 8 : isExploded ? 20 : app === 'contacts' ? 20 : 10

        return (
          <motion.div
            key={app}
            className="absolute"
            animate={style}
            transition={{
              ...windowTransition,
              delay: appState === 'exploded' && app !== 'contacts' ? index * 0.04 : 0,
            }}
            onClick={() => isExploded ? handleFocusApp(app) : undefined}
            style={{
              zIndex,
              cursor: isExploded ? 'pointer' : 'default',
            }}
          >
            <motion.div
              className="w-full h-full"
              whileHover={
                isExploded
                  ? { scale: 1.025, transition: { duration: 0.15 } }
                  : {}
              }
            >
              <AppWindow
                title={APP_TITLES[app]}
                isExploded={isExploded}
              >
                {app === 'contacts' && (
                  <ContactsApp isFocused={isFocused} onExitFocused={handleExitFocused} />
                )}
                {app === 'projects' && (
                  <ProjectsApp isFocused={isFocused} onExitFocused={handleExitFocused} />
                )}
                {app === 'mail' && (
                  <MailApp isFocused={isFocused} onExitFocused={handleExitFocused} />
                )}
                {app === 'photos' && (
                  <PhotosApp isFocused={isFocused} onExitFocused={handleExitFocused} />
                )}
              </AppWindow>
            </motion.div>
          </motion.div>
        )
      })}

      {/* Dock */}
      <Dock onMailClick={handleMailFromDock} />
    </div>
  )
}
