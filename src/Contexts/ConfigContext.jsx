// contexts/ConfigContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// API para configurações
export const configAPI = {
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
        resolve({ success: true });
      }, 300);
    });
  }
};

// Funções para aplicar configurações
export const applyTheme = (tema) => {
  const root = document.documentElement;
  
  root.classList.remove('tema-claro', 'tema-escuro', 'tema-auto');
  
  if (tema === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'tema-escuro' : 'tema-claro');
    root.classList.add('tema-auto');
  } else {
    root.classList.add(`tema-${tema}`);
  }
};

export const applyAcessibilitySettings = (acessibilidadeConfig) => {
  const root = document.documentElement;
  
  if (acessibilidadeConfig.altoContraste) {
    root.classList.add('alto-contraste');
  } else {
    root.classList.remove('alto-contraste');
  }

  root.classList.remove('fonte-pequena', 'fonte-medio', 'fonte-grande');
  root.classList.add(`fonte-${acessibilidadeConfig.tamanhoFonte}`);
};

// Criar o Context
const ConfigContext = createContext();

// Provider Component
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
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
  
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Carregar configurações ao inicializar
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const savedConfig = await configAPI.getConfig();
      setConfig(savedConfig);
      
      // Aplicar configurações
      applyTheme(savedConfig.configGerais.tema);
      applyAcessibilitySettings(savedConfig.acessibilidade);
      
      setInitialized(true);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Usar configurações padrão em caso de erro
      applyTheme('claro');
      applyAcessibilitySettings({ altoContraste: false, tamanhoFonte: 'medio' });
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar configurações
  const updateConfig = async (newConfig) => {
    try {
      setConfig(newConfig);
      
      // Aplicar configurações imediatamente
      applyTheme(newConfig.configGerais.tema);
      applyAcessibilitySettings(newConfig.acessibilidade);
      
      // Salvar na API
      await configAPI.saveConfig(newConfig);
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false, error };
    }
  };

  // Atualizar configurações específicas
  const updateNotificacoes = async (notificacoes) => {
    return await updateConfig({ ...config, notificacoes });
  };

  const updateConfigGerais = async (configGerais) => {
    return await updateConfig({ ...config, configGerais });
  };

  const updateAcessibilidade = async (acessibilidade) => {
    return await updateConfig({ ...config, acessibilidade });
  };

  // Resetar para padrão
  const resetConfig = async () => {
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
    
    const result = await updateConfig(defaultConfig);
    return result;
  };

  const value = {
    config,
    loading,
    initialized,
    updateConfig,
    updateNotificacoes,
    updateConfigGerais,
    updateAcessibilidade,
    resetConfig,
    reloadConfig: loadConfig
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

// Hook personalizado
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig deve ser usado dentro de um ConfigProvider');
  }
  return context;
};

export default ConfigContext;