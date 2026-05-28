import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useStore, cartTotals } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/products?category=T-Shirt", label: "T-Shirt" },
  { to: "/products?sale=1", label: "Sale" },
  { to: "/admin", label: "Admin" },
];

export function Navbar() {
  const { cart, products, setCartOpen } = useStore();
  const { count } = cartTotals(cart, products);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-border/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <img src="/athr-logo.png" alt="ATHR logo" className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" />
            <span className="font-display text-xl font-bold tracking-[0.32em]">
              ATHR<span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === l.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition">
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative h-9 w-9 flex items-center justify-center rounded-full text-foreground hover:bg-secondary transition"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1 glow-ring">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-full text-foreground hover:bg-secondary"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-border/40 px-4 py-4 flex flex-col gap-3 animate-fade-in">
            {links.map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
