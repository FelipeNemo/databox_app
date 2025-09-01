# rewards/services.py
from dataclasses import dataclass
from typing import Optional
from django.db import transaction
from django.utils import timezone
from notifications.models import Notification
from notifications.utils import enviar_notificacao

from .models import Reward

@dataclass
class GrantResult:
    reward: Reward
    notification: Optional[Notification]

class RewardService:
    """
    Serviço central para conceder recompensas e notificar o usuário.
    Integre aqui as chamadas reais para: perfil (XP), carteira (moedas),
    inventário (itens), APIs externas, etc.
    """

    @transaction.atomic
    def grant(self, reward: Reward) -> GrantResult:
        # Encaminha para o handler correto
        if reward.reward_type == Reward.TYPE_XP:
            self._add_xp(reward)
        elif reward.reward_type == Reward.TYPE_COIN:
            self._add_coin(reward)
        elif reward.reward_type == Reward.TYPE_ITEM:
            self._give_item(reward)
        elif reward.reward_type == Reward.TYPE_LOOTBOX:
            self._open_lootbox(reward)
        elif reward.reward_type == Reward.TYPE_API:
            self._call_api(reward)

        reward.mark_granted()

        titulo = "Recompensa 🎁"
        msg = self._human_message(reward)

        notif = Notification.objects.create(
            user=reward.user,
            title=titulo,
            message=msg,
            notification_type="reward",
        )

        # Envia via WS
        enviar_notificacao(
            user_id=reward.user_id,
            titulo=titulo,
            descricao=msg,
            tipo="reward",
        )

        return GrantResult(reward=reward, notification=notif)

    # ===== Handlers (substitua pelo seu domínio real) =====
    # ===== Handlers =====
    def _add_xp(self, reward: Reward):
        profile = reward.user.profile  # 🔹 pega o perfil do usuário
        profile.xp += reward.amount or 0  # 🔹 adiciona XP
        profile.save(update_fields=["xp"])  # 🔹 salva no DB

    def _add_coin(self, reward: Reward):
        profile = reward.user.profile
        profile.coins += reward.amount or 0
        profile.save(update_fields=["coins"])

    def _give_item(self, reward: Reward):
        # TODO: integre com seu inventário (ex.: reward.user.inventory.add_item(reward.item_code))
        pass

    def _open_lootbox(self, reward: Reward):
        # TODO: implemente a lógica de loot (sorteio) e adição ao inventário
        result_item = reward.extra_data.get("loot_item", "item_aleatorio")
        reward.extra_data["loot_item"] = result_item

    def _call_api(self, reward: Reward):
        # TODO: faça a chamada de API externa conforme reward.api_endpoint e extra_data
        # OBS: Evite requisições bloqueantes longas. Se necessário, use Celery.
        pass

    # ===== Helpers =====
    def _human_message(self, reward: Reward) -> str:
        if reward.reward_type == Reward.TYPE_XP:
            return f"Você ganhou {reward.amount or 0} XP!"
        if reward.reward_type == Reward.TYPE_COIN:
            return f"Você recebeu {reward.amount or 0} moedas!"
        if reward.reward_type == Reward.TYPE_ITEM:
            return f"Você recebeu o item: {reward.item_code}."
        if reward.reward_type == Reward.TYPE_LOOTBOX:
            loot = reward.extra_data.get("loot_item", "uma recompensa surpresa")
            return f"Caixa misteriosa aberta! Você ganhou: {loot}."
        if reward.reward_type == Reward.TYPE_API:
            return "Recompensa aplicada via integração externa."
        return "Recompensa concedida."
