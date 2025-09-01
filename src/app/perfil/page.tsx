'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Trophy, 
  Clock,
  Edit,
  Save
} from 'lucide-react';
import { useState } from 'react';

export default function MeuPerfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nome: 'Matheus Gino',
    email: 'matheusgino17@icloud.com',
    dataInscricao: '2025-01-15',
    metaDiaria: '4 horas',
    especialidade: 'Medicina'
  });

  const stats = [
    { label: 'Dias de Estudo', value: '45', icon: Calendar },
    { label: 'Disciplinas Ativas', value: '12', icon: BookOpen },
    { label: 'Simulados Realizados', value: '23', icon: Trophy },
    { label: 'Horas Totais', value: '180h', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho do Perfil */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-blue-500 text-white text-2xl">
                      MG
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{userData.nome}</CardTitle>
                    <CardDescription className="text-lg">
                      Estudante de {userData.especialidade}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      Usuário Ativo
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                >
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? 'Salvar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs de Informações */}
          <Tabs defaultValue="informacoes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
              <TabsTrigger value="preferencias">Preferências</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="informacoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Gerencie suas informações básicas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={userData.nome}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, nome: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="especialidade">Área de Estudo</Label>
                      <Input
                        id="especialidade"
                        value={userData.especialidade}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, especialidade: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meta">Meta Diária</Label>
                      <Input
                        id="meta"
                        value={userData.metaDiaria}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, metaDiaria: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferencias" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Estudo</CardTitle>
                  <CardDescription>
                    Configure como você prefere estudar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Configurações de preferências serão implementadas em breve.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Atividades</CardTitle>
                  <CardDescription>
                    Veja seu progresso ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Histórico detalhado será implementado em breve.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
