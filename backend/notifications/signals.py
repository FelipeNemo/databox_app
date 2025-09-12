from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.models import Notification
from rewards.models import Reward
from notifications.templates import get__notifications, RANDOM_NOTIFICATIONS, get_random_notification

@receiver(post_save, sender=Notification)
def reward_from_template(sender, instance, created, **kwargs):
    """
    Cria automaticamente a recompensa e atualiza reward_text
    sempre que uma notificação é criada via utils.py.
    """
    if not created:
        return

    user = getattr(instance, "user", None)
    if not user:
        return

    # Se já existe reward associada, não faz nada
    if Reward.objects.filter(notification=instance).exists():
        return


    daily_notifications = get__notifications()
    reward_config = next(
        (n["rewards"] for n in daily_notifications if n["title"] == instance.title),
        None
        )
    
    if reward_config is None:
        reward_config = next(
            (n["rewards"] for n in RANDOM_NOTIFICATIONS if n["title"] == instance.title),
            None
        )

    # Se ainda não achou, sorteia uma random
    if reward_config is None:
        random_notif = get_random_notification()
        if random_notif:
            reward_config = random_notif["rewards"]
            instance.title = random_notif["title"]
            instance.message = random_notif["message"]
            instance.save(update_fields=["title", "message"])
        else:
            reward_config = {"xp": 5, "coin": 0, "vitality": 0}

    # Cria as recompensas correspondentes
    parts = []
    if reward_config.get("xp", 0) > 0:
        Reward.objects.create(
            user=user,
            notification=instance,
            reward_type=Reward.TYPE_XP,
            amount=reward_config["xp"]
        )
        parts.append(f"{reward_config['xp']} XP")
    if reward_config.get("coin", 0) > 0:
        Reward.objects.create(
            user=user,
            notification=instance,
            reward_type=Reward.TYPE_COIN,
            amount=reward_config["coin"]
        )
        parts.append(f"{reward_config['coin']} moedas")
    if reward_config.get("vitality", 0) > 0:
        Reward.objects.create(
            user=user,
            notification=instance,
            reward_type=Reward.TYPE_VITALITY,
            amount=reward_config["vitality"]
        )
        parts.append(f"{reward_config['vitality']} Vitalidade")

    # Atualiza reward_text
    instance.reward_text = " + ".join(parts) if parts else None
    instance.save(update_fields=["reward_text"])
