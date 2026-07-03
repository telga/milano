import { SiteShell } from '@/components/SiteShell'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>
}
