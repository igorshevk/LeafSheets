"""
WSGI config for leafsheets_django project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/
"""

# Imports

import os
from django.core.wsgi import get_wsgi_application

# Configuration

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'leafsheets_django.settings')
application = get_wsgi_application()
