export function AdminLogo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--theme-text)',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          height: '2.25rem',
          width: '2.25rem',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '999px',
          border: '1px solid #c9a45c',
          color: '#c9a45c',
          fontFamily: 'Georgia, serif',
          fontSize: '1.15rem',
        }}
      >
        M
      </span>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.18em', fontSize: '0.85rem' }}>
          MILANO NAILS
        </div>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', opacity: 0.7 }}>ADMIN</div>
      </div>
    </div>
  )
}

export function AdminIcon() {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        height: '1.75rem',
        width: '1.75rem',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '999px',
        border: '1px solid #c9a45c',
        color: '#c9a45c',
        fontFamily: 'Georgia, serif',
        fontSize: '0.95rem',
      }}
    >
      M
    </span>
  )
}
