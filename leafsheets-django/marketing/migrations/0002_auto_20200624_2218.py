# Generated by Django 2.2.8 on 2020-06-24 22:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marketing', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='marketingpreference',
            old_name='mailchimp_msp',
            new_name='mailchimp_msg',
        ),
    ]
