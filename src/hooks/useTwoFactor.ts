'use client';

import { useState } from 'react';

export interface TwoFactorConfig {
  enabled: boolean;
  method: 'sms' | 'email' | 'app' | null;
  backupCodes: string[];
}

export function useTwoFactor() {
  const [twoFactor, setTwoFactor] = useState<TwoFactorConfig>({
    enabled: false,
    method: null,
    backupCodes: []
  });

  const [isConfiguring, setIsConfiguring] = useState(false);

  const generateBackupCodes = (): string[] => {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const enableTwoFactor = async (method: 'sms' | 'email' | 'app') => {
    setIsConfiguring(true);
    try {
      // Simular configuração
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const backupCodes = generateBackupCodes();
      
      setTwoFactor({
        enabled: true,
        method,
        backupCodes
      });

      // Salvar no localStorage
      localStorage.setItem('mindtech-2fa', JSON.stringify({
        enabled: true,
        method,
        backupCodes
      }));

      return { success: true, backupCodes };
    } catch (error) {
      return { success: false, error: 'Erro ao configurar autenticação de dois fatores' };
    } finally {
      setIsConfiguring(false);
    }
  };

  const disableTwoFactor = () => {
    setTwoFactor({
      enabled: false,
      method: null,
      backupCodes: []
    });

    localStorage.removeItem('mindtech-2fa');
  };

  const regenerateBackupCodes = () => {
    const newCodes = generateBackupCodes();
    const updatedConfig = {
      ...twoFactor,
      backupCodes: newCodes
    };
    
    setTwoFactor(updatedConfig);
    localStorage.setItem('mindtech-2fa', JSON.stringify(updatedConfig));
    
    return newCodes;
  };

  return {
    twoFactor,
    isConfiguring,
    enableTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes
  };
}
