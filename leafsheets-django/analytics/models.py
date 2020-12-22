"""

--- LeafSheets ---

Analytics: Models

Created on Thursday, June 25, 2020
~ satyameva_jayate
"""

# Imports

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from analytics.signals import object_viewed_signal
from analytics.utils import get_client_ip

# Settings

User = settings.AUTH_USER_MODEL

# Models

class ObjectViewed(models.Model):
    """Models an object view.
    """
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Object Viewed'
        verbose_name_plural = 'Objects Viewed'

    # Field
    created_at     = models.DateTimeField(editable=False)
    updated_at     = models.DateTimeField()

    ip_address     = models.CharField(max_length=220, blank=True, null=True)
    object_id      = models.PositiveIntegerField()

    # Relationships
    user           = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    content_type   = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    content_object = GenericForeignKey('content_type', 'object_id')

    # Methods
    def __str__(self):
        return f'<ObjectViewed — object_id: {self.object_id}>'

    def __unicode__(self):
        return f'<ObjectViewed — object_id: {self.object_id}>'

    def save(self, *args, **kwargs):
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(ObjectViewed, self).save(*args, **kwargs)

def object_viewed_receiver(sender, instance, request, *args, **kwargs):
    c_type = ContentType.objects.get_for_model(sender)
    new_view_obj = ObjectViewed.objects.create(
            user=request.user,
            content_type=c_type,
            object_id=instance.id,
            ip_address=get_client_ip(request)
        )

object_viewed_signal.connect(object_viewed_receiver)