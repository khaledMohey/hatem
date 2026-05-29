from decimal import Decimal

from django.core.management.base import BaseCommand

from store.models import Product, ProductColor, ProductSize


def img(image_id: str) -> str:
    return f"https://images.unsplash.com/{image_id}?auto=format&fit=crop&w=900&q=80"


PRODUCTS = [
    {
        "id": "core-hoodie",
        "name": "ATHR Core Heavyweight Hoodie",
        "description": "A clean heavyweight hoodie with a relaxed fit, brushed fleece interior, and subtle ATHR detailing.",
        "price": "129.00",
        "sale_price": "99.00",
        "category": "T-Shirt",
        "stock": 24,
        "featured": True,
        "best_seller": True,
        "rating": "4.8",
        "sizes": ["S", "M", "L", "XL", "2XL", "3XL"],
        "created_at": "2025-01-12",
        "colors": [
            {"name": "Black", "hex": "#000000", "image": img("photo-1523398002811-999ca8dec234")},
            {"name": "Ash", "hex": "#d7d7d7", "image": img("photo-1556821840-3a63f95609a7")},
            {"name": "ATHR Blue", "hex": "#246bff", "image": img("photo-1503342217505-b0a15ec3261c")},
        ],
    },
    {
        "id": "mark-tee",
        "name": "Leave Your Mark Tee",
        "description": "Premium cotton tee with a structured street fit and minimal front mark graphic.",
        "price": "59.00",
        "sale_price": None,
        "category": "T-Shirt",
        "stock": 48,
        "featured": True,
        "best_seller": True,
        "rating": "4.9",
        "sizes": ["S", "M", "L", "XL", "2XL", "3XL"],
        "created_at": "2025-03-02",
        "colors": [
            {"name": "Black", "hex": "#000000", "image": img("photo-1521572163474-6864f9cf17ab")},
            {"name": "White", "hex": "#ffffff", "image": img("photo-1503341504253-dff4815485f1")},
        ],
    },
    {
        "id": "utility-cargo",
        "name": "Core Utility Cargo Pants",
        "description": "Versatile straight-leg cargos with durable twill, functional pockets, and everyday comfort.",
        "price": "119.00",
        "sale_price": "89.00",
        "category": "T-Shirt",
        "stock": 60,
        "featured": True,
        "best_seller": False,
        "rating": "4.6",
        "sizes": ["S", "M", "L", "XL", "2XL", "3XL"],
        "created_at": "2025-02-20",
        "colors": [
            {"name": "Black", "hex": "#000000", "image": img("photo-1515886657613-9f3515b0c78f")},
            {"name": "Charcoal", "hex": "#1a1a1a", "image": img("photo-1548883354-94bcfe321cbb")},
            {"name": "Stone", "hex": "#b9b3a7", "image": img("photo-1473966968600-fa801b869a1a")},
        ],
    },
    {
        "id": "trace-jacket",
        "name": "Trace Overshirt Jacket",
        "description": "Layer-ready overshirt with a crisp silhouette, matte hardware, and clean panel construction.",
        "price": "149.00",
        "sale_price": None,
        "category": "T-Shirt",
        "stock": 30,
        "featured": True,
        "best_seller": True,
        "rating": "4.7",
        "sizes": ["S", "M", "L", "XL", "2XL", "3XL"],
        "created_at": "2025-04-05",
        "colors": [
            {"name": "Black", "hex": "#000000", "image": img("photo-1489987707025-afc232f7ea0f")},
            {"name": "Slate", "hex": "#3a3a3a", "image": img("photo-1520975954732-35dd22299614")},
        ],
    },
    {
        "id": "daily-sweatpant",
        "name": "Daily Core Sweatpants",
        "description": "Soft fleece sweatpants with a tapered relaxed fit, tonal drawcords, and clean ATHR branding.",
        "price": "99.00",
        "sale_price": "79.00",
        "category": "T-Shirt",
        "stock": 80,
        "featured": False,
        "best_seller": True,
        "rating": "4.8",
        "sizes": ["S", "M", "L", "XL", "2XL", "3XL"],
        "created_at": "2025-05-01",
        "colors": [
            {"name": "Black", "hex": "#000000", "image": img("photo-1529139574466-a303027c1d8b")},
            {"name": "Grey", "hex": "#777777", "image": img("photo-1506629905607-d9e297d6fb9d")},
        ],
    },
    {
        "id": "athr-cap",
        "name": "ATHR Signature Cap",
        "description": "Low-profile cap with clean embroidery, curved brim, and adjustable back strap.",
        "price": "49.00",
        "sale_price": None,
        "category": "T-Shirt",
        "stock": 100,
        "featured": False,
        "best_seller": False,
        "rating": "4.5",
        "sizes": [],
        "created_at": "2025-01-30",
        "colors": [
            {"name": "Black", "hex": "#000000", "image": img("photo-1521369909029-2afed882baee")},
            {"name": "Blue", "hex": "#246bff", "image": img("photo-1588850561407-ed78c282e89b")},
        ],
    },
    {
        "id": "blue-stitch-tee",
        "name": "Blue Stitch Box Tee",
        "description": "Boxy everyday tee with ATHR blue stitch details and a soft garment-washed finish.",
        "price": "65.00",
        "sale_price": "52.00",
        "category": "T-Shirt",
        "stock": 35,
        "featured": True,
        "best_seller": False,
        "rating": "4.7",
        "sizes": ["S", "M", "L", "XL", "2XL", "3XL"],
        "created_at": "2025-03-18",
        "colors": [
            {"name": "Black", "hex": "#000000", "image": img("photo-1562157873-818bc0726f68")},
            {"name": "White", "hex": "#ffffff", "image": img("photo-1523381210434-271e8be1f52b")},
        ],
    },
    {
        "id": "commuter-tote",
        "name": "Core Commuter Tote",
        "description": "Durable canvas tote with a structured shape, daily carry capacity, and blue ATHR accent tab.",
        "price": "69.00",
        "sale_price": None,
        "category": "T-Shirt",
        "stock": 70,
        "featured": False,
        "best_seller": False,
        "rating": "4.6",
        "sizes": [],
        "created_at": "2025-02-08",
        "colors": [
            {"name": "Black", "hex": "#000000", "image": img("photo-1590874103328-eac38a683ce7")},
            {"name": "Natural", "hex": "#d8d0c0", "image": img("photo-1542291026-7eec264c27ff")},
        ],
    },
]


class Command(BaseCommand):
    help = "Seed ATHR CORE products into the database."

    def handle(self, *args, **options):
        for item in PRODUCTS:
            colors = item["colors"]
            sizes = item["sizes"]
            product_defaults = {key: value for key, value in item.items() if key not in {"id", "colors", "sizes"}}
            product, _ = Product.objects.update_or_create(
                id=item["id"],
                defaults={
                    **product_defaults,
                    "price": Decimal(product_defaults["price"]),
                    "sale_price": Decimal(product_defaults["sale_price"]) if product_defaults["sale_price"] else None,
                    "rating": Decimal(product_defaults["rating"]),
                },
            )
            product.colors.all().delete()
            ProductColor.objects.bulk_create(
                ProductColor(product=product, sort_order=index, **color)
                for index, color in enumerate(colors)
            )
            product.sizes.all().delete()
            ProductSize.objects.bulk_create(
                ProductSize(product=product, value=size, sort_order=index)
                for index, size in enumerate(sizes)
            )

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(PRODUCTS)} ATHR products."))
