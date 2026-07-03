import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
import { revalidateGlobalOnChange } from '@/payload/hooks/revalidateOnChange'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      defaultValue: 'Milano Nail Spa Flower Mound',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Where glamour meets exquisite nail care',
    },
    {
      name: 'phone',
      type: 'text',
      defaultValue: '(214) 513-4800',
    },
    {
      name: 'email',
      type: 'email',
      defaultValue: 'milanonailflowermound@gmail.com',
    },
    {
      name: 'address',
      type: 'textarea',
      defaultValue: '5801 Long Prairie Road, Suite 680, Flower Mound, TX 75028',
    },
    {
      name: 'bookingUrl',
      type: 'text',
      defaultValue: 'https://abcapp.us/feedback/appointment?appid=tI8PdCO',
      required: true,
    },
    {
      name: 'aboutText',
      type: 'textarea',
      defaultValue:
        'Our nail salon is dedicated to bringing top-of-the-line products mixed with expert techniques to the nail salon industry. Offering many services such as Manicure, Pedicure, and Artificial Nails allows us to be a one-stop destination for those looking for a complete rejuvenating experience. The friendly staff creates an atmosphere of urban relaxation. We are always trying to be innovative with design and trend, always up-to-date with what the industry has to offer.',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'hours',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Mon – Sat', value: '9:00 AM – 7:00 PM' },
        { label: 'Sunday', value: '10:00 AM – 5:00 PM' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Google', value: 'google' },
          ],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Milano Nail Spa Flower Mound' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Luxury nail salon in Flower Mound, TX. Manicures, pedicures, nail art, lashes, and waxing.',
        },
      ],
    },
  ],
}
