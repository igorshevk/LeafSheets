# Generated by Django 2.2.8 on 2020-01-28 02:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commerce', '0023_auto_20200123_0021'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='city',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='address',
            name='postal',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='address',
            name='state',
            field=models.CharField(max_length=50),
        ),
    ]