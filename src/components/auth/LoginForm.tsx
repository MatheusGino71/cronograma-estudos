'use client'

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { LoginData } from "@/types/auth"

interface LoginFormProps {
  onToggleMode: () => void;
  onClose: () => void;
}

export function LoginForm({ onToggleMode, onClose }: LoginFormProps) {
  const { login, resetPassword, loading, error } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };



  const handleForgotPassword = async () => {
    if (!formData.email) {
      setValidationErrors({ email: 'Digite seu email para recuperar a senha' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setValidationErrors({ email: 'Email inválido' });
      return;
    }

    setIsResettingPassword(true);
    setResetMessage('');
    
    try {
      await resetPassword(formData.email);
      setResetMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData);
      onClose();
    } catch (error) {
      // Error handling is done in the context
      console.error('Login error:', error);
    }
  };

  const handleInputChange = (field: keyof LoginData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
        <CardDescription className="text-center">
          Entre com sua conta para continuar
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resetMessage && (
            <Alert>
              <AlertDescription className="text-green-600">{resetMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              className={validationErrors.email ? 'border-red-500' : ''}
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange('password')}
                className={validationErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm"
              onClick={handleForgotPassword}
              disabled={loading || isResettingPassword}
            >
              {isResettingPassword ? 'Enviando...' : 'Esqueceu a senha?'}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
          
          <div className="text-sm text-center text-muted-foreground">
            Não tem uma conta?{' '}
            <Button
              type="button"
              variant="link"
              className="px-0 text-red-600 hover:text-red-700"
              onClick={onToggleMode}
              disabled={loading}
            >
              Criar conta
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
