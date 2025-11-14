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
      // Verificar se é o email do admin
      const isAdminEmail = firebaseUser.email === 'adm@administrador.com.br' || firebaseUser.email === 'admin@admin.com';
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Se é email de admin mas o documento não tem isAdmin, atualizar
        if (isAdminEmail && !userData.isAdmin) {
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...userData,
              isAdmin: true,
              updatedAt: serverTimestamp()
            }, { merge: true });
          } catch (error) {
            console.error('Erro ao atualizar isAdmin:', error);
          }
        }
        
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          avatar: userData.avatar || firebaseUser.photoURL || '',
          isAdmin: userData.isAdmin || isAdminEmail,
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
          isAdmin: isAdminEmail,
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
        isAdmin: isAdminEmail,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  };

  // Firebase Authentication - Login
  const login = async (data: LoginData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Verificar se é o admin com credenciais hardcoded (SEMPRE PRIMEIRO)
      if (data.email === 'adm@administrador.com.br' && data.password === 'adm1001') {
        const adminUser: User = {
          id: 'admin-master',
          email: 'adm@administrador.com.br',
          name: 'Administrador',
          lastName: 'Sistema',
          phone: '(11) 99999-9999',
          avatar: '',
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Salvar no localStorage para persistir
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        
        setAuthState({
          user: adminUser,
          loading: false,
          error: null
        });
        return;
      }
      
      // Tentar login no Firebase apenas se não for admin
      try {
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
      } catch (firebaseError: any) {
        console.error('Firebase login error:', firebaseError);
        let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
        
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = 'Usuário não encontrado.';
        } else if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = 'Senha incorreta.';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Email inválido.';
        } else if (firebaseError.code === 'auth/invalid-credential') {
          errorMessage = 'Credenciais inválidas.';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
        } else if (firebaseError.code === 'auth/network-request-failed') {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        }
        
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao fazer login. Tente novamente.'
      }));
    }
  };

  // Firebase Authentication - Register
  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
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
      
      // Limpar admin do localStorage
      localStorage.removeItem('adminUser');
      
      // Tentar fazer logout do Firebase (pode falhar se for admin local)
      try {
        await signOut(auth);
      } catch (error) {
        // Ignorar erro de logout se for admin local
      }
      
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
    // Verificar se tem admin no localStorage
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        const adminUser = JSON.parse(storedAdmin);
        setAuthState({
          user: adminUser,
          loading: false,
          error: null
        });
        return;
      } catch (error) {
        localStorage.removeItem('adminUser');
      }
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
