"""

--- Leafsheets ---

Managers — Commerce

Created on Tuesday, November 5, 2019
~ satyameva_jayate
"""

# Imports 

import stripe

import logging

from django.db import models
from django.conf import settings

# Vars

stripe.api_key = settings.STRIPE_API_KEY
PER_SHEET_PRICE = settings.PER_SHEET_PRICE

# Log

logger = logging.getLogger(__name__)

# Managers

class CardManager(models.Manager):
    """Custom Card model manager.
    """
    def add_new(self, billing_profile, stripe_card_response, default=False):
        if str(stripe_card_response.object) == "card":
            new_card = self.model(
                default=default,
                billing_profile=billing_profile,
                stripe_id=stripe_card_response.id,
                brand=stripe_card_response.brand,
                country=stripe_card_response.country,
                exp_month=stripe_card_response.exp_month,
                exp_year=stripe_card_response.exp_year,
                last_4=stripe_card_response.last4,
            )
            new_card.save()
            return new_card
        return None

class OrderManager(models.Manager):
    """Custom Order model manager.
    """
    def add_item_to_order(self, order, item):
        from commerce.models import OrderItem
        order_item, created = OrderItem.objects.get_or_create(
            item=item,
            user=order.user,
            ordered=False)
        return self.add_order_item_to_order(order, order_item)

    def add_order_item_to_order(self, order, order_item):
        if order.order_items.filter(item__id=order_item.item.id).exists():
            order_item.quantity += 1
            order_item.save()
        else:
            order.order_items.add(order_item)
        return order

    def remove_item_from_order(self, order, item, quantity):
        from commerce.models import OrderItem
        if order.order_items.filter(item__id=item.id).exists():
            order_item = OrderItem.objects.filter(
                item=item,
                user=order.user,
                ordered=False)[0]
            if quantity is not None:
                if order_item.quantity > 1:
                    order_item.quantity -= int(quantity)
                    order_item.save()
                else:
                    order.order_items.remove(order_item)
                    order_item.delete()
            else:
                order.order_items.remove(order_item)
                order_item.delete()
        return order

class ItemManager(models.Manager):
    """Custom Item model manager.
    """
    def new(self, sheet):
        """
        Create and save an Item with the given sheet.
        """
        if not sheet:
            raise ValueError(_('The Sheet must be set'))
        item = self.create(title=sheet.title,\
                           price=sheet.page_count * PER_SHEET_PRICE,\
                           label='P')
        item.sheet = sheet
        item.save()
        return item

class BillingProfileManager(models.Manager):
    """Custom Billing Profile model manager.
    """
    def charge(self, order_obj, address=None, card=None):
        return Charge.objects.do(self, order_obj, address, card)

class ChargeManager(models.Manager):
    """Custom Charge model manager.
    """
    def do(self, billing_profile, order_obj, address=None, card=None):
        # Handle the Card
        card_obj = card
        if card is None:
            cards = billing_profile.cards.filter(default=True)
            if cards.exists():
                card_obj = cards.first()
        if card_obj is None:
            return None,  False, 'No Cards Available'
        # Handle the address
        address_obj = address
        if address is None:
            addresses = billing_profile.addresses.filter(default=True)
            if addresses.exist():
                address_obj = addresses.first()
        if address_obj is None:
            return None, False, 'No Billing Address Available'
        # Update the order.
        order_obj.billing_address = address_obj
        order_obj.save()
        # Create the Charge (via Stripe)
        stripe_charge = stripe.Charge.create(
            amount=int(order_obj.get_total()),
            currency="usd",
            customer=billing_profile.customer_id,
            source=card_obj.stripe_id,
            metadata={
                "order_id": order_obj.order_id, 
                "billing_postal": address_obj.postal
                },
            )
        # Create the Charge (in the db)
        new_charge_obj = self.model(
            order=order_obj,
            billing_profile=billing_profile,
            stripe_id=stripe_charge.id,
            paid=stripe_charge.paid,
            refunded=stripe_charge.refunded,
            outcome=stripe_charge.outcome,
            outcome_type=stripe_charge.outcome['type'],
            seller_message=stripe_charge.outcome.get('seller_message'),
            risk_level=stripe_charge.outcome.get('risk_level'),
            )
        new_charge_obj.payment_method = card_obj
        new_charge_obj.save()
        return new_charge_obj, new_charge_obj.paid, new_charge_obj.seller_message

class AddressManager(models.Manager):
    """Custom Addresss manager.
    """
    def get_address(self, user, kind, user_address, google_place=None):
        google_place_url = None
        if google_place is not None:
            google_place_url = google_place.get('url')
        try:
            address = user.addresses.get(\
                kind=kind,
                google_place=google_place,
                google_place_url=google_place_url,
                street_1=user_address.get('street_1', None),
                street_2=user_address.get('street_2', None),
                city=user_address.get('city', None),
                state=user_address.get('state', None),
                postal= user_address.get('postal', None))
            return address
        except self.model.DoesNotExist:
            return None

    def new_or_get(self, user, kind, default=False, google_place=None, user_address=None):
        if not user:
            raise ValueError('A valid user is required')
        # if google_place is None:
        #     raise ValueError(_('A valid google_place is required'))
        if user_address is None:
            raise ValueError('A valid user_address is required')
        address = self.get_address(user, kind, user_address, google_place)
        if address is None:
            google_place_url = None
            if google_place is not None:
                google_place_url = google_place.get('url', None)
            address = self.create(\
                user=user,
                google_place=google_place,
                google_place_url=google_place_url,
                first_name=user_address.get('first_name', None),
                last_name=user_address.get('last_name', None),
                street_1=user_address.get('street_1', None),
                street_2=user_address.get('street_2', None),
                city=user_address.get('city', None),
                state=user_address.get('state', None),
                postal= user_address.get('postal', None),   
                kind=kind,
                default=default)
            user.billing_profile.addresses.add(address)
            user.billing_profile.save()
        return address