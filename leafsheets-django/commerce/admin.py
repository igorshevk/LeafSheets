"""

--- LeafSheets ---

Admin — Commerce

Created on Monday, Oct 28, 2019
~ satyameva_jayate
"""

# Imports

from django.contrib import admin
from jet.admin import CompactInline

from leafsheets.models import Sheet

from commerce import models

# Unregister

from address.models import Address, Country, State, Locality
admin.site.unregister(Address)
admin.site.unregister(Country)
admin.site.unregister(State)
admin.site.unregister(Locality)

# Inlines

# Inline

class SheetInline(CompactInline):
    model = Sheet
    show_change_link = True

class OrderItemInline(CompactInline):
    model = models.OrderItem
    show_change_link = True

class OrderInline(CompactInline):
    model = models.Order.order_items.through
    show_change_link = True

# Admin

@admin.register(models.Card)
class CardAdmin(admin.ModelAdmin):
    """Admin for the Card class.
    """
    list_display    = ('billing_profile', 'brand', 'default', 'last_4',
                       'country', 'exp_month', 'exp_year')
    ordering        = ('-created_at', '-updated_at')
    list_filter     = ('brand', 'default')

    def get_readonly_fields(self, request, obj=None):
        return list(set(
            [field.name for field in self.opts.local_fields] +
            [field.name for field in self.opts.local_many_to_many]
        ))


@admin.register(models.BillingProfile)
class BillingProfileAdmin(admin.ModelAdmin):
    """Admin for the Billing Profile class.
    """
    list_display    = ('user', 'active', 'created_at', 'updated_at', 'id')
    ordering        = ('-created_at',)
    list_filter     = ('active',)
    readonly_fields = ('user', 'created_at', 'updated_at')

@admin.register(models.Item)
class ItemAdmin(admin.ModelAdmin):
    """Admin for the Item class.
    """
    list_display    = ('title', 'id', 'price', 'created_at', 'sheet')
    search_fields   = ('title', 'price')
    ordering        = ('-created_at', 'price')
    inlines         = (OrderItemInline,)

@admin.register(models.OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Admin for the OrderItem class.
    """
    list_display    = ('pk', 'created_at', 'ordered', 'quantity', 'user', 'item')
    ordering        = ('-created_at', '-ordered')
    list_filter     = ('ordered',)
    readonly_fields = ('created_at', 'updated_at', 'ordered', 'quantity', 'user', 'item')
    inlines         = (OrderInline,)

@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin for the Order class.
    """
    list_display    = ('pk', 'order_id', 'status', 'subtotal', 'user', 'created_at',
                       'updated_at')
    search_fields   = ('order_id',)
    ordering        = ('-created_at', 'status')
    readonly_fields = ('created_at', 'updated_at', 'order_id', 'user', 'subtotal')

@admin.register(models.Address)
class AddressAdmin(admin.ModelAdmin):
    """Admin for the Address class.
    """
    list_display    = ('user', 'default', 'kind', 'street_1', 'city',
                       'state', 'postal')
    search_fields   = ('street_1', 'street_2', 'city', 'state')
    ordering        = ('-created_at',)
    list_filter     = ('default', 'kind', 'state')
    fieldsets = (
        (None, {'fields': ('id', 'user', 'street_1', 'street_2', 'city', 'state',
         'postal', 'kind', 'default')}),
        ('Google.', {'fields': ('google_place_url', 'google_place')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )

    def get_readonly_fields(self, request, obj=None):
        return list(set(
            [field.name for field in self.opts.local_fields] +
            [field.name for field in self.opts.local_many_to_many]
        ))

@admin.register(models.Charge)
class ChargeAdmin(admin.ModelAdmin):
    """Admin for the charge class.
    """
    list_display  = ('stripe_id', 'created_at', 'paid', 'refunded')
    search_fields = ('stripe_id',)
    ordering      = ('created_at',)
    list_filter   = ('paid', 'refunded', 'outcome')