"""

--- LeafSheets ---

Models — Commerce

Created on Monday, Oct 28, 2019
~ satyameva_jayate
"""

# Imports

import stripe
import logging

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import JSONField
from django.db.models.signals import (
    post_save,
    pre_save,
    pre_delete,
    post_delete,
    m2m_changed
    )

from leafsheets_django.utils import unique_order_id_generator

from commerce.managers import (
    ItemManager, 
    CardManager,
    OrderManager, 
    ChargeManager,
    AddressManager,
    )


# Log

logger = logging.getLogger(__name__)

# Vars

stripe.api_key = settings.STRIPE_API_KEY

# Utils

LABEL_CHOICES = (
    ('P', 'primary'),
    ('S', 'secondary'),
    ('D', 'danger')
)

ORDER_STATUS_CHOICES = (
    ('C', 'created'),
    ('O', 'ordered'),
    ('R', 'refunded')
)

ADDRESS_KIND_CHOICES = (
    ('B', 'billing'),
    ('S', 'shipping'),
)

# Models

class Item(models.Model):
    """A sheet.
    """
    class Meta: 
        verbose_name = 'Item'
        verbose_name_plural = 'Items'

    objects        = ItemManager()

    # Fields
    created_at     = models.DateTimeField(editable=False)
    updated_at     = models.DateTimeField()

    title          = models.CharField(max_length=250) 

    price          = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)

    label          = models.CharField(choices=LABEL_CHOICES, max_length=1)

    # Methods
    def __str__(self):
        return f'<Item — {self.title}>'

    def __unicode__(self):
        return f'<Item — {self.title}>'

    def save(self, *args, **kwargs):
        """Saves the model.
        """
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(Item, self).save(*args, **kwargs)

class OrderItem(models.Model):
    """An OrderItem — linking a a sheet (Item) and an order.
    """

    class Meta:
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    # Fields
    created_at = models.DateTimeField(editable=False)
    updated_at = models.DateTimeField()

    quantity   = models.IntegerField(default=1)
    ordered    = models.BooleanField(default=False)

    # Relationships
    user       = models.ForeignKey(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)
    item       = models.ForeignKey(Item, on_delete=models.CASCADE)

    # Methods
    def __str__(self):
        return f'<OrderItem — {self.item.title}>'

    def __unicode__(self):
        return f'<OrderItem — {self.item.title}>'

    def save(self, *args, **kwargs):
        """Saves the model.
        """
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(OrderItem, self).save(*args, **kwargs)

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_item_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_discount_item_price()
        return self.get_total_item_price()

class Order(models.Model):
    """An Order.
    """
    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    objects = OrderManager()

    # Fields
    order_id         = models.CharField(max_length=120, blank=True)
    created_at       = models.DateTimeField(editable=False)
    updated_at       = models.DateTimeField()
    ordered_at       = models.DateTimeField(null=True, blank=True)

    status           = models.CharField(max_length=1,
                                        default="C",
                                        choices=ORDER_STATUS_CHOICES)

    subtotal         = models.FloatField(default=0.00)

    # Relationships
    user             = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        related_name="orders",
                                        on_delete=models.CASCADE)
    order_items      = models.ManyToManyField(OrderItem)
    billing_address  = models.ForeignKey('Address',\
                                        related_name='order_billing_addresses',\
                                        on_delete=models.SET_NULL,
                                        blank=True, null=True)
    shipping_address = models.ForeignKey('Address',\
                                         related_name='order_shipping_addresses',\
                                         on_delete=models.SET_NULL,
                                         blank=True, null=True)

    # Methods
    def __str__(self):
        return f'<Order — {self.user}>'

    def __unicode__(self):
        return f'<Order — {self.user}>'

    def get_total(self):
        total = 0
        for order_item in self.order_items.all():
            total += order_item.get_final_price()
        return total

    def check_done(self):
        total = self.get_total()
        if self.order_items.exists and total > 0:
            return True
        return False
    
    def mark_paid(self):
        if self.check_done():
            # Mark the individual items as ordered.
            self.order_items.update(ordered=True)
            # Mark the order as ordered.
            self.status = 'O'
            self.save()
        return self.status

    def save(self, *args, **kwargs):
        """Saves the model.
        """
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(Order, self).save(*args, **kwargs)

def pre_save_create_order_id(sender, instance, *args, **kwargs):
    if not instance.order_id:
        instance.order_id = unique_order_id_generator(instance)

pre_save.connect(pre_save_create_order_id, sender=Order)

def m2m_changed_order_receiver(sender, instance, action, *args, **kwargs):
    if action == 'post_add' or action == 'post_remove' or action == 'post_clear':
        total = 0
        order_items = instance.order_items.all()
        for order_item in order_items:
            total += order_item.get_final_price()
        if instance.subtotal != total:
            instance.subtotal = total
            instance.save()

m2m_changed.connect(m2m_changed_order_receiver, sender=Order.order_items.through)

class BillingProfile(models.Model):
    """Models a Billing Profile.
    """
    class Meta:
        verbose_name = 'Billing Profile'
        verbose_name_plural = 'Billing Profiles'

    # Fields
    created_at         = models.DateTimeField(editable=False)
    updated_at         = models.DateTimeField()
    customer_id        = models.CharField(max_length=120, null=True, blank=True)

    active             = models.BooleanField(default=True)

    # Relationship
    user               = models.OneToOneField(settings.AUTH_USER_MODEL,
                                              related_name="billing_profile",
                                              on_delete=models.CASCADE)

    addresses          = models.ManyToManyField("Address",
                            related_name="billing_profile_addresses",\
                            blank=True)

    # Methods
    def __str__(self):
        return f'<BillingProfile — user: {self.user}>'

    def __unicode__(self):
        return f'<BillingProfile — user: {self.user}>'

    def save(self, *args, **kwargs):
        """Saves the Billing Profile.
        """
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(BillingProfile, self).save(*args, **kwargs)

    @property
    def has_card(self):
        card_qs = self.get_cards()
        return card_qs.exists

    @property
    def default_card(self):
        default_cards = self.get_cards().filter(active=True, default=True)
        if default_cards.exists():
            return default_cards.first()
        return None

    @property
    def get_cards(self):
        return self.cards.all()

    def charge(self, order, address=None, card=None):
        return Charge.objects.do(self, order, address, card)

def billing_profile_created_receiver(sender, instance, *args, **kwargs):
    if not instance.customer_id:
        customer = stripe.Customer.create(email=instance.user.email)
        instance.customer_id = customer.id

pre_save.connect(billing_profile_created_receiver, sender=BillingProfile)

def user_created_receiver(sender, instance, created, *args, **kwargs):
    if created:
        BillingProfile.objects.get_or_create(user=instance)

post_save.connect(user_created_receiver, sender=settings.AUTH_USER_MODEL)

class Card(models.Model):
    """Models a card.
    """
    class Meta:
        verbose_name = 'Card'
        verbose_name_plural = 'Cards'

    objects = CardManager()

    # Fields
    created_at      = models.DateTimeField(editable=False)
    updated_at      = models.DateTimeField()

    default         = models.BooleanField(default=False)
    active          = models.BooleanField(default=True)

    stripe_id       = models.CharField(max_length=120)
    brand           = models.CharField(max_length=120, null=True, blank=True)
    country         = models.CharField(max_length=20, null=True, blank=True)
    exp_month       = models.IntegerField(null=True, blank=True)
    exp_year        = models.IntegerField(null=True, blank=True)
    last_4          = models.CharField(max_length=4, null=True, blank=True)

    # Relationships
    billing_profile = models.ForeignKey("BillingProfile",
                                        related_name="cards",
                                        on_delete=models.CASCADE)

     # Method
    def __str__(self):
        return f'<Card — brand: {self.brand}, last_4: {self.last_4}>'

    def __unicode__(self):
        return f'<Card — brand: {self.brand}, last_4: {self.last_4}>'

    def save(self, *args, **kwargs):
        """Saves the Card.
        """
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(Card, self).save(*args, **kwargs)

def post_card_save_receiver(sender, instance, created, *args, **kwargs):
    if instance.default is True:
        billing_profile = instance.billing_profile
        cards_qs = billing_profile.cards.exclude(pk=instance.pk)
        cards_qs.update(default=False)
        stripe.Customer.modify(instance.billing_profile.customer_id,
            default_source=instance.stripe_id)

post_save.connect(post_card_save_receiver, sender=Card)

def pre_card_delete_receiver(sender, instance, *args, **kwargs):
    # Delete the card with Stripe
    try:
        stripe.Customer.delete_source(
            instance.billing_profile.customer_id,
            instance.stripe_id
            )
    except Exception as e:
        logger.warn(e)

pre_delete.connect(pre_card_delete_receiver, sender=Card)

def post_card_delete_receiver(sender, instance, *args, **kwargs):
    # Make the most recently added card the default.
    if instance.default is True:
        billing_profile = instance.billing_profile
        card = billing_profile.cards.exclude(pk=instance.pk).order_by('-created_at').first()
        if card is not None:
            card.default = True
            card.save()
            # Make the most recently added card the default.
            try:
                stripe.Customer.modify(\
                    billing_profile.customer_id,
                    default_source=card.stripe_id)
            except Exception as e:
                logger.warn(e)

post_delete.connect(post_card_delete_receiver, sender=Card)

class Address(models.Model):
    """Models an address.
    """
    class Meta:
        verbose_name = 'Address'
        verbose_name_plural = 'Addresses'

    objects = AddressManager()

    # Fields
    created_at       = models.DateTimeField(editable=False)
    updated_at       = models.DateTimeField()

    default          = models.BooleanField(default=False)
    kind             = models.CharField(max_length=1, choices=ADDRESS_KIND_CHOICES)
    
    first_name       = models.CharField(max_length=50)
    last_name        = models.CharField(max_length=50)
    street_1         = models.CharField(max_length=250)
    street_2         = models.CharField(max_length=250, null=True, blank=True)
    city             = models.CharField(max_length=100)
    state            = models.CharField(max_length=50)
    postal           = models.CharField(max_length=50)

    google_place     = JSONField(null=True, blank=True)
    google_place_url = models.URLField(max_length=2000, null=True, blank=True)

    # Relationships
    user             = models.ForeignKey(settings.AUTH_USER_MODEL,
                                         related_name="addresses",\
                                         on_delete=models.CASCADE)

    # Method
    def __str__(self):
        return f'<Address — user: {self.user}, type: {self.kind}>'

    def __unicode__(self):
        return f'<Address — user: {self.user}, type: {self.kind}>'

    def save(self, *args, **kwargs):
        """Saves the Address.
        """
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(Address, self).save(*args, **kwargs)

def post_address_save_receiver(sender, instance, created, *args, **kwargs):
    if instance.default:
        user = instance.user
        address_qs = user.addresses.filter(kind=instance.kind).exclude(pk=instance.pk)
        address_qs.update(default=False)

def pre_address_save_receiver(sender, instance, *args, **kwargs):
    if instance.default is False:
        user = instance.user
        address_qs = user.addresses.filter(kind=instance.kind, default=True).exclude(pk=instance.pk)
        if not address_qs.exists():
            raise ValidationError('At least one default address required')

post_save.connect(post_address_save_receiver, sender=Address)
pre_save.connect(pre_address_save_receiver, sender=Address)

class Charge(models.Model):
    """Models a charge.
    """
    class Meta:
        verbose_name = 'Charge'
        verbose_name_plural = 'Charges'
    
    objects = ChargeManager()

    # Fields
    created_at      = models.DateTimeField(editable=False)
    updated_at      = models.DateTimeField()

    stripe_id       = models.CharField(max_length=120)
    paid            = models.BooleanField(default=False)
    refunded        = models.BooleanField(default=False)
    outcome         = models.TextField(null=True, blank=True)
    outcome_type    = models.CharField(max_length=120, null=True, blank=True)
    seller_message  = models.CharField(max_length=120, null=True, blank=True)
    risk_level      = models.CharField(max_length=120, null=True, blank=True)

    # Relationships
    order           = models.OneToOneField(Order,\
                                           null=True, blank=True,\
                                           related_name="charge",\
                                           on_delete=models.CASCADE)
    billing_profile = models.ForeignKey(BillingProfile,\
                                        related_name="charges",\
                                        on_delete=models.CASCADE)
    card            = models.ForeignKey(Card,\
                                        null=True, blank=True,\
                                        related_name="charges",
                                        on_delete=models.SET_NULL)

    # Methods
    def __str__(self):
        return f'<Charge — user: {self.stripe_id}>'

    def __unicode__(self):
        return f'<Charge — user: {self.stripe_id}>'

    @property
    def payment_method(self):
        return self.card

    @payment_method.setter
    def payment_method(self, obj):
        if type(obj) == Card:
            self.card = obj
        else:
            raise ValueError("Obj parameter must be an object of Card")

    def save(self, *args, **kwargs):
        """Saves the Charge.
        """
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(Charge, self).save(*args, **kwargs)