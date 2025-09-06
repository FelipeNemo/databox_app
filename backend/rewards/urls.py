from django.urls import path
from . import views

urlpatterns = [
    path("grant/", views.grant_reward, name="rewards_grant"),
    path("confirm_notification/", views.confirm_notification, name="confirm_notification"),
    path("mine/", views.my_rewards, name="rewards_mine"),
    path("my_status/", views.my_status, name="rewards_my_status"),

    # se quiser manter compatibilidade com o front antigo:
    path("marcar_com_recompensa/", views.confirm_notification, name="marcar_com_recompensa"),
]
