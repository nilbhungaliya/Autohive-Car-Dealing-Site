"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ModernLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
}

export function ModernLogo({ className, size = "md", animated = true }: ModernLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
    lg: "h-16 w-auto",
    xl: "h-20 w-auto"
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const hiveVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  }

  const LogoComponent = (
    <div className={cn("flex items-center space-x-3", sizeClasses[size], className)}>
      <div className="relative">
        <svg
          viewBox="0 0 60 60"
          className="h-full w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal background with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main hexagon */}
          <motion.path
            d="M30 5 L45 15 L45 35 L30 45 L15 35 L15 15 Z"
            fill="url(#logoGradient)"
            stroke="white"
            strokeWidth="2"
            filter="url(#glow)"
            variants={animated ? hiveVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
          />
          
          {/* Inner hexagon pattern */}
          <motion.path
            d="M30 12 L38 18 L38 30 L30 36 L22 30 L22 18 Z"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.8"
            variants={animated ? hiveVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            transition={{ delay: 0.3 }}
          />
          
          {/* Car silhouette */}
          <motion.path
            d="M18 28 L20 25 L25 25 L27 23 L33 23 L35 25 L40 25 L42 28 L42 32 L40 32 L40 30 L38 30 L38 32 L22 32 L22 30 L20 30 L20 32 L18 32 Z"
            fill="white"
            variants={animated ? hiveVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            transition={{ delay: 0.6 }}
          />
          
          {/* Wheels */}
          <motion.circle
            cx="24"
            cy="30"
            r="2"
            fill="white"
            variants={animated ? hiveVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            transition={{ delay: 0.8 }}
          />
          <motion.circle
            cx="36"
            cy="30"
            r="2"
            fill="white"
            variants={animated ? hiveVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            transition={{ delay: 0.8 }}
          />
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className="font-heading font-bold text-2xl gradient-text leading-none">
          AutoHive
        </span>
        <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
          Premium Cars
        </span>
      </div>
    </div>
  )

  if (animated) {
    return (
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {LogoComponent}
      </motion.div>
    )
  }

  return LogoComponent
}