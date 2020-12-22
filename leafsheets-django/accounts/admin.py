"""

--- LeafSheets ---

Admin — Accounts

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

from jet.admin import CompactInline

from imagekit.admin import AdminThumbnail

from commerce.models import BillingProfile
from leafsheets.models import Company

from accounts.forms import CustomUserCreationForm, CustomUserChangeForm
from accounts import models

# User

User = get_user_model()

# Inline 

class BillingProfileInline(CompactInline):
    model = BillingProfile
    show_change_link = True

class CompanyInline(CompactInline):
    model = Company
    show_change_link = True

# Admin

@admin.register(models.User)
class CustomUserAdmin(UserAdmin):
    
    # Model
    model = User

    avatar_display = AdminThumbnail(image_field='avatar')

    # Forms
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    list_display = ('email', 'is_staff', 'is_active', 'avatar_display',)
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Images', {'fields': ('avatar_display', 'avatar')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
        ('Profile', {'fields': ('full_name', 'phone', 'position', 'ownership')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    readonly_fields = ('avatar_display',)
    inlines = [BillingProfileInline, CompanyInline]
