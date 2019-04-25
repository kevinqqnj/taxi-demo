"""
ASGI config for project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os

import django

from channels.routing import get_default_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.prod')
django.setup()
application = get_default_application()
