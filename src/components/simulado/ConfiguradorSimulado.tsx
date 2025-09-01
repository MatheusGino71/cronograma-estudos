'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Settings, Play } from "lucide-react"
import { ConfigSimulado, ModoSimulado } from "@/types/simulado"
import { carregarQuestoes } from "@/lib/carrega-questoes"
import { agruparPorDisciplina } from "@/lib/simulado-utils"

interface ConfiguradorSimuladoProps {
  onStart: (config: ConfigSimulado) => void;
}

export function ConfiguradorSimulado({ onStart }: ConfiguradorSimuladoProps) {
  const [modo, setModo] = useState<ModoSimulado>('geral')
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<string[]>([])
  const [numeroQuestoes, setNumeroQuestoes] = useState([10]) // Começar com 10 questões
  const [mostrarGabarito, setMostrarGabarito] = useState(true)
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

  const handleDisciplinaChange = (disciplina: string, checked: boolean) => {
    setDisciplinasSelecionadas(prev => {
      if (checked) {
        return [...prev, disciplina]
      } else {
        return prev.filter(d => d !== disciplina)
      }
    })
  }

  const handleSelecionarTodas = () => {
    setDisciplinasSelecionadas(disciplinasDisponiveis.map(d => d.disciplina))
  }

  const handleDesmarcarTodas = () => {
    setDisciplinasSelecionadas([])
  }

  const totalQuestoesSelecionadas = disciplinasSelecionadas.length === 0 
    ? totalQuestoesDisponiveis
    : disciplinasDisponiveis
        .filter(d => disciplinasSelecionadas.includes(d.disciplina))
        .reduce((acc, d) => acc + d.total, 0)

  const maxQuestoes = Math.min(totalQuestoesSelecionadas, 200) // Aumentei de 100 para 200

  const handleIniciar = () => {
    const config: ConfigSimulado = {
      modo,
      disciplinas: modo === 'geral' ? undefined : disciplinasSelecionadas,
      numeroQuestoes: numeroQuestoes[0],
      mostrarGabarito
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
                    modo === 'disciplina' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setModo('disciplina')}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Por Disciplina</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Escolha disciplinas específicas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Disciplinas */}
          {modo === 'disciplina' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Disciplinas</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSelecionarTodas}
                    >
                      Todas
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDesmarcarTodas}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {disciplinasDisponiveis.map((disc) => (
                    <div key={disc.disciplina} className="flex items-center space-x-2">
                      <Checkbox
                        id={disc.disciplina}
                        checked={disciplinasSelecionadas.includes(disc.disciplina)}
                        onCheckedChange={(checked) => 
                          handleDisciplinaChange(disc.disciplina, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={disc.disciplina} 
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {disc.disciplina}
                        <Badge variant="secondary" className="ml-2">
                          {disc.total}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
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
                    {modo === 'geral' ? 'Simulado Geral' : 'Por Disciplina'}
                  </span>
                </div>
                
                {modo === 'disciplina' && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Disciplinas selecionadas:</span>
                    <span className="text-sm font-medium">
                      {disciplinasSelecionadas.length}
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
              </div>

              <Button 
                onClick={handleIniciar} 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={modo === 'disciplina' && disciplinasSelecionadas.length === 0}
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
