import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Service, ServiceCategory } from '@/payload-types'

type ServiceAccordionProps = {
  groups: Array<{ category: ServiceCategory; services: Service[] }>
}

export function ServiceAccordion({ groups }: ServiceAccordionProps) {
  if (!groups.length) {
    return <p className="text-muted">Services menu coming soon.</p>
  }

  return (
    <Accordion type="multiple" className="w-full">
      {groups.map(({ category, services }) => (
        <AccordionItem key={category.id} value={String(category.id)}>
          <AccordionTrigger>{category.name}</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-6">
              {services.map((service) => (
                <li key={service.id} className="border-l-2 border-gold/30 pl-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg text-foreground">{service.name}</h3>
                    {service.durationMinutes ? (
                      <span className="text-xs uppercase tracking-wider text-gold/80">
                        {service.durationMinutes} min
                      </span>
                    ) : null}
                    {service.showPrice && service.price != null ? (
                      <span className="text-sm text-gold">${service.price}</span>
                    ) : null}
                  </div>
                  {service.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>
                  )}
                  {service.bullets && service.bullets.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                      {service.bullets.map((bullet, i) => (
                        <li key={i}>{typeof bullet === 'object' ? bullet.text : bullet}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
