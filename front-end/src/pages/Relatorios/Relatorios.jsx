// AuditoriaLogs.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './Relatorios.css'; 
// ⚠️ Lembre-se de importar o serviço de logs
import { buscarLogsAuditoria } from '../../services/logService'; 
// Assumindo que seu serviço está em ../services/logService.js

const extractUniqueOptions = (logs, key) => ['Todos', ...new Set(logs.map(log => log[key]))];


export default function AuditoriaLogs() {
    // 1. ESTADOS PARA DADOS DINÂMICOS
    const [initialLogs, setInitialLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. ESTADOS PARA OPÇÕES DE FILTRO
    const [uniqueUsers, setUniqueUsers] = useState(['Todos']);
    const [uniqueModules, setUniqueModules] = useState(['Todos']);
    const [uniqueActions, setUniqueActions] = useState(['Todos']); // ⭐️ Mantenha 'Todos'
    const periodOptions = ['Qualquer data', 'Hoje', 'Últimos 7 dias']; 
    
    // Estados de controle do filtro
    const [periodo, setPeriodo] = useState('Qualquer data');
    const [usuario, setUsuario] = useState('Todos');
    const [acao, setAcao] = useState('Todos'); // ⭐️ Mude de 'Todas' para 'Todos'
    const [modulo, setModulo] = useState('Todos');

    // 3. PAGINAÇÃO E EXPORTAÇÃO
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pdfLibraryLoaded, setPdfLibraryLoaded] = useState(false);
    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Função para carregar bibliotecas PDF (mantida)
    useEffect(() => {
        // ⚠️ Seu código de carregamento de jspdf e autotable deve estar aqui
        // Exemplo: 
        // if (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.autoTable) {
        //     setPdfLibraryLoaded(true);
        // }
    }, []);

    // 4. FUNÇÃO PARA BUSCAR DADOS DA API
    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                // Chama o serviço que mapeia os dados
                const data = await buscarLogsAuditoria();
                setInitialLogs(data);

                // Extrai as opções de filtro dos dados
                setUniqueUsers(extractUniqueOptions(data, 'usuario'));
                setUniqueModules(extractUniqueOptions(data, 'modulo'));
                setUniqueActions(extractUniqueOptions(data, 'acao'));
                
            } catch (err) {
                // Captura a mensagem de erro lançada pelo logService em caso de 401, 404, 500
                setError("Erro ao carregar logs de auditoria. Verifique sua conexão e autenticação.");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Função auxiliar para converter data ISO (dataHoraISO) em objeto Date
    const parseDateISO = useCallback((isoString) => {
        // Usa a data ISO (ex: "2025-10-21T13:09:34") para criar o objeto Date
        return new Date(isoString);
    }, []);

    // 5. FUNÇÃO PRINCIPAL DE FILTRO (useCallback)
    const handleFilter = useCallback(() => {
        let data = [...initialLogs];
        
        // A data de hoje deve ser referenciada uma única vez
        const today = new Date(); 
        // Zera o horário para que a comparação de 'Hoje' e '7 dias' seja justa (apenas a data)
        today.setHours(0, 0, 0, 0); 

        // Filtro de Período
        if (periodo === 'Hoje') {
            data = data.filter(log => {
                // Usa a data ISO para obter o objeto Date e compara com Hoje
                const logDate = parseDateISO(log.dataHoraISO);
                logDate.setHours(0, 0, 0, 0); // Zera o horário do log para comparação
                return logDate.getTime() === today.getTime();
            });
        } else if (periodo === 'Últimos 7 dias') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7); // Data de 7 dias atrás

            data = data.filter(log => {
                const logDate = parseDateISO(log.dataHoraISO);
                // Filtra logs cuja data seja maior ou igual a 7 dias atrás
                return logDate >= sevenDaysAgo;
            });
        }

        // Outros Filtros
        if (usuario !== 'Todos') data = data.filter(log => log.usuario === usuario);
        // ⭐️ CORREÇÃO: Altere para 'Todos'
        if (acao !== 'Todos') data = data.filter(log => log.acao === acao);
        if (modulo !== 'Todos') data = data.filter(log => log.modulo === modulo);

        setFilteredLogs(data);
            setCurrentPage(1);
        }, [initialLogs, periodo, usuario, acao, modulo, parseDateISO]);

    // 6. EFEITO PARA APLICAR FILTRO QUANDO OS DADOS INICIAIS MUDAM OU FILTROS SÃO AJUSTADOS
    useEffect(() => { 
        handleFilter(); 
    }, [handleFilter]);

    // 7. FUNÇÕES DE EXPORTAÇÃO (mantidas)
    const handleExportCSV = () => {
        if (filteredLogs.length === 0) return alert("Não há dados para exportar.");
        // ... (Seu código de exportação CSV)
    };

    const handleExportPDF = () => {
        if (!pdfLibraryLoaded) return alert("A biblioteca de PDF ainda está a carregar.");
        if (filteredLogs.length === 0) return alert("Não há dados para exportar.");

        // ... (Seu código de exportação PDF usando jspdf)
    };
    
    // 8. RENDERIZAÇÃO
    if (loading) return <div className="auditoria-container"><p>Carregando logs de auditoria...</p></div>;
    if (error) return <div className="auditoria-container"><p className="error-message">{error}</p></div>;

    return (
        <div className="auditoria-container">
            <div className="auditoria-content">
                <header className="auditoria-header">
                    <h1>Auditoria & Logs</h1>
                </header>

                <div className="filters-grid">
                    {/* Select de Período */}
                    <div className="filter-item">
                        <label htmlFor="periodo">Período</label>
                        <select id="periodo" value={periodo} onChange={e => setPeriodo(e.target.value)}>
                            {periodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    {/* Select de Usuário */}
                    <div className="filter-item">
                        <label htmlFor="usuario">Usuário</label>
                        <select id="usuario" value={usuario} onChange={e => setUsuario(e.target.value)}>
                            {uniqueUsers.map(user => <option key={user} value={user}>{user}</option>)}
                        </select>
                    </div>
                    {/* Select de Ação */}
                    <div className="filter-item">
                        <label htmlFor="acao">Ação realizada</label>
                        <select id="acao" value={acao} onChange={e => setAcao(e.target.value)}>
                            {uniqueActions.map(act => <option key={act} value={act}>{act}</option>)}
                        </select>
                    </div>
                    {/* Select de Módulo */}
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
                                        {/* AQUI USA A PROPRIEDADE dataHora (já formatada) */}
                                        <td>{log.dataHora}</td> 
                                        <td>{log.usuario}</td>
                                        <td>{log.modulo}</td>
                                        <td>{log.atributo}</td>
                                        <td>{log.valorNovo}</td>
                                        <td>{log.valorAntigo}</td>
                                        <td>{log.acao}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="auditoria-footer">
                    {/* Botões de Exportação */}
                    <div className="export-buttons">
                        <button onClick={handleExportCSV} className="btn-export">Exportar CSV</button>
                        <button onClick={handleExportPDF} className="btn-export" disabled={!pdfLibraryLoaded}>Exportar PDF</button>
                    </div>
                    
                    {/* Paginação */}
                    <div className="pagination">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1}
                        >
                            &laquo; Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                            disabled={currentPage === totalPages}
                        >
                            Próxima &raquo;
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}