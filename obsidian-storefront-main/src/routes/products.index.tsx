import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/lib/products";

type Search = { category?: string; sale?: number; q?: string };

export const Route = createFileRoute("/products/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" ? s.category : undefined,
    sale: s.sale ? 1 : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All — ATHR CORE" },
      { name: "description", content: "Browse ATHR CORE streetwear essentials, clean fits, and everyday pieces." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { products } = useStore();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const [sort, setSort] = useState<"new" | "low" | "high">("new");

  const filtered = useMemo(() => {
    let r = products;
    if (search.category) r = r.filter((p) => p.category === search.category);
    if (search.sale) r = r.filter((p) => p.salePrice);
    if (q) r = r.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "low") r = [...r].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    if (sort === "high") r = [...r].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    return r;
  }, [products, search, q, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold">
          {search.sale ? "Sale" : search.category ?? "All products"}
        </h1>
        <p className="text-muted-foreground mt-1">{filtered.length} products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-60 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search streetwear..."
              className="w-full rounded-full bg-input pl-10 pr-4 py-2.5 text-sm border border-border/60 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-3">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => navigate({ search: { ...search, category: undefined } })}
                className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${!search.category ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >All</button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => navigate({ search: { ...search, category: c } })}
                  className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${search.category === c ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >{c}</button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-3">Sort</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as never)}
              className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="new">Newest</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={!!search.sale}
              onChange={(e) => navigate({ search: { ...search, sale: e.target.checked ? 1 : undefined } })}
              className="accent-primary"
            />
            On sale only
          </label>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No products match your filters.</div>
          ) : (
            <div className="grid gap-5 grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
