import { Link } from "react-router-dom";
import { faqs } from "@/data/mockData";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

function Section({ title, cta, to, children }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
            <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>
                {cta && to && (
                    <Link
                        to={to}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                        {cta} <FiArrowRight />
                    </Link>
                )}
            </div>
            {children}
        </section>
    );
}

export default function FAQ() {
    return (
        <div>
            <Section title="Frequently asked questions">
                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((f, i) => (
                            <AccordionItem
                                key={i}
                                value={`${i}`}
                                className="rounded-2xl border-none bg-card px-5 shadow-soft mb-3"
                            >
                                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                    {f.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </Section>
        </div>
    );
}
