from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from notifications.models import Notification

from .models import Reward
from .serializers import RewardSerializer
from .services import RewardService

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def grant_reward(request):
    """
    Cria e concede uma recompensa imediatamente.
    Payload exemplo:
    {
      "reward_type": "xp" | "coin" | "item" | "lootbox" | "api",
      "amount": 10,
      "item_code": "item_sword_01",
      "api_endpoint": "/externo/vitalidade",
      "mission_code": "MISSAO_DAILY_01",
      "notification_id": 123,          # opcional, vincula com uma notif existente
      "extra_data": {"chave": "valor"} # opcional
    }
    """
    data = request.data.copy()
    data["user"] = request.user.id

    serializer = RewardSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    reward = serializer.save()

    result = RewardService().grant(reward)
    out = RewardSerializer(result.reward).data
    out["notification_created_id"] = result.notification.id if result.notification else None
    return Response(out, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def confirm_notification_with_reward(request):
    """
    Fluxo para seu botão 'Ok': marca a notificação como lida
    e concede uma recompensa (parâmetros opcionais para personalizar a recompensa).

    Payload exemplo:
    {
      "notification_id": 123,
      "reward": {
        "reward_type": "xp",
        "amount": 10
      }
    }
    Se "reward" não vier, dá um XP padrão (ex.: 10).
    """
    notif_id = request.data.get("notification_id")
    if not notif_id:
        return Response({"error": "notification_id é obrigatório"}, status=400)

    notif = get_object_or_404(Notification, id=notif_id, user=request.user)

    # Marca como lida
    if not notif.is_read:
        notif.is_read = True
        notif.save(update_fields=["is_read"])

    reward_payload = request.data.get("reward") or {}
    reward_type = reward_payload.get("reward_type", "xp")
    amount = reward_payload.get("amount", 10)
    item_code = reward_payload.get("item_code")
    api_endpoint = reward_payload.get("api_endpoint")
    mission_code = reward_payload.get("mission_code")
    extra_data = reward_payload.get("extra_data", {})

    reward = Reward.objects.create(
        user=request.user,
        reward_type=reward_type,
        amount=amount,
        item_code=item_code,
        api_endpoint=api_endpoint,
        mission_code=mission_code,
        notification=notif,
        extra_data=extra_data,
    )

    result = RewardService().grant(reward)
    out = RewardSerializer(result.reward).data
    out["notification_created_id"] = result.notification.id if result.notification else None
    return Response(out, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_rewards(request):
    qs = Reward.objects.filter(user=request.user).order_by("-created_at")
    return Response(RewardSerializer(qs, many=True).data)
