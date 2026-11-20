import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

/**
 * Shared page-section wrapper: title + optional "see all" CTA + content.
 * Dedupes the `Section` helper that used to be copy-pasted between
 * home/index.jsx and faq/FAQ.jsx.
 */
export function SectionHeader({ title, cta, to, children }) {
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
