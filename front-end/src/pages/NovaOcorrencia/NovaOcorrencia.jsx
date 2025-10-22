// NovaOcorrencia.jsx
import React, { useState, useRef } from 'react';
import './NovaOcorrencia.css';
import { createOcorrencia } from '../../services/ocorrenciaService';

const NovaOcorrencia = () => {
  const [formData, setFormData] = useState({
    natureza: '',
    responsavel: '',
    data: '',
    descricao: '',
    localizacao: '',
    prioridade: 'media',
    status: 'aberta'
  });

  const [assinatura, setAssinatura] = useState('');
  const [arquivos, setArquivos] = useState([]);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          setFormData(prev => ({
            ...prev,
            localizacao: `${latitude}, ${longitude}`
          }));
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

  const fetchLatLonFromAddress = async (endereco) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`);
      const data = await response.json();
      if (data.length === 0) throw new Error("Endereço não encontrado");
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } catch (err) {
      console.error(err);
      alert("Não foi possível localizar o endereço");
      return { latitude: null, longitude: null };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Busca latitude e longitude do endereço digitado
      const { latitude, longitude } = await fetchLatLonFromAddress(formData.localizacao);

      if (!latitude || !longitude) {
        setLoading(false);
        return;
      }

      // Monta objeto a enviar
      const ocorrenciaEnviar = {
        ...formData,
        titulo: formData.descricao.slice(0, 20), // título curto baseado na descrição
        localizacao: formData.localizacao,
        latitude,
        longitude
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
        localizacao: '',
        prioridade: 'media',
        status: 'aberta'
      });
      setArquivos([]);
      clearSignature();

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
        localizacao: '',
        prioridade: 'media',
        status: 'aberta'
      });
      setArquivos([]);
      clearSignature();
    }
  };

  return (
    <div className="nova-ocorrencia-container">
      <h1>Nova Ocorrência</h1>

      <form onSubmit={handleSubmit} className="nova-ocorrencia-form">
        {/* Natureza + Responsável */}
        <div className="form-row">
          <div className="form-group">
            <label>Natureza</label>
            <select name="natureza" value={formData.natureza} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="Urgente">Urgente</option>
              <option value="Rotina">Rotina</option>
              <option value="Preventiva">Preventiva</option>
            </select>
          </div>

          <div className="form-group">
            <label>Responsável</label>
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

        {/* Data + Descrição */}
        <div className="form-row">
          <div className="form-group">
            <label>Data</label>
            <input type="date" name="data" value={formData.data} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva a ocorrência"
              required
            />
          </div>
        </div>

        {/* Localização + Prioridade */}
        <div className="form-row">
          <div className="form-group">
            <label>Localização</label>
            <div className="location-input-container">
              <input
                type="text"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                placeholder="Digite ou use o GPS"
                required
              />
              <button type="button" onClick={getCurrentLocation} title="Usar localização atual">
                📍
              </button>
            </div>
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

        {/* Status */}
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Aberta">Aberta</option>
            <option value="Em_Andamento">Em Andamento</option>
            <option value="Pendente">Pendente</option>
            <option value="Resolvida">Resolvida</option>
          </select>
        </div>

        {/* Upload de Arquivos */}
        <div className="anexos-section">
          <h2>Anexos</h2>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
          />
          {arquivos.length > 0 && (
            <ul>
              {arquivos.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Assinatura */}
        <div className="assinatura-section">
          <h2>Assinatura Digital</h2>
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            style={{ border: '1px solid #ccc', backgroundColor: '#fff' }}
          />
          <div className="assinatura-actions">
            <button type="button" onClick={clearSignature}>Limpar</button>
          </div>
        </div>

        {/* Botões */}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Salvar Ocorrência'}
          </button>
          <button type="button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default NovaOcorrencia;
