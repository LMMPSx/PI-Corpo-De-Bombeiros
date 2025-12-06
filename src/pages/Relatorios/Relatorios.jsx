// AuditoriaLogs.jsx (ou Relatorios.jsx)
import React, { useState, useEffect, useCallback } from 'react';
import './Relatorios.css';
import { buscarLogsAuditoria } from '../../services/logService';

// IMPORTE CORRETO DO jsPDF e autoTable
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const extractUniqueOptions = (logs, key) => ['Todos', ...new Set(logs.map(log => log[key]))];

export default function AuditoriaLogs() {
    // 1. ESTADOS PARA DADOS DINÂMICOS
    const [initialLogs, setInitialLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. ESTADOS PARA OPÇÕES DE FILTRO
    const [uniqueUsers, setUniqueUsers] = useState(['Todos']);
    const [uniqueModules, setUniqueModules] = useState(['Todos']);
    const [uniqueActions, setUniqueActions] = useState(['Todos']);
    const periodOptions = ['Qualquer data', 'Hoje', 'Últimos 7 dias']; 
    
    // Estados de controle do filtro
    const [periodo, setPeriodo] = useState('Qualquer data');
    const [usuario, setUsuario] = useState('Todos');
    const [acao, setAcao] = useState('Todos');
    const [modulo, setModulo] = useState('Todos');

    // 3. PAGINAÇÃO E EXPORTAÇÃO
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // 4. FUNÇÃO PARA BUSCAR DADOS DA API
    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await buscarLogsAuditoria();
                setInitialLogs(data);

                // Extrai as opções de filtro dos dados
                setUniqueUsers(extractUniqueOptions(data, 'usuario'));
                setUniqueModules(extractUniqueOptions(data, 'modulo'));
                setUniqueActions(extractUniqueOptions(data, 'acao'));
                
            } catch (err) {
                setError("Erro ao carregar logs de auditoria. Verifique sua conexão e autenticação.");
                console.error("Erro ao carregar logs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Função auxiliar para converter data ISO
    const parseDateISO = useCallback((isoString) => {
        return new Date(isoString);
    }, []);

    // 5. FUNÇÃO PRINCIPAL DE FILTRO
    const handleFilter = useCallback(() => {
        let data = [...initialLogs];
        
        const today = new Date(); 
        today.setHours(0, 0, 0, 0);

        // Filtro de Período
        if (periodo === 'Hoje') {
            data = data.filter(log => {
                const logDate = parseDateISO(log.dataHoraISO);
                logDate.setHours(0, 0, 0, 0);
                return logDate.getTime() === today.getTime();
            });
        } else if (periodo === 'Últimos 7 dias') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);

            data = data.filter(log => {
                const logDate = parseDateISO(log.dataHoraISO);
                return logDate >= sevenDaysAgo;
            });
        }

        // Outros Filtros
        if (usuario !== 'Todos') data = data.filter(log => log.usuario === usuario);
        if (acao !== 'Todos') data = data.filter(log => log.acao === acao);
        if (modulo !== 'Todos') data = data.filter(log => log.modulo === modulo);

        setFilteredLogs(data);
        setCurrentPage(1);
    }, [initialLogs, periodo, usuario, acao, modulo, parseDateISO]);

    // 6. EFEITO PARA APLICAR FILTRO
    useEffect(() => { 
        handleFilter(); 
    }, [handleFilter]);

    // 7. FUNÇÃO DE EXPORTAÇÃO CSV
    const handleExportCSV = () => {
        if (filteredLogs.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }

        const headers = ['Data/Hora', 'Usuário', 'Módulo', 'Atributo Alterado', 'Valor Novo', 'Valor Antigo', 'Ação'];
        
        const csvRows = [
            headers.join(','),
            ...filteredLogs.map(log => [
                `"${log.dataHora}"`,
                `"${log.usuario}"`,
                `"${log.modulo}"`,
                `"${log.atributo || ''}"`,
                `"${log.valorNovo || ''}"`,
                `"${log.valorAntigo || ''}"`,
                `"${log.acao}"`
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `logs_auditoria_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    };

    // 8. FUNÇÃO DE EXPORTAÇÃO PDF - CORRIGIDA
    const handleExportPDF = () => {
        if (filteredLogs.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }

        try {
            // Criar o documento jsPDF
            const doc = new jsPDF('landscape');
            
            // Adicionar título
            const title = "Relatório de Auditoria e Logs";
            const dateStr = new Date().toLocaleDateString('pt-BR');
            const timeStr = new Date().toLocaleTimeString('pt-BR');
            
            // Título
            doc.setFontSize(18);
            doc.setTextColor(40, 40, 40);
            doc.text(title, 14, 22);
            
            // Informações
            doc.setFontSize(11);
            doc.setTextColor(100, 100, 100);
            doc.text(`Gerado em: ${dateStr} às ${timeStr}`, 14, 30);
            doc.text(`Total de registros: ${filteredLogs.length}`, 14, 37);
            
            // Configurar dados da tabela
            const headers = [
                ["Data/Hora", "Usuário", "Módulo", "Atributo Alterado", "Valor Novo", "Valor Antigo", "Ação"]
            ];
            
            const data = filteredLogs.map(log => [
                log.dataHora || '',
                log.usuario || '',
                log.modulo || '',
                log.atributo || '',
                log.valorNovo || '',
                log.valorAntigo || '',
                log.acao || ''
            ]);
            
            // Criar tabela usando autoTable
            autoTable(doc, {
                head: headers,
                body: data,
                startY: 45,
                theme: 'grid',
                headStyles: {
                    fillColor: [13, 71, 161],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                margin: { top: 45 },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    overflow: 'linebreak'
                },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 25 },
                    6: { cellWidth: 25 }
                },
                didDrawPage: (data) => {
                    // Adicionar rodapé
                    doc.setFontSize(10);
                    doc.setTextColor(150, 150, 150);
                    doc.text(
                        `Página ${doc.internal.getNumberOfPages()}`,
                        doc.internal.pageSize.width / 2,
                        doc.internal.pageSize.height - 10,
                        { align: 'center' }
                    );
                }
            });
            
            // Salvar PDF
            doc.save(`relatorio_auditoria_${new Date().toISOString().split('T')[0]}.pdf`);
            
        } catch (error) {
            console.error("Erro detalhado ao gerar PDF:", error);
            alert(`Erro ao gerar PDF: ${error.message}. Verifique se as bibliotecas jsPDF e jspdf-autotable estão instaladas.`);
        }
    };
    
    // 9. FUNÇÕES DE PAGINAÇÃO
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleGoToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // 10. RENDERIZAÇÃO
    if (loading) return <div className="auditoria-container"><p>Carregando logs de auditoria...</p></div>;
    if (error) return <div className="auditoria-container"><p className="error-message">{error}</p></div>;

    return (
        <div className="auditoria-container">
            <div className="auditoria-content">
                <header className="auditoria-header">
                    <h1>Auditoria & Logs</h1>
                </header>

                <div className="filters-grid">
                    <div className="filter-item">
                        <label htmlFor="periodo">Período</label>
                        <select id="periodo" value={periodo} onChange={e => setPeriodo(e.target.value)}>
                            {periodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label htmlFor="usuario">Usuário</label>
                        <select id="usuario" value={usuario} onChange={e => setUsuario(e.target.value)}>
                            {uniqueUsers.map(user => <option key={user} value={user}>{user}</option>)}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label htmlFor="acao">Ação realizada</label>
                        <select id="acao" value={acao} onChange={e => setAcao(e.target.value)}>
                            {uniqueActions.map(act => <option key={act} value={act}>{act}</option>)}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label htmlFor="modulo">Módulo</label>
                        <select id="modulo" value={modulo} onChange={e => setModulo(e.target.value)}>
                            {uniqueModules.map(mod => <option key={mod} value={mod}>{mod}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="table-wrapper">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Usuário</th>
                                <th>Módulo</th>
                                <th>Atributo Alterado</th>
                                <th>Valor Novo</th>
                                <th>Valor Antigo</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLogs.length === 0 ? (
                                <tr><td colSpan="7" style={{textAlign: 'center'}}>Nenhum log encontrado com os filtros aplicados.</td></tr>
                            ) : (
                                currentLogs.map(log => (
                                    <tr key={log.id}>
                                        <td>{log.dataHora}</td> 
                                        <td>{log.usuario}</td>
                                        <td>{log.modulo}</td>
                                        <td>{log.atributo || '-'}</td>
                                        <td>{log.valorNovo || '-'}</td>
                                        <td>{log.valorAntigo || '-'}</td>
                                        <td>
                                            <span className={`action-badge ${log.acao.toLowerCase()}`}>
                                                {log.acao}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="auditoria-footer">
                    {/* Botões de Exportação */}
                    <div className="export-buttons">
                        <button onClick={handleExportCSV} className="btn-export">
                            <i className="bi bi-filetype-csv me-2"></i> Exportar CSV
                        </button>
                        <button onClick={handleExportPDF} className="btn-export">
                            <i className="bi bi-filetype-pdf me-2"></i> Exportar PDF
                        </button>
                    </div>
                    
                    {/* Paginação */}
                    <div className="pagination-container">
                        <div className="pagination-info">
                            Mostrando {startIndex + 1} a {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} de {filteredLogs.length} registros
                        </div>
                        
                        <div className="pagination-controls">
                            <button 
                                className="pagination-btn prev" 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                title="Página anterior"
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            
                            {/* Números de página */}
                            <div className="page-numbers">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber;
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNumber = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i;
                                    } else {
                                        pageNumber = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNumber}
                                            className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                                            onClick={() => handleGoToPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button 
                                className="pagination-btn next" 
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                                title="Próxima página"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                        
                        <div className="page-size-info">
                            {ITEMS_PER_PAGE} por página
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}   