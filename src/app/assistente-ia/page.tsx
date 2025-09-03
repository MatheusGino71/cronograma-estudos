'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIChat from '@/components/ai/AIChat';
import { 
  Bot, 
  Brain, 
  BookOpen, 
  Calendar,
  FileText,
  HelpCircle,
  Sparkles,
  Target,
  Users,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

export default function AssistenteIA() {
  const [activeTab, setActiveTab] = useState('chat');

  const features = [
    {
      icon: BookOpen,
      title: 'Explicações Jurídicas',
      description: 'Conceitos complexos explicados de forma simples e didática',
      examples: ['Princípios constitucionais', 'Institutos processuais', 'Doutrinas jurídicas']
    },
    {
      icon: Calendar,
      title: 'Cronogramas Personalizados',
      description: 'Planos de estudo adaptados ao seu tempo e objetivo',
      examples: ['Concursos específicos', 'Carga horária flexível', 'Áreas de dificuldade']
    },
    {
      icon: FileText,
      title: 'Questões de Concurso',
      description: 'Geração de questões no estilo das principais bancas',
      examples: ['CESPE/CEBRASPE', 'FCC', 'FGV', 'VUNESP']
    },
    {
      icon: Brain,
      title: 'Técnicas de Memorização',
      description: 'Métodos comprovados para fixar o conteúdo jurídico',
      examples: ['Mapas mentais', 'Resumos estruturados', 'Associações práticas']
    }
  ];

  const specializations = [
    'Direito Constitucional',
    'Direito Administrativo', 
    'Direito Civil',
    'Direito Penal',
    'Direito Processual Civil',
    'Direito Processual Penal',
    'Direito Trabalhista',
    'Direito Processual do Trabalho',
    'Direito Tributário',
    'Direito Empresarial',
    'Direito Previdenciário',
    'Direito Ambiental'
  ];

  const quickActions = [
    {
      title: 'Explicar Conceito',
      description: 'Peça para explicar qualquer instituto jurídico',
      prompt: 'Explique o conceito de devido processo legal no Direito Constitucional',
      icon: HelpCircle
    },
    {
      title: 'Criar Cronograma',
      description: 'Solicite um plano de estudos personalizado',
      prompt: 'Crie um cronograma de 20h semanais para concurso de Procurador',
      icon: Calendar
    },
    {
      title: 'Gerar Questões',
      description: 'Peça questões sobre qualquer disciplina',
      prompt: 'Crie 5 questões de Direito Administrativo nível intermediário',
      icon: FileText
    },
    {
      title: 'Dicas de Estudo',
      description: 'Solicite técnicas de memorização',
      prompt: 'Como memorizar os prazos processuais do CPC?',
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Bot className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">MindLegal AI</h1>
            <p className="text-xl text-gray-600 mb-4">
              Seu assistente de estudos especializado em Direito brasileiro
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by Google Gemini
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Especialista em Concursos
              </Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="chat">Chat Interativo</TabsTrigger>
              <TabsTrigger value="features">Funcionalidades</TabsTrigger>
              <TabsTrigger value="examples">Como Usar</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Principal */}
                <div className="lg:col-span-2">
                  <AIChat 
                    context="Assistente Jurídico Geral"
                    placeholder="Digite sua dúvida jurídica ou peça ajuda com seus estudos..."
                  />
                </div>

                {/* Informações Laterais */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Áreas de Especialização</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2">
                        {specializations.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-center py-1">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Estatísticas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Consultas hoje</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Conceitos explicados</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cronogramas criados</span>
                          <span className="font-semibold">0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Exemplos:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {feature.examples.map((example, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <action.icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{action.title}</CardTitle>
                          <CardDescription>{action.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm italic">"{action.prompt}"</p>
                      </div>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => setActiveTab('chat')}
                      >
                        Experimentar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
