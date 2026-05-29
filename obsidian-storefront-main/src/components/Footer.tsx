export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img src="/athr-logo.png" alt="ATHR logo" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10" />
            <span className="font-display font-bold tracking-[0.24em]">ATHR</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Modern streetwear focused on clean design, comfort, and timeless everyday style.
          </p>
        </div>
        {[
          { h: "Shop", l: ["New Arrivals", "Best Sellers", "Core Fits", "T-Shirt"] },
          { h: "Support", l: ["Help Center", "Shipping", "Returns", "Size Guide"] },
          { h: "Company", l: ["About ATHR", "Culture", "Journal", "Contact"] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="font-display font-semibold mb-3">{col.h}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.l.map((x) => <li key={x} className="hover:text-primary transition cursor-pointer">{x}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
          <p>© {new Date().getFullYear()} ATHR CORE — Leave your mark.</p>
          <div className="flex items-center gap-3">
            <img src="/ak-tech-logo.png" alt="AK Tech logo" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-semibold text-foreground">Created by AK Tech Company</p>
              <p>01010380701</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
