# notifications/admin.py
from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'notification_type', 'message', 'created_at', 'is_read')
    list_filter = ('notification_type', 'is_read', 'created_at')
