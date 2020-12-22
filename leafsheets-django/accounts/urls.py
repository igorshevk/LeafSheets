"""

--- LeafSheets ---

URLs

Created on Friday, Oct 4, 2019
~ satyameva_jayate
"""

# Imports

from django.urls import path, include
from knox import views as knox_views

from accounts.api import (
    RegisterAPI,
    LoginAPI,
    UserAPI
    )

# URLs

urlpatterns = [
    path('api/auth/logout', knox_views.LogoutView.as_view(), name="knox_logout"),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/me', UserAPI.as_view()),
    path('api/auth', include('knox.urls'))
]