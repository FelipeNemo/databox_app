#notifications/utils.py
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils.timezone import now
from django.utils import timezone
from .models import Notification 



def criar_notificacao(user, titulo, mensagem, tipo="info"):
    """
    Cria uma notificação apenas se ainda não existir hoje
    E se a mesma notificação não estiver marcada como lida.
    """
    hoje = now().date()
    existe = Notification.objects.filter(
        user=user,
        title=titulo,
        message=mensagem,
        created_at__date=hoje,
        is_read=False  # 🔹 Ignora notificações já lidas
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
    Cria até 3 notificações diárias, apenas se ainda não existirem hoje.
    """
    notificacoes = [
        {"titulo": "Treino físico", "mensagem": "Treine peito, costas, pernas ou corrida!", "tipo": "reward"},
        {"titulo": "Matéria do Dia", "mensagem": "Estude 20 minutos as matérias do dia!", "tipo": "reward"},
        {"titulo": "Databox", "mensagem": "Cumprir alguma feature do sistema!", "tipo": "reward"},
    ]

    hoje = now().date()
    # Contar quantas notificações do dia já existem
    qtd_hoje = Notification.objects.filter(user=user, created_at__date=hoje).count()

    # Criar apenas as que faltam para completar 3
    faltando = max(0, 3 - qtd_hoje)
    for notif in notificacoes[:faltando]:
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