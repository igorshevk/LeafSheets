"""

--- LeafSheets ---

URLs — Commerce

Created on Monday, Oct 28, 2019
~ satyameva_jayate
"""

# Imports

from django.urls import path, include
from django.views.generic import TemplateView

from rest_framework import routers

from commerce.api import (
    ItemView,
    ItemListView,
    UserCartView,
    ChargeViewSet,
    UserCartItemsViewSet,
    UserAddressViewSet,
    UserOrderListView,
    PaymentMethodViewSet
    )

# URLs

router = routers.DefaultRouter()
router.register('api/me/cart/items', UserCartItemsViewSet, 'user-cart-items')
router.register('api/me/addresses', UserAddressViewSet, 'user-addresses')
router.register('api/me/payment-methods', PaymentMethodViewSet, 'user-payment-methods')
router.register('api/me/charges', ChargeViewSet, 'user-charges')

urlpatterns = [
    path('api/items/<int:pk>/', ItemView.as_view(), name='item'),
    path('api/items/', ItemListView.as_view(), name="items-list"),
    path('api/me/cart/', UserCartView.as_view(), name="user-cart"),
    path('api/me/orders/', UserOrderListView.as_view(), name="user-order-list"),
]

urlpatterns += router.urls
