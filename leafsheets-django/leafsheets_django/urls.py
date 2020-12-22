"""

--- LeafSheets ---

URLs

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports

from django.conf import settings
from django.contrib import admin
from django.conf.urls import url
from django.urls import path, include
from django.conf.urls.static import static

from rest_framework_swagger.views import get_swagger_view
from leafsheets_django.api import UploadFileAPI

schema_view = get_swagger_view(title='Leafsheets API')

# URLs

urlpatterns = [
    path('jet/', include('jet.urls', 'jet')),  # Django JET URLS
    path('jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),  # Django JET dashboard URLS
    path('', include('leafsheets.urls')),
    path('', include('accounts.urls')),
    path('', include('marketing.urls')),
    path('', include('commerce.urls')),
    path('admin/', admin.site.urls),
    path('api/schema/', schema_view),
    path('api/uploads/', UploadFileAPI.as_view(), name='uploads')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if not settings.DEBUG:
    urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]