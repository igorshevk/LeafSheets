"""

--- LeafSheets ---

Marketing: URLs

Created on Wednesday, June 24, 2020
~ satyameva_jayate
"""

# Imports

from django.urls import path, include

from marketing.webhooks import MailchimpWebhookView

# URLs

urlpatterns = [
    path('webhooks/mailchimp/', MailchimpWebhookView.as_view(), name="mailchimp_webhooks"),
]