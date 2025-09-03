# rewards/services.py
from django.utils import timezone
from notifications.utils import enviar_notificacao
from .models import Reward
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# rewards/services.py
class RewardService:
    def grant(self, reward):
        """
        Concede a recompensa. Atualiza profile se possível e marca reward como granted.
        """
        profile = getattr(reward.user, 'profile', None)

        if profile:
            # Atualiza XP, Coins e Vitalidade somente se os atributos existirem
            if hasattr(profile, 'xp') and reward.reward_type == 'xp':
                profile.xp = (profile.xp or 0) + (reward.amount or 0)

            if hasattr(profile, 'coins') and reward.reward_type == 'coin':
                profile.coins = (profile.coins or 0) + (reward.amount or 0)

            if hasattr(profile, 'vitality') and reward.reward_type == 'vitalidade':
                profile.vitality = (profile.vitality or 0) + (reward.amount or 0)

            profile.save()  # atualiza somente os campos que existirem

        # Marca a recompensa como concedida
        reward.mark_granted()

        # 🔹 Se você estiver usando websockets ou notificações, pode chamar aqui
        # self.send_notification(reward)
        # 🔹 dispara update em tempo real
        # 🔹 Força atualização de status em tempo real
        self._send_status_update(reward.user.id)
        # 🔹 Notificação normal
        self._send_real_time_notification(reward)
        return reward  # ou um objeto com reward e notification


    def _send_status_update_ws(self, user_id):
        """
        Dispara mensagem via WebSocket para o grupo do usuário
        """
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}",
            {
                "type": "user_message",
                "message": {"tipo": "status_update"}
            }
        )
        
    def _apply_reward_to_profile(self, profile, reward):
        """
        Aplica os efeitos do reward no profile de forma segura.
        Só altera campos existentes.
        """
        if reward.reward_type == "xp" and hasattr(profile, "xp"):
            profile.xp = getattr(profile, "xp", 0) + (reward.amount or 0)
        elif reward.reward_type == "coin" and hasattr(profile, "coins"):
            profile.coins = getattr(profile, "coins", 0) + (reward.amount or 0)
        elif reward.reward_type == "vitalidade" and hasattr(profile, "vitality"):
            profile.vitality = getattr(profile, "vitality", 0) + (reward.amount or 0)

        # Se você tiver outros campos do tipo item/lootbox, pode expandir aqui
        profile.save(update_fields=[f for f in ["xp", "coins", "vitality"] if hasattr(profile, f)])

    def _send_real_time_notification(self, reward):
        """
        Envia uma notificação em tempo real via WS ou outro canal.
        """
        if hasattr(reward, "user") and hasattr(reward, "reward_type"):
            descricao = f"{reward.get_reward_type_display()} ganho! Quantidade: {reward.amount or 1}"
            enviar_notificacao(
                user_id=reward.user.id,
                titulo="Recompensa Concedida",
                descricao=descricao,
                tipo="reward"
            )
            
    def _send_status_update(self, user_id):
            """
            Dispara um evento de atualização de status para o front.
            """
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"user_{user_id}",
                {
                    "type": "send_notification",  # 👈 reaproveitando handler do consumer
                    "titulo": "Status atualizado",
                    "descricao": "Seus pontos e barras foram recalculados.",
                    "tipo": "status_update",
                    "data": timezone.now().isoformat()
                }
            )

# Para retorno simples sem precisar criar uma classe específica
from types import SimpleNamespace
