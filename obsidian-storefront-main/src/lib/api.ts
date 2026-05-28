import type { CartItem } from "./store";
import type { Product } from "./products";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");
const ADMIN_API_TOKEN = import.meta.env.VITE_ADMIN_API_TOKEN ?? "dev-admin-token";

type ApiProduct = Omit<Product, "salePrice" | "sizes"> & {
  salePrice?: number | null;
  sizes?: string[] | null;
};

export type CheckoutPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  notes?: string;
  paymentMethod: "cash" | "instapay";
  paymentScreenshot?: File | null;
  items: CartItem[];
};

export type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  notes?: string;
  paymentMethod: "cash" | "instapay";
  paymentScreenshot?: string | null;
  status: string;
  total: string;
  created_at: string;
  items: Array<{
    productId: string;
    product_name: string;
    color: string;
    size: string;
    qty: number;
    unit_price: string;
    line_total: string;
  }>;
};

async function request<T>(path: string, init: RequestInit = {}, admin = false): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (admin) headers.set("X-Admin-Token", ADMIN_API_TOKEN);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed with ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function normalizeProduct(product: ApiProduct): Product {
  return {
    ...product,
    salePrice: product.salePrice ?? undefined,
    sizes: product.sizes?.length ? product.sizes : undefined,
  };
}

export async function fetchProducts(params: Record<string, string | number | undefined> = {}): Promise<Product[]> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const suffix = search.size ? `?${search.toString()}` : "";
  const products = await request<ApiProduct[]>(`/products/${suffix}`);
  return products.map(normalizeProduct);
}

export async function saveProduct(product: Product, exists: boolean): Promise<Product> {
  const saved = await request<ApiProduct>(
    exists ? `/products/${product.id}/` : "/products/",
    {
      method: exists ? "PUT" : "POST",
      body: JSON.stringify(product),
    },
    true,
  );
  return normalizeProduct(saved);
}

export async function deleteProduct(id: string): Promise<void> {
  await request<void>(`/products/${id}/`, { method: "DELETE" }, true);
}

export async function createOrder(payload: CheckoutPayload) {
  const formData = new FormData();
  formData.append("customerName", payload.customerName);
  formData.append("customerPhone", payload.customerPhone);
  formData.append("customerEmail", payload.customerEmail ?? "");
  formData.append("address", payload.address);
  formData.append("notes", payload.notes ?? "");
  formData.append("paymentMethod", payload.paymentMethod);
  formData.append("items", JSON.stringify(payload.items));
  if (payload.paymentScreenshot) formData.append("paymentScreenshot", payload.paymentScreenshot);

  return request("/orders/", { method: "POST", body: formData });
}

export async function fetchOrders(): Promise<Order[]> {
  return request<Order[]>("/orders/", {}, true);
}
