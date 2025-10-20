import React, { useState, useEffect } from 'react';
import './Config.css';

// API simulada para configurações
const configAPI = {
  async getConfig() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedConfig = localStorage.getItem('app-config');
        if (savedConfig) {
          resolve(JSON.parse(savedConfig));
        } else {
          resolve({
            notificacoes: {
              novasOcorrencias: true,
              alteracaoStatus: true
            },
            configGerais: {
              idioma: 'portugues',
              tema: 'claro'
            },
            acessibilidade: {
              altoContraste: false,
              tamanhoFonte: 'medio'
            }
          });
        }
      }, 500);
    });
  },

  async saveConfig(config) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('app-config', JSON.stringify(config));
        // Aplicar tema imediatamente
        applyTheme(config.configGerais.tema);
        resolve({ success: true });
      }, 300);
    });
  }
};

// Função para aplicar o tema
const applyTheme = (tema) => {
  const root = document.documentElement;
  
  // Remover todas as classes de tema
  root.classList.remove('tema-claro', 'tema-escuro', 'tema-auto');
  
  // Aplicar tema selecionado
  if (tema === 'auto') {
    // Verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'tema-escuro' : 'tema-claro');
    root.classList.add('tema-auto');
  } else {
    root.classList.add(`tema-${tema}`);
  }
};

// Função para aplicar acessibilidade
const applyAcessibilitySettings = (acessibilidadeConfig) => {
  const root = document.documentElement;
  
  // Aplicar alto contraste
  if (acessibilidadeConfig.altoContraste) {
    root.classList.add('alto-contraste');
  } else {
    root.classList.remove('alto-contraste');
  }

  // Aplicar tamanho da fonte
  root.classList.remove('fonte-pequena', 'fonte-medio', 'fonte-grande');
  root.classList.add(`fonte-${acessibilidadeConfig.tamanhoFonte}`);
};

function Configuracoes() {
  const [notificacoes, setNotificacoes] = useState({
    novasOcorrencias: true,
    alteracaoStatus: true
  });
  
  const [configGerais, setConfigGerais] = useState({
    idioma: 'portugues',
    tema: 'claro'
  });
  
  const [acessibilidade, setAcessibilidade] = useState({
    altoContraste: false,
    tamanhoFonte: 'medio'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Carregar configurações da API
  useEffect(() => {
    loadConfig();
    
    // Listener para mudanças de tema do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (configGerais.tema === 'auto') {
        applyTheme('auto');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const config = await configAPI.getConfig();
      setNotificacoes(config.notificacoes);
      setConfigGerais(config.configGerais);
      setAcessibilidade(config.acessibilidade);
      
      // Aplicar configurações
      applyTheme(config.configGerais.tema);
      applyAcessibilitySettings(config.acessibilidade);
    } catch (error) {
      showMessage('Erro ao carregar configurações', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Salvar configurações
  const saveConfig = async () => {
    try {
      setSaving(true);
      const config = {
        notificacoes,
        configGerais,
        acessibilidade
      };
      
      await configAPI.saveConfig(config);
      showMessage('Configurações salvas com sucesso!', 'success');
    } catch (error) {
      showMessage('Erro ao salvar configurações', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  // Manipuladores de eventos
  const handleNotificacoesChange = (key, value) => {
    setNotificacoes(prev => ({ ...prev, [key]: value }));
  };

  const handleConfigGeraisChange = (key, value) => {
    const newConfig = { ...configGerais, [key]: value };
    setConfigGerais(newConfig);
    
    // Aplicar tema imediatamente se for mudança de tema
    if (key === 'tema') {
      applyTheme(value);
    }
  };

  const handleAcessibilidadeChange = (key, value) => {
    const newAcessibilidade = { ...acessibilidade, [key]: value };
    setAcessibilidade(newAcessibilidade);
    // Aplica imediatamente as mudanças de acessibilidade
    applyAcessibilitySettings(newAcessibilidade);
  };

  // Resetar configurações
  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      const defaultConfig = {
        notificacoes: {
          novasOcorrencias: true,
          alteracaoStatus: true
        },
        configGerais: {
          idioma: 'portugues',
          tema: 'claro'
        },
        acessibilidade: {
          altoContraste: false,
          tamanhoFonte: 'medio'
        }
      };
      
      setNotificacoes(defaultConfig.notificacoes);
      setConfigGerais(defaultConfig.configGerais);
      setAcessibilidade(defaultConfig.acessibilidade);
      
      // Aplicar configurações padrão
      applyTheme('claro');
      applyAcessibilitySettings(defaultConfig.acessibilidade);
      
      showMessage('Configurações restauradas para o padrão', 'success');
    }
  };

  if (loading) {
    return (
      <div className="configuracoes-wrapper" aria-live="polite">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando configurações...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="configuracoes-wrapper">
      <div className="configuracoes-content">
        <header className="config-header">
          <h1 id="config-title" className="config-title">
            <i className="bi bi-sliders" aria-hidden="true"></i>
            Configurações
          </h1>
          {message && (
            <div 
              className={`message ${message.type}`} 
              role="alert"
              aria-live="assertive"
            >
              <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}`} aria-hidden="true"></i>
              {message.text}
            </div>
          )}
        </header>

        {/* Notificações */}
        <section 
          className="config-category" 
          aria-labelledby="notificacoes-title"
        >
          <div className="category-header">
            <i className="bi bi-bell-fill icon" aria-hidden="true"></i>
            <strong id="notificacoes-title">Notificações</strong>
          </div>
          <div className="category-items" role="group" aria-labelledby="notificacoes-title">
            <div className="config-item interactive">
              <div className="config-label">
                <label htmlFor="novas-ocorrencias" className="config-text">
                  Novas ocorrências
                </label>
                <span className="config-description">Receber notificações de novas ocorrências</span>
              </div>
              <div className="config-control">
                <div className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={notificacoes.novasOcorrencias}
                    onChange={(e) => handleNotificacoesChange('novasOcorrencias', e.target.checked)}
                    className="config-checkbox"
                    id="novas-ocorrencias"
                    aria-describedby="novas-ocorrencias-desc"
                  />
                  <label htmlFor="novas-ocorrencias" className="checkbox-label">
                    <span className="checkbox-slider"></span>
                  </label>
                </div>
                <span id="novas-ocorrencias-desc" className="sr-only">
                  {notificacoes.novasOcorrencias ? 'Ativado' : 'Desativado'}
                </span>
              </div>
            </div>
            
            <div className="config-item interactive">
              <div className="config-label">
                <label htmlFor="alteracao-status" className="config-text">
                  Alteração de status
                </label>
                <span className="config-description">Notificar quando o status de uma ocorrência mudar</span>
              </div>
              <div className="config-control">
                <div className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={notificacoes.alteracaoStatus}
                    onChange={(e) => handleNotificacoesChange('alteracaoStatus', e.target.checked)}
                    className="config-checkbox"
                    id="alteracao-status"
                    aria-describedby="alteracao-status-desc"
                  />
                  <label htmlFor="alteracao-status" className="checkbox-label">
                    <span className="checkbox-slider"></span>
                  </label>
                </div>
                <span id="alteracao-status-desc" className="sr-only">
                  {notificacoes.alteracaoStatus ? 'Ativado' : 'Desativado'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Configurações Gerais */}
        <section 
          className="config-category" 
          aria-labelledby="gerais-title"
        >
          <div className="category-header">
            <i className="bi bi-gear-fill icon" aria-hidden="true"></i>
            <strong id="gerais-title">Configurações gerais</strong>
          </div>
          <div className="category-items" role="group" aria-labelledby="gerais-title">
            <div className="config-item interactive">
              <div className="config-label">
                <label htmlFor="idioma-select" className="config-text">
                  Idioma
                </label>
                <span className="config-description">Idioma da interface</span>
              </div>
              <div className="config-control">
                <select
                  id="idioma-select"
                  className="config-select"
                  value={configGerais.idioma}
                  onChange={(e) => handleConfigGeraisChange('idioma', e.target.value)}
                >
                  <option value="portugues">Português</option>
                  <option value="ingles">English</option>
                  <option value="espanhol">Español</option>
                </select>
              </div>
            </div>
            
            <div className="config-item interactive">
              <div className="config-label">
                <label htmlFor="tema-select" className="config-text">
                  Tema
                </label>
                <span className="config-description">Aparência visual da aplicação</span>
              </div>
              <div className="config-control">
                <select
                  id="tema-select"
                  className="config-select"
                  value={configGerais.tema}
                  onChange={(e) => handleConfigGeraisChange('tema', e.target.value)}
                >
                  <option value="claro">Claro</option>
                  <option value="escuro">Escuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Acessibilidade */}
        <section 
          className="config-category" 
          aria-labelledby="acessibilidade-title"
        >
          <div className="category-header">
            <i className="bi bi-universal-access icon" aria-hidden="true"></i>
            <strong id="acessibilidade-title">Acessibilidade</strong>
          </div>
          <div className="category-items" role="group" aria-labelledby="acessibilidade-title">
            <div className="config-item interactive">
              <div className="config-label">
                <label htmlFor="alto-contraste" className="config-text">
                  Alto contraste
                </label>
                <span className="config-description">Aumentar o contraste das cores</span>
              </div>
              <div className="config-control">
                <div className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={acessibilidade.altoContraste}
                    onChange={(e) => handleAcessibilidadeChange('altoContraste', e.target.checked)}
                    className="config-checkbox"
                    id="alto-contraste"
                    aria-describedby="alto-contraste-desc"
                  />
                  <label htmlFor="alto-contraste" className="checkbox-label">
                    <span className="checkbox-slider"></span>
                  </label>
                </div>
                <span id="alto-contraste-desc" className="sr-only">
                  {acessibilidade.altoContraste ? 'Ativado' : 'Desativado'}
                </span>
              </div>
            </div>

            <div className="config-item interactive">
              <div className="config-label">
                <label htmlFor="tamanho-fonte" className="config-text">
                  Tamanho da fonte
                </label>
                <span className="config-description">Ajustar o tamanho do texto</span>
              </div>
              <div className="config-control">
                <select
                  id="tamanho-fonte"
                  className="config-select"
                  value={acessibilidade.tamanhoFonte}
                  onChange={(e) => handleAcessibilidadeChange('tamanhoFonte', e.target.value)}
                >
                  <option value="pequena">Pequena</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Botões de ação */}
        <div className="config-actions">
          <button 
            onClick={handleReset}
            className="btn btn-secondary"
            type="button"
          >
            <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
            Restaurar Padrão
          </button>
          
          <button 
            onClick={saveConfig}
            disabled={saving}
            className="btn btn-primary"
            type="button"
            aria-busy={saving}
          >
            {saving ? (
              <>
                <div className="btn-spinner" aria-hidden="true"></div>
                Salvando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg" aria-hidden="true"></i>
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;