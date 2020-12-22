"""

--- LeafSheets ---

Marketing: Admin

Created on Thursday, June 25, 2020
~ satyameva_jayate
"""

import json

from django.contrib import admin

from analytics import models

# Admin 

@admin.register(models.ObjectViewed)
class ObjectViewedAdmin(admin.ModelAdmin):
    """Admin for ObjectViewed model.
    """
    pass