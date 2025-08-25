#notifications/utils.py
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils.timezone import now

from django.utils import timezone
from .models import Notification 



def criar_notificacao(user, titulo, mensagem, tipo="info"):
    """
    Cria uma notificação apenas se ainda não existir no mesmo dia.
    """
    hoje = now().date()
    existe = Notification.objects.filter(
        user=user,
        title=titulo,
        message=mensagem,
        created_at__date=hoje
    ).exists()

    if not existe:
        return Notification.objects.create(
            user=user,
            title=titulo,
            message=mensagem,
            notification_type=tipo
        )
    return None


def criar_notificacoes_diarias(user):
    """
    Cria o pacote de notificações diárias (uma vez por dia).
    """
    notificacoes = [
        {"titulo": "Treino físico", "mensagem": "Não esqueça do seu treino de hoje!", "tipo": "daily"},
        {"titulo": "Matéria do Dia", "mensagem": "Hoje revise: Lógica Proposicional.", "tipo": "daily"},
        {"titulo": "Databox", "mensagem": "Programe algo no databox.", "tipo": "daily"},
    ]
    for notif in notificacoes:
        criar_notificacao(user, notif["titulo"], notif["mensagem"], notif["tipo"])


def enviar_notificacao(user_id, titulo, descricao, tipo="info"):
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