# notifications/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from .utils import enviar_notificacao
from rewards.models import Reward
from rewards.services import RewardService
from django.shortcuts import get_object_or_404
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




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def marcar_com_recompensa(request):
    notif_id = request.data.get("id")
    user = request.user

    notif = get_object_or_404(Notification, id=notif_id, user=user)

    # Marca como lida
    if not notif.is_read:
        notif.is_read = True
        notif.save(update_fields=["is_read"])

    # Cria reward e concede
    reward = Reward.objects.create(
        user=user,
        reward_type="xp",  # ou passe do payload
        amount=10,
        notification=notif
    )
    result = RewardService().grant(reward)

    return Response({
        "message": "Notificação marcada e recompensa concedida",
        "reward": {
            "id": result.reward.id,
            "type": result.reward.reward_type,
            "amount": result.reward.amount,
        },
        "notification_created_id": result.notification.id,
    })
