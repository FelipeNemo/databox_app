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
