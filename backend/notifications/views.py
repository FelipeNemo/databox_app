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

from notifications.utils import criar_notificacoes_s

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
    """
    Marca a missão como concluída e concede as recompensas vinculadas.
    """
    notif_id = request.data.get("id")
    user = request.user

    notif = get_object_or_404(Notification, id=notif_id, user=user)

    # Marca como lida
    if not notif.is_read:
        notif.is_read = True
        notif.save(update_fields=["is_read"])

    # Pega todas as recompensas pendentes vinculadas à notificação
    rewards = Reward.objects.filter(notification=notif, status="pending")

    if not rewards.exists():
        return Response({"message": "Nenhuma recompensa pendente para esta notificação."}, status=404)

    parts = []
    total_count = 0
    granted_rewards = []

    for r in rewards:
        RewardService().grant(r)
        total_count += r.amount or 1
        parts.append(f"{r.amount or 1} {r.get_reward_type_display()}")
        granted_rewards.append({
            "id": r.id,
            "type": r.reward_type,
            "amount": r.amount,
            "label": f"{r.amount or 1} {r.get_reward_type_display()}",
        })

    # Atualiza a notificação
    notif.reward_text = " + ".join(parts)
    notif.reward_count = total_count
    notif.save(update_fields=["reward_text", "reward_count"])

    # Envia notificação em tempo real
    from notifications.utils import enviar_notificacao
    enviar_notificacao(
        user_id=user.id,
        titulo=notif.title,
        descricao=notif.message,
        tipo=notif.notification_type
    )

    return Response({
        "message": "Missão marcada e recompensas concedidas",
        "notification_id": notif.id,
        "rewards_count": rewards.count(),
        "rewards": granted_rewards  # ✅ lista detalhada de rewards para o front
    })


# view administrativa para não haver rewards "orfãos de notificação"


from rest_framework.permissions import IsAdminUser
from django.utils.timezone import now
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deletar_notificacoes_hoje(request):
    """
    Deleta todas as notificações de hoje e suas recompensas associadas.
    Apenas admins podem executar.
    """
    hoje = now().date()
    queryset = Notification.objects.filter(created_at__date=hoje)

    # Deleta recompensas associadas
    Reward.objects.filter(notification__in=queryset).delete()

    # Deleta notificações
    deleted_count, _ = queryset.delete()

    return Response({"message": f"{deleted_count} notificações de hoje deletadas junto com suas recompensas."})
