# rewards/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.models import Notification
from .models import Reward

# Define os valores de recompensa para cada tipo de notificação
REWARD_MAPPING = {
    "Treino físico": {"vitalidade": 15, "xp": 20, "moedas": 0},
    "Databox": {"vitalidade": 0, "xp": 0, "moedas": 25},
    "Matéria do Dia": {"vitalidade": 0, "xp": 25, "moedas": 5},
}

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

    # Não cria recompensa se já existir para esta notificação
    if Reward.objects.filter(user=user, notification=instance).exists():
        return

    # Captura o título de forma segura
    notif_title = getattr(instance, "titulo", None) or getattr(instance, "title", None)
    if not notif_title:
        notif_title = "Recompensa"

    # Recupera a configuração da recompensa com base no título da notificação
    reward_config = REWARD_MAPPING.get(notif_title, {"vitalidade": 0, "xp": 10, "moedas": 0})

    # Cria cada tipo de recompensa, se for maior que 0
    if reward_config["xp"] > 0:
        Reward.objects.create(
            user=user,
            reward_type=Reward.TYPE_XP,
            amount=reward_config["xp"],
            notification=instance,
            extra_data={"source": "notif_auto"},
        )
    if reward_config["moedas"] > 0:
        Reward.objects.create(
            user=user,
            reward_type=Reward.TYPE_COIN,
            amount=reward_config["moedas"],
            notification=instance,
            extra_data={"source": "notif_auto"},
        )
    if reward_config["vitalidade"] > 0:
        Reward.objects.create(
            user=user,
            reward_type=Reward.TYPE_VITALITY,
            amount=reward_config["vitalidade"],
            notification=instance,
            extra_data={"source": "notif_auto"},
        )

    # Atualiza a mensagem da notificação para mostrar a recompensa
    parts = []
    if reward_config["xp"] > 0:
        parts.append(f"{reward_config['xp']} XP")
    if reward_config["moedas"] > 0:
        parts.append(f"{reward_config['moedas']} moedas")
    if reward_config["vitalidade"] > 0:
        parts.append(f"{reward_config['vitalidade']} Vitalidade")

    rewards_text = " + ".join(parts) if parts else "uma recompensa"

    # Atualiza apenas o campo concreto correto, geralmente `mensagem` ou `message`
    message_field = "mensagem" if hasattr(instance, "mensagem") else "message"
    setattr(instance, message_field, f"Missão '{notif_title}' concluída! 🎁 Você ganhou {rewards_text}!")
    instance.save(update_fields=[message_field])
