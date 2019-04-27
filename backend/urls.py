"""taxi_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static

from .trips.views import SignUpView, LogInView, LogOutView, index_view, serve_worker_view

urlpatterns = [
    path('', index_view, name='index'),
    path('admin/', admin.site.urls),
    path('api/sign_up/', SignUpView.as_view(), name='sign_up'),
    path('api/log_in/', LogInView.as_view(), name='log_in'),
    path('api/log_out/', LogOutView.as_view(), name='log_out'),
    path('api/trip/', include('backend.trips.urls', 'trip',)),

    # serve static files for PWA
    path('index.html', index_view, name='index_pwa'),
    re_path(r'^(?P<worker_name>manifest).json$', serve_worker_view, name='manifest'),
    re_path(r'^(?P<worker_name>[-\w\d.]+).js$', serve_worker_view, name='serve_worker'),
    re_path(r'^(?P<worker_name>robots).txt$', serve_worker_view, name='robots'),

    # support vue-router history mode
    re_path(r'^\S+$', index_view, name='my404'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
