# Generated by Django 4.1.6 on 2024-05-27 01:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0007_remove_tender_price"),
    ]

    operations = [
        migrations.AddField(
            model_name="tender",
            name="price",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]