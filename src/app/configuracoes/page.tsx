'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Palette, 
  Shield, 
  Database,
  Moon,
  Sun,
  Volume2,
  Mail,
  Smartphone,
  Download,
  Trash2,
  Key,
  User,
  Eye
} from 'lucide-react';
import { useState } from 'react';

export default function Configuracoes() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    weeklyProgress: false,
    soundEffects: true
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    language: 'pt-BR'
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    shareProgress: false,
    analyticsData: true
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
            <p className="text-gray-600">Personalize sua experiência no MindTech</p>
          </div>

          {/* Tabs de Configurações */}
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="aparencia">Aparência</TabsTrigger>
              <TabsTrigger value="privacidade">Privacidade</TabsTrigger>
              <TabsTrigger value="dados">Dados</TabsTrigger>
            </TabsList>

            {/* Configurações Gerais */}
            <TabsContent value="geral" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Perfil do Usuário</span>
                  </CardTitle>
                  <CardDescription>
                    Informações básicas da sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" defaultValue="Matheus Gino" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" defaultValue="matheusgino17@icloud.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select defaultValue="america/sao_paulo">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america/sao_paulo">São Paulo (UTC-3)</SelectItem>
                          <SelectItem value="america/new_york">Nova York (UTC-5)</SelectItem>
                          <SelectItem value="europe/london">Londres (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idioma">Idioma</Label>
                      <Select defaultValue="pt-BR">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="mt-4">Salvar Alterações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Configurações de Estudo</span>
                  </CardTitle>
                  <CardDescription>
                    Personalize como você prefere estudar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta-diaria">Meta Diária de Estudo</Label>
                      <Select defaultValue="4">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 horas</SelectItem>
                          <SelectItem value="3">3 horas</SelectItem>
                          <SelectItem value="4">4 horas</SelectItem>
                          <SelectItem value="5">5 horas</SelectItem>
                          <SelectItem value="6">6 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intervalo">Intervalo entre Sessões</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 minutos</SelectItem>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="20">20 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notificações */}
            <TabsContent value="notificacoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notificações</span>
                  </CardTitle>
                  <CardDescription>
                    Configure como você deseja ser notificado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Notificações por E-mail</p>
                        <p className="text-sm text-gray-600">Receba atualizações importantes por e-mail</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Notificações Push</p>
                        <p className="text-sm text-gray-600">Receba notificações no seu dispositivo</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Lembretes de Estudo</p>
                        <p className="text-sm text-gray-600">Receba lembretes para suas sessões programadas</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.studyReminders}
                      onCheckedChange={(checked) => setNotifications({...notifications, studyReminders: checked})}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Efeitos Sonoros</p>
                        <p className="text-sm text-gray-600">Sons de notificação e feedback</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.soundEffects}
                      onCheckedChange={(checked) => setNotifications({...notifications, soundEffects: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aparência */}
            <TabsContent value="aparencia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Aparência</span>
                  </CardTitle>
                  <CardDescription>
                    Customize a interface do aplicativo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <Sun className="h-5 w-5" />
                        <span>Claro</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <Moon className="h-5 w-5" />
                        <span>Escuro</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <Settings className="h-5 w-5" />
                        <span>Sistema</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-size">Tamanho da Fonte</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequena</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacidade */}
            <TabsContent value="privacidade" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacidade e Segurança</span>
                  </CardTitle>
                  <CardDescription>
                    Gerencie suas configurações de privacidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibilidade do Perfil</Label>
                    <Select defaultValue="private">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público</SelectItem>
                        <SelectItem value="friends">Apenas Amigos</SelectItem>
                        <SelectItem value="private">Privado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Compartilhar Progresso</p>
                        <p className="text-sm text-gray-600">Permitir que outros vejam seu progresso</p>
                      </div>
                    </div>
                    <Switch 
                      checked={privacy.shareProgress}
                      onCheckedChange={(checked) => setPrivacy({...privacy, shareProgress: checked})}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center space-x-2">
                      <Key className="h-4 w-4" />
                      <span>Segurança da Conta</span>
                    </h4>
                    <Button variant="outline" className="w-full">
                      Alterar Senha
                    </Button>
                    <Button variant="outline" className="w-full">
                      Configurar Autenticação de Dois Fatores
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dados */}
            <TabsContent value="dados" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Gerenciamento de Dados</span>
                  </CardTitle>
                  <CardDescription>
                    Controle seus dados pessoais e preferências
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Exportar Dados</h4>
                    <p className="text-sm text-gray-600">
                      Baixe uma cópia de todos os seus dados de estudo
                    </p>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Exportar Dados</span>
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-red-600">Zona de Perigo</h4>
                    <p className="text-sm text-gray-600">
                      Ações irreversíveis que afetam permanentemente sua conta
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        Limpar Histórico de Estudos
                      </Button>
                      <Button variant="destructive" className="w-full flex items-center space-x-2">
                        <Trash2 className="h-4 w-4" />
                        <span>Excluir Conta</span>
                      </Button>
                    </div>
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
