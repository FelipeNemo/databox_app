# notifications/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_notifications(request):
    user = request.user
    # 🔹 Agora só busca as notificações ainda não lidas
    notifications = Notification.objects.filter(
        user=user, is_read=False
    ).order_by('-created_at')
    
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_as_read(request):
    """
    Marca uma notificação como lida.
    """
    notif_id = request.data.get("id")
    if not notif_id:
        return Response({"error": "ID da notificação é obrigatório"}, status=400)

    try:
        notif = Notification.objects.get(id=notif_id, user=request.user)
        notif.is_read = True
        notif.save()
        return Response({"message": "Notificação marcada como lida"})
    except Notification.DoesNotExist:
        return Response({"error": "Notificação não encontrada"}, status=404)

# notifications/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.timezone import now
from notifications.models import Notification
from notifications.utils import enviar_notificacao

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def marcar_com_recompensa(request):
    notif_id = request.data.get("id")
    user = request.user

    try:
        notif = Notification.objects.get(id=notif_id, user=user)
        notif.is_read = True
        notif.save()

        # 🔹 Cria a recompensa
        titulo = "Recompensa 🎁"
        mensagem = "Parabéns! Você ganhou 10 pontos de XP."
        recompensa = Notification.objects.create(
            user=user,
            title=titulo,
            message=mensagem,
            notification_type="reward"
        )

        # 🔹 Envia via WebSocket
        enviar_notificacao(
            user_id=user.id,
            titulo=titulo,
            descricao=mensagem,
            tipo="reward"
        )

        return Response({"message": "Notificação marcada e recompensa enviada."})
    except Notification.DoesNotExist:
        return Response({"error": "Notificação não encontrada."}, status=404)
