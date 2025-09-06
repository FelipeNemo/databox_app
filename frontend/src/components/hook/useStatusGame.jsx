import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";

export function useStatusGame(autoRefresh = true, refreshInterval = 10000) {
  // 🔹 Status principal
  const [level, setLevel] = useState(1);
  const [xpCurrent, setXpCurrent] = useState(0);
  const [xpNeeded, setXpNeeded] = useState(100);
  const [health, setHealth] = useState(0);
  const [coins, setCoins] = useState(0);
  const [missions, setMissions] = useState([]);

  // 🔹 Estados para animação
  const [displayXp, setDisplayXp] = useState(0);
  const [displayHealth, setDisplayHealth] = useState(0);
  const [displayCoins, setDisplayCoins] = useState(0);

  const requestRefCoins = useRef();
  const requestRefXp = useRef();
  const requestRefHealth = useRef();

  // 🔹 Fetch inicial
  const fetchStatus = async () => {
    try {
      const resp = await api.get("/rewards/my_status/");
      const data = resp.data;
      setLevel(data.level);
      setXpCurrent(data.xp_current);
      setXpNeeded(data.xp_needed);
      setHealth(data.vitalidade);
      setCoins(data.coins);
      setMissions(data.missions || []);
    } catch (err) {
      console.error("Erro ao carregar status:", err);
    }
  };

  // 🔹 Refresh automático
  useEffect(() => {
    fetchStatus();
    if (!autoRefresh) return;

    const interval = setInterval(fetchStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // 🔹 Animação XP
  useEffect(() => {
    const animateXp = () => {
      if (displayXp < xpCurrent) {
        const increment = Math.ceil((xpCurrent - displayXp) / 10);
        let newXp = displayXp + increment;

        // Level-up
        if (newXp >= xpNeeded) {
          newXp -= xpNeeded;
          setLevel(prev => prev + 1);
          setXpNeeded(prev => Math.floor(prev * 1.1)); // aumenta XP necessário progressivamente
        }

        setDisplayXp(newXp);
        requestRefXp.current = requestAnimationFrame(animateXp);
      }
    };
    cancelAnimationFrame(requestRefXp.current);
    requestRefXp.current = requestAnimationFrame(animateXp);
    return () => cancelAnimationFrame(requestRefXp.current);
  }, [xpCurrent, xpNeeded, displayXp]);

  // 🔹 Animação vitalidade
  useEffect(() => {
    const animateHealth = () => {
      if (displayHealth < health) {
        const increment = Math.ceil((health - displayHealth) / 10);
        setDisplayHealth(prev => Math.min(prev + increment, health));
        requestRefHealth.current = requestAnimationFrame(animateHealth);
      }
    };
    cancelAnimationFrame(requestRefHealth.current);
    requestRefHealth.current = requestAnimationFrame(animateHealth);
    return () => cancelAnimationFrame(requestRefHealth.current);
  }, [health, displayHealth]);


  useEffect(() => {
    const animateCoins = () => {
      if (displayCoins < coins) {
        const increment = Math.ceil((coins - displayCoins) / 10);
        setDisplayCoins(prev => Math.min(prev + increment, coins));
        requestRefCoins.current = requestAnimationFrame(animateCoins);
      }
    };

    requestRefCoins.current = requestAnimationFrame(animateCoins);
    return () => cancelAnimationFrame(requestRefCoins.current);
  }, [coins, displayCoins]);


  return {
    level, 
    displayXp,
    xpNeeded,
    displayHealth,
    coins,
    missions,
    refreshStatus: fetchStatus
  };
}
