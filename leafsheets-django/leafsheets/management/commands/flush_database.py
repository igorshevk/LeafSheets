"""

--- Leafsheets ---

Flush the Database

Created on Wednesday, May 13, 2020
~ satyameva_jayate
"""

# Imports

import os
import json
import urllib.request

from django.core.management.base import BaseCommand
from django.core.files import File
from django.utils import timezone

from leafsheets.models import Sheet, UserSheet, Document, User

# Command

class Command(BaseCommand):
    help = 'Flush the database.'

    def _flush_database(self):
        sheets = Sheet.objects.all()
        for sheet in sheets:
            if getattr(sheet, 'item', None):
                sheet.item.delete()
            if getattr(sheet, 'doc', None):
                sheet.doc.delete()
            sheet.delete()
        user_sheets = UserSheet.objects.all()
        for user_sheet in user_sheets:
            user_sheet.delete()
        users = User.objects.all()
        for user in users:
            user.delete()
        documents = Document.objects.all()
        for document in documents:
            document.delete()

    def handle(self, *args, **options):
        self._flush_database()