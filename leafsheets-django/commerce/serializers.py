"""

--- LeafSheets ---

Serializers — Commerce

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports

from rest_framework import serializers
from django.contrib.auth import authenticate

from commerce.models import (
    Item, 
    Order, 
    Address,
    OrderItem,
    Card,
    Charge
    )
from leafsheets.serializers import SheetSerializer

# Serializers

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'
        read_only_fields = ('__all__',)

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        exclude = ('user', 'google_place')
        read_only_fields = ('__all__',)

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ('__all__',)

class UserCartSerializer(serializers.ModelSerializer):
     class Meta:
        model = Order
        exclude = ('user', 'order_items')
        read_only_fields = ('__all__',)

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        exclude = ('user',)
        read_only_fields = ('__all__',)
        depth = 2

class CartItemSerializer(serializers.ModelSerializer):
    sheet = SheetSerializer()
    class Meta:
        model = Item
        fields = ('price', 'price', 'discount_price', 'label', 'sheet',)
        read_only_fields = ('__all__',)
        depth = 1

class CartOrderItemSerializer(serializers.ModelSerializer):
    item = CartItemSerializer()
    class Meta:
        model = OrderItem
        exclude = ('user',)
        read_only_fields = ('__all__',)
        depth = 2

class ChargeOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ('user')
        read_only_fields = ('__all__',)
        depth = 3

class ChargeSerializer(serializers.ModelSerializer):

    sheets = serializers.SerializerMethodField()
    
    class Meta:
        model = Charge
        read_only_fields = ('__all__',)
        exclude = ('billing_profile',)
        depth = 1

    def get_sheets(self, instance):
        sheets = [order_item.item.sheet for order_item in instance.order.order_items.all()]
        return SheetSerializer(sheets, many=True).data