import { useState } from 'react'

export interface NotebookIAResponse {
  success: boolean
  data?: unknown
  error?: string
}

export function useNotebookIA() {
  const [isLoading, setIsLoading] = useState(false)

  const analyzeStudyContent = async (content: string, disciplina?: string): Promise<NotebookIAResponse> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/notebook-ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'analyze',
          content,
          disciplina
        })
      })

      const result = await response.json()
      return result
    } catch (_error) {
      console.error('Erro na análise:', _error)
      return { success: false, error: 'Erro ao analisar conteúdo' }
    } finally {
      setIsLoading(false)
    }
  }

  const generateMindMap = async (content: string, theme: string, disciplina?: string): Promise<NotebookIAResponse> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/notebook-ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'mindmap',
          content,
          style: theme,
          disciplina
        })
      })

      const result = await response.json()
      return result
    } catch {
      return { success: false, error: 'Erro ao gerar mapa mental' }
    } finally {
      setIsLoading(false)
    }
  }

  const generatePodcast = async (content: string, style: string, voices: string, disciplina?: string): Promise<NotebookIAResponse> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/notebook-ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'podcast',
          content,
          style,
          voices,
          disciplina
        })
      })

      const result = await response.json()
      return result
    } catch {
      return { success: false, error: 'Erro ao gerar podcast' }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    analyzeStudyContent,
    generateMindMap,
    generatePodcast
  }
}