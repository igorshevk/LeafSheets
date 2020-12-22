"""

--- LeafSheets ---

Admin — Leafsheets

Created on Monday, Nov 4, 2019
~ satyameva_jayate
"""

import json

from django.contrib import admin
from imagekit.admin import AdminThumbnail
from django.contrib.postgres.fields import JSONField
from django.forms import widgets

from leafsheets import models

# Helpers

class PrettyJSONWidget(widgets.Textarea):
    
    def format_value(self, value):
        try:
            value = json.dumps(json.loads(value), indent=2, sort_keys=True)
            # these lines will try to adjust size of TextArea to fit to content
            row_lengths = [len(r) for r in value.split('\n')]
            self.attrs['rows'] = min(max(len(row_lengths) + 2, 10), 30)
            self.attrs['cols'] = min(max(max(row_lengths) + 2, 40), 120)
            return value
        except Exception as e:
            logger.warning("Error while formatting JSON: {}".format(e))
            return super(PrettyJSONWidget, self).format_value(value)

# Admin 

@admin.register(models.Sheet)
class SheetsAdmin(admin.ModelAdmin):
    formfield_overrides = {
        JSONField: {'widget': PrettyJSONWidget}
    }
    icon_display = AdminThumbnail(image_field='icon')
    list_display = ('title', 'editable', 'published', 'subtitle', 'id', 'download_title',
                    'page_count', 'created_at', 'updated_at', 'item')
    fieldsets = (
        (None, {'fields': ('title', 'subtitle', 'id', 'item', 'editable')}),
        ('Images', {'fields': ('icon_display', 'icon',)}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
        ('Misc.', {'fields': ('published', 'slug', 'download_title', 'short_description',
            'long_description', 'use_case', 'page_count', 'excerpt',
            'bullets', 'toc')}),
        ('Savings', {'fields': ('hours_saved', 'traditional_cost')}),
    )
    search_fields = ('title',)
    readonly_fields = ('created_at', 'updated_at', 'icon_display', 'id')

@admin.register(models.UserSheet)
class UserSheetsAdmin(admin.ModelAdmin):
    formfield_overrides = {
        JSONField: {'widget': PrettyJSONWidget}
    }
    list_display = ('user', 'sheet', 'created_at', 'updated_at')
    fieldsets = (
        ('User', {'fields': ('user', 'user_variable_dict', 'user_variable_doc', 'user_variable_pdf')}),
        ('Counts', {'fields': ('var_count', 'total_input_count', 'required_input_count', 'completed_input_count')}),
        ('Sheet', {'fields': ('sheet',)}),
        ('Doc', {'fields': ('doc',)}),
    )

@admin.register(models.Document)
class DocumentsAdmin(admin.ModelAdmin):
    formfield_overrides = {
        JSONField: {'widget': PrettyJSONWidget}
    }
    list_display = ('title', 'template_doc', 'variable_doc', 'created_at', 'updated_at')
    fieldsets = (
        ('Misc', {'fields': ('title', 'variable_dict', 'page_count')}),
        ('Sheet', {'fields': ('sheet',)}),
        ('Doc', {'fields': ('template_doc', 'variable_doc')}),
    )

@admin.register(models.Company)
class CompanyAdmin(admin.ModelAdmin):
    icon_display = AdminThumbnail(image_field='icon')
    list_display = ('name', 'verified', 'type_of_inc', 'category', 'use_case', 'new_status', 'state', 'icon_display')
    list_filter = ('new_status', 'category', 'type_of_inc', 'use_case')
    fieldsets = (
        (None, {'fields': ('name', 'user')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
        ('Verified', {'fields': ('verified',)}),
        ('Misc.', {'fields': ('type_of_inc', 'category', 'new_status', 'state', 'use_case')}),
    )
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')