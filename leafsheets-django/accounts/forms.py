"""

--- LeafSheets ---

Forms — Accounts

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports

from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth import get_user_model

# User

User = get_user_model()

# Forms

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = User
        fields = ('email', 'password')

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ('email', 'password')