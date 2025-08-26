# notifications/signals.py
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .models import Notification
from .utils import enviar_notificacao

@receiver(user_logged_in)
def notificar_bom_dia(sender, request, user, **kwargs):
    # Cria no banco
    notif = Notification.objects.create(
        user=user,
        message="Ler SNOMED ",
        notification_type="info"
    )

    # Envia instantaneamente via WebSocket
    enviar_notificacao(
        user_id=user.id,
        titulo="Ebers IA",
        descricao=notif.message,
        tipo=notif.notification_type
    )