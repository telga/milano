import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dev dashboard — Milano',
  robots: { index: false, follow: false },
}

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>
}
