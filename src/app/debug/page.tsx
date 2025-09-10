'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { carregarQuestoes } from "@/lib/carrega-questoes"
import { agruparPorDisciplina } from "@/lib/simulado-utils"
import { Questao } from "@/types/simulado"

export default function DebugQuestoesPage() {
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [disciplinasAgrupadas, setDisciplinasAgrupadas] = useState<Record<string, Questao[]>>({})

  useEffect(() => {
    async function carregarTodasQuestoes() {
      try {
        console.log('Iniciando carregamento das questões...')
        const todasQuestoes = await carregarQuestoes()
        console.log('Questões carregadas:', todasQuestoes)
        
        setQuestoes(todasQuestoes)
        
        const agrupadas = agruparPorDisciplina(todasQuestoes)
        setDisciplinasAgrupadas(agrupadas)
        
        console.log('Disciplinas agrupadas:', agrupadas)
      } catch (error) {
        console.error('Erro ao carregar questões:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarTodasQuestoes()
  }, [])

  if (carregando) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4" />
          <p>Carregando questões...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <Card>
          <CardHeader>
            <CardTitle>Debug - Questões Carregadas</CardTitle>
            <p className="text-muted-foreground">
              Visualização de todas as questões processadas do arquivo CSV
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{questoes.length}</div>
                <div className="text-sm text-muted-foreground">Total Questões</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{Object.keys(disciplinasAgrupadas).length}</div>
                <div className="text-sm text-muted-foreground">Disciplinas</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {questoes.reduce((acc, q) => acc + q.alternativas.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Alternativas</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {questoes.reduce((acc, q) => acc + q.alternativas.filter(a => a.correta).length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Respostas Corretas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Por Disciplina */}
        <Card>
          <CardHeader>
            <CardTitle>Questões por Disciplina</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(disciplinasAgrupadas)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([disciplina, questoesDisciplina]) => (
                <div key={disciplina} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{disciplina}</span>
                    <div className="text-sm text-muted-foreground">
                      IDs: {questoesDisciplina.map(q => q.id).sort((a, b) => a - b).join(', ')}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {questoesDisciplina.length} questões
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista Completa de Questões */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Questões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questoes
                .sort((a, b) => a.id - b.id)
                .map((questao) => (
                <div key={questao.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline">ID: {questao.id}</Badge>
                      <Badge variant="secondary" className="ml-2">
                        {questao.disciplina}
                      </Badge>
                    </div>
                    <Badge>
                      {questao.alternativas.length} alternativas
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {questao.enunciado.substring(0, 150)}...
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    Alternativas: {questao.alternativas.map(a => a.letra).join(', ')} | 
                    Correta: {questao.alternativas.find(a => a.correta)?.letra || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
