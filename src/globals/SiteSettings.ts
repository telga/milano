import type { GlobalConfig } from 'payload'

import { adminField, anyone, authenticated, hideFromEditors } from '@/payload/access'
import { revalidateGlobalOnChange } from '@/payload/hooks/revalidateOnChange'
import { trackEvent } from '@/lib/metrics/track'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Hours & Contact',
  admin: {
    group: 'Website Basics',
    hideAPIURL: true,
    description:
      'Phone, address, opening hours, and the About paragraph. Changes here update every page that shows them.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      revalidateGlobalOnChange,
      ({ req, doc }) => {
        if (req?.user) {
          void trackEvent({ type: 'admin_save', status: 'site-settings' })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          description: 'How customers reach the salon.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'businessName',
                  label: 'Business name',
                  type: 'text',
                  defaultValue: 'Milano Nail Spa Flower Mound',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'tagline',
                  label: 'Short tagline',
                  type: 'text',
                  defaultValue: 'Where glamour meets exquisite nail care',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  label: 'Phone number',
                  type: 'text',
                  defaultValue: '(214) 513-4800',
                  admin: {
                    width: '50%',
                    description: 'Shown in the header, footer, and contact page.',
                  },
                },
                {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  defaultValue: 'milanonailflowermound@gmail.com',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'address',
              label: 'Street address',
              type: 'textarea',
              defaultValue: '5801 Long Prairie Road, Suite 680, Flower Mound, TX 75028',
            },
            {
              name: 'logo',
              label: 'Logo (optional)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Used in popups and some branded spots. The header uses the gold “M” seal.',
              },
            },
          ],
        },
        {
          label: 'Hours',
          description: 'Opening hours shown on the Contact page.',
          fields: [
            {
              name: 'hours',
              label: 'Opening hours',
              type: 'array',
              labels: {
                singular: 'Row of hours',
                plural: 'Rows of hours',
              },
              admin: {
                description:
                  'One row per line of hours. Use “Add row” for holiday hours, and drag rows to reorder them.',
                components: {
                  RowLabel: '/components/admin/cells/RowLabels#HoursRowLabel',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      label: 'Days',
                      type: 'text',
                      required: true,
                      admin: { width: '40%', placeholder: 'Mon – Sat' },
                    },
                    {
                      name: 'value',
                      label: 'Open hours',
                      type: 'text',
                      required: true,
                      admin: { width: '60%', placeholder: '9:00 AM – 7:00 PM' },
                    },
                  ],
                },
              ],
              defaultValue: [
                { label: 'Mon – Sat', value: '9:00 AM – 7:00 PM' },
                { label: 'Sunday', value: '10:00 AM – 5:00 PM' },
              ],
            },
          ],
        },
        {
          label: 'Website text',
          fields: [
            {
              name: 'aboutText',
              label: 'About paragraph',
              type: 'textarea',
              defaultValue:
                'Our nail salon is dedicated to bringing top-of-the-line products mixed with expert techniques to the nail salon industry. Offering many services such as Manicure, Pedicure, and Artificial Nails allows us to be a one-stop destination for those looking for a complete rejuvenating experience. The friendly staff creates an atmosphere of urban relaxation. We are always trying to be innovative with design and trend, always up-to-date with what the industry has to offer.',
              admin: {
                description: 'Shown on the About / homepage “passion” section.',
              },
            },
            {
              name: 'socialLinks',
              label: 'Social media links',
              type: 'array',
              labels: {
                singular: 'Social link',
                plural: 'Social links',
              },
              fields: [
                {
                  name: 'platform',
                  label: 'Platform',
                  type: 'select',
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Google', value: 'google' },
                  ],
                  required: true,
                  admin: { width: '40%' },
                },
                {
                  name: 'url',
                  label: 'Full URL',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '60%',
                    placeholder: 'https://…',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Navigation',
          description: 'Choose which pages customers see in the header and footer menus.',
          fields: [
            {
              name: 'hiddenNavigationItems',
              label: 'Hide pages from website menus',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Home', value: 'home' },
                { label: 'About Us', value: 'about' },
                { label: 'Promotions', value: 'promotions' },
                { label: 'Specialties', value: 'specialties' },
                { label: 'Services', value: 'services' },
                { label: 'Gallery', value: 'gallery' },
                { label: 'Blog', value: 'blog' },
                { label: 'Contact', value: 'contact' },
              ],
              admin: {
                description:
                  'Select any pages you want to remove from both the desktop/mobile header and footer. The page itself remains available through its direct link.',
              },
            },
          ],
        },
        {
          label: 'Service cards',
          description: 'Display options for service-category cards across the website.',
          fields: [
            {
              name: 'hideServiceCardIcons',
              label: 'Hide icons on service cards',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Turn this on to remove the small gold icons from service cards on the homepage and Services page.',
              },
            },
          ],
        },
        {
          label: 'Booking',
          description: 'How customers book appointments on the website.',
          fields: [
            {
              name: 'useCustomBookingFrontend',
              label: 'Use Milano booking page',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'When on, Book buttons open the styled booking page on this website. When off, they go straight to the ABC Salon booking link.',
              },
            },
            {
              name: 'useNativeAbcBooking',
              label: 'Use native Milano booking UI',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'When on (and custom booking is on), visitors see the full Milano-styled booking wizard powered by ABC Salon underneath. When off, the ABC form is embedded in an iframe.',
              },
            },
          ],
        },
        {
          label: 'Advanced',
          description: 'Technical settings — admins only.',
          fields: [
            {
              name: 'bookingUrl',
              label: 'Online booking link',
              type: 'text',
              defaultValue: 'https://abcapp.us/feedback/appointment?appid=tI8PdCO',
              required: true,
              access: {
                update: adminField,
              },
              admin: {
                description:
                  'ABC Salon POS appointment URL. Only change this if your booking provider changes.',
                condition: (_data, _sibling, { user }) => !hideFromEditors({ user }),
              },
            },
            {
              name: 'seo',
              label: 'Search engine text (SEO)',
              type: 'group',
              access: {
                update: adminField,
              },
              admin: {
                condition: (_data, _sibling, { user }) => !hideFromEditors({ user }),
                description: 'Defaults used for Google title/description when a page has no custom SEO.',
              },
              fields: [
                {
                  name: 'title',
                  label: 'Default page title',
                  type: 'text',
                  defaultValue: 'Milano Nail Spa Flower Mound',
                },
                {
                  name: 'description',
                  label: 'Default meta description',
                  type: 'textarea',
                  defaultValue:
                    'Luxury nail salon in Flower Mound, TX. Manicures, pedicures, nail art, lashes, and waxing.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
