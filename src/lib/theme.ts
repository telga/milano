export const THEME_STORAGE_KEY = 'milano-theme'

export type Theme = 'light' | 'dark'

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(stored: string | null): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return getSystemTheme()
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  root.dataset.theme = theme
}

/** Inline script for root layout — prevents FOUC before hydration. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;r.dataset.theme=t;}catch(e){}})();`
