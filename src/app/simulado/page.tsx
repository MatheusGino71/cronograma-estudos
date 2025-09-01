'use client'

import * as React from "react"
import { useState } from "react"
import { ConfiguradorSimulado } from "@/components/simulado/ConfiguradorSimulado"
import { SimuladoInterativo } from "@/components/simulado/SimuladoInterativo"
import { ConfigSimulado } from "@/types/simulado"

export default function SimuladoPage() {
  const [configuracao, setConfiguracao] = useState<ConfigSimulado | null>(null)
  const [resultado, setResultado] = useState<any>(null)

  const handleIniciarSimulado = (config: ConfigSimulado) => {
    setConfiguracao(config)
    setResultado(null)
  }

  const handleFinalizarSimulado = (res: any) => {
    setResultado(res)
  }

  const handleVoltarConfigurador = () => {
    setConfiguracao(null)
    setResultado(null)
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
