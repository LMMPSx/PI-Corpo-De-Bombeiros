import React, { useState, useRef } from 'react';
import './NovaOcorrencia.css'; // Certifique-se de ter este arquivo CSS ou remova a importação
import { createOcorrencia } from '../../services/ocorrenciaService'; // Ajuste o caminho conforme sua pasta

const NovaOcorrencia = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Estado do Formulário (Sem Data, Sem Status)
  const [formData, setFormData] = useState({
    natureza: '',
    responsavel: '',
    descricao: '',
    prioridade: 'Baixa',
    // Dados de Endereço
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });

  // Estado separado para Geolocalização e Arquivos
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [arquivos, setArquivos] = useState([]);
  const [assinatura, setAssinatura] = useState('');
  
  // Refs para assinatura e upload
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // --- HANDLERS GERAIS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setArquivos(Array.from(e.target.files));
  };

  // --- BUSCA DE CEP ---
  const handleCepChange = async (e) => {
    const cep = e.target.value;
    setFormData(prev => ({ ...prev, cep }));

    // Se tiver 8 dígitos numéricos, busca
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            estado: data.uf,
            cidade: data.localidade,
            bairro: data.bairro,
            rua: data.logradouro
          }));
        }
      } catch (error) {
        console.error("Erro CEP:", error);
      }
    }
  };

  // --- GEOLOCALIZAÇÃO ---
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCoords({ lat: coords.latitude, lng: coords.longitude });
          alert(`Localização capturada: ${coords.latitude}, ${coords.longitude}`);
        },
        (error) => alert("Erro ao obter GPS: " + error.message)
      );
    } else {
      alert("Seu navegador não suporta geolocalização.");
    }
  };

  // --- ASSINATURA (CANVAS) ---
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
    setAssinatura(canvas.toDataURL()); // Salva imagem em Base64
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAssinatura('');
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Monta estrutura final para passar ao service
      const dadosParaEnvio = {
        natureza: formData.natureza,
        responsavel: formData.responsavel,
        descricao: formData.descricao,
        prioridade: formData.prioridade,
        
        latitude: coords.lat,
        longitude: coords.lng,
        
        endereco: {
          cep: formData.cep,
          estado: formData.estado,
          cidade: formData.cidade,
          bairro: formData.bairro,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento
        }
      };

      await createOcorrencia(dadosParaEnvio, arquivos, assinatura);

      alert("✅ Ocorrência criada com sucesso!");
      
      // Resetar tudo
      setFormData({
        natureza: '', responsavel: '', descricao: '', prioridade: 'Baixa',
        cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: '', complemento: ''
      });
      setCoords({ lat: null, lng: null });
      setArquivos([]);
      setAssinatura('');
      clearSignature();
      setCurrentStep(1);

    } catch (error) {
      alert("❌ Erro ao criar ocorrência. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div className="nova-ocorrencia-container">
      <h2 style={{ textAlign: 'center' }}>Nova Ocorrência</h2>
      
      {/* Barra de Progresso Simples */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        <span style={{ fontWeight: currentStep === 1 ? 'bold' : 'normal' }}>1. Dados</span> &gt;
        <span style={{ fontWeight: currentStep === 2 ? 'bold' : 'normal' }}>2. Endereço</span> &gt;
        <span style={{ fontWeight: currentStep === 3 ? 'bold' : 'normal' }}>3. Anexos</span>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* === STEP 1: DADOS BÁSICOS === */}
        {currentStep === 1 && (
          <div className="form-step">
            <div className="form-group">
              <label>Natureza:</label>
              <select name="natureza" value={formData.natureza} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="Urgente">Urgente</option>
                <option value="Rotina">Rotina</option>
                <option value="Preventiva">Preventiva</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nome do Solicitante:</label>
              <input 
                placeholder="Nome do Solicitante"
                type="text" 
                name="responsavel" 
                value={formData.responsavel} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Prioridade:</label>
              <select name="prioridade" value={formData.prioridade} onChange={handleChange}>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descrição Detalhada:</label>
              <textarea 
                placeholder="Descrição Detalhada:"
                name="descricao" 
                rows="4"
                value={formData.descricao} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button className='next' type="button" onClick={() => setCurrentStep(2)}>Próximo</button>
          </div>
        )}

        {/* === STEP 2: ENDEREÇO E GPS === */}
        {currentStep === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label>CEP:</label>
              <input 
                placeholder='CEP'
                type="text" 
                name="cep" 
                value={formData.cep} 
                onChange={handleCepChange} 
                maxLength="9"
              />
            </div>

            <div className="form-row">
                <input type="text" name="rua" placeholder="Rua" value={formData.rua} onChange={handleChange} />
                <input type="text" name="numero" placeholder="Número" value={formData.numero} onChange={handleChange} />
            </div>
            
            <div className="form-row">
                <input type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} />
                <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
                <input type="text" name="estado" placeholder="UF" value={formData.estado} onChange={handleChange} maxLength="2" />
            </div>

            <div className="form-group" style={{ marginTop: '15px', padding: '10px', border: '1px solid #ccc' }}>
              <label>Geolocalização (GPS):</label>
              <div>
                {coords.lat ? (
                   <span style={{ color: 'green' }}>✅ Capturado: {coords.lat}, {coords.lng}</span>
                ) : (
                   <span style={{ color: 'red' }}>Não capturado</span>
                )}
              </div>
              <button className='localizacao' type="button" onClick={getCurrentLocation} style={{ marginTop: '5px' }}>
                📍 Pegar Localização Atual
              </button>
            </div>

            <div className="buttons-row">
              <button type="button" className='back' onClick={() =>  setCurrentStep(1)} >Voltar</button>
              <button type="button" className='next' onClick={() => setCurrentStep(3)}>Próximo</button>
            </div>
          </div>
        )}

        {/* === STEP 3: ANEXOS E ASSINATURA === */}
        {currentStep === 3 && (
          <div className="form-step">
            
            <div className="form-group">
              <label>Anexar Foto/Documento:</label>
              <input type="file" onChange={handleFileChange} />
            </div>

            <div className="form-group">
              <label>Assinatura Digital:</label>
              <div style={{ border: '1px solid #000', width: '860px', height: '250px', backgroundColor: '#fff' }}>
                <canvas
                  ref={canvasRef}
                  width={860}
                  height={250}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
              <button className='next' type="button" onClick={clearSignature} style={{ marginTop: '5px', fontSize: '0.8rem' }}>
                Limpar Assinatura
              </button>
            </div>

            <div className="buttons-row">
              <button className='back' type="button" onClick={() => setCurrentStep(2)}>Voltar</button>
              <button className='next' type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Finalizar e Criar'}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default NovaOcorrencia;