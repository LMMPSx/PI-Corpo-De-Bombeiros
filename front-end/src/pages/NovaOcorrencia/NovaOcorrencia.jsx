import React, { useState, useRef } from 'react';
import './NovaOcorrencia.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setArquivos(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setArquivos(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            localizacao: `${latitude}, ${longitude}`
          }));
          
          // Abrir mapa com a localização
          window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
        },
        (error) => {
          alert('Erro ao obter localização: ' + error.message);
        }
      );
    } else {
      alert('Geolocalização não suportada pelo navegador');
    }
  };

  const openMapForLocation = () => {
    if (formData.localizacao) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.localizacao)}`, '_blank');
    } else {
      alert('Digite uma localização primeiro');
    }
  };

  // Funções para assinatura digital
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
    
    // Salvar assinatura como base64
    setAssinatura(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAssinatura('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosCompletos = {
      ...formData,
      assinatura,
      arquivos: arquivos.map(file => file.name)
    };
    console.log('Dados do formulário:', dadosCompletos);
    // Aqui você implementaria a lógica de envio
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? Os dados não salvos serão perdidos.')) {
      setFormData({
        natureza: '',
        responsavel: '',
        data: '',
        descricao: '',
        localizacao: '',
        prioridade: 'media',
        status: 'aberta'
      });
      setAssinatura('');
      setArquivos([]);
      clearSignature();
    }
  };

  return (
    <div className="nova-ocorrencia-container">
      <div className="nova-ocorrencia-header">
        <h1>Nova ocorrência</h1>
      </div>

      <form onSubmit={handleSubmit} className="nova-ocorrencia-form">
        {/* Primeira linha - 2 campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="natureza">Natureza da ocorrência</label>
            <select
              id="natureza"
              name="natureza"
              value={formData.natureza}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a natureza</option>
              <option value="urgente">Urgente</option>
              <option value="rotina">Rotina</option>
              <option value="preventiva">Preventiva</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="responsavel">Responsável</label>
            <input
              type="text"
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              placeholder="Digite o nome do responsável"
              required
            />
          </div>
        </div>

        {/* Segunda linha - 2 campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="data">Data</label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva a ocorrência"
              required
            />
          </div>
        </div>

        {/* Terceira linha - 2 campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="localizacao">Localização</label>
            <div className="location-input-container">
              <input
                type="text"
                id="localizacao"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                placeholder="Digite a localização"
                required
              />
              <button 
                type="button" 
                className="location-btn"
                onClick={getCurrentLocation}
                title="Usar localização atual"
              >
                <i className="bi bi-geo-alt"></i>
              </button>
              <button 
                type="button" 
                className="map-btn"
                onClick={openMapForLocation}
                title="Abrir no mapa"
              >
                <i className="bi bi-map"></i>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prioridade">Prioridade</label>
            <select
              id="prioridade"
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>

        <div className="separator"></div>

        <div className="anexos-section">
          <h2>Anexos</h2>
          
          <div className="anexos-upload">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
            <button 
              type="button" 
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="upload-icon"><i className="bi bi-paperclip"></i></span>
              Anexar arquivos
            </button>
            <span className="upload-hint">Formatos suportados: PDF, JPG, PNG</span>
            
            {/* Lista de arquivos anexados */}
            {arquivos.length > 0 && (
              <div className="arquivos-list">
                <h4>Arquivos anexados:</h4>
                {arquivos.map((file, index) => (
                  <div key={index} className="arquivo-item">
                    <span>{file.name}</span>
                    <button 
                      type="button" 
                      className="remove-file"
                      onClick={() => removeFile(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quarta linha - 2 campos */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="pendente">Pendente</option>
                <option value="resolvida">Resolvida</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assinatura digital</label>
              <div className="signature-container">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={100}
                  className="signature-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                
              </div>
              <button 
                  type="button" 
                  className="clear-signature"
                  onClick={clearSignature}
                >
                  Limpar
                </button>
            </div>
          </div>

          <div className="protocolo-info">
            <span>Número de protocolo: </span>
            <strong>#{(Math.random() * 10000).toFixed(0).padStart(4, '0')}</strong>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="submit-btn">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaOcorrencia;