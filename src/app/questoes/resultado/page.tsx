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

  if (!resultado || !resultado.estatisticas) {
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
  const tempoMedio = (estatisticas?.respondidas && estatisticas.respondidas > 0)
    ? Math.round(estatisticas.tempoTotal / estatisticas.respondidas / 1000)
    : 0

  const getMensagem = () => {
    const porcentagem = estatisticas?.porcentagem || 0
    if (porcentagem >= 90) return { texto: "Excelente! Desempenho excepcional! 🏆", cor: "text-red-600" }
    if (porcentagem >= 70) return { texto: "Muito Bom! Continue assim! 🎯", cor: "text-red-500" }
    if (porcentagem >= 50) return { texto: "Bom trabalho! Há espaço para melhorar. 💪", cor: "text-red-700" }
    return { texto: "Continue praticando! A prática leva à perfeição. 📚", cor: "text-black dark:text-white" }
  }

  const mensagem = getMensagem()

  const novasPratica = () => {
    sessionStorage.removeItem('resultado-pratica')
    sessionStorage.removeItem('questoes-pratica')
    router.push('/questoes')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 relative">

      {/* Header com Celebração */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-600 to-black rounded-full mb-4 shadow-2xl animate-pulse">
          <Trophy className="h-12 w-12 text-white drop-shadow-lg" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
          Prática Concluída!
        </h1>
        <p className={`text-2xl font-semibold ${mensagem.cor} animate-in slide-in-from-bottom-2 duration-1000`}>
          {mensagem.texto}
        </p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
        <Card className="border-2 border-red-600 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-black shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Target className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 animate-in zoom-in duration-500 delay-500">
              {Math.round(estatisticas?.porcentagem || 0)}%
            </div>
            <Progress value={estatisticas?.porcentagem || 0} className="mt-2 h-3 [&>div]:bg-red-600 animate-in slide-in-from-left duration-700 delay-700" />
          </CardContent>
        </Card>

        <Card className="border-2 border-black dark:border-red-600 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-red-950/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acertos</CardTitle>
            <CheckCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-black dark:text-red-600 animate-in zoom-in duration-500 delay-600">
              {estatisticas?.corretas || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de {estatisticas?.respondidas || 0} respondidas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-600 dark:border-red-700 bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-black shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <XCircle className="h-5 w-5 text-red-700 dark:text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-700 dark:text-red-500 animate-in zoom-in duration-500 delay-700">
              {estatisticas?.incorretas || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              questões erradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black dark:border-red-600 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-5 w-5 text-black dark:text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-black dark:text-red-600 animate-in zoom-in duration-500 delay-800">
              {tempoMedio}s
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              por questão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Detalhado */}
      <Card className="border-2 border-red-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <TrendingUp className="h-5 w-5" />
            Resumo da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-600 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-black dark:text-red-600">Total de Questões</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{estatisticas?.total || 0}</p>
            </div>

            <div className="p-4 bg-black dark:bg-red-950/20 border-2 border-black dark:border-red-600 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-600">Tempo Total</span>
              </div>
              <p className="text-2xl font-bold text-white dark:text-red-600">
                {Math.floor((estatisticas?.tempoTotal || 0) / 60000)}min {Math.floor(((estatisticas?.tempoTotal || 0) % 60000) / 1000)}s
              </p>
            </div>
          </div>

          {/* Gráfico Visual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                Corretas
              </span>
              <span className="font-semibold text-red-600">
                {estatisticas?.corretas || 0} ({estatisticas?.respondidas ? Math.round(((estatisticas.corretas || 0) / estatisticas.respondidas) * 100) : 0}%)
              </span>
            </div>
            <Progress value={estatisticas?.respondidas ? ((estatisticas.corretas || 0) / estatisticas.respondidas) * 100 : 0} className="h-3 bg-red-100 dark:bg-red-950/30 [&>div]:bg-red-600" />

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black dark:bg-red-900 rounded-full"></div>
                Incorretas
              </span>
              <span className="font-semibold text-black dark:text-red-900">
                {estatisticas?.incorretas || 0} ({estatisticas?.respondidas ? Math.round(((estatisticas.incorretas || 0) / estatisticas.respondidas) * 100) : 0}%)
              </span>
            </div>
            <Progress value={estatisticas?.respondidas ? ((estatisticas.incorretas || 0) / estatisticas.respondidas) * 100 : 0} className="h-3 bg-gray-100 dark:bg-gray-900 [&>div]:bg-black dark:[&>div]:bg-red-900" />

            {estatisticas && estatisticas.total > (estatisticas.respondidas || 0) && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    Não Respondidas
                  </span>
                  <span className="font-semibold">{estatisticas.total - (estatisticas.respondidas || 0)}</span>
                </div>
                <Progress value={((estatisticas.total - (estatisticas.respondidas || 0)) / estatisticas.total) * 100} className="h-3 bg-gray-100" />
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
      <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000">
        <Button 
          size="lg" 
          onClick={novasPratica} 
          className="flex-1 gap-2 bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <RotateCcw className="h-5 w-5" />
          Nova Prática
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={() => router.push('/questoes')} 
          className="flex-1 gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <Home className="h-5 w-5" />
          Voltar ao Início
        </Button>
      </div>

      {/* Mensagem motivacional extra */}
      {estatisticas?.porcentagem < 50 && (
        <Card className="border-2 border-red-600 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-black">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-semibold text-red-600 mb-2">
              💪 Não desanime!
            </p>
            <p className="text-muted-foreground">
              A prática constante é o caminho para o sucesso. Continue estudando e fazendo mais questões!
            </p>
          </CardContent>
        </Card>
      )}

      {estatisticas?.porcentagem >= 90 && (
        <Card className="border-2 border-red-600 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-black">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-semibold text-red-600 mb-2">
              🏆 Desempenho Excepcional!
            </p>
            <p className="text-muted-foreground">
              Você está no caminho certo! Continue assim e o sucesso está garantido!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
