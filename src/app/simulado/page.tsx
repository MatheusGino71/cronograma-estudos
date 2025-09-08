'use client'

import * as React from "react"
import { useState } from "react"
import { ConfiguradorSimulado } from "@/components/simulado/ConfiguradorSimulado"
import { SimuladoInterativo } from "@/components/simulado/SimuladoInterativo"
import { PlanejamentoCronograma } from "@/components/simulado/PlanejamentoCronograma"
import { ConfigSimulado, ResultadoSimulado } from "@/types/simulado"

export default function SimuladoPage() {
  const [configuracao, setConfiguracao] = useState<ConfigSimulado | null>(null)
  const [resultado, setResultado] = useState<ResultadoSimulado | null>(null)
  const [mostrarPlanejamento, setMostrarPlanejamento] = useState(false)

  const handleIniciarSimulado = (config: ConfigSimulado) => {
    setConfiguracao(config)
    setResultado(null)
    setMostrarPlanejamento(false)
  }

  const handleFinalizarSimulado = (res: ResultadoSimulado) => {
    setResultado(res)
    setMostrarPlanejamento(false)
  }

  const handleVoltarConfigurador = () => {
    setConfiguracao(null)
    setResultado(null)
    setMostrarPlanejamento(false)
  }

  const handleAbrirPlanejamento = () => {
    setMostrarPlanejamento(true)
  }

  const handleVoltarResultado = () => {
    setMostrarPlanejamento(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simulado MindTech
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Teste seus conhecimentos com questões reais de concursos. 
          Configure seu simulado e acompanhe seu progresso.
        </p>
      </div>

      {/* Conteúdo */}
      {!configuracao ? (
        <ConfiguradorSimulado onStart={handleIniciarSimulado} />
      ) : mostrarPlanejamento && resultado ? (
        <PlanejamentoCronograma 
          resultado={resultado}
          onVoltarSimulado={handleVoltarConfigurador}
        />
      ) : resultado ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Botão voltar */}
          <div className="flex justify-start">
            <button
              onClick={handleVoltarConfigurador}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              ← Voltar às configurações
            </button>
          </div>

          {/* Resultado do Simulado */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8">Resultado do Simulado</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Resultado Geral</h3>
                <div className="text-4xl font-bold text-center text-blue-600 mb-2">
                  {resultado.percentualGeral.toFixed(1)}%
                </div>
                <p className="text-center text-blue-700">
                  {resultado.acertos} acertos de {resultado.totalQuestoes} questões
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-800">Estatísticas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Tempo Total:</span>
                    <span className="font-medium text-green-800">
                      {Math.floor(resultado.tempoTotal / 60)}min {resultado.tempoTotal % 60}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Média por Questão:</span>
                    <span className="font-medium text-green-800">
                      {Math.floor(resultado.tempoTotal / resultado.totalQuestoes)}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4">Resultado por Disciplina</h3>
              <div className="space-y-3">
                {resultado.resultadosPorDisciplina.map((disc) => (
                  <div key={disc.disciplina} className="flex items-center justify-between p-3 bg-white border rounded">
                    <span className="font-medium">{disc.disciplina}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {disc.acertos}/{disc.total}
                      </span>
                      <span className={`font-semibold px-2 py-1 rounded ${
                        disc.percentual >= 70 ? 'text-green-600 bg-green-100' :
                        disc.percentual >= 50 ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {disc.percentual.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleVoltarConfigurador}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Fazer Novo Simulado
              </button>
              <button 
                onClick={handleAbrirPlanejamento}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                📅 Criar Cronograma de Estudos
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Botão voltar */}
          <div className="flex justify-start">
            <button
              onClick={handleVoltarConfigurador}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              ← Voltar às configurações
            </button>
          </div>
          
          {/* Simulado */}
          <SimuladoInterativo
            config={configuracao}
            onFinished={handleFinalizarSimulado}
          />
        </div>
      )}
    </div>
  )
}
