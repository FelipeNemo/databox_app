#notifications/templates.py
import random
from datetime import datetime

# -----------------------------------------------
# 1️⃣ Notificações diárias fixas (se repetem todos os dias)
# -----------------------------------------------
_NOTIFICATIONS = [
    {
        "title": "Treino físico",
        "message": "treine puxar, empurrar pernas  e correr.",
        "rewards": {"vitality": 15, "xp": 20, "coin": 0},

    },
    {
        "title": "Databox",
        "message": "Conclua uma feature no databox.",
        "rewards": {"vitality": 0, "xp": 20, "coin": 25},
    },
    {
        "title": "Matéria do Dia",
        "message": "Estude ao menos 20 minutos das matérias do dia.",
        "rewards": {"vitality": 0, "xp": 25, "coin": 10},
    },
]


def get__notifications():
    """
    Retorna a lista fixa de notificações diárias.
    """
    return _NOTIFICATIONS


# -----------------------------------------------
# 2️⃣ Notificações aleatórias
# -----------------------------------------------
RANDOM_NOTIFICATIONS = [
    {
        "title": "Exercício de Inferência",
        "message": "Resolva um exercício de inferência lógica para ganhar suas recompensas!",
        "rewards": {"vitality": 0, "xp": 25, "coin": 10},
    },
    {
        "title": "Lavar louça",
        "message": "Cronometre quanto tempo você demora para terminar de lavar a louça",
        "rewards": {"vitality": 0, "xp": 10, "coin": 0},
    },
    {
        "title": "Descanse um pouco",
        "message": "Procure fazer algo que te faça feliz hoje!",
        "rewards": {"vitality": 10, "xp": 10, "coin": 5},
    },
]


def get_random_notification():
    """
    Retorna uma notificação aleatória da lista randômica.
    """
    if not RANDOM_NOTIFICATIONS:
        return None
    return random.choice(RANDOM_NOTIFICATIONS)


# -----------------------------------------------
# 3️⃣ Placeholders para ALERTAS
# -----------------------------------------------
ALERT_TEMPLATES = [
    {"title": "Novo usuário!", "message": "Um novo usuário entrou no sistema 🚀"},
    {"title": "Alteração detectada", "message": "Uma configuração importante foi atualizada."},
]


def get_alert_templates():
    """
    Retorna lista de notificações de alerta.
    """
    return ALERT_TEMPLATES


# -----------------------------------------------
# 4️⃣ Placeholders para AGENTS (IA externa)
# -----------------------------------------------
def create_agent_notification(title, message, rewards=None):
    """
    Gera uma notificação compatível com agents/IA,
    garantindo que as chaves de recompensa sigam o padrão esperado:
    'xp', 'coin' e 'vitality'.
    """
    # Cria um dicionário padrão de recompensas
    padrao_recompensas = {"vitality": 0, "xp": 0, "coin": 0}

    if rewards:
        # Mapeia possíveis nomes alternativos do agente para o padrão
        padrao_recompensas["vitality"] = rewards.get("vitality") or rewards.get("vitalidade") or 0
        padrao_recompensas["xp"] = rewards.get("xp") or 0
        padrao_recompensas["coin"] = rewards.get("coin") or rewards.get("moedas") or 0

    return {
        "title": title,
        "message": message,
        "rewards": padrao_recompensas,
        "metadata": {
            "source": "agent",
            "created_at": datetime.utcnow().isoformat(),
        },
    }
