'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  mobile?: boolean
}

export function ThemeToggle({ mobile = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size={mobile ? "sm" : "icon"}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      className={mobile ? 'justify-start w-full px-2' : 'h-8 w-8 rounded-full'}
    >
      {isDarkMode ? (
        <>
          <Sun size={16} className="text-yellow-400" />
          {mobile && <span className="ml-2">Light Mode</span>}
        </>
      ) : (
        <>
          <Moon size={16} className="text-primary" />
          {mobile && <span className="ml-2">Dark Mode</span>}
        </>
      )}
    </Button>
  )
}