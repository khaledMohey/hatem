import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ShoppingBag, Zap, Truck, Shield } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATHR CORE — Modern Streetwear" },
      { name: "description", content: "Modern streetwear focused on clean design, comfort, and timeless everyday style." },
      { property: "og:title", content: "ATHR CORE — Modern Streetwear" },
      { property: "og:description", content: "High-quality pieces with strong details and versatile fits made for daily wear." },
    ],
  }),
  component: Index,
});

const catIcons: Record<string, typeof ShoppingBag> = {
  "T-Shirt": ShoppingBag,
  Hoodies: ShoppingBag,
};

const heroSlides = [
  "/athr-slide-1.png",
  "/athr-slide-2.png",
  "/athr-slide-3.png",
  "/athr-slide-4.png",
  "/athr-slide-5.png",
];

function Index() {
  const { products } = useStore();
  const featured = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);
  const onSale = products.filter((p) => p.salePrice);
  const cats = categories;

  return (
    <div>
      <HeroCarousel />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 opacity-50">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/25 blur-[110px] animate-glow" />
          <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-white/10 blur-[120px]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-3 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.28em]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">Trace your path. Leave your mark.</span>
            </div>
            <div className="space-y-4">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.5em] text-primary">ATHR CORE</p>
              <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[0.04em] sm:text-7xl">
                CLEAN FITS.<br />
                <span className="text-gradient">DAILY CONFIDENCE.</span>
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              ATHR CORE is a modern streetwear brand focused on clean design, comfort, and timeless everyday style.
              We create high-quality pieces with strong details and versatile fits made for daily wear.
            </p>
            <p className="max-w-xl text-sm uppercase tracking-[0.22em] text-white/70">
              Built for people who appreciate simplicity, confidence, and authentic street culture.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/products" className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition glow-ring">
                Shop Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/products" search={{ sale: 1 } as never} className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold hover:border-primary/60 transition">
                Discounts
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-lg pt-8">
              {[
                { i: Truck, t: "Fast shipping", s: "Daily dispatch" },
                { i: Shield, t: "Quality build", s: "Strong details" },
                { i: Zap, t: "Core fits", s: "Made to move" },
              ].map((f) => (
                <div key={f.t} className="space-y-1">
                  <f.i className="h-5 w-5 text-primary" />
                  <p className="text-xs font-semibold">{f.t}</p>
                  <p className="text-[11px] text-muted-foreground">{f.s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
              <img src="/athr-logo.png" alt="ATHR primary logo" className="aspect-[4/3] w-full object-cover" />
              <div className="border-t border-white/10 p-5">
                <p className="font-display text-sm uppercase tracking-[0.45em] text-primary">Leave your mark</p>
                <p className="mt-2 text-sm text-muted-foreground">Black, white, graphite, and electric blue. Minimal by design, bold in the details.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold">Shop by category</h2>
            <p className="text-muted-foreground mt-1">Everyday essentials with a streetwear edge.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {cats.map((c) => {
            const Icon = catIcons[c] ?? ShoppingBag;
            return (
              <Link
                key={c}
                to="/products"
                search={{ category: c } as never}
                className="group relative aspect-square rounded-2xl glass border border-border/40 hover:border-primary/60 transition-all flex flex-col items-center justify-center gap-3 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/25 to-white/10 flex items-center justify-center group-hover:glow-ring transition">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-display font-semibold text-sm">{c}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <ProductRow title="Featured" subtitle="Core pieces selected for daily wear." items={featured} />

      {/* Sale */}
      <section className="relative my-16 py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Current drop</span>
              <h2 className="font-display text-3xl font-bold mt-1">Limited ATHR pieces</h2>
            </div>
            <Link to="/products" search={{ sale: 1 } as never} className="text-sm text-primary hover:underline">View all →</Link>
          </div>
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {onSale.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <ProductRow title="Best sellers" subtitle="Clean silhouettes people keep reaching for." items={bestSellers} />
    </div>
  );
}

function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden border-b border-border/40 sm:h-[88vh]">
      {heroSlides.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`ATHR campaign slide ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            active === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/20" />
      <div className="absolute inset-x-0 bottom-8 mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">ATHR CORE</p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-bold uppercase leading-none tracking-[0.08em] text-white sm:text-6xl">
            Leave Your Mark
          </h1>
        </div>
        <div className="hidden gap-2 sm:flex">
          {heroSlides.map((src, index) => (
            <button
              key={src}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${active === index ? "w-10 bg-primary" : "w-5 bg-white/45"}`}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductRow({ title, subtitle, items }: { title: string; subtitle: string; items: ReturnType<typeof useStore>["products"] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Link to="/products" className="text-sm text-primary hover:underline">View all →</Link>
      </div>
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
