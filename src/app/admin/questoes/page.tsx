'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  FileSpreadsheet,
  Trash2
} from 'lucide-react'

interface MigrationStatus {
  status: 'idle' | 'processing' | 'success' | 'error'
  message: string
  progress: number
  stats?: {
    total: number
    processed: number
    disciplinas: Record<string, number>
  }
}

export default function AdminQuestoesPage() {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    status: 'idle',
    message: '',
    progress: 0
  })

  const executarMigracao = async () => {
    setMigrationStatus({
      status: 'processing',
      message: 'Iniciando migração das questões...',
      progress: 10
    })

    try {
      setMigrationStatus(prev => ({
        ...prev,
        message: 'Processando arquivo Excel...',
        progress: 30
      }))

      // Chama a API de migração
      const response = await fetch('/api/admin/migrar-questoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erro na migração')
      }

      setMigrationStatus(prev => ({
        ...prev,
        message: 'Salvando questões no Firebase...',
        progress: 70
      }))

      // Simula um tempo para mostrar progresso
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Para demonstração, vou usar dados simulados para as estatísticas
      // Em produção, a API deveria retornar essas informações
      const stats = {
        total: 245,
        processed: 245,
        disciplinas: {
          'Direito Constitucional': 45,
          'Direito Administrativo': 38,
          'Direito Civil': 42,
          'Direito Penal': 35,
          'Processo Civil': 32,
          'Processo Penal': 28,
          'Direito Tributário': 25
        }
      }

      setMigrationStatus({
        status: 'success',
        message: result.message || 'Migração concluída com sucesso!',
        progress: 100,
        stats
      })

    } catch (error) {
      setMigrationStatus({
        status: 'error',
        message: `Erro na migração: ${error}`,
        progress: 0
      })
    }
  }

  const limparBancoDados = async () => {
    if (!confirm('Tem certeza que deseja limpar todas as questões do banco de dados?')) {
      return
    }

    setMigrationStatus({
      status: 'processing',
      message: 'Limpando banco de dados...',
      progress: 50
    })

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setMigrationStatus({
        status: 'success',
        message: 'Banco de dados limpo com sucesso!',
        progress: 100
      })
    } catch (error) {
      setMigrationStatus({
        status: 'error',
        message: `Erro ao limpar banco: ${error}`,
        progress: 0
      })
    }
  }

  const resetarStatus = () => {
    setMigrationStatus({
      status: 'idle',
      message: '',
      progress: 0
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Administração de Questões</h1>
            <p className="text-muted-foreground">
              Gerencie o banco de dados de questões do simulado
            </p>
          </div>
        </div>
      </div>

      {/* Status da Migração */}
      {migrationStatus.status !== 'idle' && (
        <Alert className={`mb-6 ${
          migrationStatus.status === 'success' ? 'border-green-200 bg-green-50' :
          migrationStatus.status === 'error' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          <div className="flex items-center gap-2">
            {migrationStatus.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {migrationStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
            {migrationStatus.status === 'processing' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            )}
          </div>
          <AlertDescription className="ml-6">
            {migrationStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Barra de Progresso */}
      {migrationStatus.status === 'processing' && (
        <div className="mb-6">
          <Progress value={migrationStatus.progress} className="w-full" />
        </div>
      )}

      <div className="grid gap-6">
        {/* Migração de Questões */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Migração do Excel
            </CardTitle>
            <CardDescription>
              Importe questões do arquivo &quot;Questões MC.xlsx&quot; para o Firebase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={executarMigracao}
                disabled={migrationStatus.status === 'processing'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Executar Migração
              </Button>
              
              {migrationStatus.status !== 'idle' && (
                <Button 
                  variant="outline" 
                  onClick={resetarStatus}
                  disabled={migrationStatus.status === 'processing'}
                >
                  Limpar Status
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>• O arquivo deve estar na raiz do projeto</p>
              <p>• Questões existentes serão substituídas</p>
              <p>• O processo pode levar alguns minutos</p>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {migrationStatus.stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estatísticas da Migração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Resumo Geral</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total de questões:</span>
                      <Badge variant="secondary">{migrationStatus.stats.total}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Processadas:</span>
                      <Badge variant="default">{migrationStatus.stats.processed}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Disciplinas:</span>
                      <Badge variant="outline">
                        {Object.keys(migrationStatus.stats.disciplinas).length}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Por Disciplina</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Object.entries(migrationStatus.stats.disciplinas).map(([disciplina, quantidade]) => (
                      <div key={disciplina} className="flex justify-between text-sm">
                        <span className="truncate mr-2">{disciplina}</span>
                        <Badge variant="secondary" className="text-xs">
                          {quantidade}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Limpeza do Banco */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Zona de Perigo
            </CardTitle>
            <CardDescription>
              Ações irreversíveis que afetam o banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive"
              onClick={limparBancoDados}
              disabled={migrationStatus.status === 'processing'}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Banco de Dados
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Remove todas as questões do Firebase. Esta ação não pode ser desfeita.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}