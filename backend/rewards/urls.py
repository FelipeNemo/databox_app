from django.urls import path
from . import views

urlpatterns = [
    path("grant/", views.grant_reward, name="rewards_grant"),
    path("confirm_notification/", views.confirm_notification_with_reward, name="rewards_confirm_notification"),
    path("mine/", views.my_rewards, name="rewards_mine"),

    # novo endpoint
    path("my_status/", views.my_status, name="rewards_my_status"),

    # compatibilidade com front-end antigo
    path("marcar_com_recompensa/", views.confirm_notification_with_reward, name="marcar_com_recompensa"),
]
