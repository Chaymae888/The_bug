'use client'

import StickBug from '@/components/StickBug'
import styles from '@/components/StickBug.module.css'
import Image from 'next/image'
import logo_light from '@/public/images/bug-logo-light.png'
import logo_dark from '@/public/images/bug-logo-dark.png'
import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function AuthLayout({
  children, 
}: {
  children: React.ReactNode
}) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute top-4 left-4 z-20">
        <Image 
          src={theme === 'dark' ? logo_dark : logo_light}
          alt="Logo"
          width={100}
          height={50}
          className="h-auto"
        />
      </div>

      <button 
        onClick={toggleTheme}
        className="absolute top-8 right-8 z-20 p-2 rounded-full bg-backgroundSecondary text-buttons dark:text-buttons"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <div className={styles['stickbug-container']}>
        {[...Array(20)].map((_, i) => (
          <StickBug key={i} />
        ))}
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}