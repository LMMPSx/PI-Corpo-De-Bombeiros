import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Ocorrencias.css';
import { fetchOcorrencias } from '../../services/ocorrenciaService'; 

const Ocorrencias = () => {
    // 1. Estados para dados e controle
    const [ocorrencias, setOcorrencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [counts, setCounts] = useState({ Alta: 0, Média: 0, Baixa: 0, Crítica: 0 }); 

    // 🔴 NOVO ESTADO: Armazena os valores dos filtros
    const [filters, setFilters] = useState({
        prioridade: '',
        tipo: '',
        status: '',
        periodo: '', // Não implementaremos a lógica de data complexa, mas manteremos o estado
        regiao: '',
        search: ''
    });

    // 2. Função para buscar os dados (Inalterada)
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

    // 3. Efeito para carregar os dados na montagem (Inalterada)
    useEffect(() => {
        loadOcorrencias();
    }, [loadOcorrencias]);

    // 4. Função auxiliar para formatar os dados da tabela (Inalterada)
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

    // 🔴 NOVO: Função para lidar com a mudança nos filtros (Selects e Input de Pesquisa)
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // 🔴 NOVO: Lógica de Filtragem Local usando useMemo para performance
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
    }, [ocorrencias, filters]); // Recalcula sempre que ocorrencias ou filters mudarem

    // 5. Função para navegar para a página de registro (Inalterada)
    const handleRegistrarClick = () => {
        alert("Navegar para a página de registro de nova ocorrência...");
    };
    
    // 🔴 NOVO: Funções para obter as opções únicas para os Selects
    const getUniqueOptions = (field) => {
        // Usa Set para garantir valores únicos
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

            {/* Cards de Prioridade (Inalterado) */}
            <div className="prioridade-cards">
                <div className="card-prioridade critica"><span>{counts.Crítica}</span><p>Crítica</p></div>
                <div className="card-prioridade alta"><span>{counts.Alta}</span><p>Alta</p></div>
                <div className="card-prioridade media"><span>{counts.Média}</span><p>Média</p></div>
                <div className="card-prioridade baixa"><span>{counts.Baixa}</span><p>Baixa</p></div>
            </div>

            {/* 🔴 FILTROS INTEGRADOS */}
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
                    {/* Botão Aplicar desnecessário, pois o filtro é reativo */}
                    <button className="btn-aplicar" onClick={() => loadOcorrencias()}>Atualizar Dados</button>
                </div>
            </div>


            <div className="tabela-wrapper">
                <div className="tabela-header">
                    <h3>Ocorrências ({filteredOcorrencias.length})</h3>
                </div>
                <div className="tabela-container">
                    
                    {loading && <p className="status-message">Carregando ocorrências...</p>}
                    {error && <p className="error-message">Erro: {error}</p>}
                    
                    {!loading && !error && filteredOcorrencias.length === 0 && (
                         <p className="status-message">Nenhuma ocorrência encontrada com os filtros atuais.</p>
                    )}

                    {!loading && filteredOcorrencias.length > 0 && (
                        <table>
                            <thead>
                                {/* 🔴 CORREÇÃO DE HIDRATAÇÃO */}
                                <tr><th>Prioridade</th><th>Tipo</th><th>Período</th><th>Localização</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {filteredOcorrencias.map((item) => {
                                    const rowData = formatOcorrenciaRow(item);
                                    return (
                                        //  CORREÇÃO DE HIDRATAÇÃO
                                        <tr key={rowData.id}>
                                            <td>{rowData.prioridade}</td><td>{rowData.tipo}</td><td>{rowData.periodo}</td><td>{rowData.regiao}</td><td>{rowData.status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ocorrencias;