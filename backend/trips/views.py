# from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Q
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.response import Response

from .serializers import UserSerializer, TripSerializer, ReadOnlyTripSerializer
from .models import Trip


# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))


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
