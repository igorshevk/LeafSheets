# Generated by Django 2.2.7 on 2019-11-12 23:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('leafsheets', '0013_sheet_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sheet',
            name='item',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='sheet', to='commerce.Item'),
        ),
    ]
