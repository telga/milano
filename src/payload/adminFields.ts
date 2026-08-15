/** Shared helpers for friendlier Payload admin forms. */

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Cells that render plain language in list views instead of true/false. */
export const onWebsiteCell = {
  Cell: '/components/admin/cells/ListCells#OnWebsiteCell',
}

export const yesNoCell = {
  Cell: '/components/admin/cells/ListCells#YesNoCell',
}

export const priceCell = {
  Cell: '/components/admin/cells/ListCells#PriceCell',
}

export const minutesCell = {
  Cell: '/components/admin/cells/ListCells#MinutesCell',
}

export const photoCell = {
  Cell: '/components/admin/cells/PhotoCell',
}

export const publishedCheckbox = {
  name: 'published' as const,
  label: 'Show on website',
  type: 'checkbox' as const,
  defaultValue: true,
  admin: {
    position: 'sidebar' as const,
    description: 'Turn off to hide this from the website without deleting it.',
    components: onWebsiteCell,
  },
}

export const displayOrderField = {
  name: 'sortOrder' as const,
  label: 'Order on page',
  type: 'number' as const,
  defaultValue: 0,
  admin: {
    position: 'sidebar' as const,
    description: 'Lower numbers show first. Leave at 0 if the order does not matter.',
  },
}

/** Applied to every collection so staff never see the technical API tab or tiny pages. */
export const friendlyList = {
  hideAPIURL: true,
  pagination: {
    defaultLimit: 50,
    limits: [25, 50, 100],
  },
}
