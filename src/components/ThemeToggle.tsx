'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  THEME_STORAGE_KEY,
  applyTheme,
  getSystemTheme,
  resolveTheme,
  type Theme,
} from '@/lib/theme'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const next = resolveTheme(localStorage.getItem(THEME_STORAGE_KEY))
      setTheme(next)
      applyTheme(next)
    } catch {
      const next = getSystemTheme()
      setTheme(next)
      applyTheme(next)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') return
      } catch {
        // ignore
      }
      const next = getSystemTheme()
      setTheme(next)
      applyTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mounted])

  const toggle = () => {
    if (!mounted) return
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!mounted}
      data-theme-ready={mounted ? 'true' : 'false'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-60',
        className,
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {mounted && theme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  )
}
