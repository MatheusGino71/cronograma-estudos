'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Questao } from "@/types/simulado"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  BookOpen
} from "lucide-react"

interface QuestaoErrada extends Questao {
  respostaUsuario: string
  dataResposta: string
  tentativas: number
}

export default function RevisaoPage() {
  const router = useRouter()
  const [questoesErradas, setQuestoesErradas] = React.useState<QuestaoErrada[]>([])
  const [disciplinaFiltro, setDisciplinaFiltro] = React.useState<string>("todas")
  const [questaoSelecionada, setQuestaoSelecionada] = React.useState<QuestaoErrada | null>(null)
  const [carregando, setCarregando] = React.useState(true)

  React.useEffect(() => {
    carregarQuestoesErradas()
  }, [])

  const carregarQuestoesErradas = () => {
    try {
      setCarregando(true)
      const historico = localStorage.getItem('historico-questoes')
      if (historico) {
        const dados = JSON.parse(historico)
        const erradas = dados.filter((q: QuestaoErrada) => 
          q.alternativas.find(a => a.letra === q.respostaUsuario)?.correta === false
        )
        setQuestoesErradas(erradas)
      }
    } catch (error) {
      console.error('Erro ao carregar questões erradas:', error)
    } finally {
      setCarregando(false)
    }
  }

  const questoesFiltradas = React.useMemo(() => {
    if (disciplinaFiltro === "todas") {
      return questoesErradas
    }
    return questoesErradas.filter(q => q.disciplina === disciplinaFiltro)
  }, [questoesErradas, disciplinaFiltro])

  const disciplinas = React.useMemo(() => {
    const discs = [...new Set(questoesErradas.map(q => q.disciplina))]
    return discs.sort()
  }, [questoesErradas])

  if (carregando) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-[#3D5AFE] mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando questões erradas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent">
              Questões para Revisar
            </span>
          </h1>
          <p className="text-muted-foreground">
            Revise e refaça as questões que você errou
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={disciplinaFiltro} onValueChange={setDisciplinaFiltro}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as disciplinas</SelectItem>
              {disciplinas.map(disc => (
                <SelectItem key={disc} value={disc}>{disc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-[#FF3347]/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total de Erros</CardTitle>
              <XCircle className="h-4 w-4 text-[#FF3347]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FF3347]">
              {questoesFiltradas.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Questões para revisar
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#3D5AFE]/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
              <BookOpen className="h-4 w-4 text-[#3D5AFE]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D5AFE]">
              {disciplinaFiltro === "todas" ? disciplinas.length : 1}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {disciplinaFiltro === "todas" ? "Com erros" : "Selecionada"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Múltiplas Tentativas</CardTitle>
              <RefreshCw className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">
              {questoesFiltradas.filter(q => q.tentativas > 1).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Erradas mais de uma vez
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Últimas 24h</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {questoesFiltradas.filter(q => {
                const diff = Date.now() - new Date(q.dataResposta).getTime()
                return diff < 24 * 60 * 60 * 1000
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Erradas recentemente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Questões Erradas */}
      <Card>
        <CardHeader>
          <CardTitle>
            {questoesFiltradas.length} {questoesFiltradas.length === 1 ? 'Questão' : 'Questões'} para Revisar
          </CardTitle>
          <CardDescription>
            {disciplinaFiltro !== "todas" && `Filtrado por: ${disciplinaFiltro}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questoesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Parabéns!</h3>
              <p className="text-muted-foreground">
                {disciplinaFiltro === "todas" 
                  ? "Você não tem questões erradas para revisar"
                  : `Você não tem questões erradas em ${disciplinaFiltro}`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questoesFiltradas.map((questao, index) => (
                <div 
                  key={`${questao.id}-${index}`}
                  className="border-2 border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-[#3D5AFE]/50 hover:bg-muted/50 transition-all cursor-pointer"
                  onClick={() => setQuestaoSelecionada(questao)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="destructive" className="bg-[#FF3347]">
                          {questao.disciplina}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(questao.dataResposta).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {questao.tentativas > 1 && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            {questao.tentativas} tentativas
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm leading-relaxed line-clamp-3">
                        {questao.enunciado}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Sua resposta:</span>
                          <span className="font-bold text-[#FF3347]">{questao.respostaUsuario}</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Resposta correta:</span>
                          <span className="font-bold text-green-600">
                            {questao.alternativas.find(a => a.correta)?.letra}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Questão Detalhada */}
      {questaoSelecionada && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setQuestaoSelecionada(null)}
        >
          <Card 
            className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Revisar Questão</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuestaoSelecionada(null)}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <Badge variant="destructive" className="bg-[#FF3347]">
                  {questaoSelecionada.disciplina}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Respondida em {new Date(questaoSelecionada.dataResposta).toLocaleDateString('pt-BR')}
                </span>
                {questaoSelecionada.tentativas > 1 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    {questaoSelecionada.tentativas} tentativas
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-[#3D5AFE]">Enunciado:</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                  {questaoSelecionada.enunciado}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4 text-[#3D5AFE]">Alternativas:</h3>
                <div className="space-y-3">
                  {questaoSelecionada.alternativas.map((alt) => {
                    const isSuaResposta = alt.letra === questaoSelecionada.respostaUsuario
                    const isCorreta = alt.correta
                    
                    return (
                      <div
                        key={alt.letra}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCorreta
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md'
                            : isSuaResposta
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`font-bold text-lg flex-shrink-0 ${
                            isCorreta ? 'text-green-600' : isSuaResposta ? 'text-red-600' : ''
                          }`}>
                            {alt.letra})
                          </span>
                          <p className="text-sm flex-1 leading-relaxed">{alt.texto}</p>
                          {isCorreta && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                              <span className="text-xs font-semibold text-green-600">Correta</span>
                            </div>
                          )}
                          {isSuaResposta && !isCorreta && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <XCircle className="h-6 w-6 text-red-600" />
                              <span className="text-xs font-semibold text-red-600">Sua resposta</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setQuestaoSelecionada(null)}
                  className="px-6"
                >
                  Fechar
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#3D5AFE] to-[#2648C7] text-white px-6 gap-2"
                  onClick={() => {
                    // Marca como revisada e fecha
                    setQuestaoSelecionada(null)
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Entendi, Próxima
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
