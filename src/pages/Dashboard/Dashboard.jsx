// pages/Dashboard/Dashboard.jsx (atualizado)
import React, { useState, useEffect } from 'react';
import { useConfig } from '../../Contexts/ConfigContext';
import MapaOcorrencias from '../../components/MapaOcorrencias/MapaOcorrencias';
import EstatisticasRapidas from '../../components/EstatisticasRapidas/EstatisticasRapidas';
import UltimasOcorrencias from '../../components/UltimasOcorrencias/UltimasOcorrencias';
import { fetchOcorrencias } from '../../services/ocorrenciaService';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { config } = useConfig();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    emAndamento: 0,
    resolvidas: 0,
    criticas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);

    try {
      const dadosOcorrencias = await fetchOcorrencias();

      setOcorrencias(dadosOcorrencias);

      const total = dadosOcorrencias.length;

      const emAndamento = dadosOcorrencias.filter(o => o.status === 'Em_Andamento').length;
      const resolvidas = dadosOcorrencias.filter(o => o.status === 'Resolvida').length;
      const criticas = dadosOcorrencias.filter(o => o.prioridade === 'Crítica').length;

      setEstatisticas({ total, emAndamento, resolvidas, criticas });

    } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);

    } finally {
        setLoading(false);

    }
  };

  const handleNovaOcorrencia = () => {
    navigate('/nova-ocorrencia');;
  };

  const handleGerarRelatorio = () => {
    if (ocorrencias.length === 0) {
      alert("Não há dados para gerar relatório.");
      return;
    }

    try {
      // Criar documento PDF
      const doc = new jsPDF('portrait');
      
      // Título do relatório
      const title = "Relatório de Ocorrências - Dashboard";
      const dateStr = new Date().toLocaleDateString('pt-BR');
      const timeStr = new Date().toLocaleTimeString('pt-BR');
      
      // Logo ou cabeçalho
      doc.setFontSize(20);
      doc.setTextColor(0, 51, 102);
      doc.text("Sistema de Gestão de Ocorrências", 105, 15, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text(title, 105, 25, { align: 'center' });
      
      // Informações de data e estatísticas
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Gerado em: ${dateStr} às ${timeStr}`, 105, 35, { align: 'center' });
      
      // Estatísticas em formato de tabela
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Estatísticas Gerais", 20, 45);
      
      const estatisticasData = [
        ['Total de Ocorrências', estatisticas.total],
        ['Em Andamento', estatisticas.emAndamento],
        ['Resolvidas', estatisticas.resolvidas],
        ['Críticas', estatisticas.criticas]
      ];
      
      autoTable(doc, {
        body: estatisticasData,
        startY: 50,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: 'bold' },
          1: { cellWidth: 40, halign: 'center' }
        }
      });
      
      // Últimas ocorrências
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Últimas Ocorrências", 20, 20);
      
      const ocorrenciasParaRelatorio = ocorrencias.slice(0, 10).map(oc => [
        oc.id || 'N/A',
        oc.natureza || 'N/A',
        oc.prioridade,
        oc.status?.replace('_', ' ') || 'N/A',
        oc.data ? new Date(oc.data).toLocaleDateString('pt-BR') : 'N/A',
        oc.localizacao || 'N/A'
      ]);
      
      autoTable(doc, {
        head: [['ID', 'Natureza', 'Prioridade', 'Status', 'Data', 'Localização']],
        body: ocorrenciasParaRelatorio,
        startY: 30,
        theme: 'grid',
        headStyles: {
          fillColor: [13, 71, 161],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 40 }
        }
      });
      
      // Gráfico de distribuição por prioridade
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Distribuição por Prioridade", 20, 20);
      
      const prioridades = ocorrencias.reduce((acc, oc) => {
        acc[oc.prioridade] = (acc[oc.prioridade] || 0) + 1;
        return acc;
      }, {});
      
      const prioridadesData = Object.entries(prioridades).map(([prioridade, quantidade]) => [
        prioridade,
        quantidade,
        `${((quantidade / ocorrencias.length) * 100).toFixed(1)}%`
      ]);
      
      autoTable(doc, {
        head: [['Prioridade', 'Quantidade', 'Percentual']],
        body: prioridadesData,
        startY: 30,
        theme: 'grid',
        headStyles: {
          fillColor: [40, 167, 69],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          2: { halign: 'center' }
        }
      });
      
      // Adicionar rodapé em todas as páginas
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          `CBMPE - Sistema de Bombeiros`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 5,
          { align: 'center' }
        );
      }
      
      // Salvar PDF
      doc.save(`relatorio_dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar relatório PDF. Tente novamente.");
    }
  };

  // Função alternativa para CSV
  const handleGerarRelatorioCSV = () => {
    if (ocorrencias.length === 0) {
      alert("Não há dados para gerar relatório.");
      return;
    }

    const headers = ['ID', 'Natureza', 'Prioridade', 'Status', 'Data', 'Localização', 'Descrição'];
    
    const csvRows = [
      headers.join(','),
      ...ocorrencias.map(oc => [
        `"${oc.id || ''}"`,
        `"${oc.natureza || ''}"`,
        `"${oc.prioridade || ''}"`,
        `"${oc.status?.replace('_', ' ') || ''}"`,
        `"${oc.data ? new Date(oc.data).toLocaleDateString('pt-BR') : ''}"`,
        `"${oc.localizacao || ''}"`,
        `"${(oc.descricao || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_ocorrencias_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard overflow-container">
      <header className="dashboard-header">
        <h1 className="force-break">Painel de coleta e gestão de ocorrências - SiSBMPE</h1>
        <div className="dashboard-actions">
          <button 
            className="btn btn-primary"
            onClick={handleNovaOcorrencia}
          >
            <i className="bi bi-plus-circle"></i>
            Nova ocorrência
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleGerarRelatorio}
          >
            <i className="bi bi-file-earmark-pdf"></i>
            Gerar relatório (PDF)
          </button>
          <button 
            className="btn btn-success"
            onClick={handleGerarRelatorioCSV}
          >
            <i className="bi bi-file-earmark-excel"></i>
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <EstatisticasRapidas estatisticas={estatisticas} />

        <div className="dashboard-main">
          <section className="mapa-section">
            <div className="section-header">
              <h2>Mapa de Ocorrências</h2>
              <div className="map-search">
                <input 
                  type="text" 
                  placeholder="Pesquisar endereço"
                  className="search-input"
                />
                <button className="search-btn">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            <div className="mapa-container">
              <MapaOcorrencias ocorrencias={ocorrencias} />
            </div>
          </section>

          <section className="ocorrencias-section">
            <div className="section-header">
              <h2>Últimas Ocorrências</h2>
              <a href="/ocorrencias" className="ver-todas">
                Ver todas
              </a>
            </div>
            <UltimasOcorrencias ocorrencias={ocorrencias.slice(0, 5)} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;