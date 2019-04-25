from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

from .models import User, Trip


@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    ...


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    fields = (
        'id', 'pick_up_address', 'drop_off_address', 'status',
        'driver', 'rider', 'created', 'updated',
    )
    list_display = (
        'id', 'pick_up_address', 'drop_off_address', 'status',
        'driver', 'rider', 'created', 'updated',
    )
    list_filter = ('status',)
    readonly_fields = (
        'id', 'created', 'updated',
    )
