import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ocorrencias.css';
import { fetchOcorrencias } from '../../services/ocorrenciaService'; 

const Ocorrencias = () => {
    // 🔴 HOOK PARA NAVEGAÇÃO
    const navigate = useNavigate();
    
    // 1. Estados para dados e controle
    const [ocorrencias, setOcorrencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [counts, setCounts] = useState({ Alta: 0, Média: 0, Baixa: 0, Crítica: 0 }); 

    // 🔴 ESTADOS PARA PAGINAÇÃO
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 🔴 ESTADO: Armazena os valores dos filtros
    const [filters, setFilters] = useState({
        prioridade: '',
        tipo: '',
        status: '',
        periodo: '',
        regiao: '',
        search: ''
    });

    // 🔴 FUNÇÃO: Navegar para a página de nova ocorrência
    const handleRegistrarClick = () => {
        navigate('/nova-ocorrencia');
    };

    // 2. Função para buscar os dados
    const loadOcorrencias = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchOcorrencias();
            setOcorrencias(data);

            // Lógica para calcular as contagens dos cards
            const newCounts = { Alta: 0, Média: 0, Baixa: 0, Crítica: 0 };
            data.forEach(ocorrencia => {
                const prioridade = ocorrencia.prioridade; 
                if (newCounts.hasOwnProperty(prioridade)) {
                    newCounts[prioridade] += 1;
                }
            });
            setCounts(newCounts);

        } catch (err) {
            console.error("Erro ao carregar ocorrências:", err.response?.data || err);
            setError("Não foi possível carregar as ocorrências. Verifique a conexão com o servidor ou o status da autenticação.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Efeito para carregar os dados na montagem
    useEffect(() => {
        loadOcorrencias();
    }, [loadOcorrencias]);

    // 4. Função auxiliar para formatar os dados da tabela
    const formatOcorrenciaRow = (item) => {
        const regiao = item.localizacao || 'N/A'; 
        const dataObjeto = new Date(item.data);
        const dataFormatada = isNaN(dataObjeto.getTime()) ? 'N/A' : dataObjeto.toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        return {
            id: item.id,
            prioridade: item.prioridade,
            tipo: item.natureza || 'N/A', 
            periodo: dataFormatada,
            regiao: regiao.split(',')[0] || regiao, 
            status: item.status
        };
    };

    // 🔴 FUNÇÃO: Para lidar com a mudança nos filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // 🔴 Resetar para a primeira página ao filtrar
    };

    // 🔴 LÓGICA: Filtragem Local usando useMemo para performance
    const filteredOcorrencias = useMemo(() => {
        if (ocorrencias.length === 0) return [];

        return ocorrencias.filter(ocorrencia => {
            const rowData = formatOcorrenciaRow(ocorrencia);
            
            // 1. Filtragem por Selects (Prioridade, Tipo, Status)
            const prioridadeMatch = !filters.prioridade || rowData.prioridade === filters.prioridade;
            const tipoMatch = !filters.tipo || rowData.tipo === filters.tipo;
            const statusMatch = !filters.status || rowData.status === filters.status;
            
            // 2. Filtragem por Pesquisa (Search - Titulo, Descricao, Localizacao ou ID)
            const searchTerm = filters.search.toLowerCase();
            const searchMatch = !searchTerm || 
                                rowData.prioridade.toLowerCase().includes(searchTerm) ||
                                rowData.tipo.toLowerCase().includes(searchTerm) ||
                                rowData.regiao.toLowerCase().includes(searchTerm) ||
                                (ocorrencia.descricao && ocorrencia.descricao.toLowerCase().includes(searchTerm)) ||
                                (ocorrencia.id && ocorrencia.id.toString().includes(searchTerm));

            // A ocorrência só é exibida se TODOS os filtros baterem
            return prioridadeMatch && tipoMatch && statusMatch && searchMatch;
        });
    }, [ocorrencias, filters]);

    // 🔴 PAGINAÇÃO: Calcular itens para a página atual
    const totalPages = Math.ceil(filteredOcorrencias.length / itemsPerPage);
    
    // 🔴 Calcular índice de início e fim
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOcorrencias.slice(indexOfFirstItem, indexOfLastItem);

    // 🔴 FUNÇÕES: Navegação entre páginas
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // 🔴 FUNÇÃO: Para obter as opções únicas para os Selects
    const getUniqueOptions = (field) => {
        const uniqueValues = new Set(ocorrencias.map(o => o[field]).filter(Boolean));
        return Array.from(uniqueValues).sort();
    };

    const uniquePrioridades = getUniqueOptions('prioridade');
    const uniqueNaturezas = getUniqueOptions('natureza');
    const uniqueStatus = getUniqueOptions('status');

    return (
        <div className="ocorrencias-container">
            <div className="page-header">
                <h2>Ocorrências</h2>
                <button className="btn-registrar" onClick={handleRegistrarClick}>
                    Registrar nova ocorrência
                </button>
            </div>

            {/* Cards de Prioridade */}
            <div className="prioridade-cards">
                <div className="card-prioridade critica"><span>{counts.Crítica}</span><p>Crítica</p></div>
                <div className="card-prioridade alta"><span>{counts.Alta}</span><p>Alta</p></div>
                <div className="card-prioridade media"><span>{counts.Média}</span><p>Média</p></div>
                <div className="card-prioridade baixa"><span>{counts.Baixa}</span><p>Baixa</p></div>
            </div>

            {/* FILTROS INTEGRADOS */}
            <div className="filtros-container">
                <div className="filtros-header">
                    <i className="fa-solid fa-filter"></i>
                    <span>Filtrar por:</span>
                </div>
                <div className="filtros-inputs">
                    <select name="prioridade" value={filters.prioridade} onChange={handleFilterChange}>
                        <option value="">Prioridade</option>
                        {uniquePrioridades.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    
                    <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                        <option value="">Tipo</option>
                        {uniqueNaturezas.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    
                    <select name="periodo" value={filters.periodo} onChange={handleFilterChange} disabled>
                        <option value="">Período</option>
                    </select>
                    
                    <select name="regiao" value={filters.regiao} onChange={handleFilterChange} disabled>
                        <option value="">Região</option>
                    </select>

                    <select name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="">Status</option>
                        {uniqueStatus.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    
                    <div className="search-wrapper">
                        <i className="fa-solid fa-search"></i>
                        <input 
                            type="text" 
                            name="search"
                            placeholder="Pesquisar ocorrência"
                            value={filters.search}
                            onChange={handleFilterChange} 
                        />
                    </div>
                    <button className="btn-aplicar" onClick={() => loadOcorrencias()}>Atualizar Dados</button>
                </div>
            </div>

            <div className="tabela-wrapper">
                <div className="tabela-header">
                    <h3>Ocorrências ({filteredOcorrencias.length})</h3>
                    <div className="pagination-info">
                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOcorrencias.length)} de {filteredOcorrencias.length}
                    </div>
                </div>
                <div className="tabela-container">
                    
                    {loading && <p className="tabela-carregando">Carregando ocorrências...</p>}
                    {error && <p className="error-message">Erro: {error}</p>}
                    
                    {!loading && !error && filteredOcorrencias.length === 0 && (
                        <p className="tabela-vazia">Nenhuma ocorrência encontrada com os filtros atuais.</p>
                    )}

                    {!loading && currentItems.length > 0 && (
                        <>
                            <table className="tabela-mobile">
                                <thead>
                                    <tr>
                                        <th>Prioridade</th>
                                        <th>Tipo</th>
                                        <th>Período</th>
                                        <th>Localização</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => {
                                        const rowData = formatOcorrenciaRow(item);
                                        return (
                                            <tr key={rowData.id}>
                                                <td>
                                                    <span className={`badge-prioridade ${rowData.prioridade.toLowerCase()}`}>
                                                        {rowData.prioridade}
                                                    </span>
                                                </td>
                                                <td className="tipo-cell">{rowData.tipo}</td>
                                                <td className="data-cell">{rowData.periodo}</td>
                                                <td className="localizacao-cell">{rowData.regiao}</td>
                                                <td>
                                                    <span className={`badge-status ${rowData.status.toLowerCase().replace('_', '')}`}>
                                                        {rowData.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* 🔴 PAGINAÇÃO */}
                            <div className="pagination-controls">
                                <button 
                                    className="pagination-btn prev" 
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fa-solid fa-chevron-left"></i> Anterior
                                </button>
                                
                                <div className="pagination-numbers">
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
                                                className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                                                onClick={() => goToPage(pageNumber)}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <button 
                                    className="pagination-btn next" 
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    Próximo <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ocorrencias;