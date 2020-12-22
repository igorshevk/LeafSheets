"""

--- LeafSheets ---

Marketing: Webhooks

Created on Tuesday, June 23, 2020
~ satyameva_jayate
"""

# Imports

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View

from marketing.models import MarketingPreference
from marketing.mixins import CsrfExemptMixin
from marketing.utils import Mailchimp

# Settings

MAILCHIMP_API_KEY =  getattr(settings, 'MAILCHIMP_API_KEY', None)
MAILCHIMP_EMAIL_LIST_ID =  getattr(settings, 'MAILCHIMP_EMAIL_LIST_ID', None)
MAILCHIMP_DATA_CENTER =  getattr(settings, 'MAILCHIMP_DATA_CENTER', None)

# Webhooks

class MailchimpWebhookView(CsrfExemptMixin, View):

    def post(self, request, *args, **kwargs):
        data = request.POST
        list_id = data.get('data[list_id]')
        if str(list_id) == str(MAILCHIMP_EMAIL_LIST_ID):
            email = data.get('data[email]')
            response_status, response = Mailchimp().check_subscription_status(email)
            sub_status = response['status']
            is_subbed = None
            mailchimp_subbed = None
            if sub_status == 'subscribed':
                is_subbed, mailchimp_subbed = (True, True)
                qs = MarketingPreference.objects.filter(user__email__iexact=email)
                if qs.exists():
                    qs.update(subscribed=True, mailchimp_subscribed=False, mailchimp_msg=str(data))
            elif sub_status == 'unsubscribed':
                is_subbed, mailchimp_subbed = (False, False)
            if is_subbed is not None and mailchimp_subbed is not None:
                qs = MarketingPreference.objects.filter(user__email__iexact=email)
                if qs.exists():
                    qs.update(subscribed=False, mailchimp_subscribed=False, mailchimp_msg=str(data))
        return HttpResponse("Thank you", status=200)