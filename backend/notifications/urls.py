# notifications/urls.py
from django.urls import path
from .views import user_notifications

urlpatterns = [
    path('user/', user_notifications, name='user_notifications'),
]
