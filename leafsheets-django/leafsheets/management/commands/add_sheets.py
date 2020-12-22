"""

--- Leafsheets ---

Populate DB Management Command

Created on Tuesday, November 5, 2019
~ satyameva_jayate
"""

# Imports

import os
import json
import urllib.request

from django.core.management.base import BaseCommand

from leafsheets.models import Sheet, Document
from leafsheets.fixtures.sheets import SHEETS

# Command

class Command(BaseCommand):
    help = 'our help string comes here'

    def _add_sheets(self):
        for sheet in SHEETS:

            # Create the sheet
            sheet_dict = {
                "title": sheet['fields']['title'],
                "subtitle": sheet['fields']['subtitle'],
                "download_title": sheet['fields']['download_title'],
                "short_description": sheet['fields']['short_description'],
                "long_description": sheet['fields']['long_description'],
                "use_case": sheet['fields']['use_case'],
                "page_count": sheet['fields']['page_count'],
                "excerpt": sheet['fields']['excerpt'],
                "hours_saved": sheet['fields']['hours_saved'],
                "traditional_cost": sheet['fields']['traditional_cost'],
                "bullets": sheet['fields']['bullets'],
                "icon_url": sheet['fields']['icon_url'],
                "toc": sheet['fields']['toc']
            }
            new_sheet = Sheet.objects.new(**sheet_dict)
            
            # Create the document.
            doc_dict = {
                "sheet": new_sheet,
                "doc_title": sheet['fields']['doc']['title'],
                "doc_url": sheet['fields']['doc']['template_url']
            }
            Document.objects.new(**doc_dict)

    def handle(self, *args, **options):
        self._add_sheets()