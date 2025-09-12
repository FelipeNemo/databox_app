# rewards/models.py

"""O app rewards é responsável por gerenciar, conceder e calcular efeitos dos rewards (XP, moedas, vitalidade, lootbox, etc)."""
from django.db import models
from django.utils import timezone
from django.conf import settings
from notifications.models import Notification

class Reward(models.Model):
    TYPE_XP = "xp"
    TYPE_VITALITY = "vitality"
    TYPE_COIN = "coin"
    TYPE_ITEM = "item"
    TYPE_LOOTBOX = "lootbox"
    TYPE_API = "api"

    REWARD_TYPES = [
        (TYPE_XP, "XP"),
        (TYPE_VITALITY, "Vitalidade"),
        (TYPE_COIN, "Moeda"),
        (TYPE_ITEM, "Item"),
        (TYPE_LOOTBOX, "Lootbox"),
        (TYPE_API, "API"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    notification = models.ForeignKey(Notification, null=True, blank=True, on_delete=models.SET_NULL)
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPES)
    amount = models.IntegerField(null=True, blank=True)
    item_code = models.CharField(max_length=50, blank=True, null=True)
    extra_data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    granted_at = models.DateTimeField(null=True, blank=True)
    
    
    # Para cada (user, notification), pode ter vários reward_types diferentes (ex: XP + Vitalidade + Moeda).
    # Mas não pode ter duplicado do mesmo reward_type para a mesma notificação.
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "notification", "reward_type"],
                name="unique_reward_per_type_per_notification"
            )
        ]


    def mark_granted(self):
        """Marca a recompensa como concedida."""
        self.status = "granted"
        self.granted_at = timezone.now()
        # 🔹 Atualiza somente esses campos no DB
        self.save(update_fields=["status", "granted_at"])
