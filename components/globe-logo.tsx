"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface GlobeLogoProps {
  size?: number
  className?: string
}

export function GlobeLogo({ size = 40, className = "" }: GlobeLogoProps) {
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

  const strokeWidth = Math.max(1, size / 40)
  const radius = (size - strokeWidth * 2) / 2

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-navy-400/20 to-navy-600/20 dark:from-cream-100/20 dark:to-cream-300/20 blur-sm"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width: size + 6, height: size + 6, left: -3, top: -3 }}
      />

      {/* Main globe container */}
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          style={{ transform: "rotateX(15deg)" }}
        >
          {/* Outer circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-navy-600 dark:text-cream-300"
          />

          {/* Latitude lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, index) => {
            const y = size / 2 - radius + ratio * (radius * 2)
            const ellipseWidth = Math.sqrt(radius * radius - Math.pow(y - size / 2, 2)) * 2

            return (
              <ellipse
                key={`lat-${index}`}
                cx={size / 2}
                cy={y}
                rx={ellipseWidth / 2}
                ry={ellipseWidth / 8}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth * 0.7}
                className="text-navy-500 dark:text-cream-400 opacity-60"
              />
            )
          })}

          {/* Equator - thicker line */}
          <ellipse
            cx={size / 2}
            cy={size / 2}
            rx={radius}
            ry={radius / 4}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 1.2}
            className="text-navy-600 dark:text-cream-300 opacity-80"
          />

          {/* Longitude lines - vertical ellipses */}
          {[0, 30, 60, 90, 120, 150].map((angle, index) => (
            <motion.ellipse
              key={`long-${index}`}
              cx={size / 2}
              cy={size / 2}
              rx={radius}
              ry={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth * 0.7}
              className="text-navy-500 dark:text-cream-400 opacity-50"
              style={{
                transformOrigin: `${size / 2}px ${size / 2}px`,
              }}
              animate={{ rotateZ: angle }}
              transition={{ duration: 0 }}
            />
          ))}

          {/* Prime meridian - thicker line */}
          <ellipse
            cx={size / 2}
            cy={size / 2}
            rx={radius}
            ry={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 1.2}
            className="text-navy-600 dark:text-cream-300 opacity-70"
          />
        </svg>

        {/* Rotating longitude lines for 3D effect */}
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          style={{ transform: "rotateX(15deg)" }}
          animate={{ rotateY: -360 }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* Moving longitude lines */}
          {[15, 45, 75, 105, 135, 165].map((angle, index) => (
            <motion.ellipse
              key={`moving-long-${index}`}
              cx={size / 2}
              cy={size / 2}
              rx={radius * 0.95}
              ry={radius * 0.95}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth * 0.5}
              className="text-navy-400 dark:text-cream-500 opacity-40"
              style={{
                transformOrigin: `${size / 2}px ${size / 2}px`,
              }}
              animate={{ rotateZ: angle }}
              transition={{ duration: 0 }}
            />
          ))}
        </motion.svg>

        {/* Central dot */}
        <div
          className="absolute bg-navy-600 dark:bg-cream-300 rounded-full"
          style={{
            width: strokeWidth * 2,
            height: strokeWidth * 2,
            left: size / 2 - strokeWidth,
            top: size / 2 - strokeWidth,
          }}
        />

        {/* Highlight arc for 3D effect */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          style={{ transform: "rotateX(15deg)" }}
        >
          <path
            d={`M ${size / 2 - radius * 0.7} ${size / 2 - radius * 0.5} 
                Q ${size / 2} ${size / 2 - radius * 0.8} 
                ${size / 2 + radius * 0.7} ${size / 2 - radius * 0.5}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 1.5}
            className="text-navy-300 dark:text-cream-200 opacity-60"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Orbital indicators */}
      <motion.div
        className="absolute inset-0"
        style={{
          width: size + 12,
          height: size + 12,
          left: -6,
          top: -6,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <div
          className="absolute w-1 h-1 bg-navy-400 dark:bg-cream-400 rounded-full opacity-60"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="absolute w-1 h-1 bg-navy-400 dark:bg-cream-400 rounded-full opacity-60"
          style={{
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="absolute w-1 h-1 bg-navy-400 dark:bg-cream-400 rounded-full opacity-60"
          style={{
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
          }}
        />
        <div
          className="absolute w-1 h-1 bg-navy-400 dark:bg-cream-400 rounded-full opacity-60"
          style={{
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
          }}
        />
      </motion.div>
    </div>
  )
}
