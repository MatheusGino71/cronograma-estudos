'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Key, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  Bot,
  MessageSquare,
  BookOpen
} from 'lucide-react';



export default function GeminiSetup() {
  const [copied, setCopied] = React.useState(false);

  const envExample = `# Configuração para Chat IA e Assistente IA
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...sua_chave_aqui`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGeminiAPI = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Configuração do Chat IA</h1>
            <p className="text-muted-foreground">Configure a API do Google Gemini para habilitar a IA</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Bot className="h-3 w-3" />
            Chat IA
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <MessageSquare className="h-3 w-3" />
            Assistente IA
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Gratuito
          </Badge>
        </div>
      </div>

      {/* Status Atual */}
      <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          <strong>Modo Demonstração Ativo</strong> - Configure a API do Gemini para respostas reais da IA
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Passo 1: Obter API Key */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              1. Obter API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Obtenha sua chave gratuita da API do Google Gemini
            </p>
            
            <Button 
              onClick={openGeminiAPI}
              className="w-full gap-2"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4" />
              Acessar Google AI Studio
            </Button>

            <div className="text-xs text-muted-foreground space-y-2">
              <p><strong>📋 Passos no Google AI Studio:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Faça login com sua conta Google</li>
                <li>Clique em &quot;Create API Key&quot;</li>
                <li>Selecione ou crie um projeto</li>
                <li>Copie a chave gerada</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Passo 2: Configurar Projeto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              2. Configurar Projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Adicione a chave no arquivo de configuração
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Arquivo .env.local</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="gap-1"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                <code>{envExample}</code>
              </pre>
            </div>

            <div className="text-xs text-muted-foreground space-y-2">
              <p><strong>📋 Como configurar:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Crie o arquivo <code>.env.local</code> na raiz</li>
                <li>Cole o conteúdo e substitua pela sua chave</li>
                <li>Reinicie o servidor: <code>npm run dev</code></li>
                <li>Recarregue esta página</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funcionalidades que serão habilitadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Funcionalidades que serão habilitadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Chat Inteligente</h3>
              <p className="text-xs text-muted-foreground">
                Conversas naturais com IA especializada em Direito
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Explicações Detalhadas</h3>
              <p className="text-xs text-muted-foreground">
                Conceitos jurídicos explicados de forma didática
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Cronogramas Personalizados</h3>
              <p className="text-xs text-muted-foreground">
                Planos de estudo adaptados ao seu objetivo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre limites gratuitos */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>💡 Dica:</strong> A API do Google Gemini oferece uma cota gratuita generosa, suficiente para uso pessoal intenso.
        </AlertDescription>
      </Alert>
    </div>
  );
}