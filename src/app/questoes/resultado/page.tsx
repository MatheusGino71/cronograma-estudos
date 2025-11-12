'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  TrendingUp,
  Award,
  Flame
} from "lucide-react"

interface ResultadoPratica {
  questoes: Array<{
    id: string
    area: string
    enunciado: string
    alternativas: Array<{
      letra: string
      descricao: string
      correta: boolean
    }>
    respostaUsuario: {
      alternativaSelecionada: string | null
      correta: boolean | null
    }
  }>
  estatisticas: {
    total: number
    respondidas: number
    corretas: number
    incorretas: number
    porcentagem: number
    tempoTotal: number
  }
}

export default function ResultadoPage() {
  const router = useRouter()
  const [resultado, setResultado] = React.useState<ResultadoPratica | null>(null)

  React.useEffect(() => {
    const resultadoSalvo = sessionStorage.getItem('resultado-pratica')
    if (resultadoSalvo) {
      setResultado(JSON.parse(resultadoSalvo))
    } else {
      router.push('/questoes')
    }
  }, [router])

  if (!resultado) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando resultado...</p>
          </div>
        </div>
      </div>
    )
  }

  const { estatisticas } = resultado
  const tempoMedio = estatisticas.respondidas > 0 
    ? Math.round(estatisticas.tempoTotal / estatisticas.respondidas / 1000)
    : 0

  const getMensagem = () => {
    const porcentagem = estatisticas.porcentagem
    if (porcentagem >= 90) return { texto: "Excelente! Desempenho excepcional! 🏆", cor: "text-yellow-600" }
    if (porcentagem >= 70) return { texto: "Muito Bom! Continue assim! 🎯", cor: "text-green-600" }
    if (porcentagem >= 50) return { texto: "Bom trabalho! Há espaço para melhorar. 💪", cor: "text-blue-600" }
    return { texto: "Continue praticando! A prática leva à perfeição. 📚", cor: "text-purple-600" }
  }

  const mensagem = getMensagem()

  const novasPratica = () => {
    sessionStorage.removeItem('resultado-pratica')
    sessionStorage.removeItem('questoes-pratica')
    router.push('/questoes')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Header com Celebração */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Prática Concluída!</h1>
        <p className={`text-xl font-semibold ${mensagem.cor}`}>
          {mensagem.texto}
        </p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(estatisticas.porcentagem)}%
            </div>
            <Progress value={estatisticas.porcentagem} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acertos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {estatisticas.corretas}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de {estatisticas.respondidas} respondidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {estatisticas.incorretas}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              questões erradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {tempoMedio}s
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              por questão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Total de Questões</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{estatisticas.total}</p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Tempo Total</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {Math.floor(estatisticas.tempoTotal / 60000)}min {Math.floor((estatisticas.tempoTotal % 60000) / 1000)}s
              </p>
            </div>
          </div>

          {/* Gráfico Visual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Corretas
              </span>
              <span className="font-semibold">{estatisticas.corretas} ({Math.round((estatisticas.corretas / estatisticas.respondidas) * 100)}%)</span>
            </div>
            <Progress value={(estatisticas.corretas / estatisticas.respondidas) * 100} className="h-3 bg-green-100" />

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Incorretas
              </span>
              <span className="font-semibold">{estatisticas.incorretas} ({Math.round((estatisticas.incorretas / estatisticas.respondidas) * 100)}%)</span>
            </div>
            <Progress value={(estatisticas.incorretas / estatisticas.respondidas) * 100} className="h-3 bg-red-100" />

            {estatisticas.total > estatisticas.respondidas && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    Não Respondidas
                  </span>
                  <span className="font-semibold">{estatisticas.total - estatisticas.respondidas}</span>
                </div>
                <Progress value={((estatisticas.total - estatisticas.respondidas) / estatisticas.total) * 100} className="h-3 bg-gray-100" />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revisão de Questões */}
      <Card>
        <CardHeader>
          <CardTitle>Revisão das Questões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {resultado.questoes.map((questao, idx) => {
              const resposta = questao.respostaUsuario
              if (!resposta?.alternativaSelecionada) return null

              return (
                <div 
                  key={questao.id}
                  className={`p-4 border-2 rounded-lg ${
                    resposta.correta
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Questão {idx + 1}</Badge>
                      <Badge variant="secondary">{questao.area}</Badge>
                    </div>
                    {resposta.correta ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  
                  <div 
                    className="text-sm mb-2 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: questao.enunciado }}
                  />

                  <div className="text-xs text-muted-foreground">
                    Sua resposta: <span className="font-semibold">{resposta.alternativaSelecionada}</span>
                    {!resposta.correta && (
                      <span className="ml-2">
                        | Correta: <span className="font-semibold text-green-700">
                          {questao.alternativas.find(a => a.correta)?.letra}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" onClick={novasPratica} className="flex-1 gap-2">
          <RotateCcw className="h-5 w-5" />
          Nova Prática
        </Button>
        <Button size="lg" variant="outline" onClick={() => router.push('/questoes')} className="flex-1 gap-2">
          <Home className="h-5 w-5" />
          Voltar ao Início
        </Button>
      </div>
    </div>
  )
}
