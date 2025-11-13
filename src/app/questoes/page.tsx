'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { carregarQuestoesDoFirebase } from "@/lib/migrador-questoes"
import type { Questao } from "@/types/simulado"
import { questoesPorDisciplina } from "@/lib/questoes-por-disciplina"
import {
  GraduationCap,
  Play,
  Trophy,
  Target,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Filter
} from "lucide-react"

export default function QuestoesPage() {
  const router = useRouter()
  const [todasQuestoes, setTodasQuestoes] = React.useState<Questao[]>([])
  const [carregando, setCarregando] = React.useState(true)
  const [disciplinaSelecionada, setDisciplinaSelecionada] = React.useState<string>("todas")
  const [quantidadeQuestoes, setQuantidadeQuestoes] = React.useState<string>("10")

  // Estatísticas (localStorage)
  const [estatisticas, setEstatisticas] = React.useState({
    totalRespondidas: 0,
    totalCorretas: 0,
    totalIncorretas: 0,
    porcentagemAcerto: 0,
    questoesHoje: 0
  })

  React.useEffect(() => {
    carregarTodasQuestoes()
    carregarEstatisticas()
  }, [])

  const carregarTodasQuestoes = async () => {
    try {
      setCarregando(true)
      console.log('📚 Iniciando carregamento de questões...')
      const questoes = await carregarQuestoesDoFirebase()
      console.log(`📊 Total carregado: ${questoes.length} questões`)
      setTodasQuestoes(questoes.sort(() => Math.random() - 0.5))
    } catch (error) {
      console.error('❌ Erro ao carregar questões do Firebase:', error)
    } finally {
      setCarregando(false)
    }
  }

  const carregarEstatisticas = () => {
    const stats = localStorage.getItem('estatisticas-questoes')
    if (stats) {
      setEstatisticas(JSON.parse(stats))
    }
  }

  const iniciarPratica = () => {
    const params = new URLSearchParams()
    params.set('disciplina', disciplinaSelecionada)
    params.set('quantidade', quantidadeQuestoes)
    router.push(`/questoes/pratica?${params.toString()}`)
  }

  const getQuestoesDisponiveis = () => {
    if (disciplinaSelecionada === "todas") {
      return todasQuestoes.length
    }
    return todasQuestoes.filter(q => 
      q.disciplina.toLowerCase().includes(disciplinaSelecionada.toLowerCase())
    ).length
  }

  if (carregando) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando questões...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <GraduationCap className="h-10 w-10 text-[#3D5AFE]" />
          <span className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent">
            Banco de Questões
          </span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Pratique com questões reais de concursos anteriores
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disponível</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FF3347]">{todasQuestoes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Questões no banco
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-[#3D5AFE]/30" onClick={() => router.push('/questoes/respondidas')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respondidas</CardTitle>
            <Target className="h-4 w-4 text-[#3D5AFE]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3D5AFE]">{estatisticas.totalRespondidas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de tentativas
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-[#FF3347]/30" onClick={() => router.push('/questoes/acertos')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acertos</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#FF3347]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FF3347]">{estatisticas.totalCorretas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Questões corretas
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-[#3D5AFE]/30" onClick={() => router.push('/questoes/erros')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <XCircle className="h-4 w-4 text-[#3D5AFE]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3D5AFE]">{estatisticas.totalIncorretas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Questões erradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FF3347]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FF3347]">
              {estatisticas.totalRespondidas > 0 
                ? Math.round((estatisticas.totalCorretas / estatisticas.totalRespondidas) * 100)
                : 0}%
            </div>
            <Progress 
              value={estatisticas.totalRespondidas > 0 
                ? (estatisticas.totalCorretas / estatisticas.totalRespondidas) * 100
                : 0} 
              className="mt-2 h-1"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Atualiza automaticamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuração de Prática */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Configurar Prática
          </CardTitle>
          <CardDescription>
            Escolha a disciplina e quantidade de questões para sua sessão de estudos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Disciplina</label>
              <Select value={disciplinaSelecionada} onValueChange={setDisciplinaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">
                    Todas as Disciplinas ({todasQuestoes.length} questões)
                  </SelectItem>
                  {questoesPorDisciplina.map((disc) => (
                    <SelectItem key={disc.id} value={disc.nome}>
                      {disc.nome} ({disc.quantidade} questões)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade de Questões</label>
              <Select value={quantidadeQuestoes} onValueChange={setQuantidadeQuestoes}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a quantidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 questões (Rápido - ~10 min)</SelectItem>
                  <SelectItem value="10">10 questões (Normal - ~20 min)</SelectItem>
                  <SelectItem value="20">20 questões (Longo - ~40 min)</SelectItem>
                  <SelectItem value="30">30 questões (Intensivo - ~60 min)</SelectItem>
                  <SelectItem value="50">50 questões (Maratona - ~100 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#3D5AFE]/10 to-[#FF3347]/10 border-2 border-[#3D5AFE]/30 rounded-lg">
            <div>
              <p className="font-medium text-[#3D5AFE]">
                {getQuestoesDisponiveis()} questões disponíveis
              </p>
              <p className="text-sm text-[#FF3347]">
                Você vai praticar com {Math.min(parseInt(quantidadeQuestoes), getQuestoesDisponiveis())} questões
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={iniciarPratica}
              disabled={getQuestoesDisponiveis() === 0}
              className="gap-2 bg-[#3D5AFE] hover:bg-[#2648C7] text-white font-semibold shadow-md"
            >
              <Play className="h-5 w-5" />
              Iniciar Prática
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disciplinas Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Questões por Disciplina
          </CardTitle>
          <CardDescription>
            Veja quantas questões estão disponíveis em cada área
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {questoesPorDisciplina.map((disc) => (
              <div 
                key={disc.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setDisciplinaSelecionada(disc.nome)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{disc.nome}</h4>
                  <Badge variant="secondary">{disc.quantidade}</Badge>
                </div>
                <Progress value={(disc.quantidade / todasQuestoes.length) * 100} className="h-1" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((disc.quantidade / todasQuestoes.length) * 100)}% do total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-[#FF3347]/20 hover:border-[#FF3347]/50" onClick={() => router.push('/questoes/historico')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#FF3347]">
              <Clock className="h-5 w-5" />
              Ver Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Revise todas as questões que você já respondeu
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-[#3D5AFE]/20 hover:border-[#3D5AFE]/50" onClick={() => router.push('/questoes/estatisticas')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#3D5AFE]">
              <BarChart3 className="h-5 w-5" />
              Estatísticas Detalhadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Análise completa do seu desempenho
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-[#FF3347]/20 hover:border-[#FF3347]/50" onClick={() => router.push('/questoes/revisao')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#FF3347]">
              <Trophy className="h-5 w-5" />
              Modo Revisão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Revise questões que você errou
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
