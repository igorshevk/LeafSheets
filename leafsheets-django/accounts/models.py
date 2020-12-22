"""

--- LeafSheets ---

Models

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports

from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.utils import timezone

from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill

from accounts.managers import UserManager

from leafsheets_django.utils import PathAndRename

# Choices

USER_POSITION_CHOICES = (
    ('O', 'Owner'),
    ('E', 'Employee'),
    ('SP', 'Service Provider'),
)

# Models

avatar_path = PathAndRename("users/avatars/")

class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model.
    """
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    objects = UserManager()

    # Fields
    created_at = models.DateTimeField(editable=False)
    updated_at = models.DateTimeField()

    avatar     = ProcessedImageField(upload_to=avatar_path,
                                     null=True, blank=True,
                                     processors=[ResizeToFill(150, 150)],
                                     format='JPEG',
                                     options={'quality': 80})

    email      = models.EmailField(_('email address'), unique=True)
    is_staff   = models.BooleanField(default=False)
    is_active  = models.BooleanField(default=True)

    full_name  = models.CharField(max_length=100, null=True, blank=True)
    phone      = models.CharField(null=True, blank=True, max_length=15)
    position   = models.CharField(max_length=2, choices=USER_POSITION_CHOICES,
                                  null=True, blank=True)
    ownership  = models.IntegerField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # Methods
    def __str__(self):
        return f'<User — email: {self.email}>'

    def __unicode__(self):
        return f'<User — email: {self.email}>'

    def save(self, *args, **kwargs):
        """Saves the User.
        """
        if not self.id:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(User, self).save(*args, **kwargs)

def user_post_save(sender, instance, created, *args, **kwargs):
    """Post User save.
    """
    from leafsheets.models import Company
    if created is True:
        Company.objects.new(user=instance)
            
# Connect the post-save receiver.
post_save.connect(user_post_save, sender=User)
