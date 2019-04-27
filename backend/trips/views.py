from django.http import HttpResponse, HttpResponseNotFound
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.conf import settings
from django.db.models import Q
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.response import Response

import os

from .serializers import UserSerializer, TripSerializer, ReadOnlyTripSerializer
from .models import Trip


# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))

# pwa_view = never_cache(TemplateView.as_view(template_name='manifest.json'))
def serve_worker_view(request, worker_name):
    """
    Serve the requested service worker from the appropriate location in the static files.
    We need to serve the worker this way in order to allow it access to requests made against the
    root - whatever /sub/dir the worker ends up getting served from is the only location it will
    have visibility on, so serving from / is the only way to ensure the worker has visibility on all
    requests. Only a-zA-Z-_ characters can appear in the service worker name.

    :param request:
    :param worker_name:
    :return:
    """
    if worker_name == 'manifest':
        worker_path = os.path.join(settings.STATIC_ROOT, f"{worker_name}.json")
    elif worker_name == 'robots':
        worker_path = os.path.join(settings.STATIC_ROOT, f"{worker_name}.txt")
    else:
        worker_path = os.path.join(settings.STATIC_ROOT, f"{worker_name}.js")
    try:
        with open(worker_path, 'r') as worker_file:
            return HttpResponse(worker_file, content_type='application/javascript')
    except IOError:
        return HttpResponseNotFound('serviceWorkers not found!')


class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class LogInView(views.APIView):
    @staticmethod
    def post(request):
        form = AuthenticationForm(data=request.data)
        if form.is_valid():
            user = form.get_user()
            login(request, user=user)
            rsp = UserSerializer(user).data
            rsp['sessionid'] = request.session.session_key
            return Response(rsp)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


class LogOutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, *args, **kwargs):
        logout(self.request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TripView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ReadOnlyTripSerializer

    def get_queryset(self):
        user = self.request.user
        if user.group == 'driver':
            return Trip.objects.filter(
                Q(status=Trip.REQUESTED) | Q(driver=user)
            )
        if user.group == 'rider':
            return Trip.objects.filter(rider=user)
        return Trip.objects.none()
