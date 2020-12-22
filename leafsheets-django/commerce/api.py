"""

--- LeafSheets ---

API — Commerce

Created on Monday, Oct 28, 2019
~ satyameva_jayate
"""

# Imports

import logging

from django.db.models import Q
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError, ObjectDoesNotExist

import stripe

from rest_framework import viewsets, generics, permissions, views
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_204_NO_CONTENT
    )

from commerce.models import Item, OrderItem, Order, Card, Address
from commerce.serializers import (
    ItemSerializer,
    CardSerializer,
    ChargeSerializer,
    AddressSerializer,
    UserCartSerializer,
    OrderItemSerializer,
    CartOrderItemSerializer
    )

# Vars

stripe.api_key = settings.STRIPE_API_KEY

# Log

logger = logging.getLogger(__name__)

# API

# Items

class ItemListView(generics.ListAPIView):
    permissions_classes = [permissions.AllowAny]
    serializer_class = ItemSerializer
    queryset = Item.objects.all()

class ItemView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ItemSerializer
    queryset = Item.objects.all()

# Cart

class UserCartView(generics.RetrieveAPIView):
    permissions_classes = [permissions.IsAuthenticated]
    serializer_class = UserCartSerializer

    def get_object(self):
        obj = self.request.user.orders.filter(status="C").first()
        # May raise a permission denied
        self.check_object_permissions(self.request, obj)
        return obj

class UserCartItemsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartOrderItemSerializer
    
    def get_queryset(self):
        cart_qs = self.request.user.orders.filter(status="C")
        if cart_qs.exists():
            order = cart_qs[0]
            return order.order_items

    def create(self, request, *args, **kwargs):
        id = request.data.get('id', None)
        if id is None:
            return Response({"message": "Invalid Request"},\
                            status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, id=id)
        order_qs = Order.objects.filter(user=request.user, status="C")
        if order_qs.exists():
            order = order_qs[0]
            order = Order.objects.add_item_to_order(order, item)
        else:
            order = Order.objects.create(
                user=request.user, ordered_at=timezone.now()
            )
            order = Order.objects.add_item_to_order(order, item)
        return Response(CartOrderItemSerializer(order.order_items, many=True).data,
                        status=HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        item_id = kwargs.pop('pk', False)
        quantity = request.data.get('quantity', None)
        if item_id is None:
            return Response({"message": "Invalid Request"},\
                            status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, id=item_id)
        order_qs = Order.objects.filter(user=request.user, status="C")
        if order_qs.exists():
            order = order_qs[0]
            order = Order.objects.remove_item_from_order(order, item, quantity)
        else:
            return Response({"message": "Invalid Request"},\
                            status=HTTP_400_BAD_REQUEST)
        return Response(CartOrderItemSerializer(order.order_items, many=True).data, status=HTTP_200_OK)

# Addresses

class UserAddressViewSet(viewsets.ModelViewSet):
    permissions_classes = [permissions.IsAuthenticated]
    serializer_class = AddressSerializer

    def get_queryset(self):
        kind = self.request.query_params.get('kind', None)
        default = self.request.query_params.get('default', None)
        address_qs = self.request.user.billing_profile.addresses
        if kind is not None:
            address_qs = address_qs.filter(kind=kind)
        if default is not None:
            address_qs = address_qs.filter(default=default)
        return address_qs

    def create(self, request, *args, **kwargs):
        user_address = request.data.get('user_address', None)
        google_place = request.data.get('google_place', None)
        kind = request.data.get('kind', None)
        default = request.data.get('isDefault', False)
        # if user_address is None or google_place is None or kind is None:
        if user_address is None or kind is None:
            return Response({"message": "Invalid Request"},\
                            status=HTTP_400_BAD_REQUEST)
        address = Address.objects.new_or_get(\
            self.request.user,
            kind,
            default,
            google_place, 
            user_address)
        return Response(AddressSerializer(\
                        self.request.user.billing_profile.addresses,
                        many=True).data, status=HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        address = self.get_object()
        self.perform_destroy(address)
        return Response(AddressSerializer(\
                        self.request.user.billing_profile.addresses,
                        many=True).data, status=HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        default = request.data.get('isDefault', None)
        if default is None:
            return Response({"message": "Invalid Request"},\
                            status=HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance,
                                         data={'default': default},
                                         partial=partial)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_update(serializer)
        except ValidationError as e:
            return Response({"message": "At least one default address is required"},\
                            status=HTTP_400_BAD_REQUEST)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(AddressSerializer(\
                        self.request.user.billing_profile.addresses,
                        many=True).data, status=HTTP_200_OK)

# Orders

class UserOrderListView(generics.ListAPIView):
    permissions_classes = [permissions.IsAuthenticated]
    serializer_class = UserCartSerializer

    def get_queryset(self):
        return self.request.user.orders.filter(~Q(status="C"))

# Payment

class PaymentMethodViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CardSerializer

    def get_queryset(self):
        return self.request.user.billing_profile.cards

    def create(self, request, *args, **kwargs):
        billing_profile = self.request.user.billing_profile
        token = request.data.get('token', None)
        default = request.data.get('isDefault', False)
        if billing_profile is None or token is None:
            return Response({"message": "Invalid Request"},\
                            status=HTTP_400_BAD_REQUEST) 
        card_response = stripe.Customer.create_source(\
                billing_profile.customer_id,
                source=token)
        Card.objects.add_new(\
            billing_profile=billing_profile,
            stripe_card_response=card_response,
            default=default)
        print('here')
        # if default is True:
        #     response = stripe.Customer.modify(billing_profile.customer_id,
        #         default_source=card_response.id)
        return Response(CardSerializer(\
                        self.request.user.billing_profile.cards,
                        many=True).data, status=HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        payment_method = self.get_object()
        self.perform_destroy(payment_method)
        return Response(CardSerializer(\
                        self.request.user.billing_profile.cards,
                        many=True).data, status=HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        default = request.data.get('isDefault', None)
        if default is None:
            return Response({"message": "Invalid Request"},\
                            status=HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance,
                                         data={'default': default},
                                         partial=partial)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_update(serializer)
        except ValidationError as e:
            return Response({"message": "At least one default card is required"},\
                            status=HTTP_400_BAD_REQUEST)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(CardSerializer(\
                        self.request.user.billing_profile.cards,
                        many=True).data, status=HTTP_200_OK)
            
class ChargeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChargeSerializer

    def get_queryset(self):
        return self.request.user.billing_profile.charges

    def create(self, request, *args, **kwargs):
        # Get the User, BillingProfile and Order.
        data = self.request.data
        user = self.request.user
        billing_profile = user.billing_profile
        order = Order.objects.get(user=user, status="C")
        # Get the Payment Method and Billing Address.
        payment_method_id  = data.get('paymentMethodID', None)
        billing_address_id = data.get('billingAddressID', None)
        try:
            payment_method = Card.objects.get(pk=payment_method_id)
        except ObjectDoesNotExist:
            return Response({"message": "A valid payment method is required."},\
                            status=HTTP_400_BAD_REQUEST)
        try:
            billing_address = Address.objects.get(pk=billing_address_id)
        except:
            return Response({"message": "A valid billing address is required."},\
                            status=HTTP_400_BAD_REQUEST)
        # Make the Charge
        is_prepared = order.check_done()
        if is_prepared:
            charge, did_charge, charge_msg = billing_profile.charge(order, billing_address, payment_method)
            if did_charge is False:
                return Response({"message": "An error occurred while processing the payment."},\
                            status=HTTP_400_BAD_REQUEST)
            # The charge was a success!
            order.mark_paid()
            return Response(ChargeSerializer(self.request.user.billing_profile.charges, many=True).data, status=HTTP_200_OK)
        return Response({"message": "Not a valid order."},\
                         status=HTTP_400_BAD_REQUEST)
