import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { clearOrders, deleteOrder, fetchOrders, markOrderDone, type Order } from "@/lib/api";
import { formatCurrency } from "@/lib/money";
import { categories, SIZE_OPTIONS, type Product } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ATHR CORE" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const ADMIN_PASS = "admin123";

function AdminPage() {
  const [authed, setAuthed] = useState(() => typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "1");
  const [pass, setPass] = useState("");

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === ADMIN_PASS) {
              sessionStorage.setItem("admin_auth", "1");
              setAuthed(true);
              toast.success("Welcome, admin");
            } else toast.error("Incorrect password");
          }}
          className="glass rounded-3xl p-8 w-full max-w-sm space-y-4 border border-border/60"
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center glow-ring">
              <Lock className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mt-3">Admin access</h1>
            <p className="text-xs text-muted-foreground mt-1">Demo password: <span className="text-primary">admin123</span></p>
          </div>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="w-full rounded-full bg-input border border-border/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <button className="w-full rounded-full bg-primary py-2.5 font-semibold text-primary-foreground glow-ring">Sign in</button>
        </form>
      </div>
    );
  }

  return <Dashboard />;
}

function emptyProduct(): Product {
  return {
    id: crypto.randomUUID().slice(0, 8),
    name: "", description: "", price: 0, colors: [{ name: "Default", hex: "#000000", image: "" }],
    images: [], category: categories[0], stock: 0, featured: false, rating: 5, sizes: SIZE_OPTIONS,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

function Dashboard() {
  const { products, productsLoading, saveProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      setOrders(await fetchOrders());
    } catch {
      toast.error("Could not load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const completeOrder = async (id: number) => {
    try {
      const updated = await markOrderDone(id);
      setOrders((current) => current.map((order) => order.id === id ? updated : order));
      toast.success(`Order #${id} marked as done`);
    } catch {
      toast.error("Could not mark order as done");
    }
  };

  const removeOrder = async (id: number) => {
    if (!window.confirm(`Delete order #${id}?`)) return;
    try {
      await deleteOrder(id);
      setOrders((current) => current.filter((order) => order.id !== id));
      toast.success(`Order #${id} deleted`);
    } catch {
      toast.error("Could not delete order");
    }
  };

  const removeAllOrders = async () => {
    if (!window.confirm("Delete all orders? This cannot be undone.")) return;
    try {
      const result = await clearOrders();
      setOrders([]);
      toast.success(`Deleted ${result.deleted} orders`);
    } catch {
      toast.error("Could not delete orders");
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const remove = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Could not delete product");
    }
  };

  const save = async (p: Product) => {
    const exists = products.some((x) => x.id === p.id);
    try {
      await saveProduct(p, exists);
      setEditing(null);
      toast.success(exists ? "Product updated" : "Product added");
    } catch {
      toast.error("Could not save product");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {productsLoading ? "Loading products..." : `${products.length} products`}
          </p>
        </div>
        <button
          onClick={() => setEditing(emptyProduct())}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-ring"
        >
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 glass">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4 hidden md:table-cell">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4 hidden sm:table-cell">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border/40 hover:bg-secondary/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.colors[0]?.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-muted" />
                    <div>
                      <Link to="/products/$id" params={{ id: p.id }} className="font-medium hover:text-primary">{p.name || "(untitled)"}</Link>
                      <p className="text-xs text-muted-foreground">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">{p.category}</td>
                <td className="p-4">
                  {p.salePrice ? (
                    <span><span className="text-primary font-semibold">{formatCurrency(p.salePrice)}</span> <span className="text-xs text-muted-foreground line-through">{formatCurrency(p.price)}</span></span>
                  ) : <span className="font-semibold">{formatCurrency(p.price)}</span>}
                </td>
                <td className="p-4 hidden sm:table-cell">{p.stock}</td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => setEditing(p)} className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(p.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/20 hover:text-destructive flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Orders</h2>
            <p className="text-sm text-muted-foreground">
              {ordersLoading ? "Loading orders..." : `${orders.length} orders`}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void loadOrders()} className="rounded-full border border-border/60 px-4 py-2 text-sm hover:bg-secondary">
              Refresh
            </button>
            {orders.length > 0 && (
              <button onClick={() => void removeAllOrders()} className="rounded-full border border-destructive/60 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
                Delete all
              </button>
            )}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border/60 glass">
          {orders.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-4">Order</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Items</th>
                    <th className="text-left p-4">Payment</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Address</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className={`border-t border-border/40 align-top ${order.status === "completed" ? "opacity-60" : ""}`}>
                      <td className="p-4">
                        <p className="font-semibold">#{order.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                        <p className="mt-1 text-xs uppercase text-primary">{order.status}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                        {order.customerEmail && <p className="text-xs text-muted-foreground">{order.customerEmail}</p>}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p key={`${order.id}-${item.productId}-${index}`} className="text-xs">
                              {item.qty} x {item.product_name} ({item.color}{item.size ? ` / ${item.size}` : ""})
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{order.paymentMethod === "instapay" ? "InstaPay" : "Cash"}</p>
                        {order.paymentScreenshot && (
                          <a href={order.paymentScreenshot} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                            View screenshot
                          </a>
                        )}
                      </td>
                      <td className="p-4 font-semibold">{formatCurrency(Number(order.total))}</td>
                      <td className="p-4">
                        <p className="max-w-xs text-xs text-muted-foreground">{order.address}</p>
                        {order.notes && <p className="mt-1 max-w-xs text-xs text-muted-foreground">Notes: {order.notes}</p>}
                      </td>
                      <td className="p-4">
                        {order.status === "completed" ? (
                          <span className="rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary">Done</span>
                        ) : (
                          <button
                            onClick={() => void completeOrder(order.id)}
                            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                          >
                            Done
                          </button>
                        )}
                        <button
                          onClick={() => void removeOrder(order.id)}
                          className="ml-2 rounded-full border border-destructive/60 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {editing && <EditModal product={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function EditModal({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = useState<Product>(product);
  const upd = <K extends keyof Product>(k: K, v: Product[K]) => setP({ ...p, [k]: v });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass border border-border/60 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 className="font-display text-xl font-bold">{product.name ? "Edit product" : "New product"}</h2>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Name"><input value={p.name} onChange={(e) => upd("name", e.target.value)} className={inputCls} /></Field>
          <Field label="Category">
            <select value={p.category} onChange={(e) => upd("category", e.target.value)} className={inputCls}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Price (L.E)"><input type="number" value={p.price} onChange={(e) => upd("price", +e.target.value)} className={inputCls} /></Field>
          <Field label="Sale price (L.E)"><input type="number" value={p.salePrice ?? ""} onChange={(e) => upd("salePrice", e.target.value ? +e.target.value : undefined)} className={inputCls} /></Field>
          <Field label="Stock"><input type="number" value={p.stock} onChange={(e) => upd("stock", +e.target.value)} className={inputCls} /></Field>
          <Field label="Rating"><input type="number" step="0.1" min="0" max="5" value={p.rating} onChange={(e) => upd("rating", +e.target.value)} className={inputCls} /></Field>
        </div>

        <Field label="Description"><textarea value={p.description} onChange={(e) => upd("description", e.target.value)} rows={3} className={inputCls} /></Field>

        <Field label="Available sizes">
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => {
              const selected = p.sizes?.includes(size) ?? false;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    const current = p.sizes ?? [];
                    upd("sizes", selected ? current.filter((x) => x !== size) : [...current, size]);
                  }}
                  className={`min-w-12 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    selected ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Colors (name, hex, image URL)">
          <div className="space-y-2">
            {p.colors.map((c, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_2fr_auto] gap-2">
                <input value={c.name} onChange={(e) => upd("colors", p.colors.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Name" className={inputCls} />
                <input value={c.hex} onChange={(e) => upd("colors", p.colors.map((x, j) => j === i ? { ...x, hex: e.target.value } : x))} placeholder="#000" className={inputCls} />
                <input value={c.image} onChange={(e) => upd("colors", p.colors.map((x, j) => j === i ? { ...x, image: e.target.value } : x))} placeholder="https://..." className={inputCls} />
                <button onClick={() => upd("colors", p.colors.filter((_, j) => j !== i))} className="text-destructive px-2"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={() => upd("colors", [...p.colors, { name: "", hex: "#000000", image: "" }])} className="text-sm text-primary">+ Add color</button>
          </div>
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.featured} onChange={(e) => upd("featured", e.target.checked)} className="accent-primary" />
          Featured on homepage
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
          <button onClick={onClose} className="rounded-full px-5 py-2 text-sm border border-border/60 hover:bg-secondary">Cancel</button>
          <button
            onClick={() => onSave({ ...p, images: p.colors.map((c) => c.image).filter(Boolean) })}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground glow-ring"
          >Save</button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
