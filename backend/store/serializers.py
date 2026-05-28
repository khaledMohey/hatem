from decimal import Decimal
import json

from django.db import transaction
from rest_framework import serializers

from .models import Order, OrderItem, Product, ProductColor, ProductSize


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ["name", "hex", "image"]


class ProductSerializer(serializers.ModelSerializer):
    salePrice = serializers.DecimalField(
        source="sale_price", max_digits=10, decimal_places=2, required=False, allow_null=True
    )
    bestSeller = serializers.BooleanField(source="best_seller", required=False)
    createdAt = serializers.DateField(source="created_at", required=False)
    colors = ProductColorSerializer(many=True)
    sizes = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    rating = serializers.DecimalField(max_digits=3, decimal_places=1)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "salePrice",
            "colors",
            "images",
            "category",
            "stock",
            "featured",
            "bestSeller",
            "rating",
            "sizes",
            "createdAt",
        ]

    def get_images(self, obj: Product) -> list[str]:
        return [color.image for color in obj.colors.all() if color.image]

    def get_sizes(self, obj: Product) -> list[str] | None:
        sizes = [size.value for size in obj.sizes.all()]
        return sizes or None

    def to_representation(self, instance: Product) -> dict:
        data = super().to_representation(instance)
        data["price"] = float(data["price"])
        data["rating"] = float(data["rating"])
        if data.get("salePrice") is not None:
            data["salePrice"] = float(data["salePrice"])
        return data

    def create(self, validated_data: dict) -> Product:
        colors_data = validated_data.pop("colors", [])
        sizes_data = self.initial_data.get("sizes", []) or []
        product = Product.objects.create(**validated_data)
        self._replace_children(product, colors_data, sizes_data)
        return product

    def update(self, instance: Product, validated_data: dict) -> Product:
        colors_data = validated_data.pop("colors", None)
        sizes_data = self.initial_data.get("sizes") if "sizes" in self.initial_data else None
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if colors_data is not None or sizes_data is not None:
            self._replace_children(instance, colors_data, sizes_data)
        return instance

    def _replace_children(self, product: Product, colors_data: list[dict] | None, sizes_data: list[str] | None) -> None:
        if colors_data is not None:
            product.colors.all().delete()
            ProductColor.objects.bulk_create(
                ProductColor(product=product, sort_order=index, **color)
                for index, color in enumerate(colors_data)
            )
        if sizes_data is not None:
            product.sizes.all().delete()
            ProductSize.objects.bulk_create(
                ProductSize(product=product, value=size, sort_order=index)
                for index, size in enumerate(sizes_data)
                if size
            )


class OrderItemInputSerializer(serializers.Serializer):
    productId = serializers.CharField(max_length=80)
    color = serializers.CharField(max_length=80)
    size = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    qty = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    productId = serializers.CharField(source="product_id", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["productId", "product_name", "color", "size", "qty", "unit_price", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    customerName = serializers.CharField(source="customer_name")
    customerPhone = serializers.CharField(source="customer_phone")
    customerEmail = serializers.EmailField(source="customer_email", required=False, allow_blank=True)
    paymentMethod = serializers.CharField(source="payment_method")
    paymentScreenshot = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customerName",
            "customerPhone",
            "customerEmail",
            "address",
            "notes",
            "paymentMethod",
            "paymentScreenshot",
            "status",
            "total",
            "items",
            "created_at",
        ]
        read_only_fields = ["id", "status", "total", "created_at"]

    def get_paymentScreenshot(self, obj: Order) -> str | None:
        if not obj.payment_screenshot:
            return None
        request = self.context.get("request")
        url = obj.payment_screenshot.url
        return request.build_absolute_uri(url) if request else url


class OrderCreateSerializer(serializers.Serializer):
    customerName = serializers.CharField(max_length=160)
    customerPhone = serializers.CharField(max_length=40)
    customerEmail = serializers.EmailField(required=False, allow_blank=True)
    address = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)
    paymentMethod = serializers.ChoiceField(choices=Order.PaymentMethod.choices, default=Order.PaymentMethod.CASH)
    paymentScreenshot = serializers.FileField(required=False, allow_empty_file=False)
    items = OrderItemInputSerializer(many=True)

    def to_internal_value(self, data):
        mutable = {key: data.get(key) for key in data}
        if isinstance(mutable.get("items"), str):
            try:
                mutable["items"] = json.loads(mutable["items"])
            except json.JSONDecodeError as exc:
                raise serializers.ValidationError({"items": "Invalid items JSON."}) from exc
        return super().to_internal_value(mutable)

    def validate_items(self, items: list[dict]) -> list[dict]:
        if not items:
            raise serializers.ValidationError("Order must include at least one item.")
        return items

    def validate(self, attrs: dict) -> dict:
        if attrs.get("paymentMethod") == Order.PaymentMethod.INSTAPAY and not attrs.get("paymentScreenshot"):
            raise serializers.ValidationError({"paymentScreenshot": "Payment screenshot is required for InstaPay."})
        return attrs

    @transaction.atomic
    def create(self, validated_data: dict) -> Order:
        items = validated_data.pop("items")
        order = Order.objects.create(
            customer_name=validated_data["customerName"],
            customer_phone=validated_data["customerPhone"],
            customer_email=validated_data.get("customerEmail", ""),
            address=validated_data["address"],
            notes=validated_data.get("notes", ""),
            payment_method=validated_data.get("paymentMethod", Order.PaymentMethod.CASH),
            payment_screenshot=validated_data.get("paymentScreenshot"),
        )
        total = Decimal("0.00")

        for item in items:
            try:
                product = Product.objects.select_for_update().get(id=item["productId"])
            except Product.DoesNotExist as exc:
                raise serializers.ValidationError({"items": f"Product {item['productId']} does not exist."}) from exc
            qty = item["qty"]
            unit_price = product.active_price
            line_total = unit_price * qty
            total += line_total
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                color=item["color"],
                size=item.get("size") or "",
                qty=qty,
                unit_price=unit_price,
                line_total=line_total,
            )
            if product.stock >= qty:
                product.stock -= qty
                product.save(update_fields=["stock", "updated_at"])

        order.total = total
        order.save(update_fields=["total", "updated_at"])
        return order

    def to_representation(self, instance: Order) -> dict:
        return OrderSerializer(instance).data
