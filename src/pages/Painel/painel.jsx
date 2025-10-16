import { useState, useRef, useEffect } from "react";
import "./painel.css";

// Bibliotecas para gerar PDF
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SignatureCanvas from "react-signature-canvas";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

// Correção para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const getFormattedCurrentDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const estadoInicialFormulario = {
  tipo: "",
  responsavel: "",
  dataHora: getFormattedCurrentDateTime(),
  descricao: "",
  assinatura: "",
  prioridade: "Normal",
  status: "Aberto",
  protocolo: "",
  localizacao: null,
};

export default function Painel() {
  const [dadosOcorrencia, setDadosOcorrencia] = useState(estadoInicialFormulario);
  const [isCameraLigada, setIsCameraLigada] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [notification, setNotification] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

  const videoRef = useRef(null);
  const sigCanvas = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    let stream = null;
    const setupCamera = async () => {
      if (isCameraLigada) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          setNotification("Erro ao acessar a câmera. Verifique as permissões.");
          console.error(err);
          setIsCameraLigada(false);
        }
      }
    };
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraLigada]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosOcorrencia((prev) => ({ ...prev, [name]: value }));
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setDadosOcorrencia(prev => ({ ...prev, assinatura: "" }));
  };

  const handleAbrirMapa = () => {
    if (!isEditing) return;
    if (!("geolocation" in navigator)) {
      setNotification("Geolocalização não é suportada neste navegador.");
      return;
    }
    setNotification("Obtendo localização...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDadosOcorrencia((p) => ({ ...p, localizacao: { lat: latitude, lon: longitude } }));
        setNotification("Localização obtida!");
      },
      () => setNotification("Não foi possível obter a localização. Verifique as permissões do navegador.")
    );
  };
  
  const handleCaptureFoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setFotos((f) => [...f, dataUrl]);
    setNotification("Foto capturada!");
  };

  const handleStartRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setVideos((v) => [...v, videoUrl]);
        setNotification("Vídeo salvo!");
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGeneratePdf = async (e) => {
    e.preventDefault();

    let signatureImage = dadosOcorrencia.assinatura;
    if (!signatureImage && sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        setNotification("Por favor, preencha o campo da assinatura.");
        return;
      }
      signatureImage = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      setDadosOcorrencia(prev => ({ ...prev, assinatura: signatureImage }));
    }

    if (!signatureImage) {
      setNotification("A assinatura é obrigatória para gerar o PDF.");
      return;
    }
    
    setNotification("Gerando PDF...");

    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Relatório de Ocorrência", 105, 20, { align: 'center' });
      doc.setFontSize(11);
      let y = 35;
      const addField = (label, value) => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value || "Não informado"), 55, y);
        y += 8;
      };

      addField("Protocolo", dadosOcorrencia.protocolo);
      addField("Tipo", dadosOcorrencia.tipo);
      addField("Responsável", dadosOcorrencia.responsavel);
      addField("Data/Hora", new Date(dadosOcorrencia.dataHora).toLocaleString());
      addField("Prioridade", dadosOcorrencia.prioridade);
      addField("Status", dadosOcorrencia.status);
      
      const descLines = doc.splitTextToSize(dadosOcorrencia.descricao, 175);
      doc.setFont('helvetica', 'bold');
      doc.text("Descrição:", 15, y); y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(descLines, 15, y); y += descLines.length * 5 + 5;
      
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text("Assinatura:", 15, y); y += 5;
      doc.addImage(signatureImage, 'PNG', 15, y, 60, 25); y += 35;
      
      if (dadosOcorrencia.localizacao && mapContainerRef.current) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const canvas = await html2canvas(mapContainerRef.current, { useCORS: true, logging: false });
        const mapImage = canvas.toDataURL('image/png');
        if (y > 200) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text("Localização:", 15, y); y += 5;
        doc.addImage(mapImage, 'PNG', 15, y, 180, 70);
      }
      
      doc.save(`ocorrencia_${dadosOcorrencia.protocolo || 'novo'}.pdf`);
      setNotification("PDF gerado com sucesso!");
      setIsEditing(false);

    } catch (error) {
      console.error("Erro detalhado ao gerar o PDF:", error);
      setNotification("Falha ao gerar o PDF. Verifique o console (F12).");
    }
  };

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => console.log("Logout executado!");

  return (
    <div className={`dashboard-page ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} />
      <div className="main-wrapper">
        <Header onToggleSidebar={handleToggleSidebar} onLogout={handleLogout} />
        <div className="main-content">
          <h1 style={{ marginBottom: "20px", width: '100%', maxWidth: '1200px' }}>
            {isEditing ? "Registro de Ocorrência" : "Visualizar Ocorrência"}
          </h1>
          <form className="form-container" onSubmit={handleGeneratePdf}>
            <div className="form-column">
              <div className="form-group">
                <label>Tipo de ocorrência</label>
                <input type="text" name="tipo" value={dadosOcorrencia.tipo} onChange={handleInputChange} required placeholder="Ex: Incêndio em vegetação" disabled={!isEditing}/>
              </div>
              <div className="form-group">
                <label>Responsável</label>
                <input type="text" name="responsavel" value={dadosOcorrencia.responsavel} onChange={handleInputChange} required placeholder="Nome do agente" disabled={!isEditing}/>
              </div>
              <div className="form-group">
                <label>Data/Hora</label>
                <input type="datetime-local" name="dataHora" value={dadosOcorrencia.dataHora} onChange={handleInputChange} required disabled={!isEditing}/>
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea name="descricao" value={dadosOcorrencia.descricao} onChange={handleInputChange} required placeholder="Descreva os detalhes da ocorrência..." disabled={!isEditing}/>
              </div>
              <div className="form-group">
                <label>Localização (Opcional)</label>
                <div ref={mapContainerRef}>
                  {dadosOcorrencia.localizacao ? (
                    <MapContainer center={[dadosOcorrencia.localizacao.lat, dadosOcorrencia.localizacao.lon]} zoom={16} style={{ height: "200px", width: "100%", borderRadius: "8px" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                      <Marker position={[dadosOcorrencia.localizacao.lat, dadosOcorrencia.localizacao.lon]}><Popup>Localização da ocorrência.</Popup></Marker>
                    </MapContainer>
                  ) : (
                    <div className="location-box" onClick={handleAbrirMapa} style={{ cursor: isEditing ? "pointer" : "not-allowed" }}>
                      <i className="fa-solid fa-map-marker-alt"></i>
                      <p>Obter Localização Atual</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Assinatura digital</label>
                <div className="signature-pad-container">
                  {dadosOcorrencia.assinatura ? (
                    <div className="signature-preview">
                      <img src={dadosOcorrencia.assinatura} alt="Assinatura" className="signature-image"/>
                      <button type="button" onClick={clearSignature} className="signature-button secondary" disabled={!isEditing}>Refazer</button>
                    </div>
                  ) : (
                    <>
                      <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: `signature-canvas ${!isEditing ? 'disabled' : ''}` }}/>
                      <div className="signature-buttons">
                        <button type="button" onClick={clearSignature} className="signature-button secondary" disabled={!isEditing}>Limpar</button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prioridade</label>
                  <select name="prioridade" value={dadosOcorrencia.prioridade} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="Baixa">Baixa</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={dadosOcorrencia.status} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="Aberto">Aberto</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Número do protocolo</label>
                <input type="text" name="protocolo" value={dadosOcorrencia.protocolo} onChange={handleInputChange} placeholder="Digite o número do protocolo" disabled={!isEditing}/>
              </div>

              <div className="form-group">
                <label>Anexos</label>
                <div className="attachments-container">
                  {fotos.map((foto, i) => (
                    <div className="attachment-preview" key={`foto-${i}`}>
                      <img src={foto} alt={`Anexo ${i + 1}`} />
                    </div>
                  ))}
                  {videos.map((videoUrl, i) => (
                    <div className="attachment-preview" key={`video-${i}`}>
                      <video src={videoUrl} controls style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    </div>
                  ))}
                </div>
                {isEditing && (
                  isCameraLigada ? (
                    <div className="camera-view">
                      <video ref={videoRef} autoPlay muted style={{ width: "100%", borderRadius: "8px" }}/>
                      <div className="camera-buttons">
                        <button type="button" onClick={handleCaptureFoto} disabled={isRecording} className="camera-button">Tirar Foto</button>
                        {!isRecording ? (
                          <button type="button" onClick={handleStartRecording} className="camera-button">Gravar Vídeo</button>
                        ) : (
                          <button type="button" onClick={handleStopRecording} className="camera-button recording">Parar Gravação</button>
                        )}
                      </div>
                      <button type="button" onClick={() => setIsCameraLigada(false)} className="camera-button secondary" style={{width: '100%', marginTop: '10px'}}>Fechar Câmera</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCameraLigada(true)} className="camera-button-ligar" disabled={!isEditing}>
                      <i className="fa-solid fa-camera"></i> Ligar Câmera
                    </button>
                  )
                )}
              </div>
            </div>

            {isEditing && (
              <button type="submit" className="submit-button">
                Gerar PDF da Ocorrência
              </button>
            )}
          </form>
          
          {!isEditing && (
            <div className="edit-icon" onClick={() => setIsEditing(true)}>
              <i className="fa-solid fa-pencil"></i>
            </div>
          )}

          {notification && (
            <div className="notification-toast">{notification}</div>
          )}
        </div>
      </div>
    </div>
  );
}
