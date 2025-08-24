#rewards/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from notifications.models import Notification

class Reward(models.Model):
    TYPE_XP = "xp"
    TYPE_COIN = "coin"
    TYPE_ITEM = "item"
    TYPE_LOOTBOX = "lootbox"
    TYPE_API = "api"

    REWARD_TYPES = [
        (TYPE_XP, "Experiência (XP)"),
        (TYPE_COIN, "Moeda"),
        (TYPE_ITEM, "Item"),
        (TYPE_LOOTBOX, "Caixa Misteriosa"),
        (TYPE_API, "Chamada de API"),
    ]

    STATUS_PENDING = "pending"
    STATUS_GRANTED = "granted"
    STATUS_CLAIMED = "claimed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pendente"),
        (STATUS_GRANTED, "Concedida"),
        (STATUS_CLAIMED, "Resgatada"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rewards")
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPES)
    amount = models.IntegerField(null=True, blank=True, help_text="XP/moeda/quantidade (se aplicável)")
    item_code = models.CharField(max_length=100, null=True, blank=True, help_text="Identificador do item (se aplicável)")
    mission_code = models.CharField(max_length=100, null=True, blank=True, help_text="Ligação opcional com missão")
    notification = models.ForeignKey(Notification, null=True, blank=True, on_delete=models.SET_NULL, related_name="rewards")
    api_endpoint = models.CharField(max_length=255, null=True, blank=True, help_text="Endpoint de API (se aplicável)")
    extra_data = models.JSONField(default=dict, blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    granted_at = models.DateTimeField(null=True, blank=True)

    def mark_granted(self):
        self.status = self.STATUS_GRANTED
        self.granted_at = timezone.now()
        self.save(update_fields=["status", "granted_at"])

    def __str__(self):
        return f"{self.get_reward_type_display()} -> {self.user} [{self.status}]"
