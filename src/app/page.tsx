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
import { GlassFilter, GlassEffect } from '@/components/ui/liquid-glass'
import { useIsMobile } from '@/hooks/useIsMobile'

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
  contacts: ['14%', '3.5%', '72%', '83%'],
  mail:     ['51.5%', '7%', '45.5%', '43%'],    // stays at exploded pos, hidden
  projects: ['3%', '52%', '45.5%', '43%'],       // stays at exploded pos, hidden
  photos:   ['51.5%', '52%', '45.5%', '43%'],    // stays at exploded pos, hidden
}

const FOCUSED: [string, string, string, string] = ['1%', '3%', '98%', '94%']

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

const MOBILE_APP_TITLES: Record<AppName, string> = {
  contacts: 'Contacts',
  projects: 'Notes',
  mail: 'Mail',
  photos: 'Photos',
}

type MobileScreen = 'home' | 'focused'

export default function Page() {
  const isMobile = useIsMobile()
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>('home')
  const [mobileApp, setMobileApp] = useState<AppName>('contacts')

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

  const handleAppFromDock = useCallback((app: 'contacts' | 'notes' | 'photos') => {
    // 'notes' dock icon opens the projects app (which is the Notes-style app)
    const target: AppName = app === 'notes' ? 'projects' : app
    if (appState === 'focused' && focusedApp === target) return
    triggerTransition('focused', target)
  }, [appState, focusedApp, triggerTransition])

  const windowTransition = {
    duration: 0.55,
    ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
  }

  // ── Mobile render path ─────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        {/* Wallpaper */}
        <Image src="/wallpaper.jpg" alt="wallpaper" fill priority className="object-cover" style={{ zIndex: 0 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%)', zIndex: 1 }} />
        <GlassFilter />

        <AnimatePresence mode="wait">

          {mobileScreen === 'home' && (
            <motion.div
              key="mobile-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8"
              style={{ zIndex: 10 }}
            >
              {/* Name plate */}
              <div className="text-center mb-2">
                <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.92)', fontSize: 24 }}>Zach Walnock</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Software Developer</p>
              </div>

              {/* 2×2 app icon grid */}
              <div className="grid grid-cols-2 gap-10">
                {([
                  { app: 'contacts', label: 'Contacts', img: '/icon-contacts.png' },
                  { app: 'projects', label: 'Notes',    img: '/icon-notes.webp'   },
                  { app: 'mail',     label: 'Mail',     img: '/icon-mail.png'     },
                  { app: 'photos',   label: 'Photos',   img: '/icon-photos.png'   },
                ] as const).map(({ app, label, img }) => (
                  <button
                    key={app}
                    onClick={() => { setMobileApp(app); setMobileScreen('focused') }}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      className="w-20 h-20 rounded-[22px] overflow-hidden shadow-2xl"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={label} className="w-full h-full object-cover" draggable={false} />
                    </motion.div>
                    <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.88)' }}>{label}</span>
                  </button>
                ))}
              </div>

              {/* Social dock */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <GlassEffect className="rounded-[20px] px-5 py-3">
                  <div className="flex items-center gap-5">
                    <motion.a whileTap={{ scale: 0.88 }} href="https://github.com/ZachWalnock" target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center p-3 shadow-lg"
                      style={{ background: '#1a1a1a', color: '#fff' }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </motion.a>
                    <motion.a whileTap={{ scale: 0.88 }} href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/icon-instagram.png" alt="Instagram" className="w-12 h-12 rounded-[14px] shadow-lg object-cover" draggable={false} />
                    </motion.a>
                    <motion.a whileTap={{ scale: 0.88 }} href="https://linkedin.com/in/zachwalnock" target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center p-3 shadow-lg"
                      style={{ background: '#0077b5', color: '#fff' }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </motion.a>
                  </div>
                </GlassEffect>
              </div>
            </motion.div>
          )}

          {mobileScreen === 'focused' && (
            <motion.div
              key={`mobile-app-${mobileApp}`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 flex flex-col"
              style={{ zIndex: 20, background: '#1c1c1e' }}
            >
              {/* iOS-style top bar */}
              <div
                className="flex-shrink-0 flex items-center px-4 pb-3"
                style={{ paddingTop: 56, borderBottom: '1px solid #3a3a3a' }}
              >
                <button
                  onClick={() => setMobileScreen('home')}
                  className="flex items-center gap-1"
                  style={{ color: '#0a84ff' }}
                >
                  <svg width="10" height="17" viewBox="0 0 10 17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 1L1.5 8.5L8.5 16" />
                  </svg>
                  <span style={{ fontSize: 17 }}></span>
                </button>
                <span className="flex-1 text-center font-semibold" style={{ color: '#f0f0f0', fontSize: 17 }}>
                  {MOBILE_APP_TITLES[mobileApp]}
                </span>
                <div style={{ width: 40 }} />
              </div>

              {/* App content */}
              <div className="flex-1 overflow-hidden">
                {mobileApp === 'contacts' && <ContactsApp isFocused={false} onExitFocused={() => setMobileScreen('home')} isMobile />}
                {mobileApp === 'projects' && <ProjectsApp isFocused={false} onExitFocused={() => setMobileScreen('home')} isMobile />}
                {mobileApp === 'mail'     && <MailApp     isFocused={false} onExitFocused={() => setMobileScreen('home')} isMobile />}
                {mobileApp === 'photos'   && <PhotosApp   isFocused={false} onExitFocused={() => setMobileScreen('home')} isMobile />}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    )
  }
  // ── End mobile render path ─────────────────────────────────────────────────

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

      {/* macOS menu bar — visible on desktop + focused states */}
      {(() => {
        const menuItems: Record<AppName, string[]> = {
          contacts: ['Contacts', 'File', 'Edit', 'View', 'Card', 'Window', 'Help'],
          mail:     ['Mail', 'File', 'Edit', 'View', 'Mailbox', 'Message', 'Window', 'Help'],
          projects: ['Projects', 'File', 'Edit', 'View', 'Window', 'Help'],
          photos:   ['Photos', 'File', 'Edit', 'View', 'Image', 'Window', 'Help'],
        }
        const items = appState === 'focused'
          ? menuItems[focusedApp]
          : menuItems['contacts']
        const show = appState === 'desktop' || appState === 'focused'

        return (
          <AnimatePresence>
            {show && (
              <motion.div
                key={`menubar-${appState}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute top-0 left-0 right-0 flex items-center justify-between px-4"
                style={{
                  height: 24,
                  background: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  zIndex: 55,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <div className="flex items-center gap-5">
                  <span style={{ fontSize: 15 }}>&#63743;</span>
                  {items.map((item, i) => (
                    <span
                      key={item}
                      className={i === 0 ? 'font-semibold' : ''}
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
        )
      })()}

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
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}
              >
                scroll to explore
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="2.5"
                strokeLinecap="round"
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

      {/* SVG filter for liquid glass — must be in DOM */}
      <GlassFilter />

      {/* Dock */}
      <Dock onMailClick={handleMailFromDock} onAppClick={handleAppFromDock} />
    </div>
  )
}
