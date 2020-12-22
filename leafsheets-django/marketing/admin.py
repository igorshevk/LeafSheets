"""

--- LeafSheets ---

Admin — Leafsheets

Created on Wednesday, June 24, 2020
~ satyameva_jayate
"""

import json

from django.contrib import admin

from marketing import models

# Admin 

@admin.register(models.MarketingPreference)
class MarketingPreferenceAdmin(admin.ModelAdmin):
    """Admin for MarketingPreference model.
    """
    list_display = ['__str__', 'subscribed']
    readonly_fields = ('mailchimp_subscribed', 'updated_at', 'created_at')
    class Meta:
        model = models.MarketingPreference
        fields = [
            'created_at',
            'updated_at',
            'user',
            'subscribed',
            'mailchimp_msg',
            'mailchimp_subscribed'
        ]