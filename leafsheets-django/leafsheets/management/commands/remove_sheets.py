"""

--- Leafsheets ---

Remove Sheets Management Command

Created on Monday, March 2, 2019
~ satyameva_jayate
"""

# Imports

import os
import json
import urllib.request

from django.core.management.base import BaseCommand
from django.core.files import File
from django.utils import timezone

from leafsheets.models import Sheet

# Command

class Command(BaseCommand):
    help = 'our help string comes here'

    def _rm_sheets(self):
        sheets = Sheet.objects.all()
        for sheet in sheets:
            if getattr(sheet, 'item', None):
                sheet.item.delete()
            if getattr(sheet, 'doc', None):
                sheet.doc.delete()
            sheet.delete()

    def handle(self, *args, **options):
        self._rm_sheets()