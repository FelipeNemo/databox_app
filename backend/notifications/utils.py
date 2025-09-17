#notifications/utils.py
"""
Funções utilitárias para criação e envio de notificações no sistema.

Funções:
1. criar_notificacao_ - cria notificações diárias únicas por usuário.
2. criar_notificacao_random - cria notificações aleatórias únicas por dia.
3. enviar_notificacao - envia notificação em tempo real via WebSocket.
"""

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils.timezone import now
from .models import Notification
from rewards.models import Reward
from notifications.templates import get__notifications, get_random_notification

# -----------------------------
# 1️⃣ Notificações diárias
# -----------------------------

def criar_notificacoes_s(user):
    hoje = now().date()
    notificacoes_templates = get__notifications()
    criadas = []

    # Conta quantas notificações diárias já existem hoje
    existentes = Notification.objects.filter(
        user=user, 
        notification_type="daily",
        created_at__date=hoje
    ).count()

    # Só cria se ainda não atingiu o limite (3)
    for template in notificacoes_templates:
        if existentes >= 3:
            break

        existe = Notification.objects.filter(
            user=user,
            title=template["title"],
            created_at__date=hoje
        ).exists()

        if not existe:
            notif = Notification.objects.create(
                user=user,
                notification_type="daily",
                title=template["title"],
                message=template["message"],
            )
            _criar_recompensas(user, notif, template.get("rewards", {}))
            criadas.append(notif)
            existentes += 1

    return criadas

# -----------------------------
# 2️⃣ Notificação aleatória
# -----------------------------
def criar_notificacao_random(user):
    hoje = now().date()
    
    notif = Notification.objects.filter(
        user=user,
        notification_type="random",
        created_at__date=hoje
    ).first()
    
    if notif:
        return notif  # já existe, retorna existente

    template = get_random_notification()
    if not template:
        return None

    notif = Notification.objects.create(
        user=user,
        notification_type="random",
        title=template["title"],
        message=template["message"],
    )

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

    try:
        if rewards.get("xp", 0) > 0:
            Reward.objects.create(
                user=user, notification=notif,
                reward_type=getattr(Reward, "TYPE_XP", "xp"),
                amount=rewards["xp"]
            )
            partes.append(f"{rewards['xp']} XP")

        if rewards.get("coin", 0) > 0:
            Reward.objects.create(
                user=user, notification=notif,
                reward_type=getattr(Reward, "TYPE_COIN", "coin"),
                amount=rewards["coin"]
            )
            partes.append(f"{rewards['coin']} moedas")

        if rewards.get("vitality", 0) > 0:
            Reward.objects.create(
                user=user, notification=notif,
                reward_type=getattr(Reward, "TYPE_VITALITY", "vitality"),
                amount=rewards["vitality"]
            )
            partes.append(f"{rewards['vitality']} Vitalidade")

    except Exception as e:
        # 🔒 Loga mas não quebra login
        print(f"[ERRO Reward] {e}")

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
    - tipo: tipo da notificação (ex: "info", "reward", "")
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
