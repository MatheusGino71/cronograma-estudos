'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function MigrarQuestoesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleMigration = async () => {
    try {
      setLoading(true)
      setResult(null)

      const response = await fetch('/api/admin/migrar-questoes', {
        method: 'POST',
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Migração de Questões</h1>
          <p className="text-lg text-muted-foreground">
            Importar questões do arquivo Excel para o Firebase
          </p>
        </div>

        {/* Card de Migração */}
        <Card>
          <CardHeader>
            <CardTitle>Importar Questões do Excel</CardTitle>
            <CardDescription>
              Este processo irá importar TODAS as 5000+ questões do arquivo &quot;Questões MC.xlsx&quot; 
              para o Firebase Firestore.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4" />
                O que será feito:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                <li>Leitura do arquivo Excel &quot;Questões MC.xlsx&quot;</li>
                <li>Processamento e agrupamento de 5000+ questões</li>
                <li>Remoção de questões duplicadas por enunciado</li>
                <li>Limpeza de questões existentes no Firebase</li>
                <li>Importação de TODAS as questões únicas</li>
                <li>Geração de estatísticas por disciplina</li>
              </ul>
            </div>

            <Alert>
              <AlertDescription>
                <strong>📊 Importante:</strong> O arquivo &quot;Questões MC.xlsx&quot; contém mais de 5000 questões. 
                A migração pode levar alguns minutos.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleMigration} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrando questões...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Iniciar Migração
                </>
              )}
            </Button>

            {/* Resultado */}
            {result && (
              <Alert variant={result.success ? 'default' : 'destructive'}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription>
                      <strong>{result.success ? 'Sucesso!' : 'Erro:'}</strong>
                      <p className="mt-1">{result.message}</p>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">1. Preparar o arquivo Excel</h4>
                <p className="text-muted-foreground">
                  O arquivo deve ter as colunas: ID Simulado, ID Questão, Área, Questão, 
                  Letter, Alternativa, Correct
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">2. Colocar na raiz do projeto</h4>
                <p className="text-muted-foreground">
                  O arquivo &quot;Questões MC.xlsx&quot; deve estar na pasta raiz do projeto
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">3. Executar a migração</h4>
                <p className="text-muted-foreground">
                  Clique no botão &quot;Iniciar Migração&quot; acima e aguarde o processo ser concluído
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">4. Verificar os resultados</h4>
                <p className="text-muted-foreground">
                  Após a conclusão, acesse a página de Questões para ver as questões importadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
