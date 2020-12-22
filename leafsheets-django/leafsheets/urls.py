"""

--- LeafSheets ---

URLs

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports

from django.urls import path, include
from rest_framework import routers

from leafsheets.api import (
    CompanyViewSet,
    SheetListView,
    SheetView,
    UserSheetViewSet
    )

# URLs

router = routers.DefaultRouter()
router.register(r'api/me/companies', CompanyViewSet, 'user-companies')
router.register(r'api/me/sheets', UserSheetViewSet, 'user-sheets')

urlpatterns = [
    path(r'api/sheets/<int:pk>/', SheetView.as_view(), name='sheet'),
    path(r'api/sheets/', SheetListView.as_view(), name='sheets-list'),
]

urlpatterns += router.urls
