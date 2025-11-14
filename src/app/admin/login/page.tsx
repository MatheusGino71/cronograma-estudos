'use client'

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Shield } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { LoginData } from "@/types/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email) {
      errors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido'
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await login(formData)
      // Aguardar um pouco para garantir que o estado foi atualizado
      setTimeout(() => {
        router.push('/admin')
      }, 100)
    } catch (error) {
      console.error('Admin login error:', error)
    }
  }

  const handleInputChange = (field: keyof LoginData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full border-purple-200 dark:border-purple-800">
          <CardHeader className="space-y-1 bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-12 w-12 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-purple-900 dark:text-purple-100">
              Área Administrativa
            </CardTitle>
            <CardDescription className="text-center text-purple-600 dark:text-purple-300">
              Acesso exclusivo para administradores
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-purple-900 dark:text-purple-100">
                  Email Administrativo
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={validationErrors.email ? 'border-red-500' : 'border-purple-300 focus:border-purple-500'}
                  disabled={loading}
                  autoComplete="username"
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-purple-900 dark:text-purple-100">
                  Senha Administrativa
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={validationErrors.password ? 'border-red-500 pr-10' : 'border-purple-300 focus:border-purple-500 pr-10'}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-purple-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-500">{validationErrors.password}</p>
                )}
              </div>

              <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
                <Shield className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-sm text-purple-700 dark:text-purple-300">
                  Esta área é restrita a administradores autorizados. Use suas credenciais administrativas para acessar.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Acessar Painel Administrativo
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-4 text-center text-sm text-purple-600 dark:text-purple-400">
          <p>Acesso restrito • Ações são monitoradas</p>
        </div>
      </div>
    </div>
  )
}
