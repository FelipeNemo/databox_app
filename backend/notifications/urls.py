# notifications/urls.py
from django.urls import path
from .views import user_notifications, mark_as_read, marcar_com_recompensa

urlpatterns = [
    path('user/', user_notifications, name='user_notifications'),
    path('mark_as_read/', mark_as_read, name='mark_as_read'),
        # compatibilidade com front-end antigo
    path("marcar_com_recompensa/", marcar_com_recompensa, name="marcar_com_recompensa"),
    
]



