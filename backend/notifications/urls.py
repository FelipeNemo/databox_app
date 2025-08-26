# notifications/urls.py
from django.urls import path
from .views import user_notifications, mark_as_read

urlpatterns = [
    path('user/', user_notifications, name='user_notifications'),
    path('mark_as_read/', mark_as_read, name='mark_as_read'),
]



