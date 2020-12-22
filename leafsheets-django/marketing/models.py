"""

--- LeafSheets ---

Marketing: Models

Created on Tuesday, June 23, 2020
~ satyameva_jayate
"""

# Imports

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models.signals import post_save, pre_save

from marketing.utils import Mailchimp

# Models

class MarketingPreference(models.Model):
    """Models a marketing preference.
    """
    class Meta:
        verbose_name = 'Marketing Preference'
        verbose_name_plural = 'Marketing Preferences'

    # objects       = MarketingPreferenceManager()

    # Fields
    created_at           = models.DateTimeField(editable=False)
    updated_at           = models.DateTimeField()

    subscribed           = models.BooleanField(default=True)
    mailchimp_subscribed = models.NullBooleanField(blank=True)
    mailchimp_msg        = models.TextField(null=True, blank=True)

    # Relationships
    user          = models.OneToOneField(settings.AUTH_USER_MODEL,
                                         on_delete=models.CASCADE)

    # Methods
    def __str__(self):
        return f'<MarketingPreference — User: {self.user.email}>'

    def __unicode__(self):
        return f'<MarketingPreference — User: {self.user.email}>'

    def save(self, *args, **kwargs):
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(MarketingPreference, self).save(*args, **kwargs)

def marketing_pref_create_receiver(sender, instance, created, *args, **kwargs):
    pass
    # if created:
    #     status_code, response_data = Mailchimp().add_email(instance.user.email)

post_save.connect(marketing_pref_create_receiver, sender=MarketingPreference)

def marketing_pref_update_receiver(sender, instance, *args, **kwargs):
    if instance.subscribed != instance.mailchimp_subscribed:
        if instance.subscribed:
            status_code, response_data = Mailchimp().subscribe(instance.user.email)
        else:
            status_code, response_data = Mailchimp().unsubscribe(instance.user.email)
        if response_data['status'] == 'subscribed':
            instance.subscribed = True
            instance.mailchimp_subscribed = True
            instance.mailchimp_msg = response_data
        else:
            instance.subscribed = False
            instance.mailchimp_subscribed = False
            instance.mailchimp_msg = response_data

pre_save.connect(marketing_pref_update_receiver, sender=MarketingPreference)

def make_marketing_pref_receiver(sender, instance, created, *args, **kwargs):
    """User post-save.
    """
    pass
    # if created:
    #     MarketingPreference.objects.get_or_create(user=instance)

post_save.connect(make_marketing_pref_receiver, sender=settings.AUTH_USER_MODEL)