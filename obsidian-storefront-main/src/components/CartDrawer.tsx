import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { createOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/money";
import { useStore, cartTotals } from "@/lib/store";

const INSTAPAY_NUMBER = "01114066864";

export function CartDrawer() {
  const { cart, products, cartOpen, setCartOpen, updateQty, removeFromCart, clearCart } = useStore();
  const { subtotal, count } = cartTotals(cart, products);
  const [checkingOut, setCheckingOut] = useState(false);
  const [customer, setCustomer] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    notes: "",
    paymentMethod: "cash" as "cash" | "instapay",
    paymentScreenshot: null as File | null,
  });

  const submitOrder = async () => {
    if (!customer.customerName || !customer.customerPhone || !customer.address) {
      toast.error("Add your name, phone, and address");
      return;
    }
    if (customer.paymentMethod === "instapay" && !customer.paymentScreenshot) {
      toast.error("Upload the InstaPay payment screenshot");
      return;
    }
    setCheckingOut(true);
    try {
      await createOrder({ ...customer, items: cart });
      clearCart();
      setCartOpen(false);
      setCustomer({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        address: "",
        notes: "",
        paymentMethod: "cash",
        paymentScreenshot: null,
      });
      toast.success("Order placed successfully");
    } catch {
      toast.error("Could not place order");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm transition-opacity ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] glass border-l border-border/60 transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-5 border-b border-border/40">
            <h3 className="font-display text-lg font-bold">Your Cart ({count})</h3>
            <button onClick={() => setCartOpen(false)} className="h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="h-20 w-20 rounded-full glass flex items-center justify-center glow-ring">
                <ShoppingBag className="h-9 w-9 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add an ATHR piece to get started.</p>
              </div>
              <Link
                to="/products"
                onClick={() => setCartOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition glow-ring"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.map((item) => {
                  const p = products.find((x) => x.id === item.productId);
                  if (!p) return null;
                  const c = p.colors.find((c) => c.name === item.color) ?? p.colors[0];
                  const price = p.salePrice ?? p.price;
                  return (
                    <div key={`${item.productId}-${item.color}-${item.size ?? ""}`} className="flex gap-3 p-3 rounded-xl bg-card/60 border border-border/40">
                      <img src={c.image} alt={p.name} className="h-20 w-20 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.color}{item.size && ` · Size ${item.size}`}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="inline-flex items-center rounded-full border border-border/60 bg-background/60">
                            <button onClick={() => updateQty(p.id, item.color, item.qty - 1, item.size)} className="h-7 w-7 flex items-center justify-center hover:text-primary"><Minus className="h-3 w-3" /></button>
                            <span className="px-2 text-sm font-medium w-6 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(p.id, item.color, item.qty + 1, item.size)} className="h-7 w-7 flex items-center justify-center hover:text-primary"><Plus className="h-3 w-3" /></button>
                          </div>
                          <span className="text-sm font-semibold">{formatCurrency(price * item.qty)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(p.id, item.color, item.size)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="p-5 border-t border-border/40 space-y-3 glass">
                <div className="grid gap-2">
                  <input
                    value={customer.customerName}
                    onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                    placeholder="Full name"
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    value={customer.customerPhone}
                    onChange={(e) => setCustomer({ ...customer, customerPhone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    value={customer.customerEmail}
                    onChange={(e) => setCustomer({ ...customer, customerEmail: e.target.value })}
                    placeholder="Email (optional)"
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <textarea
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="Delivery address"
                    rows={2}
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`rounded-xl border px-3 py-2 text-sm cursor-pointer transition ${customer.paymentMethod === "cash" ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted-foreground"}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={customer.paymentMethod === "cash"}
                        onChange={() => setCustomer({ ...customer, paymentMethod: "cash", paymentScreenshot: null })}
                        className="sr-only"
                      />
                      Cash on delivery
                    </label>
                    <label className={`rounded-xl border px-3 py-2 text-sm cursor-pointer transition ${customer.paymentMethod === "instapay" ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted-foreground"}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="instapay"
                        checked={customer.paymentMethod === "instapay"}
                        onChange={() => setCustomer({ ...customer, paymentMethod: "instapay" })}
                        className="sr-only"
                      />
                      InstaPay
                    </label>
                  </div>
                  {customer.paymentMethod === "instapay" && (
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">
                      <p className="font-semibold text-primary">InstaPay: {INSTAPAY_NUMBER}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Transfer the total, then upload the payment screenshot.</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCustomer({ ...customer, paymentScreenshot: e.target.files?.[0] ?? null })}
                        className="mt-3 block w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold">Total</span>
                  <span className="font-display text-xl font-bold text-gradient">{formatCurrency(subtotal)}</span>
                </div>
                <button
                  onClick={submitOrder}
                  disabled={checkingOut}
                  className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition glow-ring disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkingOut ? "Placing order..." : "Checkout"}
                </button>
                <button onClick={clearCart} className="w-full text-xs text-muted-foreground hover:text-destructive">Clear cart</button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
