import React, { useState, useRef } from 'react';
import './NovaOcorrencia.css';
import { createOcorrencia } from '../../services/ocorrenciaService';

const NovaOcorrencia = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados básicos da ocorrência
    natureza: '',
    responsavel: '',
    data: '',
    descricao: '',
    prioridade: 'Baixa',
    status: 'Aberta',
    
    // Dados de endereço (novos campos baseados no back-end)
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });

  const [assinatura, setAssinatura] = useState('');
  const [arquivos, setArquivos] = useState([]);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localizacaoAuto, setLocalizacaoAuto] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para buscar endereço via CEP
  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      if (cepLimpo.length !== 8) return;
      
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          cep: cepLimpo,
          estado: data.uf,
          cidade: data.localidade,
          bairro: data.bairro,
          rua: data.logradouro
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleCepChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, cep: value }));
    
    if (value.replace(/\D/g, '').length === 8) {
      buscarEnderecoPorCEP(value);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setArquivos(files);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          setLocalizacaoAuto(`${latitude}, ${longitude}`);
          window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
        },
        (error) => alert('Erro ao obter localização: ' + error.message)
      );
    } else alert('Geolocalização não suportada pelo navegador');
  };

  // 🖋️ Funções de assinatura
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
    setAssinatura(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAssinatura('');
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Monta objeto a enviar incluindo o endereço completo
      const ocorrenciaEnviar = {
        natureza: formData.natureza,
        responsavel: formData.responsavel,
        data: formData.data,
        descricao: formData.descricao,
        prioridade: formData.prioridade,
        status: formData.status,
        titulo: formData.descricao.slice(0, 20),
        endereco: {
          cep: formData.cep,
          estado: formData.estado,
          cidade: formData.cidade,
          bairro: formData.bairro,
          rua: formData.rua,
          numero: formData.numero
        },
        localizacaoAuto: localizacaoAuto
      };

      console.log("📤 Enviando ocorrência:", ocorrenciaEnviar);

      const response = await createOcorrencia(ocorrenciaEnviar, arquivos, assinatura);

      console.log("✅ Ocorrência criada com sucesso:", response);
      alert("Ocorrência criada com sucesso!");

      // Resetar formulário
      setFormData({
        natureza: '',
        responsavel: '',
        data: '',
        descricao: '',
        prioridade: 'Baixa',
        status: 'Aberta',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        complemento: ''
      });
      setLocalizacaoAuto('');
      setArquivos([]);
      clearSignature();
      setCurrentStep(1);

    } catch (error) {
      console.error("❌ Erro ao criar ocorrência:", error);
      alert("Erro ao criar ocorrência. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar?')) {
      setFormData({
        natureza: '',
        responsavel: '',
        data: '',
        descricao: '',
        prioridade: 'Baixa',
        status: 'Aberta',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        complemento: ''
      });
      setLocalizacaoAuto('');
      setArquivos([]);
      clearSignature();
      setCurrentStep(1);
    }
  };

  return (
    <div className="nova-ocorrencia-container">
      <h1>Nova Ocorrência</h1>
      
      <div className="steps-indicator">
        <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
          <span>1</span>
          Dados Básicos
        </div>
        <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
          <span>2</span>
          Endereço & Anexos
        </div>
      </div>

      <form onSubmit={handleSubmit} className="nova-ocorrencia-form">
        {/* PARTE 1: Dados Básicos (visível quando currentStep === 1) */}
        <div className={`form-section ${currentStep === 1 ? 'active' : 'hidden'}`}>
          <h2>Dados da Ocorrência</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Natureza *</label>
              <select name="natureza" value={formData.natureza} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="Urgente">Urgente</option>
                <option value="Rotina">Rotina</option>
                <option value="Preventiva">Preventiva</option>
              </select>
            </div>

            <div className="form-group">
              <label>Responsável *</label>
              <input
                type="text"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                placeholder="Nome do responsável"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data *</label>
              <input type="date" name="data" value={formData.data} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Prioridade</label>
              <select name="prioridade" value={formData.prioridade} onChange={handleChange}>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Descrição *</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva detalhadamente a ocorrência"
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancelar
            </button>
            <button type="button" onClick={nextStep} className="next-btn">
              Próximo →
            </button>
          </div>
        </div>

        {/* PARTE 2: Endereço e Anexos (visível quando currentStep === 2) */}
        <div className={`form-section ${currentStep === 2 ? 'active' : 'hidden'}`}>
          <h2>Localização e Documentação</h2>
          
          {/* Localização por GPS */}
          <div className="form-group">
            <label>Localização por GPS (Opcional)</label>
            <div className="location-input-container">
              <input
                type="text"
                value={localizacaoAuto}
                placeholder="Clique no botão para obter localização"
                readOnly
              />
              <button type="button" onClick={getCurrentLocation} title="Usar localização atual">
                📍 Obter Localização
              </button>
            </div>
          </div>

          <div className="separator">
            <span>OU</span>
          </div>

          {/* Endereço Manual */}
          <h3>Endereço Manual</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>CEP *</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength="9"
                required
              />
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                placeholder="UF"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cidade *</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                required
              />
            </div>
            <div className="form-group">
              <label>Bairro *</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rua *</label>
              <input
                type="text"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                placeholder="Nome da rua"
                required
              />
            </div>
            <div className="form-group">
              <label>Número *</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Nº"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Complemento</label>
            <input
              type="text"
              name="complemento"
              value={formData.complemento}
              onChange={handleChange}
              placeholder="Apto, Bloco, etc."
            />
          </div>

          {/* Upload de Arquivos */}
          <div className="anexos-section">
            <h3>Anexos</h3>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {arquivos.length > 0 && (
              <ul className="arquivos-list">
                {arquivos.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Assinatura */}
          <div className="assinatura-section">
            <h3>Assinatura Digital</h3>
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              className="signature-canvas"
            />
            <div className="assinatura-actions">
              <button type="button" onClick={clearSignature}>Limpar Assinatura</button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={prevStep} className="prev-btn">
              ← Voltar
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Enviando...' : 'Salvar Ocorrência'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NovaOcorrencia;