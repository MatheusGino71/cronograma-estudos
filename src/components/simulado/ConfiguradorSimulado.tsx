'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Settings, Play } from "lucide-react"
import { ConfigSimulado, ModoSimulado } from "@/types/simulado"
import { carregarQuestoes } from "@/lib/carrega-questoes"
import { agruparPorDisciplina } from "@/lib/simulado-utils"
import { TEMAS_CONCURSO, obterDisciplinasPorTema } from "@/lib/temas-concurso"

interface ConfiguradorSimuladoProps {
  onStart: (config: ConfigSimulado) => void;
}

// Função para criar data local evitando problemas de fuso horário
function criarDataLocal(dataString: string): Date {
  if (!dataString) return new Date()
  
  // Parse da data no formato YYYY-MM-DD como data local
  const [ano, mes, dia] = dataString.split('-').map(Number)
  return new Date(ano, mes - 1, dia) // mês é 0-indexado no JavaScript
}

// Função para formatar data em pt-BR
function formatarDataBR(dataString: string): string {
  if (!dataString) return ''
  
  const data = criarDataLocal(dataString)
  return data.toLocaleDateString('pt-BR')
}

// Função para calcular semanas até a prova
function calcularSemanasAteProva(dataProva: string): number {
  if (!dataProva) return 0
  
  const hoje = new Date()
  const prova = criarDataLocal(dataProva)
  const diferencaMilissegundos = prova.getTime() - hoje.getTime()
  const diferencaDias = Math.ceil(diferencaMilissegundos / (1000 * 60 * 60 * 24))
  
  return Math.ceil(diferencaDias / 7)
}

export function ConfiguradorSimulado({ onStart }: ConfiguradorSimuladoProps) {
  const [modo, setModo] = useState<ModoSimulado>('geral')
  const [temaSelecionado, setTemaSelecionado] = useState('')
  const [numeroQuestoes, setNumeroQuestoes] = useState([10]) // Começar com 10 questões
  const [mostrarGabarito, setMostrarGabarito] = useState(true)
  const [dataProva, setDataProva] = useState('')
  const [disciplinasDisponiveis, setDisciplinasDisponiveis] = useState<{
    disciplina: string;
    total: number;
  }[]>([])
  const [carregando, setCarregando] = useState(true)
  const [totalQuestoesDisponiveis, setTotalQuestoesDisponiveis] = useState(0)

  useEffect(() => {
    async function carregarDisciplinas() {
      try {
        const questoes = await carregarQuestoes()
        console.log('Questões carregadas:', questoes.length)
        
        const agrupadas = agruparPorDisciplina(questoes)
        console.log('Disciplinas:', Object.keys(agrupadas))
        
        const disciplinas = Object.entries(agrupadas).map(([disciplina, questoesDisciplina]) => ({
          disciplina,
          total: questoesDisciplina.length
        })).sort((a, b) => a.disciplina.localeCompare(b.disciplina))
        
        console.log('Disciplinas processadas:', disciplinas)
        
        setDisciplinasDisponiveis(disciplinas)
        setTotalQuestoesDisponiveis(questoes.length)
      } catch (error) {
        console.error('Erro ao carregar disciplinas:', error)
      } finally {
        setCarregando(false)
      }
    }
    
    carregarDisciplinas()
  }, [])

  const totalQuestoesSelecionadas = modo === 'geral' 
    ? totalQuestoesDisponiveis
    : temaSelecionado
    ? (() => {
        const disciplinasTema = obterDisciplinasPorTema(temaSelecionado)
        return disciplinasDisponiveis
          .filter(d => disciplinasTema.includes(d.disciplina))
          .reduce((acc, d) => acc + d.total, 0)
      })()
    : 0

  const maxQuestoes = Math.min(totalQuestoesSelecionadas, 200) // Aumentei de 100 para 200

  const handleIniciar = () => {
    const config: ConfigSimulado = {
      modo,
      tema: modo === 'tema' ? temaSelecionado : undefined,
      disciplinas: modo === 'tema' ? obterDisciplinasPorTema(temaSelecionado) : undefined,
      numeroQuestoes: numeroQuestoes[0],
      mostrarGabarito,
      dataProva: dataProva || undefined
    }
    
    onStart(config)
  }

  if (carregando) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4" />
          <p>Carregando configurações...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurar Simulado
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Personalize seu simulado escolhendo disciplinas, número de questões e outras opções.
            </p>
            <Badge variant="secondary" className="ml-4">
              {totalQuestoesDisponiveis} questões disponíveis
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Modo do Simulado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Modo do Simulado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    modo === 'geral' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setModo('geral')}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-medium">Simulado Geral</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Todas as disciplinas disponíveis
                  </p>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    modo === 'tema' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setModo('tema')}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Por Tema</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Escolha uma área de concurso específica
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Temas */}
          {modo === 'tema' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Área do Concurso</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Escolha o tema que corresponde ao seu concurso. As disciplinas serão selecionadas automaticamente.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {TEMAS_CONCURSO.map((tema) => (
                    <div 
                      key={tema.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        temaSelecionado === tema.id 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setTemaSelecionado(tema.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{tema.icone}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{tema.nome}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {tema.descricao}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {tema.disciplinas.slice(0, 4).map((disciplina, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {disciplina}
                              </Badge>
                            ))}
                            {tema.disciplinas.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{tema.disciplinas.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {temaSelecionado && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">
                        {TEMAS_CONCURSO.find(t => t.id === temaSelecionado)?.nome}
                      </span> selecionado 
                      ({totalQuestoesSelecionadas} questões disponíveis para este tema)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Número de Questões */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Número de Questões</CardTitle>
              <p className="text-sm text-muted-foreground">
                Questões disponíveis: {totalQuestoesSelecionadas}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Botões de seleção rápida */}
              <div className="flex flex-wrap gap-2">
                {[5, 10, 20, 30, 50].filter(n => n <= maxQuestoes).map((num) => (
                  <Button
                    key={num}
                    variant={numeroQuestoes[0] === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNumeroQuestoes([num])}
                    className={numeroQuestoes[0] === num ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    {num}
                  </Button>
                ))}
                {maxQuestoes > 50 && (
                  <Button
                    variant={numeroQuestoes[0] === maxQuestoes ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNumeroQuestoes([maxQuestoes])}
                    className={numeroQuestoes[0] === maxQuestoes ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    Todas ({maxQuestoes})
                  </Button>
                )}
              </div>
              
              <div className="px-2">
                <input
                  type="range"
                  min={1}
                  max={maxQuestoes}
                  value={numeroQuestoes[0]}
                  onChange={(e) => setNumeroQuestoes([parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-red-600">
                  {numeroQuestoes[0]}
                </span>
                <span className="text-muted-foreground ml-1">questões</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opções Adicionais */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Opções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="mostrar-gabarito">Mostrar Gabarito</Label>
                  <p className="text-xs text-muted-foreground">
                    Exibir resposta após cada questão
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="mostrar-gabarito"
                  checked={mostrarGabarito}
                  onChange={(e) => setMostrarGabarito(e.target.checked)}
                  className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-prova">Data da Prova (Opcional)</Label>
                <input
                  type="date"
                  id="data-prova"
                  value={dataProva}
                  onChange={(e) => setDataProva(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // não permite datas no passado
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-muted-foreground">
                  Cronograma especializado será criado com base nas semanas restantes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total de questões:</span>
                  <span className="text-sm font-medium">{totalQuestoesDisponiveis}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Disciplinas disponíveis:</span>
                  <span className="text-sm font-medium">{disciplinasDisponiveis.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Modo:</span>
                  <span className="text-sm font-medium">
                    {modo === 'geral' ? 'Simulado Geral' : modo === 'tema' ? 'Por Tema' : 'Personalizado'}
                  </span>
                </div>
                
                {modo === 'tema' && temaSelecionado && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tema:</span>
                    <span className="text-sm font-medium">
                      {TEMAS_CONCURSO.find(t => t.id === temaSelecionado)?.nome}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Questões do simulado:</span>
                  <span className="text-sm font-medium">{numeroQuestoes[0]}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gabarito:</span>
                  <span className="text-sm font-medium">
                    {mostrarGabarito ? 'Sim' : 'Não'}
                  </span>
                </div>
                
                {dataProva && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Data da Prova:</span>
                      <span className="text-sm font-medium">
                        {formatarDataBR(dataProva)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Semanas restantes:</span>
                      <span className="text-sm font-medium text-orange-600">
                        {calcularSemanasAteProva(dataProva)} semanas
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Button 
                onClick={handleIniciar} 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={modo === 'tema' && !temaSelecionado}
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Simulado
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
