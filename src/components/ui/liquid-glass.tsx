'use client'

import React from 'react'

interface GlassEffectProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`relative flex overflow-hidden ${className}`}
      style={{
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      {/* Blur + SVG distortion layer */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        style={{
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          filter: 'url(#glass-distortion)',
          isolation: 'isolate',
        }}
      />
      {/* White tint */}
      <div
        className="absolute inset-0 z-10 rounded-[inherit]"
        style={{ background: 'rgba(255, 255, 255, 0.20)' }}
      />
      {/* Inner highlight shine */}
      <div
        className="absolute inset-0 z-20 overflow-hidden rounded-[inherit]"
        style={{
          boxShadow:
            'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
        }}
      />
      {/* Content */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  )
}

export const GlassFilter: React.FC = () => (
  <svg style={{ display: 'none' }} aria-hidden="true">
    <defs>
      <filter
        id="glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0 0.005"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="5"
          specularConstant="1"
          specularExponent="100"
          lightingColor="white"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="200"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
)
