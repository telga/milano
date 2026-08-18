export const THEME_STORAGE_KEY = 'milano-theme'

export type Theme = 'light' | 'dark'

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  root.dataset.theme = theme
}

export function clearStoredTheme() {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY)
  } catch {
    // ignore
  }
}

/** Inline script for root layout — follows the device theme before hydration. */
export const THEME_INIT_SCRIPT = `(function(){try{try{localStorage.removeItem(${JSON.stringify(THEME_STORAGE_KEY)});}catch(e){}var t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;r.dataset.theme=t;}catch(e){}})();`
