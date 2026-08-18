import type { CollectionConfig } from 'payload'

import { METRICS_EVENT_TYPES } from '@/lib/metrics/types'

export const MetricsEvents: CollectionConfig = {
  slug: 'metrics-events',
  labels: {
    singular: 'Metrics event',
    plural: 'Metrics events',
  },
  admin: {
    hidden: true,
    useAsTitle: 'type',
    description: 'Internal first-party telemetry. Not shown in the admin CMS.',
  },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: METRICS_EVENT_TYPES.map((value) => ({ label: value, value })),
    },
    { name: 'path', type: 'text' },
    { name: 'step', type: 'text', index: true },
    { name: 'serviceKey', type: 'text' },
    { name: 'category', type: 'text' },
    { name: 'ok', type: 'checkbox' },
    { name: 'status', type: 'text' },
    { name: 'value', type: 'number' },
    { name: 'session', type: 'text', index: true },
    { name: 'day', type: 'text', index: true },
    { name: 'deploy', type: 'text' },
  ],
}
