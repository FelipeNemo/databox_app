import AreaAdm from '../../components/Area/AreaAdm/AreaAdm';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebarAdm.css';

import {
  FaHome, FaChartBar, FaUsers, FaUniversity, FaUserTie,
  FaCreditCard, FaShieldAlt, FaComments, FaEnvelope,
  FaBullseye, FaPuzzlePiece, FaFlask, FaTrophy, FaStore,
  FaChevronDown, FaChevronRight, FaUserFriends, FaCommentDots,
  FaVials, FaMedal, FaShoppingBag, FaChevronLeft,
} from 'react-icons/fa';

const SidebarAdm = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});

  // Abre seção e sidebar se estiver fechada
  const toggleSection = (section) => {
    if (!isOpen) toggleSidebar();
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Navega e abre sidebar se estiver fechada
  const nav = (path) => () => {
    if (!isOpen) toggleSidebar();
    navigate(path);
  };

  return (
    <div className={`sidebar-adm ${isOpen ? 'open' : 'closed'}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </div>

      <div className="sidebar-buttons">
        {/* Página inicial */}
        <button onClick={nav('/admin')}>
          <FaHome /> {isOpen && 'Página Inicial'}
        </button>

        {/* Dashboards e KPIs */}
        <button onClick={nav('/admin/dashboard')}>
          <FaChartBar /> {isOpen && 'Dashboards e KPIs'}
        </button>

        {/* Gestão de Usuários */}
        <button onClick={() => toggleSection('usuarios')}>
          <FaUsers /> {isOpen && 'Gestão de Usuários'} {openSections.usuarios ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.usuarios && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/area-estudante')}>
              <FaUsers /> {isOpen && 'Estudantes'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/area-empresa')}>
              <FaUniversity /> {isOpen && 'Empresas'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/area-helpers')}>
              <FaUserTie /> {isOpen && 'Helpers'}
            </button>
          </>
        )}

        {/* Pagamentos */}
        <button onClick={nav('/admin/pagamentos')}>
          <FaCreditCard /> {isOpen && 'Pagamentos e Planos'}
        </button>

        {/* Moderação */}
        <button onClick={() => toggleSection('moderacao')}>
          <FaShieldAlt /> {isOpen && 'Moderação de Conteúdo'} {openSections.moderacao ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.moderacao && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/comentarios')}>
              <FaComments /> {isOpen && 'Comentários'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/foruns')}>
              <FaComments /> {isOpen && 'Fóruns'}
            </button>
          </>
        )}

        {/* Suporte */}
        <button onClick={() => toggleSection('suporte')}>
          <FaEnvelope /> {isOpen && 'Suporte a Usuários'} {openSections.suporte ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.suporte && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/tickets')}>
              <FaEnvelope /> {isOpen && 'Tickets'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/mensagens')}>
              <FaEnvelope /> {isOpen && 'Mensagens Internas'}
            </button>
          </>
        )}

        {/* Temporadas Gamificadas */}
        <button onClick={() => toggleSection('temporadas')}>
          <FaBullseye /> {isOpen && 'Temporadas Gamificadas'} {openSections.temporadas ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.temporadas && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/temporadas/criar')}>
              <FaBullseye /> {isOpen && 'Criação'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/temporadas/editar')}>
              <FaBullseye /> {isOpen && 'Edição'}
            </button>
          </>
        )}

        {/* Desafios */}
        <button onClick={() => toggleSection('desafios')}>
          <FaPuzzlePiece /> {isOpen && 'Desafios'} {openSections.desafios ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.desafios && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/desafios/ativos')}>
              <FaPuzzlePiece /> {isOpen && 'Ativos'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/desafios/tipo')}>
              <FaPuzzlePiece /> {isOpen && 'Fictícios vs Empresariais'}
            </button>
          </>
        )}

        {/* Avaliações */}
        <button onClick={() => toggleSection('avaliacoes')}>
          <FaFlask /> {isOpen && 'Avaliações de Projetos'} {openSections.avaliacoes ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.avaliacoes && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/avaliacao-manual')}>
              <FaFlask /> {isOpen && 'Manual'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/avaliacao-auto')}>
              <FaFlask /> {isOpen && 'Automática'}
            </button>
          </>
        )}

        {/* Rankings */}
        <button onClick={() => toggleSection('rankings')}>
          <FaTrophy /> {isOpen && 'Rankings'} {openSections.rankings ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.rankings && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/ranking-geral')}>
              <FaTrophy /> {isOpen && 'Geral'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/ranking-temporada')}>
              <FaTrophy /> {isOpen && 'Por Temporada'}
            </button>
          </>
        )}

        {/* Loja */}
        <button onClick={() => toggleSection('loja')}>
          <FaStore /> {isOpen && 'Loja e Benefícios'} {openSections.loja ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openSections.loja && (
          <>
            <button className="sidebar-subbutton" onClick={nav('/admin/loja/itens')}>
              <FaStore /> {isOpen && 'Itens'}
            </button>
            <button className="sidebar-subbutton" onClick={nav('/admin/loja/moedas')}>
              <FaStore /> {isOpen && 'Moedas e Troféus'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarAdm;
