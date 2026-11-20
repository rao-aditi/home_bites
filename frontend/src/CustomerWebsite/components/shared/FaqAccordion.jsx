import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Shared FAQ accordion used by both faq/FAQ.jsx (home page) and help.jsx,
 * which previously implemented near-identical accordions independently.
 */
export function FaqAccordion({ faqs, className = "" }) {
  return (
    <Accordion type="single" collapsible className={`w-full ${className}`}>
      {faqs.map((f, i) => (
        <AccordionItem
          key={i}
          value={`${i}`}
          className="mb-3 rounded-2xl border-none bg-card px-5 shadow-soft"
        >
          <AccordionTrigger className="text-left font-semibold hover:no-underline">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
