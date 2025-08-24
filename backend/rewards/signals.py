# rewards/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.models import Notification
from .models import Reward

@receiver(post_save, sender=Notification)
def reward_for_notification(sender, instance, created, **kwargs):
    if created:
        # Exemplo: dá 10 pontos por cada notificação recebida
        user = instance.user  
        Reward.objects.create(user=user, points=10, reason="Notificação recebida")



# Exemplos de sinais caso você queira reagir a eventos,
# por enquanto deixamos sem lógica automática para evitar efeitos colaterais.

# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from notifications.models import Notification
# from .models import Reward
#
# @receiver(post_save, sender=Notification)
# def maybe_reward_on_notification(sender, instance, created, **kwargs):
#     if not created:
#         return
#     # Exemplo: dar XP por uma notificação diária específica
#     if instance.notification_type == "daily" and instance.title == "Databox":
#         Reward.objects.create(
#             user=instance.user,
#             reward_type="xp",
#             amount=5,
#             notification=instance,
#             extra_data={"source": "signal_auto"},
#         )
#         # Você pode optar por executar o grant aqui também.
