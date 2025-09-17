# notifications/urls.py
from django.urls import path
from .views import user_notifications, mark_as_read, marcar_com_recompensa, criar_notificacao_personalizada

urlpatterns = [

    path('user/', user_notifications, name='user_notifications'),
    path('user/mark_as_read/', mark_as_read, name='mark_as_read'),
    path('user/marcar_com_recompensa/', marcar_com_recompensa, name='marcar_com_recompensa'),
    path('user/criar_notificacao_personalizada/', criar_notificacao_personalizada, name='criar_notificacao_personalizada'),
]



