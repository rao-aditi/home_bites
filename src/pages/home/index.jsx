import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiMic, FiArrowRight, FiStar, FiClock, FiShield, FiTruck } from "react-icons/fi";
import { restaurants, foods, categories, offers, testimonials, faqs } from "../../data/mockData";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { FoodCard } from "@/components/cards/FoodCard";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { AiFillFire } from "react-icons/ai";
import FAQ from "../faq/FAQ";

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

export default function Home() {
  const { state } = useApp();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const recent = state.recentlyViewed
    .map((id) => foods.find((f) => f.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--gradient-glow)" }}
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary-foreground"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <AiFillFire className="h-4 w-4 text-white" />
              Trending in your city
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              Delicious food,
              <br />
              delivered in <span className="italic">30 mins</span>.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-white/90">
              Order from 10,000+ restaurants. Track your order live. Feel the flavor faster than
              ever.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
              }}
              className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-background p-2 shadow-elegant"
            >
              <FiSearch className="ml-3 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Enter your dish, restaurant or cuisine"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-foreground outline-none"
              />
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent"
                title="Voice search"
              >
                <FiMic />
              </button>
              <button className="rounded-full gradient-warm px-6 py-2.5 text-sm font-bold text-primary-foreground">
                Search
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              {[
                { icon: FiClock, label: "30 min delivery" },
                { icon: FiShield, label: "Safe & hygienic" },
                { icon: FiTruck, label: "Free delivery" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon /> {label}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="aspect-square overflow-hidden rounded-[3rem] shadow-elegant"
            >
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                alt="Delicious food"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-elegant"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-success/15 text-success text-xl">
                ✓
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Delivered</div>
                <div className="font-bold">In 28 minutes</div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-4 top-10 rounded-2xl bg-card p-4 shadow-elegant"
            >
              <div className="flex items-center gap-1 text-warning">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <div className="mt-1 text-xs font-bold">4.9 from 200k+ reviews</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <Section title="What's on your mind?" cta="See all" to="/categories">
        <div className="no-scrollbar flex gap-1 overflow-x-auto md:grid md:grid-cols-6 lg:grid-cols-11">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to="/search"
                search={{ q: c.name }}
                className="group flex min-w-[90px] flex-col items-center gap-2"
              >
                <div className="grid h-22 w-22 place-items-center rounded-full bg-accent transition group-hover:scale-110 group-hover:shadow-glow">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-18 w-18 object-contain"
                  />
                </div>
                <span className="text-sm font-semibold">{c.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Offers */}
      <Section title="Top offers for you" cta="All offers" to="/offers">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.slice(0, 3).map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${o.color} p-6 text-white shadow-elegant`}
            >
              <div className="text-xs font-semibold uppercase opacity-90">{o.subtitle}</div>
              <div className="mt-1 text-2xl font-extrabold">{o.title}</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
                CODE: {o.code}
              </div>
              <div className="absolute -bottom-6 -right-6 text-8xl opacity-20">🎁</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Popular */}
      <Section title="Popular restaurants" cta="View all" to="/restaurants">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.slice(0, 8).map((r, i) => (
            <RestaurantCard key={r.id} r={r} i={i} />
          ))}
        </div>
      </Section>

      {/* Recommended */}
      <Section title="Recommended for you">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {foods.slice(0, 8).map((f, i) => (
            <FoodCard key={f.id} f={f} i={i} />
          ))}
        </div>
      </Section>

      {/* Bestsellers */}
      <Section title="Best sellers this week">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {foods
            .filter((f) => f.isBestseller)
            .slice(0, 4)
            .map((f, i) => (
              <FoodCard key={f.id} f={f} i={i} />
            ))}
        </div>
      </Section>

      {/* Top rated */}
      <Section title="Top rated near you" cta="See all" to="/restaurants">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...restaurants]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
            .map((r, i) => (
              <RestaurantCard key={r.id} r={r} i={i} />
            ))}
        </div>
      </Section>

      {/* Recently viewed */}
      {recent.length > 0 && (
        <Section title="Recently viewed">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((f, i) => f && <FoodCard key={f.id} f={f} i={i} />)}
          </div>
        </Section>
      )}

      {/* Featured collections */}
      <Section title="Featured collections">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Rainy Day Comfort",
              count: 24,
              img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Under $10",
              count: 68,
              img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Healthy Bowls",
              count: 32,
              img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft"
            >
              <img
                src={c.img}
                alt={c.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <div className="text-xl font-extrabold">{c.title}</div>
                <div className="text-xs">{c.count} places</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* App download */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[3rem] gradient-hero p-8 text-primary-foreground md:p-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-3xl font-extrabold md:text-4xl">Get the Foodly app</h3>
              <p className="mt-3 max-w-md opacity-90">
                Faster ordering, personalized recommendations and exclusive in-app offers.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#" className="rounded-2xl bg-black px-5 py-3 text-sm font-bold">
                  App Store
                </a>
                <a href="#" className="rounded-2xl bg-black px-5 py-3 text-sm font-bold">
                  Google Play
                </a>
              </div>
            </div>
            <div className="relative h-56 md:h-72">
              <div
                className="absolute inset-0 opacity-90"
                style={{ backgroundImage: "var(--gradient-glow)" }}
              />
              <div className="absolute inset-0 grid place-items-center text-9xl">📱</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Section title="Loved by food lovers">
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border/40"
            >
              <div className="flex items-center gap-1 text-warning">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full" />
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <FAQ />
    </div>
  );
}
