"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Globe3DProps {
  size?: number
  className?: string
}

export function Globe3D({ size = 32, className = "" }: Globe3DProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br from-navy-600 to-navy-700 dark:from-cream-200 dark:to-cream-300 ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  const strokeWidth = Math.max(0.8, size / 50)
  const radius = (size - strokeWidth * 4) / 2
  const center = size / 2

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        perspective: `${size * 3}px`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(59, 130, 246, 0.05) 50%, 
            transparent 70%
          )`,
          width: size + 8,
          height: size + 8,
          left: -4,
          top: -4,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Main rotating globe container */}
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: 360,
          rotateX: [0, 2, 0, -2, 0], // Subtle wobble like Earth's axis
        }}
        transition={{
          rotateY: {
            duration: 24, // 24 seconds for full rotation (Earth takes 24 hours)
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
          rotateX: {
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      >
        {/* Base sphere outline */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          style={{
            transform: "rotateX(23.5deg)", // Earth's axial tilt
            transformOrigin: "center center",
          }}
        >
          {/* Outer sphere */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 1.5}
            className="text-navy-600 dark:text-cream-300"
            opacity={0.8}
          />

          {/* Latitude lines (parallels) */}
          {[-60, -30, 0, 30, 60].map((lat, index) => {
            const y = center + (lat / 90) * radius * 0.8
            const ellipseRx = Math.cos((lat * Math.PI) / 180) * radius
            const ellipseRy = ellipseRx * 0.15 // Flattened for 3D effect

            return (
              <ellipse
                key={`lat-${index}`}
                cx={center}
                cy={y}
                rx={ellipseRx}
                ry={ellipseRy}
                fill="none"
                stroke="currentColor"
                strokeWidth={lat === 0 ? strokeWidth * 1.2 : strokeWidth * 0.8} // Equator is thicker
                className={lat === 0 ? "text-navy-500 dark:text-cream-400" : "text-navy-400 dark:text-cream-500"}
                opacity={lat === 0 ? 0.9 : 0.6}
              />
            )
          })}

          {/* Longitude lines (meridians) - static ones */}
          {[0, 30, 60, 90, 120, 150].map((lng, index) => (
            <ellipse
              key={`lng-static-${index}`}
              cx={center}
              cy={center}
              rx={radius}
              ry={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={lng === 0 ? strokeWidth * 1.2 : strokeWidth * 0.7} // Prime meridian is thicker
              className={lng === 0 ? "text-navy-500 dark:text-cream-400" : "text-navy-400 dark:text-cream-500"}
              opacity={lng === 0 ? 0.8 : 0.5}
              style={{
                transformOrigin: `${center}px ${center}px`,
                transform: `rotateZ(${lng}deg)`,
              }}
            />
          ))}

          {/* Tropic lines */}
          <ellipse
            cx={center}
            cy={center - radius * 0.4}
            rx={radius * 0.9}
            ry={radius * 0.12}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 0.6}
            className="text-navy-300 dark:text-cream-600"
            opacity={0.4}
            strokeDasharray="2,2"
          />
          <ellipse
            cx={center}
            cy={center + radius * 0.4}
            rx={radius * 0.9}
            ry={radius * 0.12}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 0.6}
            className="text-navy-300 dark:text-cream-600"
            opacity={0.4}
            strokeDasharray="2,2"
          />
        </svg>

        {/* Rotating longitude lines for 3D depth */}
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          style={{
            transform: "rotateX(23.5deg)",
            transformOrigin: "center center",
          }}
          animate={{ rotateY: -360 }}
          transition={{
            duration: 16, // Different speed for depth effect
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {[15, 45, 75, 105, 135, 165].map((lng, index) => (
            <ellipse
              key={`lng-moving-${index}`}
              cx={center}
              cy={center}
              rx={radius * 0.98}
              ry={radius * 0.98}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth * 0.5}
              className="text-navy-300 dark:text-cream-600"
              opacity={0.3}
              style={{
                transformOrigin: `${center}px ${center}px`,
                transform: `rotateZ(${lng}deg)`,
              }}
            />
          ))}
        </motion.svg>

        {/* Polar caps */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          style={{
            transform: "rotateX(23.5deg)",
            transformOrigin: "center center",
          }}
        >
          {/* North pole */}
          <circle
            cx={center}
            cy={center - radius * 0.85}
            r={radius * 0.15}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 0.8}
            className="text-navy-400 dark:text-cream-500"
            opacity={0.6}
            strokeDasharray="1,1"
          />
          {/* South pole */}
          <circle
            cx={center}
            cy={center + radius * 0.85}
            r={radius * 0.15}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 0.8}
            className="text-navy-400 dark:text-cream-500"
            opacity={0.6}
            strokeDasharray="1,1"
          />
        </svg>

        {/* Axis indicator */}
        <div
          className="absolute w-px bg-navy-500 dark:bg-cream-400 opacity-30"
          style={{
            height: size * 1.2,
            left: center - 0.5,
            top: -size * 0.1,
            transform: "rotateZ(23.5deg)",
            transformOrigin: "center center",
          }}
        />

        {/* Highlight for 3D effect */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          style={{
            transform: "rotateX(23.5deg)",
            transformOrigin: "center center",
          }}
        >
          <defs>
            <radialGradient id="highlight" cx="0.3" cy="0.3" r="0.7">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={center} cy={center} r={radius} fill="url(#highlight)" className="text-white dark:text-navy-900" />
        </svg>
      </motion.div>

      {/* Orbital ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed border-navy-300/20 dark:border-cream-300/20"
        style={{
          width: size + 16,
          height: size + 16,
          left: -8,
          top: -8,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 60, // Slow orbital animation
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}
