// components/hook/useTopbarAdm.jsx
export function useTopbarAdm() {
  const playClickSound = () => {
    const clickSound = new Audio('/sounds/mixkit-interface-device-click-2577.wav');
    clickSound.play().catch((err) =>
      console.warn('Erro ao tocar som de clique:', err)
    );
  };

  const playRewardSound = () => {
    const rewardSound = new Audio(
      '/sounds/mixkit-quick-positive-video-game-notification-interface-265.wav'
    );
    rewardSound.play().catch((err) =>
      console.warn('Erro ao tocar som de recompensa:', err)
    );
  };

  const normalizeNotification = (n) => {
    const rawMessage = n?.message || n?.descricao || n?.body || '';
    const linhas = rawMessage.split('\n');

    const titulo =
      n?.titulo ||
      n?.title ||
      n?.message_title ||
      (linhas.length > 0 && linhas[0].trim() !== ''
        ? linhas[0]
        : 'Notificação');

    const descricao =
      n?.descricao ||
      (linhas.length > 1 ? linhas.slice(1).join('\n') : rawMessage) ||
      '—';

    const isoDate =
      n?.created_at || n?.data || n?.timestamp || new Date().toISOString();
    const dt = new Date(isoDate);
    const data = isNaN(dt.getTime())
      ? new Date().toLocaleString('pt-BR')
      : dt.toLocaleString('pt-BR');

    const tipo = n?.tipo || n?.notification_type || 'info';

    return {
      ...n,
      titulo,
      descricao,
      data,
      tipo,
    };
  };

  return { playClickSound, playRewardSound, normalizeNotification };
}
