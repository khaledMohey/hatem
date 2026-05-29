export type ProductColor = { name: string; hex: string; image: string };
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  colors: ProductColor[];
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  bestSeller?: boolean;
  rating: number;
  sizes?: string[];
  createdAt: string;
};

export const SIZE_OPTIONS = ["S", "M", "L", "XL", "2XL", "3XL"];

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const seedProducts: Product[] = [
  {
    id: "core-hoodie",
    name: "ATHR Core Heavyweight Hoodie",
    description: "A clean heavyweight hoodie with a relaxed fit, brushed fleece interior, and subtle ATHR detailing.",
    price: 129, salePrice: 99,
    colors: [
      { name: "Black", hex: "#000000", image: img("photo-1523398002811-999ca8dec234") },
      { name: "Ash", hex: "#d7d7d7", image: img("photo-1556821840-3a63f95609a7") },
      { name: "ATHR Blue", hex: "#246bff", image: img("photo-1503342217505-b0a15ec3261c") },
    ],
    images: [img("photo-1523398002811-999ca8dec234"), img("photo-1556821840-3a63f95609a7"), img("photo-1503342217505-b0a15ec3261c")],
    category: "T-Shirt", stock: 24, featured: true, bestSeller: true, rating: 4.8,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    createdAt: "2025-01-12",
  },
  {
    id: "mark-tee",
    name: "Leave Your Mark Tee",
    description: "Premium cotton tee with a structured street fit and minimal front mark graphic.",
    price: 59,
    colors: [
      { name: "Black", hex: "#000000", image: img("photo-1521572163474-6864f9cf17ab") },
      { name: "White", hex: "#ffffff", image: img("photo-1503341504253-dff4815485f1") },
    ],
    images: [img("photo-1521572163474-6864f9cf17ab"), img("photo-1503341504253-dff4815485f1")],
    category: "T-Shirt", stock: 48, featured: true, bestSeller: true, rating: 4.9,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    createdAt: "2025-03-02",
  },
  {
    id: "utility-cargo",
    name: "Core Utility Cargo Pants",
    description: "Versatile straight-leg cargos with durable twill, functional pockets, and everyday comfort.",
    price: 119, salePrice: 89,
    colors: [
      { name: "Black", hex: "#000000", image: img("photo-1515886657613-9f3515b0c78f") },
      { name: "Charcoal", hex: "#1a1a1a", image: img("photo-1548883354-94bcfe321cbb") },
      { name: "Stone", hex: "#b9b3a7", image: img("photo-1473966968600-fa801b869a1a") },
    ],
    images: [img("photo-1515886657613-9f3515b0c78f"), img("photo-1548883354-94bcfe321cbb")],
    category: "T-Shirt", stock: 60, featured: true, rating: 4.6,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    createdAt: "2025-02-20",
  },
  {
    id: "trace-jacket",
    name: "Trace Overshirt Jacket",
    description: "Layer-ready overshirt with a crisp silhouette, matte hardware, and clean panel construction.",
    price: 149,
    colors: [
      { name: "Black", hex: "#000000", image: img("photo-1489987707025-afc232f7ea0f") },
      { name: "Slate", hex: "#3a3a3a", image: img("photo-1520975954732-35dd22299614") },
    ],
    images: [img("photo-1489987707025-afc232f7ea0f"), img("photo-1520975954732-35dd22299614")],
    category: "T-Shirt", stock: 30, featured: true, bestSeller: true, rating: 4.7,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    createdAt: "2025-04-05",
  },
  {
    id: "daily-sweatpant",
    name: "Daily Core Sweatpants",
    description: "Soft fleece sweatpants with a tapered relaxed fit, tonal drawcords, and clean ATHR branding.",
    price: 99, salePrice: 79,
    colors: [
      { name: "Black", hex: "#000000", image: img("photo-1529139574466-a303027c1d8b") },
      { name: "Grey", hex: "#777777", image: img("photo-1506629905607-d9e297d6fb9d") },
    ],
    images: [img("photo-1529139574466-a303027c1d8b"), img("photo-1506629905607-d9e297d6fb9d")],
    category: "T-Shirt", stock: 80, featured: false, bestSeller: true, rating: 4.8,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    createdAt: "2025-05-01",
  },
  {
    id: "athr-cap",
    name: "ATHR Signature Cap",
    description: "Low-profile cap with clean embroidery, curved brim, and adjustable back strap.",
    price: 49,
    colors: [
      { name: "Black", hex: "#000000", image: img("photo-1521369909029-2afed882baee") },
      { name: "Blue", hex: "#246bff", image: img("photo-1588850561407-ed78c282e89b") },
    ],
    images: [img("photo-1521369909029-2afed882baee"), img("photo-1588850561407-ed78c282e89b")],
    category: "T-Shirt", stock: 100, featured: false, rating: 4.5,
    createdAt: "2025-01-30",
  },
  {
    id: "blue-stitch-tee",
    name: "Blue Stitch Box Tee",
    description: "Boxy everyday tee with ATHR blue stitch details and a soft garment-washed finish.",
    price: 65, salePrice: 52,
    colors: [
      { name: "Black", hex: "#000000", image: img("photo-1562157873-818bc0726f68") },
      { name: "White", hex: "#ffffff", image: img("photo-1523381210434-271e8be1f52b") },
    ],
    images: [img("photo-1562157873-818bc0726f68"), img("photo-1523381210434-271e8be1f52b")],
    category: "T-Shirt", stock: 35, featured: true, rating: 4.7,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    createdAt: "2025-03-18",
  },
  {
    id: "commuter-tote",
    name: "Core Commuter Tote",
    description: "Durable canvas tote with a structured shape, daily carry capacity, and blue ATHR accent tab.",
    price: 69,
    colors: [
      { name: "Black", hex: "#000000", image: img("photo-1590874103328-eac38a683ce7") },
      { name: "Natural", hex: "#d8d0c0", image: img("photo-1542291026-7eec264c27ff") },
    ],
    images: [img("photo-1590874103328-eac38a683ce7"), img("photo-1542291026-7eec264c27ff")],
    category: "T-Shirt", stock: 70, featured: false, rating: 4.6,
    createdAt: "2025-02-08",
  },
];

export const categories = ["T-Shirt", "Hoodies"];

const KEY = "athr_products_v1";
export function loadProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedProducts;
    return JSON.parse(raw);
  } catch { return seedProducts; }
}
export function saveProducts(p: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}
