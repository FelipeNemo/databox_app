# rewards/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.models import Notification
from .models import Reward

REWARD_MAPPING = {
    "Treino físico": {"vitalidade": 15, "xp": 20, "moedas": 0},
    "Databox": {"vitalidade": 0, "xp": 0, "moedas": 25},
    "Matéria do Dia": {"vitalidade": 0, "xp": 25, "moedas": 5},
}

@receiver(post_save, sender=Notification)
def reward_for_notification(sender, instance, created, **kwargs):
    if not created:
        return

    user = getattr(instance, "user", None)
    if not user:
        return

    if Reward.objects.filter(user=user, notification=instance).exists():
        return

    notif_title = getattr(instance, "title", None) or "Recompensa"
    # AJUSTAR AS NOTIFICAÇÕES PARA TER TÍTULOS PADRÃO
    # ELAS ESTÃO SAINDO COM APENASESSE 10 DE XP.... dESCUBRA COMO CRIAR NOTIFICAÇÕES E INTEGRAR ALEATÓRIEDADE E IA. sE PRECISO CRIE UM
    # ARQUIVO PARA CRIAR O TEMPLATE DE NOTIFICAÇÃO ASSOCIADA A RECOMPENSAS ALEATORIAS.
    reward_config = REWARD_MAPPING.get(notif_title, {"vitalidade": 0, "xp": 10, "moedas": 0})

    # Cria cada tipo de recompensa
    if reward_config["xp"] > 0:
        Reward.objects.create(user=user, reward_type=Reward.TYPE_XP, amount=reward_config["xp"], notification=instance, extra_data={"source": "notif_auto"})
    if reward_config["moedas"] > 0:
        Reward.objects.create(user=user, reward_type=Reward.TYPE_COIN, amount=reward_config["moedas"], notification=instance, extra_data={"source": "notif_auto"})
    if reward_config["vitalidade"] > 0:
        Reward.objects.create(user=user, reward_type=Reward.TYPE_VITALITY, amount=reward_config["vitalidade"], notification=instance, extra_data={"source": "notif_auto"})

    # 🔹 Atualiza apenas o campo reward_text, não a mensagem original
    parts = []
    if reward_config["xp"] > 0:
        parts.append(f"{reward_config['xp']} XP")
    if reward_config["moedas"] > 0:
        parts.append(f"{reward_config['moedas']} moedas")
    if reward_config["vitalidade"] > 0:
        parts.append(f"{reward_config['vitalidade']} Vitalidade")

    instance.reward_text = " + ".join(parts) if parts else None
    instance.save(update_fields=["reward_text"])
