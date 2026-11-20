import { faqs } from "@/CustomerWebsite/data/mockData";
import { SectionHeader } from "@/CustomerWebsite/components/shared/SectionHeader";
import { FaqAccordion } from "@/CustomerWebsite/components/shared/FaqAccordion";

export default function FAQ() {
  return (
    <div>
      <SectionHeader title="Frequently asked questions">
        <div className="mx-auto max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </SectionHeader>
    </div>
  );
}
