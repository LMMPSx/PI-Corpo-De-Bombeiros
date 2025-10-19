import React, { useState, useEffect } from 'react';
import './auditoria.css'; // Importando o CSS separado

// --- Dados simulados para a tabela de logs ---
const initialLogData = [
  { id: 1, dataHora: '19/10/2025 14:32', usuario: 'Victor Melo', modulo: 'Usuários', atributo: 'perfil', valorNovo: 'Admin', valorAntigo: 'Gerente', acao: 'Alteração' },
  { id: 2, dataHora: '19/10/2025 11:15', usuario: 'Maria Silva', modulo: 'Ocorrências', atributo: 'status', valorNovo: 'Fechada', valorAntigo: 'Em Andamento', acao: 'Alteração' },
  { id: 3, dataHora: '18/10/2025 20:05', usuario: 'João Santos', modulo: 'Login', atributo: 'N/A', valorNovo: 'N/A', valorAntigo: 'N/A', acao: 'Acesso ao Sistema' },
  { id: 4, dataHora: '18/10/2025 16:40', usuario: 'Ana Costa', modulo: 'Relatórios', atributo: 'N/A', valorNovo: 'N/A', valorAntigo: 'N/A', acao: 'Exportação' },
  { id: 5, dataHora: '17/10/2025 09:01', usuario: 'Pedro Lima', modulo: 'Usuários', atributo: 'email', valorNovo: 'pedro.lima@email.com', valorAntigo: 'pedro@email.com', acao: 'Alteração' },
  { id: 6, dataHora: '16/10/2025 08:59', usuario: 'Admin', modulo: 'Usuários', atributo: 'N/A', valorNovo: 'Luana Viana', valorAntigo: 'N/A', acao: 'Criação' },
  { id: 7, dataHora: '15/10/2025 18:20', usuario: 'Maria Silva', modulo: 'Login', atributo: 'N/A', valorNovo: 'N/A', valorAntigo: 'N/A', acao: 'Logout' },
  { id: 8, dataHora: '14/10/2025 12:00', usuario: 'Victor Melo', modulo: 'Painel', atributo: 'N/A', valorNovo: 'N/A', valorAntigo: 'N/A', acao: 'Visualização' },
  { id: 9, dataHora: '13/10/2025 10:10', usuario: 'Ana Costa', modulo: 'Ocorrências', atributo: 'prioridade', valorNovo: 'Alta', valorAntigo: 'Média', acao: 'Alteração' },
  { id: 10, dataHora: '12/10/2025 22:30', usuario: 'João Santos', modulo: 'Usuários', atributo: 'N/A', valorNovo: 'N/A', valorAntigo: 'N/A', acao: 'Exclusão' },
];

// --- Opções para os filtros ---
const uniqueUsers = ['Todos', ...new Set(initialLogData.map(log => log.usuario))];
const uniqueModules = ['Todos', ...new Set(initialLogData.map(log => log.modulo))];
const uniqueActions = ['Todas', ...new Set(initialLogData.map(log => log.acao))];
const periodOptions = ['Qualquer data', 'Hoje', 'Últimos 7 dias'];

export default function AuditoriaLogs() {
  const [logs] = useState(initialLogData);
  const [filteredLogs, setFilteredLogs] = useState(initialLogData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfLibraryLoaded, setPdfLibraryLoaded] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const [periodo, setPeriodo] = useState('Qualquer data');
  const [usuario, setUsuario] = useState('Todos');
  const [acao, setAcao] = useState('Todas');
  const [modulo, setModulo] = useState('Todos');

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  useEffect(() => {
    const loadScript = (src, onLoad) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = onLoad;
      document.body.appendChild(script);
    };
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", () => {
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js", () => {
        setPdfLibraryLoaded(true);
      });
    });
  }, []);

  const parseDate = (str) => {
    const [date, time] = str.split(' ');
    const [day, month, year] = date.split('/');
    const [hour, minute] = time.split(':');
    return new Date(year, month - 1, day, hour, minute);
  };

  const handleFilter = () => {
    let data = [...initialLogData];
    const today = new Date('2025-10-19T15:17:00-03:00');

    if (periodo === 'Hoje') {
      data = data.filter(log => parseDate(log.dataHora).toDateString() === today.toDateString());
    } else if (periodo === 'Últimos 7 dias') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      data = data.filter(log => parseDate(log.dataHora) >= sevenDaysAgo);
    }

    if (usuario !== 'Todos') data = data.filter(log => log.usuario === usuario);
    if (acao !== 'Todas') data = data.filter(log => log.acao === acao);
    if (modulo !== 'Todos') data = data.filter(log => log.modulo === modulo);

    setFilteredLogs(data);
    setCurrentPage(1);
  };

  useEffect(() => { handleFilter(); }, [periodo, usuario, acao, modulo]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return alert("Não há dados para exportar.");
    const headers = Object.keys(filteredLogs[0]).join(',');
    const rows = filteredLogs.map(log => Object.values(log).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'auditoria_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!pdfLibraryLoaded) return alert("A biblioteca de PDF ainda está a carregar.");
    if (filteredLogs.length === 0) return alert("Não há dados para exportar.");

    const doc = new window.jspdf.jsPDF();
    const tableColumn = ["Data/Hora", "Usuário", "Módulo", "Atributo", "Valor Novo", "Valor Antigo", "Ação"];
    const tableRows = filteredLogs.map(log => [
      log.dataHora, log.usuario, log.modulo, log.atributo, log.valorNovo, log.valorAntigo, log.acao
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.text("Relatório de Auditoria & Logs", 14, 15);
    doc.save('auditoria_logs.pdf');
  };

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
                <th>Atributo alterado</th>
                <th>Valor novo</th>
                <th>Valor antigo</th>
                <th>Ação realizada</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.dataHora}</td>
                  <td>{log.usuario}</td>
                  <td>{log.modulo}</td>
                  <td>{log.atributo}</td>
                  <td>{log.valorNovo}</td>
                  <td>{log.valorAntigo}</td>
                  <td>{log.acao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="auditoria-footer">
          <div className="export-buttons">
            <button className="btn-export" onClick={handleExportCSV}>Exportar CSV</button>
            <button className="btn-export" onClick={handleExportPDF}>Exportar PDF</button>
          </div>
          <div className="pagination">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>&lt;</button>
            <span>Página {currentPage} de {totalPages || 1}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0}>&gt;</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
