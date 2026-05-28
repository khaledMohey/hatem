import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Minus, Plus, Heart, Truck, Shield, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency } from "@/lib/money";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md text-center py-32">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <Link to="/products" className="text-primary mt-4 inline-block">Browse all products →</Link>
    </div>
  ),
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { products, addToCart, wishlist, toggleWishlist } = useStore();
  const product = products.find((p) => p.id === id);
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);

  if (!product) throw notFound();
  const color = product.colors[colorIdx];
  const onSale = !!product.salePrice;
  const wished = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> /{" "}
        <Link to="/products" className="hover:text-primary">Shop</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="aspect-square rounded-3xl overflow-hidden glass border border-border/60 relative">
            {onSale && (
              <div className="absolute top-4 left-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                SALE -{Math.round((1 - product.salePrice! / product.price) * 100)}%
              </div>
            )}
            <img src={color.image} alt={product.name} className="h-full w-full object-cover transition-all duration-500" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition ${colorIdx === i ? "border-primary glow-ring" : "border-border/40"}`}
              >
                <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">{product.category}</p>
            <h1 className="font-display text-4xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3 text-sm">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-muted-foreground">{product.rating} · {product.stock} in stock</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            {onSale ? (
              <>
                <span className="font-display text-4xl font-bold text-gradient">{formatCurrency(product.salePrice!)}</span>
                <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="font-display text-4xl font-bold">{formatCurrency(product.price)}</span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div>
            <p className="text-sm font-semibold mb-2">Color: <span className="text-muted-foreground font-normal">{color.name}</span></p>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setColorIdx(i)}
                  className={`h-10 w-10 rounded-full border-2 transition ${colorIdx === i ? "border-primary scale-110" : "border-border/60"}`}
                  style={{ background: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {product.sizes && (
            <div>
              <p className="text-sm font-semibold mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] h-10 px-3 rounded-lg border text-sm transition ${size === s ? "border-primary bg-primary/10 text-primary" : "border-border/60 hover:border-primary/50"}`}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <div className="inline-flex items-center rounded-full border border-border/60 bg-card/40">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 flex items-center justify-center hover:text-primary"><Minus className="h-4 w-4" /></button>
              <span className="px-3 font-semibold w-10 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-11 w-11 flex items-center justify-center hover:text-primary"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => {
                if (product.sizes && !size) { toast.error("Select a size"); return; }
                addToCart({ productId: product.id, color: color.name, size, qty });
                toast.success(`Added ${qty} x ${product.name} to cart`);
              }}
              className="flex-1 rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition glow-ring"
            >
              Add to cart · {formatCurrency((product.salePrice ?? product.price) * qty)}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="h-12 w-12 rounded-full glass border border-border/60 flex items-center justify-center hover:text-primary transition"
            >
              <Heart className={`h-5 w-5 ${wished ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/40">
            {[
              { i: Truck, t: "Free shipping" },
              { i: RotateCcw, t: "30-day returns" },
              { i: Shield, t: "Premium quality" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-2 text-xs text-muted-foreground">
                <x.i className="h-4 w-4 text-primary" />{x.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
