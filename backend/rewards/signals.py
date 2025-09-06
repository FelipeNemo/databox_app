from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.models import Notification

from .models import Reward

@receiver(post_save, sender=Notification)
def reward_from_template(sender, instance, created, **kwargs):
    """
    Cria automaticamente a recompensa e atualiza reward_text
    sempre que uma notificação é criada via utils.py.
    Presume que a notificação já possui um campo 'rewards'.
    """
    if not created:
        return

    user = getattr(instance, "user", None)
    if not user:
        return

    # Se já existe reward associada, não faz nada
    if Reward.objects.filter(notification=instance).exists():
        return

    rewards = getattr(instance, "rewards", None)
    if not rewards:
        return  # Nada a criar se não houver rewards

    parts = []

    if rewards.get("xp", 0) > 0:
        Reward.objects.create(
            user=user,
            notification=instance,
            reward_type=Reward.TYPE_XP,
            amount=rewards["xp"],
            extra_data={"source": "signal"}
        )
        parts.append(f"{rewards['xp']} XP")

    if rewards.get("coin", 0) > 0:
        Reward.objects.create(
            user=user,
            notification=instance,
            reward_type=Reward.TYPE_COIN,
            amount=rewards["coin"],
            extra_data={"source": "signal"}
        )
        parts.append(f"{rewards['coin']} moedas")

    if rewards.get("vitality", 0) > 0:
        Reward.objects.create(
            user=user,
            notification=instance,
            reward_type=Reward.TYPE_VITALITY,
            amount=rewards["vitality"],
            extra_data={"source": "signal"}
        )
        parts.append(f"{rewards['vitality']} Vitalidade")

    # Atualiza reward_text da notificação
    instance.reward_text = " + ".join(parts) if parts else None
    instance.save(update_fields=["reward_text"])
