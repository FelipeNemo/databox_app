# notifications/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Notification(models.Model):
    """
    Modelo de Notificação do usuário.
    Cada notificação pertence a um usuário e tem título, mensagem,
    tipo, data de criação, status de leitura e informações de recompensa.
    """

    # Tipos de notificação possíveis
    NOTIFICATION_TYPES = [
        ('reward', 'Recompensa'),
        ('daily', 'Tarefa Diária'),
        ('alert', 'Alerta'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, default="Sem título")

    message = models.TextField()
    notification_type = models.CharField(
        max_length=50, choices=NOTIFICATION_TYPES, default='alert'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    # Campos relacionados a recompensas
    reward_text = models.CharField(max_length=255, blank=True, null=True)
    reward_count = models.IntegerField(default=0)  # renomeado de "rewards" para evitar conflito

    def __str__(self):
        return f"Notificação para {self.user.username} - {self.notification_type}"
