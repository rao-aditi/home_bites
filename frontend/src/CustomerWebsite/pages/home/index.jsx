import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiMic, FiStar, FiClock, FiShield, FiTruck } from "react-icons/fi";
import { AiFillFire } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusiness } from "@/store/slice/CustomerSlice/businessSlice";
import { fetchFoods } from "@/store/slice/CustomerSlice/foodSlice";
import { fetchBanners } from "@/store/slice/CustomerSlice/bannerSlice";
import { fetchSections } from "@/store/slice/CustomerSlice/sectionSlice";
import { selectRecentlyViewed } from "@/store/slice/uiSlice";
import { FoodCard } from "@/CustomerWebsite/components/cards/FoodCard";
import { FoodGridSkeleton } from "@/CustomerWebsite/components/shared/FoodCardSkeleton";
import { SectionHeader } from "@/CustomerWebsite/components/shared/SectionHeader";
import { GlowBackground } from "@/CustomerWebsite/components/shared/GlowBackground";
import { testimonials } from "@/CustomerWebsite/data/mockData";
import FAQ from "../faq/FAQ";

const EMPTY_LIST = [];
const SECTION_LINK = { categories: "/categories", offers: "/offers" };

function HomeSection({ section }) {
  const { type, title, description, items } = section;
  if (!items || items.length === 0) return null;
  const to = SECTION_LINK[type] || "/menu";
  const cta = type === "categories" ? "See all" : type === "offers" ? "All offers" : "Full menu";

  return (
    <SectionHeader title={title} cta={cta} to={to}>
      {description && <p className="-mt-3 mb-5 text-sm text-muted-foreground">{description}</p>}

      {type === "categories" && (
        <div className="no-scrollbar flex gap-1 overflow-x-auto md:grid md:grid-cols-6 lg:grid-cols-11">
          {items.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/menu?category=${encodeURIComponent(c.id)}`}
                className="group flex min-w-[90px] flex-col items-center gap-2"
              >
                <div className="grid h-22 w-22 place-items-center rounded-full bg-accent transition group-hover:scale-110 group-hover:shadow-glow">
                  <img src={c.image} alt={c.name} className="h-18 w-18 object-contain" />
                </div>
                <span className="text-sm font-semibold">{c.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {type === "offers" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((o, i) => (
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
      )}

      {type !== "categories" && type !== "offers" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((f, i) => (
            <FoodCard key={f.id} f={f} i={i} />
          ))}
        </div>
      )}
    </SectionHeader>
  );
}

export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const recentlyViewedIds = useSelector(selectRecentlyViewed);

  const dispatch = useDispatch();
  const business = useSelector((state) => state.customerBusiness.business);
  const allFoods = useSelector((state) => state.customerFood.foods);
  // Admin-managed content: banners and the ordered, visible homepage sections.
  const heroBanners = useSelector((state) => state.customerBanner.banners.hero) ?? EMPTY_LIST;
  const promoBanners = useSelector((state) => state.customerBanner.banners.promo) ?? EMPTY_LIST;
  const { sections, loaded: sectionsLoaded } = useSelector((state) => state.customerSection);
  const sectionsLoading = !sectionsLoaded;

  useEffect(() => {
    dispatch(fetchBusiness());
    dispatch(fetchFoods({}));
    dispatch(fetchBanners({ type: "hero" }));
    dispatch(fetchBanners({ type: "promo" }));
    dispatch(fetchSections());
  }, [dispatch]);

  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (heroBanners.length < 2) return undefined;
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroBanners.length), 6000);
    return () => clearInterval(t);
  }, [heroBanners.length]);
  const hero = heroBanners.length ? heroBanners[heroIndex % heroBanners.length] : null;

  const recentlyViewed = recentlyViewedIds
    .map((id) => allFoods.find((f) => f.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img
          src={hero?.image || business?.banner || "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1920&q=80"}
          alt={business?.name || "Delicious food"}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/60" />
        <div className="mx-auto flex min-h-[63vh] max-w-4xl flex-col items-center justify-center px-4 py-8 text-center text-white md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex w-full flex-col items-center"
          >
            <h1 className="mt-4 text-2xl font-extrabold uppercase leading-tight tracking-wide md:text-4xl max-w-xl">
              {hero?.title ||
                business?.tagline || (
                  <>
                    Delicious food,
                    <br />
                    delivered in <span className="italic">30 mins</span>.
                  </>
                )}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/90 md:text-base">
              {hero?.subtitle ||
                business?.description ||
                "Fresh, home-style meals made to order and delivered fast. Track your order live, every time."}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
              }}
              className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-md bg-white p-1.5 shadow-elegant"
            >
              <FiSearch className="ml-3 shrink-0 text-gray-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for a dish or category"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-left text-gray-900 outline-none placeholder:text-gray-500"
              />
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full text-gray-700 hover:bg-gray-100"
                title="Voice search"
              >
                <FiMic />
              </button>
              <button className="rounded-md bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-black/85">
                Search
              </button>
            </form>
            {hero?.linkUrl && (
              <Link
                to={hero.linkUrl}
                className="mt-5 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-bold backdrop-blur hover:bg-white/30"
              >
                Order now →
              </Link>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-success/30 text-lg">✓</div>
                <div className="text-left">
                  <div className="text-xs text-white/80">Delivered</div>
                  <div className="text-sm font-bold">In {business?.avgDeliveryTime || 28} minutes</div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-2 text-left backdrop-blur">
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className="fill-current" />
                  ))}
                </div>
                <div className="mt-1 text-xs font-bold">
                  {business?.rating || 4.9} from {business?.reviewsCount?.toLocaleString() || "thousands of"} reviews
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Promotional banners (managed in the admin panel) */}
      {promoBanners.length > 0 && (
        <section className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 md:grid-cols-2 md:px-6">
          {promoBanners.map((b) => {
            const body = (
              <div className="relative h-40 overflow-hidden rounded-3xl bg-muted shadow-soft md:h-48">
                <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                  <div className="text-lg font-extrabold">{b.title}</div>
                  {b.subtitle && <div className="text-sm opacity-90">{b.subtitle}</div>}
                </div>
              </div>
            );
            return b.linkUrl ? (
              <Link key={b.id} to={b.linkUrl}>{body}</Link>
            ) : (
              <div key={b.id}>{body}</div>
            );
          })}
        </section>
      )}

      {/* Sections: order, visibility, headings and contents are all admin-controlled */}
      {sectionsLoading && (
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <FoodGridSkeleton count={4} />
        </div>
      )}
      {sections.map((section) => (
        <HomeSection key={section.id} section={section} />
      ))}

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <SectionHeader title="Recently viewed">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewed.map((f, i) => (
              <FoodCard key={f.id} f={f} i={i} />
            ))}
          </div>
        </SectionHeader>
      )}

      {/* App download */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[3rem] gradient-hero p-8 text-primary-foreground md:p-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-3xl font-extrabold md:text-4xl">Get the HomeBites app</h3>
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
              <GlowBackground className="absolute inset-0 opacity-90" />
              <div className="absolute inset-0 grid place-items-center text-9xl">📱</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <SectionHeader title="Loved by food lovers">
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
                {Array.from({ length: 5 }).map((_, j) => (
                  <FiStar key={j} className="fill-current" />
                ))}
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
      </SectionHeader>

      <FAQ />
    </div>
  );
}
