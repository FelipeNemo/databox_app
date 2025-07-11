import React, { useState } from "react";
import './contato.css';

const Contato = () => {
  const [form, setForm] = useState({
    nomeEmpresa: '',
    areaAtuacao: '',
    porteEmpresa: '',
    cargoSolicitante: '',
    outroCargoSolicitante: '',
    detalhesProposta: '',
    emailContato: '',
    documentos: null,
    detalhesExtras: '',
  });

  const [statusMsg, setStatusMsg] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('dados');

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm(prev => ({ ...prev, [name]: files }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.nomeEmpresa || !form.emailContato || !form.detalhesProposta.trim()) {
      setStatusMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setStatusMsg("Enviando...");

    setTimeout(() => {
      setStatusMsg("Mensagem enviada com sucesso! Entraremos em contato.");
      setForm({
        nomeEmpresa: '',
        areaAtuacao: '',
        porteEmpresa: '',
        cargoSolicitante: '',
        outroCargoSolicitante: '',
        detalhesProposta: '',
        emailContato: '',
        documentos: null,
        detalhesExtras: '',
      });
      setAbaAtiva('dados');
    }, 2000);
  };

  return (
    <section className="contato-container">
      <h2 className="titulo-centralizado">Contato - Solicite sua Proposta</h2>
      <p className="titulo-centralizado">Preencha o formulário para entendermos sua demanda.</p>

      <form onSubmit={handleSubmit} className="contato-form">
        {abaAtiva === 'dados' && (
          <>
            <label>
              Nome da Empresa<span className="required">*</span>
              <input
                type="text"
                name="nomeEmpresa"
                value={form.nomeEmpresa}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email para Contato<span className="required">*</span>
              <input
                type="email"
                name="emailContato"
                value={form.emailContato}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Área de Atuação
              <input
                type="text"
                name="areaAtuacao"
                value={form.areaAtuacao}
                onChange={handleChange}
                placeholder="Digite sua área de atuação"
              />
            </label>

            <label>
              Porte da Empresa
              <select
                name="porteEmpresa"
                value={form.porteEmpresa}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="Microempresa">Microempresa</option>
                <option value="Pequena">Pequena</option>
                <option value="Média">Média</option>
                <option value="Grande">Grande</option>
                <option value="Startup">Startup</option>
              </select>
            </label>

            <label>
              Cargo Solicitante
              <select
                name="cargoSolicitante"
                value={form.cargoSolicitante}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="Recrutador">Recrutador</option>
                <option value="CEO">CEO</option>
                <option value="Gestor">Gestor</option>
                <option value="Outro">Outro</option>
              </select>
            </label>

            {form.cargoSolicitante === "Outro" && (
              <label>
                Por favor, especifique seu cargo
                <input
                  type="text"
                  name="outroCargoSolicitante"
                  value={form.outroCargoSolicitante}
                  onChange={handleChange}
                  placeholder="Digite seu cargo"
                  required
                />
              </label>
            )}
          </>
        )}

        {abaAtiva === 'documentos' && (
          <>
            <label className="label-centralizado">
              Upload de Documentos (PDF, DOC, imagens)
              <input
                type="file"
                name="documentos"
                onChange={handleChange}
                multiple
                accept=".pdf,.doc,.docx,image/*"
              />
            </label>

            <label>
              Detalhes Adicionais
              <textarea
                name="detalhesExtras"
                value={form.detalhesExtras}
                onChange={handleChange}
                placeholder="Informações adicionais..."
                rows="4"
              />
            </label>
          </>
        )}

        <div className="abas aba-bottom">
          <button
            type="button"
            className={abaAtiva === 'dados' ? 'aba ativa' : 'aba'}
            onClick={() => setAbaAtiva('dados')}
          >
            Dados da Proposta
          </button>
          <button
            type="button"
            className={abaAtiva === 'documentos' ? 'aba ativa' : 'aba'}
            onClick={() => setAbaAtiva('documentos')}
          >
            Documentos e Detalhes
          </button>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={!form.detalhesProposta.trim()}
        >
          Enviar
        </button>
      </form>

      {statusMsg && <p className="status-msg">{statusMsg}</p>}
    </section>
  );
};

export default Contato;
