from decimal import Decimal
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("customer_name", models.CharField(max_length=160)),
                ("customer_phone", models.CharField(max_length=40)),
                ("customer_email", models.EmailField(blank=True, max_length=254)),
                ("address", models.TextField()),
                ("notes", models.TextField(blank=True)),
                ("status", models.CharField(choices=[("new", "New"), ("processing", "Processing"), ("completed", "Completed"), ("cancelled", "Cancelled")], default="new", max_length=20)),
                ("total", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=10)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.SlugField(max_length=80, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("sale_price", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("category", models.CharField(max_length=80)),
                ("stock", models.PositiveIntegerField(default=0)),
                ("featured", models.BooleanField(default=False)),
                ("best_seller", models.BooleanField(default=False)),
                ("rating", models.DecimalField(decimal_places=1, default=Decimal("5.0"), max_digits=3)),
                ("created_at", models.DateField()),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-created_at", "name"]},
        ),
        migrations.CreateModel(
            name="ProductColor",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=80)),
                ("hex", models.CharField(max_length=20)),
                ("image", models.URLField(blank=True, max_length=600)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="colors", to="store.product")),
            ],
            options={"ordering": ["sort_order", "id"]},
        ),
        migrations.CreateModel(
            name="ProductSize",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("value", models.CharField(max_length=20)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="sizes", to="store.product")),
            ],
            options={"ordering": ["sort_order", "id"]},
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("product_name", models.CharField(max_length=200)),
                ("color", models.CharField(max_length=80)),
                ("size", models.CharField(blank=True, max_length=20)),
                ("qty", models.PositiveIntegerField()),
                ("unit_price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("line_total", models.DecimalField(decimal_places=2, max_digits=10)),
                ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="store.order")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="store.product")),
            ],
        ),
    ]
