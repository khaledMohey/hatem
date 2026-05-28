from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("store", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="payment_method",
            field=models.CharField(
                choices=[("cash", "Cash"), ("instapay", "InstaPay")],
                default="cash",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_screenshot",
            field=models.FileField(blank=True, upload_to="payment-screenshots/"),
        ),
    ]
