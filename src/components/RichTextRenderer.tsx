type RichTextProps = {
  content?: unknown
  className?: string
}

export function RichTextRenderer({ content, className }: RichTextProps) {
  if (!content || typeof content !== 'object' || !('root' in (content as object))) {
    return null
  }

  const lexical = content as { root: unknown }

  const renderNode = (node: unknown, index: number): React.ReactNode => {
    if (!node || typeof node !== 'object') return null
    const n = node as Record<string, unknown>

    if (n.type === 'text') {
      return <span key={index}>{String(n.text || '')}</span>
    }

    const children = Array.isArray(n.children)
      ? n.children.map((child, i) => renderNode(child, i))
      : null

    switch (n.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed text-muted">
            {children}
          </p>
        )
      case 'heading': {
        const tag = n.tag === 'h3' ? 'h3' : n.tag === 'h4' ? 'h4' : 'h2'
        const Tag = tag
        return (
          <Tag key={index} className="mb-3 mt-8 font-display text-gold">
            {children}
          </Tag>
        )
      }
      case 'list':
        return (
          <ul key={index} className="mb-4 list-disc space-y-2 pl-6 text-muted">
            {children}
          </ul>
        )
      case 'listitem':
        return <li key={index}>{children}</li>
      default:
        return <div key={index}>{children}</div>
    }
  }

  const root = lexical.root as Record<string, unknown>
  const nodes = Array.isArray(root.children) ? root.children : []

  return <div className={className}>{nodes.map((node, i) => renderNode(node, i))}</div>
}
