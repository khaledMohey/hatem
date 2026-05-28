from decimal import Decimal

from django.db import models, transaction


class Product(models.Model):
    id = models.SlugField(primary_key=True, max_length=80)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=80)
    stock = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    best_seller = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=Decimal("5.0"))
    created_at = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "name"]

    def __str__(self) -> str:
        return self.name

    @property
    def active_price(self) -> Decimal:
        return self.sale_price if self.sale_price is not None else self.price


class ProductColor(models.Model):
    product = models.ForeignKey(Product, related_name="colors", on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    hex = models.CharField(max_length=20)
    image = models.URLField(max_length=600, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.product_id} - {self.name}"


class ProductSize(models.Model):
    product = models.ForeignKey(Product, related_name="sizes", on_delete=models.CASCADE)
    value = models.CharField(max_length=20)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.product_id} - {self.value}"


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        PROCESSING = "processing", "Processing"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    class PaymentMethod(models.TextChoices):
        CASH = "cash", "Cash"
        INSTAPAY = "instapay", "InstaPay"

    customer_name = models.CharField(max_length=160)
    customer_phone = models.CharField(max_length=40)
    customer_email = models.EmailField(blank=True)
    address = models.TextField()
    notes = models.TextField(blank=True)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.CASH)
    payment_screenshot = models.FileField(upload_to="payment-screenshots/", blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order #{self.pk} - {self.customer_name}"

    @transaction.atomic
    def recalculate_total(self) -> None:
        self.total = sum((item.line_total for item in self.items.all()), Decimal("0.00"))
        self.save(update_fields=["total", "updated_at"])


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    product_name = models.CharField(max_length=200)
    color = models.CharField(max_length=80)
    size = models.CharField(max_length=20, blank=True)
    qty = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return f"{self.qty} x {self.product_name}"
