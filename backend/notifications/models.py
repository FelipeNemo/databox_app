#notifications/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('reward', 'Recompensa'),
        ('reward', 'Tarefa Diária'),
        ('reward', 'Alerta'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='info')
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    # 🔹 Novo campo para armazenar a recompensa ligada a essa notificação
    reward_text = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Notificação para {self.user.username} - {self.notification_type}"