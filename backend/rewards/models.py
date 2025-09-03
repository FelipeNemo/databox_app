# rewards/models.py
from django.db import models
from django.utils import timezone
from django.conf import settings
class Reward(models.Model):
    TYPE_XP = "xp"
    TYPE_COIN = "coin"
    TYPE_ITEM = "item"
    TYPE_LOOTBOX = "lootbox"
    TYPE_API = "api"

    REWARD_TYPES = [
        (TYPE_XP, "XP"),
        (TYPE_COIN, "Moeda"),
        (TYPE_ITEM, "Item"),
        (TYPE_LOOTBOX, "Lootbox"),
        (TYPE_API, "API"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPES)
    amount = models.IntegerField(null=True, blank=True)
    item_code = models.CharField(max_length=50, blank=True, null=True)
    extra_data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    granted_at = models.DateTimeField(null=True, blank=True)

    def mark_granted(self):
        """Marca a recompensa como concedida."""
        self.status = "granted"
        self.granted_at = timezone.now()
        # 🔹 Atualiza somente esses campos no DB
        self.save(update_fields=["status", "granted_at"])
