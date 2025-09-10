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
  Target,
  PlayCircle,
  Brain
} from 'lucide-react';
import Link from 'next/link';

export default function MeusEstudos() {
  const metasSemanais = {
    horasEstudadas: { atual: 0, meta: 20 },
    disciplinasConcluidas: { atual: 0, meta: 3 },
    simuladosRealizados: { atual: 0, meta: 5 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Estudos - Direito</h1>
            <p className="text-gray-600">Comece sua jornada jurídica criando seu primeiro cronograma de estudos</p>
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
              <Card className="text-center p-8">
                <CardContent>
                  <div className="text-gray-400 mb-6">
                    <BookOpen className="h-24 w-24 mx-auto" />
                  </div>
                  <CardTitle className="text-2xl mb-4">Bem-vindo à sua jornada jurídica!</CardTitle>
                  <CardDescription className="text-lg mb-6">
                    Você ainda não possui disciplinas ativas. Comece criando seu cronograma personalizado de estudos em Direito.
                  </CardDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button asChild>
                      <Link href="/cronograma">
                        <Calendar className="h-4 w-4 mr-2" />
                        Criar Cronograma
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/disciplinas">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ver Disciplinas
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Sessões</CardTitle>
                  <CardDescription>Suas sessões de estudo aparecerão aqui</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Clock className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Nenhuma sessão registrada</h3>
                    <p className="text-gray-600 mb-4">
                      Quando você começar a estudar, suas sessões aparecerão aqui com detalhes sobre tempo de estudo, disciplinas e progresso.
                    </p>
                    <Button asChild>
                      <Link href="/cronograma">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Iniciar Primeira Sessão
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planejamento" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cronograma Jurídico</CardTitle>
                    <CardDescription>Organize seus estudos em Direito</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Crie um cronograma personalizado com as 12 disciplinas jurídicas essenciais para concursos públicos.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/cronograma">
                        <Calendar className="h-4 w-4 mr-2" />
                        Criar Cronograma
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Simulados Jurídicos</CardTitle>
                    <CardDescription>Teste seus conhecimentos em Direito</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Prepare-se para concursos com simulados específicos das principais bancas examinadoras.
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

              <Card>
                <CardHeader>
                  <CardTitle>Disciplinas Disponíveis</CardTitle>
                  <CardDescription>Explore todas as áreas do Direito</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
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
                    ].map((disciplina, index) => (
                      <Badge key={`disciplina-estudos-${disciplina}-${index}`} variant="outline" className="p-2 text-center">
                        {disciplina}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button asChild variant="outline">
                      <Link href="/disciplinas">
                        Ver Todas as Disciplinas
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
