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
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MeuPerfil() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    dataInscricao: '',
    metaDiaria: '',
    especialidade: '',
    telefone: ''
  });

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            nome: data.name + ' ' + (data.lastName || ''),
            email: data.email || user.email,
            dataInscricao: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Data não disponível',
            metaDiaria: data.metaDiaria || '4 horas',
            especialidade: data.especialidade || 'Não informado',
            telefone: data.phone || ''
          });
        } else {
          // Dados básicos do Firebase Auth
          setUserData({
            nome: user.name + ' ' + (user.lastName || ''),
            email: user.email,
            dataInscricao: user.createdAt ? user.createdAt.toLocaleDateString('pt-BR') : 'Data não disponível',
            metaDiaria: '4 horas',
            especialidade: 'Não informado',
            telefone: user.phone || ''
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Função para salvar alterações
  const handleSave = async () => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.id);
      const nameParts = userData.nome.split(' ');
      
      await setDoc(userDocRef, {
        name: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userData.email,
        phone: userData.telefone,
        metaDiaria: userData.metaDiaria,
        especialidade: userData.especialidade,
        updatedAt: new Date()
      }, { merge: true });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  const stats = [
    { label: 'Dias de Estudo', value: '0', icon: Calendar },
    { label: 'Disciplinas Ativas', value: '0', icon: BookOpen },
    { label: 'Simulados Realizados', value: '0', icon: Trophy },
    { label: 'Horas Totais', value: '0h', icon: Clock }
  ];

  // Função para obter as iniciais do nome
  const getInitials = (nome: string) => {
    const names = nome.split(' ');
    return names.length >= 2 
      ? (names[0][0] + names[1][0]).toUpperCase()
      : nome.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

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
                    <AvatarImage src={user.avatar || "/placeholder-avatar.jpg"} />
                    <AvatarFallback className="bg-blue-500 text-white text-2xl">
                      {getInitials(userData.nome || user.name + ' ' + (user.lastName || ''))}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{userData.nome || 'Usuário'}</CardTitle>
                    <CardDescription className="text-lg">
                      Estudante de {userData.especialidade}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      Novo Usuário
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
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
              <Card key={`stat-${stat.label}-${index}`}>
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
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        type="tel"
                        value={userData.telefone}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, telefone: e.target.value})}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataInscricao">Data de Inscrição</Label>
                      <Input
                        id="dataInscricao"
                        value={userData.dataInscricao}
                        disabled={true}
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="especialidade">Área de Estudo</Label>
                      <Input
                        id="especialidade"
                        value={userData.especialidade}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, especialidade: e.target.value})}
                        placeholder="Ex: Medicina, Direito, Engenharia..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meta">Meta Diária de Estudos</Label>
                      <Input
                        id="meta"
                        value={userData.metaDiaria}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, metaDiaria: e.target.value})}
                        placeholder="Ex: 4 horas, 6 horas..."
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
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <User className="h-16 w-16 mx-auto" />
                    </div>
                    <p className="text-gray-600 mb-2">
                      <strong>Configure suas preferências</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Personalize sua experiência de estudos definindo horários, lembretes e métodos de aprendizado.
                    </p>
                  </div>
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
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <Calendar className="h-16 w-16 mx-auto" />
                    </div>
                    <p className="text-gray-600 mb-2">
                      <strong>Nenhuma atividade registrada ainda</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Comece criando seu primeiro cronograma de estudos para ver seu histórico aqui.
                    </p>
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
