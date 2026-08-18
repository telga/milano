import type { MergedBookingService } from '@/lib/abc-booking/types'
import type { Service, ServiceCategory } from '@/payload-types'

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function similarity(a: string, b: string): number {
  const na = normalizeName(a)
  const nb = normalizeName(b)
  if (na === nb) return 1
  if (na.includes(nb) || nb.includes(na)) return 0.8
  const aWords = new Set(na.split(' '))
  const bWords = nb.split(' ').filter((w) => aWords.has(w))
  return bWords.length / Math.max(aWords.size, nb.split(' ').length)
}

function cmsCategoryName(service: Service): string | undefined {
  return typeof service.category === 'object' && service.category
    ? service.category.name
    : undefined
}

function cmsCategorySort(service: Service): number | undefined {
  return typeof service.category === 'object' && service.category
    ? service.category.sortOrder ?? undefined
    : undefined
}

export function mergeAbcWithCmsServices(
  abcServices: MergedBookingService[],
  cmsServices: Service[],
): MergedBookingService[] {
  const cmsByAbcId = new Map<string, Service>()
  for (const cms of cmsServices) {
    const abcId = cms.abcServiceId
    if (abcId) cmsByAbcId.set(abcId, cms)
  }

  return abcServices.map((abc) => {
    const applyCms = (cms: Service): MergedBookingService => ({
      ...abc,
      cmsName: cms.name,
      cmsDescription: cms.description || undefined,
      name: cms.name,
      price: cms.showPrice && cms.price != null ? cms.price : abc.price,
      durationMinutes: cms.durationMinutes != null ? cms.durationMinutes : abc.durationMinutes,
      displayCategory: cmsCategoryName(cms) || abc.category,
      categorySortOrder: cmsCategorySort(cms),
      serviceSortOrder: cms.sortOrder ?? abc.index,
    })

    const byId = cmsByAbcId.get(abc.id)
    if (byId) return applyCms(byId)

    let best: Service | null = null
    let bestScore = 0
    for (const cms of cmsServices) {
      const score = similarity(abc.name, cms.name)
      if (score > bestScore) {
        bestScore = score
        best = cms
      }
    }

    if (best && bestScore >= 0.65) return applyCms(best)

    return {
      ...abc,
      displayCategory: abc.category,
      serviceSortOrder: abc.index,
    }
  })
}

function categoryMatchScore(abcLabel: string, cmsName: string): number {
  const a = normalizeName(abcLabel)
  const b = normalizeName(cmsName)
  if (a === b) return 1
  if (b.startsWith(a) || a.startsWith(b)) return 0.9
  if (b.includes(a) || a.includes(b)) return 0.8

  const aliases: Array<[RegExp, RegExp]> = [
    [/kid|child/, /kid|child/],
    [/dip/, /dip/],
    [/shellac|gel polish/, /shellac|gel polish/],
    [/gelx|gel x/, /gelx|gel x/],
    [/repair/, /repair/],
    [/additional|addon|add on/, /additional/],
    [/hard builder/, /hard builder/],
    [/poly/, /poly/],
    [/acrylic/, /acrylic/],
  ]
  for (const [left, right] of aliases) {
    if (left.test(a) && right.test(b)) return 0.85
  }

  return similarity(abcLabel, cmsName)
}

export function orderBookingCatalog(
  services: MergedBookingService[],
  cmsCategories: ServiceCategory[],
): { services: MergedBookingService[]; categories: string[] } {
  const categoryMeta = new Map<string, { sort: number; label: string }>()

  for (const service of services) {
    const abcLabel = service.category
    if (categoryMeta.has(abcLabel)) continue

    let best: ServiceCategory | null = null
    let bestScore = 0
    for (const cms of cmsCategories) {
      const score = categoryMatchScore(abcLabel, cms.name)
      if (score > bestScore) {
        bestScore = score
        best = cms
      }
    }

    const matched = Boolean(best && bestScore >= 0.65)
    categoryMeta.set(abcLabel, {
      sort: matched ? (best?.sortOrder ?? 999) : 1000 + (service.categorySortOrder ?? 999),
      label: matched && best ? best.name : abcLabel,
    })
  }

  const orderedAbcCategories = [...categoryMeta.entries()]
    .sort((a, b) => a[1].sort - b[1].sort || a[0].localeCompare(b[0]))
    .map(([abcLabel]) => abcLabel)

  const sorted = [...services].sort((a, b) => {
    const aCat = categoryMeta.get(a.category)?.sort ?? 9999
    const bCat = categoryMeta.get(b.category)?.sort ?? 9999
    if (aCat !== bCat) return aCat - bCat
    return (a.serviceSortOrder ?? a.index) - (b.serviceSortOrder ?? b.index)
  })

  const withLabels = sorted.map((service) => ({
    ...service,
    displayCategory: categoryMeta.get(service.category)?.label || service.category,
  }))

  const categories = orderedAbcCategories.map(
    (abcLabel) => categoryMeta.get(abcLabel)?.label || abcLabel,
  )

  return { services: withLabels, categories }
}
