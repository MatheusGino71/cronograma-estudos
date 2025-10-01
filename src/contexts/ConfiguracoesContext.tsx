'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ConfiguracoesUsuario {
  // Perfil
  nome: string;
  email: string;
  timezone: string;
  idioma: string;
  
  // Estudo
  metaDiaria: number;
  intervaloSessoes: number;
  
  // Notificações
  notificacoes: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    studyReminders: boolean;
    weeklyProgress: boolean;
    soundEffects: boolean;
  };
  
  // Aparência
  aparencia: {
    fontSize: 'small' | 'medium' | 'large';
    language: string;
  };
  
  // Privacidade
  privacidade: {
    profileVisibility: 'public' | 'friends' | 'private';
    shareProgress: boolean;
    analyticsData: boolean;
  };
}

const configuracoesDefault: ConfiguracoesUsuario = {
  nome: '',
  email: '',
  timezone: 'america/sao_paulo',
  idioma: 'pt-BR',
  metaDiaria: 4,
  intervaloSessoes: 15,
  notificacoes: {
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    weeklyProgress: false,
    soundEffects: true
  },
  aparencia: {
    fontSize: 'medium',
    language: 'pt-BR'
  },
  privacidade: {
    profileVisibility: 'private',
    shareProgress: false,
    analyticsData: true
  }
};

interface ConfiguracoesContextType {
  configuracoes: ConfiguracoesUsuario;
  updateConfiguracoes: (novasConfiguracoes: Partial<ConfiguracoesUsuario>) => void;
  resetConfiguracoes: () => void;
  exportarDados: () => void;
  limparHistorico: () => void;
  excluirConta: () => void;
}

const ConfiguracoesContext = createContext<ConfiguracoesContextType | undefined>(undefined);

export function ConfiguracoesProvider({ children }: { children: React.ReactNode }) {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesUsuario>(configuracoesDefault);

  // Carregar configurações do localStorage
  useEffect(() => {
    const configSalvas = localStorage.getItem('mindtech-configuracoes');
    if (configSalvas) {
      try {
        const parsed = JSON.parse(configSalvas);
        setConfiguracoes({ ...configuracoesDefault, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('mindtech-configuracoes', JSON.stringify(configuracoes));
  }, [configuracoes]);

  const updateConfiguracoes = (novasConfiguracoes: Partial<ConfiguracoesUsuario>) => {
    setConfiguracoes(prev => ({ ...prev, ...novasConfiguracoes }));
  };

  const resetConfiguracoes = () => {
    setConfiguracoes(configuracoesDefault);
    localStorage.removeItem('mindtech-configuracoes');
  };

  const exportarDados = () => {
    // Coleta todos os dados do usuário
    const dadosExportacao = {
      configuracoes,
      dataExportacao: new Date().toISOString(),
      versao: '1.0',
      // Adicionar outros dados como progresso, cronogramas, etc.
      progresso: JSON.parse(localStorage.getItem('mindtech-progresso') || '{}'),
      cronogramas: JSON.parse(localStorage.getItem('mindtech-cronogramas') || '[]'),
      simulados: JSON.parse(localStorage.getItem('mindtech-simulados') || '[]')
    };

    // Criar arquivo para download
    const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindtech-dados-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const limparHistorico = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico de estudos? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('mindtech-progresso');
      localStorage.removeItem('mindtech-cronogramas');
      localStorage.removeItem('mindtech-simulados');
      alert('Histórico de estudos limpo com sucesso!');
    }
  };

  const excluirConta = () => {
    if (confirm('ATENÇÃO: Isso excluirá permanentemente sua conta e todos os dados. Esta ação não pode ser desfeita. Tem certeza?')) {
      if (confirm('Esta é sua última chance! Realmente deseja excluir sua conta permanentemente?')) {
        // Limpar todos os dados
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect para página inicial ou logout
        alert('Conta excluída com sucesso!');
        window.location.href = '/';
      }
    }
  };

  return (
    <ConfiguracoesContext.Provider value={{
      configuracoes,
      updateConfiguracoes,
      resetConfiguracoes,
      exportarDados,
      limparHistorico,
      excluirConta
    }}>
      {children}
    </ConfiguracoesContext.Provider>
  );
}

export function useConfiguracoes() {
  const context = useContext(ConfiguracoesContext);
  if (context === undefined) {
    throw new Error('useConfiguracoes deve ser usado dentro de ConfiguracoesProvider');
  }
  return context;
}
