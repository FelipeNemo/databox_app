"""
Funções utilitárias para criação e envio de notificações no sistema.

Funções:
1. criar_notificacao_diaria - cria notificações diárias únicas por usuário.
2. criar_notificacao_random - cria notificações aleatórias únicas por dia.
3. enviar_notificacao - envia notificação em tempo real via WebSocket.
"""

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils.timezone import now
from .models import Notification
from rewards.models import Reward
from notifications.templates import get_daily_notifications, get_random_notification

# -----------------------------
# 1️⃣ Notificações diárias
# -----------------------------
def criar_notificacoes_diarias(user):
    hoje = now().date()
    notificacoes_templates = get_daily_notifications()
    criadas = []

    for template in notificacoes_templates:
        # Verifica se já existe notificação hoje
        existe = Notification.objects.filter(
            user=user,
            title=template["title"],
            created_at__date=hoje
        ).exists()

        if not existe:
            notif = Notification.objects.create(
                user=user,
                notification_type="diaria",
                title=template["title"],
                message=template["message"],
            )
            criadas.append(notif)

            # Cria recompensas vinculadas à notificação
            _criar_recompensas(user, notif, template.get("rewards", {}))

    return criadas

# -----------------------------
# 2️⃣ Notificação aleatória
# -----------------------------
def criar_notificacao_random(user):
    hoje = now().date()

    # Se já existe random hoje, não cria outra
    if Notification.objects.filter(user=user, notification_type="random", created_at__date=hoje).exists():
        return None

    template = get_random_notification()
    if not template:
        return None

    notif = Notification.objects.create(
        user=user,
        notification_type="random",
        title=template["title"],
        message=template["message"],
    )

    # Cria recompensas vinculadas à notificação
    _criar_recompensas(user, notif, template.get("rewards", {}))

    return notif

# -----------------------------
# 3️⃣ Criação de recompensas
# -----------------------------
def _criar_recompensas(user, notif, rewards):
    """
    Cria recompensas vinculadas à notificação.
    O id da notificação serve como "pai" das recompensas.
    """
    partes = []

    if rewards.get("xp", 0) > 0:
        Reward.objects.create(
            user=user, notification=notif,
            reward_type=Reward.TYPE_XP, amount=rewards["xp"]
        )
        partes.append(f"{rewards['xp']} XP")

    if rewards.get("coin", 0) > 0:
        Reward.objects.create(
            user=user, notification=notif,
            reward_type=Reward.TYPE_COIN, amount=rewards["coin"]
        )
        partes.append(f"{rewards['coin']} moedas")

    if rewards.get("vitality", 0) > 0:
        Reward.objects.create(
            user=user, notification=notif,
            reward_type=Reward.TYPE_VITALITY, amount=rewards["vitality"]
        )
        partes.append(f"{rewards['vitality']} Vitalidade")

    # Atualiza o texto resumo das recompensas na notificação
    if partes:
        notif.reward_text = " + ".join(partes)
        notif.reward_count = sum(rewards.values())
        notif.save(update_fields=["reward_text", "reward_count"])

# -----------------------------
# 4️⃣ Envio em tempo real via WebSocket
# -----------------------------
def enviar_notificacao(user_id, titulo, descricao, tipo="info"):
    """
    Envia notificação em tempo real via WebSocket para o canal do usuário.

    Parâmetros:
    - user_id: id do usuário
    - titulo: título da notificação
    - descricao: mensagem da notificação
    - tipo: tipo da notificação (ex: "info", "reward", "diaria")
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            "type": "send_notification",
            "titulo": titulo,
            "descricao": descricao,
            "tipo": tipo,
            "data": now().strftime("%d/%m/%Y %H:%M"),
        }
    )
