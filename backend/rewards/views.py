#rewards/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from notifications.models import Notification
from rewards.models import Reward
from rewards.serializers import RewardSerializer
from rewards.services import RewardService
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_status(request):
    user = request.user

    # Garante que estamos filtrando com os valores reais do banco (minúsculos)
    rewards = Reward.objects.filter(user=user, status="granted")

    total_xp = sum(r.amount for r in rewards.filter(reward_type="xp"))
    coins = sum(r.amount for r in rewards.filter(reward_type="coin"))
    vitality = sum(r.amount for r in rewards.filter(reward_type="vitalidade"))

    # Calcula nível
    level = 1
    xp_accumulated = total_xp
    xp_needed = int(100 * (level ** 1.5))
    while xp_accumulated >= xp_needed:
        xp_accumulated -= xp_needed
        level += 1
        xp_needed = int(100 * (level ** 1.5))

    xp_current = xp_accumulated
    xp_progress = round((xp_current / xp_needed) * 100, 2)

    return Response({
        "level": level,
        "xp_current": xp_current,
        "xp_needed": xp_needed,
        "xp_progress": xp_progress,
        "coins": coins,
        "vitalidade": min(vitality, 560),  # limite de Vitalidade
        # debug opcional
        "debug_rewards": list(rewards.values("id", "reward_type", "amount", "status")),
    })


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

    result = RewardService().grant(reward) # --------------------------------------------------------------- RewardService().grant(reward)
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
    
    # cria reward mas já concede imediatamente
    reward = Reward(
        user=request.user,
        reward_type=reward_type,
        amount=amount,
        item_code=item_code,
        api_endpoint=api_endpoint,
        mission_code=mission_code,
        notification=notif,
        extra_data=extra_data,
    )

    result = RewardService().grant(reward)  # já marca granted + envia WS

    out = RewardSerializer(result.reward).data
    out["notification_created_id"] = result.notification.id if result.notification else None
    return Response(out, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_rewards(request):
    qs = Reward.objects.filter(user=request.user).order_by("-created_at")
    return Response(RewardSerializer(qs, many=True).data)
