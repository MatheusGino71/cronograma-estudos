'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Mail, Scan, Shield, Copy, CheckCircle } from 'lucide-react';
import { useTwoFactor } from '@/hooks/useTwoFactor';

interface TwoFactorModalProps {
  children: React.ReactNode;
}

export function TwoFactorModal({ children }: TwoFactorModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'setup' | 'backup' | 'complete'>('select');
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | 'app' | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const { twoFactor, isConfiguring, enableTwoFactor, disableTwoFactor } = useTwoFactor();

  const handleMethodSelect = (method: 'sms' | 'email' | 'app') => {
    setSelectedMethod(method);
    setStep('setup');
  };

  const handleSetupComplete = async () => {
    if (!selectedMethod) return;

    const result = await enableTwoFactor(selectedMethod);
    
    if (result.success && result.backupCodes) {
      setBackupCodes(result.backupCodes);
      setStep('backup');
    } else {
      alert('Erro ao configurar autenticação de dois fatores');
    }
  };

  const handleBackupCodesSaved = () => {
    setStep('complete');
    setTimeout(() => {
      setOpen(false);
      resetModal();
    }, 2000);
  };

  const resetModal = () => {
    setStep('select');
    setSelectedMethod(null);
    setBackupCodes([]);
    setCopiedCodes(false);
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText).then(() => {
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    });
  };

  const handleDisable = () => {
    if (confirm('Tem certeza que deseja desabilitar a autenticação de dois fatores? Isso tornará sua conta menos segura.')) {
      disableTwoFactor();
      setOpen(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-4">
            <div className="grid gap-4">
              <Card 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleMethodSelect('app')}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Scan className="h-5 w-5 text-green-600" />
                  <div className="ml-3">
                    <CardTitle className="text-sm">App Autenticador</CardTitle>
                    <CardDescription className="text-xs">
                      Use Google Authenticator ou similar
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-auto">Recomendado</Badge>
                </CardHeader>
              </Card>

              <Card 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleMethodSelect('email')}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div className="ml-3">
                    <CardTitle className="text-sm">E-mail</CardTitle>
                    <CardDescription className="text-xs">
                      Receba códigos por e-mail
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleMethodSelect('sms')}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  <div className="ml-3">
                    <CardTitle className="text-sm">SMS</CardTitle>
                    <CardDescription className="text-xs">
                      Receba códigos por mensagem de texto
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        );

      case 'setup':
        return (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                {selectedMethod === 'app' && 'Escaneie o QR code com seu app autenticador'}
                {selectedMethod === 'email' && 'Verificaremos sua identidade enviando um código para seu e-mail'}
                {selectedMethod === 'sms' && 'Verificaremos sua identidade enviando um código SMS'}
              </AlertDescription>
            </Alert>

            {selectedMethod === 'app' && (
              <div className="flex justify-center p-8">
                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Scan className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">QR Code aqui</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleSetupComplete}
                disabled={isConfiguring}
                className="flex-1"
              >
                {isConfiguring ? 'Configurando...' : 'Continuar'}
              </Button>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Guarde estes códigos de backup em local seguro. Eles podem ser usados se você perder acesso ao seu método principal.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="p-2 bg-white rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={copyBackupCodes}
              variant="outline"
              className="w-full"
            >
              {copiedCodes ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Códigos Copiados!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Códigos
                </>
              )}
            </Button>

            <Button
              onClick={handleBackupCodesSaved}
              className="w-full"
            >
              Já Salvei os Códigos
            </Button>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Configuração Concluída!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Autenticação de dois fatores ativada com sucesso
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>
              {twoFactor.enabled ? 'Gerenciar' : 'Configurar'} Autenticação de Dois Fatores
            </span>
          </DialogTitle>
          <DialogDescription>
            {twoFactor.enabled 
              ? 'Sua conta está protegida com autenticação de dois fatores'
              : 'Adicione uma camada extra de segurança à sua conta'
            }
          </DialogDescription>
        </DialogHeader>

        {twoFactor.enabled ? (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Autenticação de dois fatores está ativa via {twoFactor.method?.toUpperCase()}
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={handleDisable}
              variant="destructive"
              className="w-full"
            >
              Desabilitar Autenticação de Dois Fatores
            </Button>
          </div>
        ) : (
          renderStepContent()
        )}
      </DialogContent>
    </Dialog>
  );
}
