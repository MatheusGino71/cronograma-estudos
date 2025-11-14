'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AuthContextType, AuthState, LoginData, RegisterData, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  // Helper function to convert Firebase user to our User type
  const createUserFromFirebase = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          avatar: userData.avatar || firebaseUser.photoURL || '',
          isAdmin: userData.isAdmin || false,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date()
        };
      } else {
        // Se não encontrar documento do usuário, criar com dados básicos
        const basicUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName?.split(' ')[0] || 'Usuário',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          phone: '',
          avatar: firebaseUser.photoURL || '',
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Tentar salvar no Firestore, mas não falhar se offline
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            name: basicUser.name,
            lastName: basicUser.lastName,
            phone: basicUser.phone,
            avatar: basicUser.avatar,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (firestoreError) {
          console.warn('Firestore offline, using local data:', firestoreError);
        }
        
        return basicUser;
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Se houver erro (como offline), criar usuário básico
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName?.split(' ')[0] || 'Usuário',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        phone: '',
        avatar: firebaseUser.photoURL || '',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  };

  // Firebase Authentication - Login
  const login = async (data: LoginData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Modo de desenvolvimento - permite login com qualquer email/senha
      if (process.env.NODE_ENV === 'development') {
        // Verificar se é o admin específico
        const isAdminLogin = data.email === 'stadm@administrativo.com' && data.password === 'adm2714';
        
        const mockUser: User = {
          id: isAdminLogin ? 'admin-1' : 'dev-user-1',
          email: data.email,
          name: isAdminLogin ? 'Administrador' : 'Usuário',
          lastName: isAdminLogin ? 'Sistema' : 'Desenvolvimento',
          phone: isAdminLogin ? '(11) 99999-9999' : '',
          avatar: '',
          isAdmin: isAdminLogin || data.email === 'admin@admin.com',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setAuthState({
          user: mockUser,
          loading: false,
          error: null
        });
        return;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = await createUserFromFirebase(userCredential.user);
      
      // user agora sempre retorna um objeto válido ou null
      if (!user) {
        throw new Error('Erro ao processar dados do usuário');
      }

      setAuthState({
        user,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  };

  // Firebase Authentication - Register
  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Modo de desenvolvimento - permite registro sem Firebase
      if (process.env.NODE_ENV === 'development') {
        const mockUser: User = {
          id: 'dev-user-' + Date.now(),
          email: data.email,
          name: data.name,
          lastName: data.lastName || '',
          phone: data.phone || '',
          avatar: '',
          isAdmin: data.email === 'admin@admin.com' || data.email === 'stadm@administrativo.com',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setAuthState({
          user: mockUser,
          loading: false,
          error: null
        });
        return;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Create user document in Firestore
      const userData = {
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        avatar: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      const user: User = {
        id: userCredential.user.uid,
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        avatar: '',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setAuthState({
        user,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      }
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  };

  // Firebase Authentication - Logout
  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await signOut(auth);
      
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao fazer logout'
      }));
    }
  };

  // Firebase Authentication - Reset Password
  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      await sendPasswordResetEmail(auth, email);
      
      setAuthState(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      console.error('Reset password error:', error);
      let errorMessage = 'Erro ao enviar email de recuperação';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      }
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    // Em modo de desenvolvimento, não conecta ao Firebase
    if (process.env.NODE_ENV === 'development') {
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const user = await createUserFromFirebase(firebaseUser);
          setAuthState({
            user,
            loading: false,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setAuthState({
          user: null,
          loading: false,
          error: 'Erro ao verificar autenticação'
        });
      }
    });

    return () => unsubscribe();
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
