'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    } else if (user) {
      setShowAuthModal(false)
    }
  }, [user, loading])

  const handleToggleMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login')
  }

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    )
  }

  // Se não está autenticado, mostra modal de login/registro
  if (!user) {
    return (
      <>
        {fallback || (
          <div className="flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Bem-vindo ao MindTech
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Para acessar nossa plataforma de estudos, você precisa fazer login ou criar uma conta.
              </p>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setAuthMode('login')
                      setShowAuthModal(true)
                    }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Fazer Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register')
                      setShowAuthModal(true)
                    }}
                    className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                  >
                    Criar Conta
                  </button>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h3 className="font-semibold text-foreground mb-2">📚 Cronograma Inteligente</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize seus estudos com cronogramas personalizados baseados em seu desempenho.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h3 className="font-semibold text-foreground mb-2">📊 Simulados Adaptativos</h3>
                  <p className="text-sm text-muted-foreground">
                    Faça simulados que se adaptam ao seu nível e identifica pontos de melhoria.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h3 className="font-semibold text-foreground mb-2">🎯 Progresso Detalhado</h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe seu progresso com métricas avançadas e insights personalizados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {authMode === 'login' ? 'Faça seu login' : 'Crie sua conta'}
              </DialogTitle>
            </DialogHeader>
            {authMode === 'login' ? (
              <LoginForm 
                onToggleMode={handleToggleMode} 
                onClose={() => setShowAuthModal(false)} 
              />
            ) : (
              <RegisterForm 
                onToggleMode={handleToggleMode} 
                onClose={() => setShowAuthModal(false)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Se está autenticado, mostra o conteúdo protegido
  return <>{children}</>
}
