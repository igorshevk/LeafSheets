"""

--- Leafsheets ---

Managers — Accounts

Created on Sunday, November 3, 2019
~ satyameva_jayate
"""

# Imports 

import os
import logging
import urllib.request
from copy import deepcopy

from django.db import models
from django.core.files import File

from leafsheets.documents import (
    calc_input_counts,
    calc_var_count
    )

# Log

logger = logging.getLogger(__name__)

# Managers

class CompanyManager(models.Manager):
    """Custom Company model manager.
    """
    def new(self, user, **kwargs):
        """Create and save a new User.
        """
        company = None
        company = self.model.objects.create(user=user, **kwargs)
        return company

class UserSheetManager(models.Manager):
    """Custom user sheet model manager.
    """
    def new(self, user, sheet):
        """Create and save a User Sheet.
        """
        user_sheet = None
        total_input_count, required_input_count = calc_input_counts(sheet.doc.variable_dict)
        var_count = calc_var_count(sheet.doc.variable_dict)
        user_sheet = self.model.objects.create(\
            user=user, 
            sheet=sheet, 
            doc=sheet.doc,
            total_input_count=total_input_count,
            required_input_count=required_input_count,
            var_count=var_count,
            completed_input_count=0,
            user_variable_dict=deepcopy(sheet.doc.variable_dict))
        return user_sheet

class SheetManager(models.Manager):
    """Custom Sheet model manager.
    """
    def new(self, title, subtitle, download_title, short_description,
            long_description, use_case, page_count, excerpt, hours_saved,
            traditional_cost, bullets, toc, icon_url,):
        """Create and save a new Sheet.
        """
        new_sheet = self.model.objects.create(\
            title=title,
            subtitle=subtitle,
            download_title=download_title,
            short_description=short_description,
            long_description=long_description,
            use_case=use_case,
            page_count=page_count,
            excerpt=excerpt,
            hours_saved=hours_saved,
            traditional_cost=traditional_cost,
            bullets=bullets,
            toc=toc
            )
        # Add the Sheet icon.            
        icon = urllib.request.urlretrieve(icon_url)
        new_sheet.icon.save(
            os.path.basename(icon_url),
            File(open(icon[0], 'rb'))
            )
        return new_sheet

class DocumentManager(models.Manager):
    """Custom Document model manager.
    """
    def new(self, sheet, doc_title, doc_url=None):
        """Create and save a Document.
        """
        if not doc_url:
            raise ValueError('Either a doc or doc_url must be provided')
        template_doc = urllib.request.urlretrieve(doc_url)
        new_doc = self.model.objects.create(\
            title=doc_title,
            sheet=sheet
            )
        new_doc.template_doc.save(\
            os.path.basename(doc_url),
            File(open(template_doc[0], 'rb'))
            )
        return new_doc
