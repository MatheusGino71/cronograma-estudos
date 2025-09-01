'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthState, LoginData, RegisterData, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  // Simulação temporária - será substituída pela integração Firebase
  const login = async (data: LoginData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Aqui será a integração com Firebase Auth
      // Por enquanto, simulação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: data.email,
        name: 'Usuário',
        lastName: 'Teste',
        phone: '(11) 99999-9999',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setAuthState({
        user: mockUser,
        loading: false,
        error: null
      });

      // Salvar no localStorage temporariamente
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao fazer login. Verifique suas credenciais.'
      }));
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Aqui será a integração com Firebase Auth
      // Por enquanto, simulação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setAuthState({
        user: mockUser,
        loading: false,
        error: null
      });

      // Salvar no localStorage temporariamente
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao criar conta. Tente novamente.'
      }));
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // Aqui será a integração com Firebase Auth signOut
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAuthState({
        user: null,
        loading: false,
        error: null
      });

      localStorage.removeItem('auth_user');
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao fazer logout'
      }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Aqui será a integração com Firebase Auth sendPasswordResetEmail
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao enviar email de recuperação'
      }));
    }
  };

  // Verificar se há usuário salvo no localStorage ao inicializar
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          loading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    }
  }, []);

  const value: AuthContextType = {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
