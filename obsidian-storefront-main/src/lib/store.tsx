import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { deleteProduct as apiDeleteProduct, fetchProducts, saveProduct as apiSaveProduct } from "./api";
import { seedProducts, type Product } from "./products";

export type CartItem = {
  productId: string;
  color: string;
  size?: string;
  qty: number;
};

type StoreCtx = {
  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;
  saveProduct: (product: Product, exists: boolean) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, color: string, size?: string) => void;
  updateQty: (productId: string, color: string, qty: number, size?: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
};

const Ctx = createContext<StoreCtx | null>(null);
const CART_KEY = "athr_cart_v1";
const WISH_KEY = "athr_wishlist_v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(seedProducts);
  const [productsLoading, setProductsLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    void refreshProducts();
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
      const w = localStorage.getItem(WISH_KEY);
      if (w) setWishlist(JSON.parse(w));
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      setProductsState(await fetchProducts());
    } catch (error) {
      console.warn("Using local seed products because API is unavailable.", error);
      setProductsState(seedProducts);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const saveProduct = useCallback(async (product: Product, exists: boolean) => {
    const saved = await apiSaveProduct(product, exists);
    setProductsState((prev) => (exists ? prev.map((item) => item.id === saved.id ? saved : item) : [saved, ...prev]));
    return saved;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await apiDeleteProduct(id);
    setProductsState((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo<StoreCtx>(() => ({
    products,
    productsLoading,
    refreshProducts,
    saveProduct,
    deleteProduct,
    cart,
    addToCart: (item) => {
      setCart((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === item.productId && i.color === item.color && i.size === item.size,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
          return next;
        }
        return [...prev, item];
      });
    },
    removeFromCart: (productId, color, size) =>
      setCart((prev) => prev.filter((i) => !(i.productId === productId && i.color === color && i.size === size))),
    updateQty: (productId, color, qty, size) =>
      setCart((prev) => prev.map((i) =>
        i.productId === productId && i.color === color && i.size === size ? { ...i, qty: Math.max(1, qty) } : i,
      )),
    clearCart: () => setCart([]),
    cartOpen, setCartOpen,
    wishlist,
    toggleWishlist: (id) => setWishlist((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id]),
  }), [products, productsLoading, refreshProducts, saveProduct, deleteProduct, cart, cartOpen, wishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}

export function cartTotals(cart: CartItem[], products: Product[]) {
  let count = 0, subtotal = 0;
  for (const item of cart) {
    const p = products.find((x) => x.id === item.productId);
    if (!p) continue;
    const price = p.salePrice ?? p.price;
    count += item.qty;
    subtotal += price * item.qty;
  }
  return { count, subtotal };
}
