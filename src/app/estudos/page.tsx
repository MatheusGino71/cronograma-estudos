'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  TrendingUp,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  Target,
  Brain,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function MeusEstudos() {
  const disciplinasAtivas = [
    { nome: 'Anatomia', progresso: 75, tempoHoje: '2h 30min', status: 'Em andamento' },
    { nome: 'Fisiologia', progresso: 60, tempoHoje: '1h 45min', status: 'Em andamento' },
    { nome: 'Farmacologia', progresso: 40, tempoHoje: '45min', status: 'Pausado' },
    { nome: 'Patologia', progresso: 85, tempoHoje: '3h 15min', status: 'Concluído hoje' }
  ];

  const sessoeRecentes = [
    { disciplina: 'Anatomia', topico: 'Sistema Cardiovascular', duracao: '45min', data: 'Hoje', tipo: 'Teoria' },
    { disciplina: 'Fisiologia', topico: 'Regulação Hormonal', duracao: '30min', data: 'Hoje', tipo: 'Exercícios' },
    { disciplina: 'Farmacologia', topico: 'Antibióticos', duracao: '1h 20min', data: 'Ontem', tipo: 'Simulado' },
    { disciplina: 'Patologia', topico: 'Neoplasias', duracao: '55min', data: 'Ontem', tipo: 'Teoria' }
  ];

  const metasSemanais = {
    horasEstudadas: { atual: 28, meta: 40 },
    disciplinasConcluidas: { atual: 3, meta: 5 },
    simuladosRealizados: { atual: 7, meta: 10 }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return <PlayCircle className="h-4 w-4 text-green-500" />;
      case 'Pausado':
        return <PauseCircle className="h-4 w-4 text-yellow-500" />;
      case 'Concluído hoje':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Teoria':
        return <BookOpen className="h-4 w-4" />;
      case 'Exercícios':
        return <FileText className="h-4 w-4" />;
      case 'Simulado':
        return <Brain className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Estudos</h1>
            <p className="text-gray-600">Acompanhe seu progresso e gerencie suas sessões de estudo</p>
          </div>

          {/* Metas Semanais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Horas de Estudo</span>
                  </div>
                  <Badge variant="outline">Esta Semana</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{metasSemanais.horasEstudadas.atual}h / {metasSemanais.horasEstudadas.meta}h</span>
                  </div>
                  <Progress value={(metasSemanais.horasEstudadas.atual / metasSemanais.horasEstudadas.meta) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Disciplinas</span>
                  </div>
                  <Badge variant="outline">Meta Semanal</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Concluídas</span>
                    <span>{metasSemanais.disciplinasConcluidas.atual} / {metasSemanais.disciplinasConcluidas.meta}</span>
                  </div>
                  <Progress value={(metasSemanais.disciplinasConcluidas.atual / metasSemanais.disciplinasConcluidas.meta) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Simulados</span>
                  </div>
                  <Badge variant="outline">Esta Semana</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Realizados</span>
                    <span>{metasSemanais.simuladosRealizados.atual} / {metasSemanais.simuladosRealizados.meta}</span>
                  </div>
                  <Progress value={(metasSemanais.simuladosRealizados.atual / metasSemanais.simuladosRealizados.meta) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de Conteúdo */}
          <Tabs defaultValue="ativas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ativas">Disciplinas Ativas</TabsTrigger>
              <TabsTrigger value="sessoes">Sessões Recentes</TabsTrigger>
              <TabsTrigger value="planejamento">Planejamento</TabsTrigger>
            </TabsList>

            <TabsContent value="ativas" className="space-y-6">
              <div className="grid gap-6">
                {disciplinasAtivas.map((disciplina, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(disciplina.status)}
                          <div>
                            <h3 className="font-semibold text-lg">{disciplina.nome}</h3>
                            <p className="text-sm text-gray-600">Tempo hoje: {disciplina.tempoHoje}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{disciplina.progresso}%</p>
                          <Badge variant={disciplina.status === 'Pausado' ? 'destructive' : 'default'}>
                            {disciplina.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso Geral</span>
                          <span>{disciplina.progresso}% concluído</span>
                        </div>
                        <Progress value={disciplina.progresso} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sessoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Sessões</CardTitle>
                  <CardDescription>Suas sessões de estudo mais recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessoeRecentes.map((sessao, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTipoIcon(sessao.tipo)}
                          <div>
                            <p className="font-medium">{sessao.disciplina}</p>
                            <p className="text-sm text-gray-600">{sessao.topico}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{sessao.duracao}</p>
                          <p className="text-sm text-gray-600">{sessao.data}</p>
                          <Badge variant="outline" className="mt-1">
                            {sessao.tipo}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planejamento" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cronograma Semanal</CardTitle>
                    <CardDescription>Acesse seu cronograma personalizado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Gerencie e acompanhe seu cronograma de estudos semanal.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/cronograma">
                        <Calendar className="h-4 w-4 mr-2" />
                        Ver Cronograma
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Simulados</CardTitle>
                    <CardDescription>Teste seus conhecimentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Realize simulados para avaliar seu progresso.
                    </p>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/simulado">
                        <Brain className="h-4 w-4 mr-2" />
                        Fazer Simulado
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
