from django.contrib import admin

from .models import Order, OrderItem, Product, ProductColor, ProductSize


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 0


class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "sale_price", "stock", "featured", "best_seller")
    list_filter = ("category", "featured", "best_seller")
    search_fields = ("id", "name", "description")
    inlines = [ProductColorInline, ProductSizeInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "product_name", "color", "size", "qty", "unit_price", "line_total")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "customer_phone", "payment_method", "status", "total", "created_at")
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("customer_name", "customer_phone", "customer_email", "address")
    readonly_fields = ("payment_screenshot",)
    inlines = [OrderItemInline]


admin.site.site_header = "ATHR CORE Admin"
admin.site.site_title = "ATHR CORE"
admin.site.index_title = "Store management"
