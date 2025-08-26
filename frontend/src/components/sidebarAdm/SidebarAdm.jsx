
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebarAdm.css';
import { useTopbarAdm } from '../hook/useTopbarAdm';
import {
  FaHome, FaChartBar, FaUsers, FaUniversity, FaUserTie,
  FaCreditCard, FaShieldAlt, FaComments, FaEnvelope,
  FaBullseye, FaPuzzlePiece, FaFlask, FaTrophy, FaStore,
  FaChevronDown, FaChevronRight
} from 'react-icons/fa';


const SidebarAdm = () => {
  const { playClickSound } = useTopbarAdm();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    playClickSound();
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const nav = (path) => () => {
    playClickSound();
    navigate(path);
  };

  return (
    <div className="sidebar-adm">
      <div className="sidebar-buttons">
        <button onClick={nav('/admin')}>
          <FaHome /> Página Inicial
        </button>

        <button onClick={nav('/admin/dashboard')}>
          <FaChartBar /> Dashboards e KPIs
        </button>

        <button onClick={() => toggleSection('usuarios')}>
          <FaUsers /> Gestão de Usuários {openSections.usuarios ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.usuarios && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/area-estudante')}>
              <FaUsers /> Estudantes
            </button>
            <button className="sidebar-subbutton" onClick={nav('/area-empresa')}>
              <FaUniversity /> Empresas
            </button>
            <button className="sidebar-subbutton" onClick={nav('/area-helpers')}>
              <FaUserTie /> Helpers
            </button>
          </>
        )}

        <button onClick={nav('/admin/pagamentos')}>
          <FaCreditCard /> Pagamentos e Planos
        </button>

        <button onClick={() => toggleSection('moderacao')}>
          <FaShieldAlt /> Moderação de mídia {openSections.moderacao ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.moderacao && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/comentarios')}>
              <FaComments /> Comentários
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/foruns')}>
              <FaComments /> Fóruns
            </button>
          </>
        )}

        <button onClick={() => toggleSection('suporte')}>
          <FaEnvelope /> Suporte a Usuários {openSections.suporte ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.suporte && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/tickets')}>
              <FaEnvelope /> Tickets
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/mensagens')}>
              <FaEnvelope /> Mensagens Internas
            </button>
          </>
        )}

        <button onClick={() => toggleSection('temporadas')}>
          <FaBullseye /> Eventos {openSections.temporadas ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.temporadas && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/temporadas/criar')}>
              <FaBullseye /> Criação
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/temporadas/editar')}>
              <FaBullseye /> Edição
            </button>
          </>
        )}

        <button onClick={() => toggleSection('desafios')}>
          <FaPuzzlePiece /> Desafios {openSections.desafios ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.desafios && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/desafios/ativos')}>
              <FaPuzzlePiece /> Ativos
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/desafios/tipo')}>
              <FaPuzzlePiece /> Fictícios vs Empresariais
            </button>
          </>
        )}

        <button onClick={() => toggleSection('avaliacoes')}>
          <FaFlask /> Avaliação de Projeto {openSections.avaliacoes ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.avaliacoes && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/avaliacao-manual')}>
              <FaFlask /> Manual
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/avaliacao-auto')}>
              <FaFlask /> Automática
            </button>
          </>
        )}

        <button onClick={() => toggleSection('rankings')}>
          <FaTrophy /> Rankings {openSections.rankings ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.rankings && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/ranking-geral')}>
              <FaTrophy /> Geral
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/ranking-temporada')}>
              <FaTrophy /> Por Temporada
            </button>
          </>
        )}

        <button onClick={() => toggleSection('loja')}>
          <FaStore /> Loja e Benefícios {openSections.loja ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.loja && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/loja/itens')}>
              <FaStore /> Itens
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/loja/moedas')}>
              <FaStore /> Moedas e Troféus
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarAdm;
