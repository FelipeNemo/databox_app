# rewards/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.models import Notification
from .models import Reward


@receiver(post_save, sender=Notification)
def reward_for_notification(sender, instance, created, **kwargs):
    """
    Cria recompensa automática quando uma nova notificação é criada.
    """
    if not created:
        return

    user = getattr(instance, "user", None)
    if not user:
        return

    # Verifica se já existe recompensa associada a essa notificação
    if Reward.objects.filter(user=user, notification=instance).exists():
        return

    # Cria recompensa corretamente
    Reward.objects.create(
        user=user,
        reward_type=Reward.TYPE_XP,   # pode ser "xp", "coin", etc.
        amount=10,                    # substitui o antigo "points"
        notification=instance,
        extra_data={"source": "notif_auto"},
    )
