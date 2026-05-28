import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatCurrency } from "@/lib/money";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const [colorIdx, setColorIdx] = useState(0);
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const color = product.colors[colorIdx];
  const onSale = !!product.salePrice;
  const wished = wishlist.includes(product.id);

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgb(36_107_255/0.35)]">
      {onSale && (
        <div className="absolute top-3 left-3 z-10 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          -{Math.round((1 - product.salePrice! / product.price) * 100)}%
        </div>
      )}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full glass flex items-center justify-center hover:text-primary transition"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : ""}`} />
      </button>

      <Link to="/products/$id" params={{ id: product.id }} className="block">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-secondary/40 to-background">
          <img
            src={color.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.category}</p>
            <Link to="/products/$id" params={{ id: product.id }} className="font-display font-semibold leading-tight hover:text-primary transition line-clamp-1">
              {product.name}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {product.rating}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setColorIdx(i)}
              aria-label={c.name}
              className={`h-5 w-5 rounded-full border-2 transition ${
                colorIdx === i ? "border-primary scale-110" : "border-border/60"
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            {onSale ? (
              <>
                <span className="font-display text-lg font-bold text-gradient">{formatCurrency(product.salePrice!)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="font-display text-lg font-bold">{formatCurrency(product.price)}</span>
            )}
          </div>
          <button
            onClick={() => {
              addToCart({ productId: product.id, color: color.name, qty: 1 });
              toast.success(`Added ${product.name} to cart`);
            }}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
