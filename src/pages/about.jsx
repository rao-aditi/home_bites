import { motion } from "framer-motion";

const stats = [
  { v: "10K+", l: "Restaurants" },
  { v: "2M+", l: "Happy customers" },
  { v: "50+", l: "Cities" },
  { v: "30min", l: "Avg delivery" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden gradient-hero py-20 text-primary-foreground">
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-glow)" }} />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold md:text-6xl"
          >
            Bringing your cravings home.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg opacity-90"
          >
            Foodly is a beautifully crafted food-delivery platform obsessed with speed, quality and
            joy.
          </motion.p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-card p-6 text-center shadow-soft ring-1 ring-border/40"
            >
              <div className="text-3xl font-extrabold gradient-text">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold">Our mission</h2>
            <p className="mt-3 text-muted-foreground">
              We started Foodly because ordering food should feel like magic — not paperwork. Every
              pixel, every animation, every partner is chosen to make hungry moments delightful.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
            alt="Our story"
            className="aspect-video rounded-3xl object-cover shadow-elegant"
          />
        </div>
      </section>
    </div>
  );
}
