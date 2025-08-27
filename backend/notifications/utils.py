# notifications/utils.py

"""
Funções utilitárias para criação e envio de notificações no sistema.

Funções:
1. criar_notificacao - cria uma notificação única no dia para o usuário.
2. criar_notificacoes_diarias - cria pacotes de notificações diárias (uma vez por dia).
3. enviar_notificacao - envia notificação em tempo real via WebSocket.
"""

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils.timezone import now
from .models import Notification


def criar_notificacao(user, titulo, mensagem, tipo="info"):
    """
    Cria uma notificação para o usuário apenas se ainda não existir
    hoje com o mesmo título.

    Parâmetros:
    - user: instância do usuário
    - titulo: título da notificação
    - mensagem: conteúdo da notificação
    - tipo: tipo da notificação (ex: "info", "reward", "diaria")

    Retorna:
    - A instância da notificação criada, ou None se já existia hoje.
    """
    hoje = now().date()

    # Verifica se já existe notificação com o mesmo título hoje
    existe = Notification.objects.filter(
        user=user,
        title=titulo,
        created_at__date=hoje  # usa apenas a parte da data
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
    Cria o pacote de notificações diárias para o usuário apenas uma vez por dia.

    - Evita criar duplicatas do mesmo tipo no mesmo dia.
    - Retorna a lista de notificações criadas ou None se já existiam.
    """
    hoje = now().date()

    # Verifica se já foram criadas notificações diárias hoje
    if Notification.objects.filter(user=user, created_at__date=hoje, notification_type="diaria").exists():
        return None

    # Lista de notificações diárias
    notificacoes = [
        {"titulo": "Treino físico", "mensagem": "Treine peito, costas, pernas ou corrida!", "tipo": "diaria"},
        {"titulo": "Matéria do Dia", "mensagem": "Estude 20 minutos as matérias do dia!", "tipo": "diaria"},
        {"titulo": "Databox", "mensagem": "Cumprir alguma feature do sistema!", "tipo": "diaria"},
    ]

    criadas = []
    for n in notificacoes:
        notif = Notification.objects.create(
            user=user,
            notification_type=n["tipo"],
            title=n["titulo"],
            message=n["mensagem"],
        )
        criadas.append(notif)

    return criadas


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
            "type": "send_notification",  # nome do handler no consumer
            "titulo": titulo,
            "descricao": descricao,
            "tipo": tipo,
            "data": now().strftime("%d/%m/%Y %H:%M"),  # timestamp formatado
        }
    )
