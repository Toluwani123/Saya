# Generated by Django 4.1.6 on 2024-05-26 18:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0004_alter_offer_created_at_alter_offer_owner"),
    ]

    operations = [
        migrations.AlterField(
            model_name="offer",
            name="shoe",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="main.shoe",
            ),
        ),
    ]
