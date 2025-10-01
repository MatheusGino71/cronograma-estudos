'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Questao, Alternativa, RespostaUsuario } from '@/types/simulado';
import { formatarTempo } from '@/lib/simulado-utils';

interface QuestaoCardProps {
  questao: Questao;
  numeroQuestao: number;
  totalQuestoes: number;
  onResposta: (questaoId: number, alternativaSelecionada: string, correta: boolean, tempo: number) => void;
  mostrarGabarito?: boolean;
  respostaAnterior?: string;
}

export function QuestaoCard({
  questao,
  numeroQuestao,
  totalQuestoes,
  onResposta,
  mostrarGabarito = false,
  respostaAnterior
}: QuestaoCardProps) {
  const [alternativaSelecionada, setAlternativaSelecionada] = useState<string | null>(respostaAnterior || null);
  const [respondida, setRespondida] = useState(!!respostaAnterior);
  const [tempoInicio] = useState(Date.now());
  const [tempoResposta, setTempoResposta] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!respondida) {
        setTempoResposta(Math.floor((Date.now() - tempoInicio) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tempoInicio, respondida]);

  const handleAlternativaClick = (alternativa: Alternativa) => {
    if (respondida && !mostrarGabarito) return;

    const tempo = Math.floor((Date.now() - tempoInicio) / 1000);
    setAlternativaSelecionada(alternativa.letra);
    setRespondida(true);
    
    onResposta(questao.id, alternativa.letra, alternativa.correta, tempo);
  };

  const getEstiloAlternativa = (alternativa: Alternativa) => {
    if (!respondida && !mostrarGabarito) {
      return 'bg-gray-50 hover:bg-gray-100 border-gray-200';
    }

    if (mostrarGabarito) {
      if (alternativa.correta) {
        return 'bg-green-100 border-green-500 text-green-800';
      }
      if (alternativaSelecionada === alternativa.letra && !alternativa.correta) {
        return 'bg-red-100 border-red-500 text-red-800';
      }
      return 'bg-gray-50 border-gray-200';
    }

    if (alternativaSelecionada === alternativa.letra) {
      return alternativa.correta
        ? 'bg-green-100 border-green-500 text-green-800'
        : 'bg-red-100 border-red-500 text-red-800';
    }

    return 'bg-gray-50 border-gray-200';
  };

  const alternativaCorreta = questao.alternativas.find(alt => alt.correta);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              Questão {numeroQuestao} de {totalQuestoes}
            </Badge>
            <Badge variant="secondary">
              {questao.disciplina}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatarTempo(tempoResposta)}</span>
            </div>
            {respondida && (
              <div className="flex items-center gap-1">
                {alternativaCorreta?.letra === alternativaSelecionada ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Correta</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Incorreta</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        <Progress value={(numeroQuestao / totalQuestoes) * 100} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div 
          className="text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: questao.enunciado }}
        />

        <div className="space-y-3">
          {questao.alternativas.map((alternativa, index) => (
            <button
              key={`qcard-${questao.id}-alt-${alternativa.letra}-idx-${index}`}
              onClick={() => handleAlternativaClick(alternativa)}
              disabled={respondida && !mostrarGabarito}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-sm',
                getEstiloAlternativa(alternativa),
                respondida && !mostrarGabarito && 'cursor-not-allowed'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="font-semibold text-lg min-w-[2rem]">
                  {alternativa.letra})
                </span>
                <div 
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: alternativa.texto }}
                />
                {mostrarGabarito && alternativa.correta && (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>

        {respondida && !mostrarGabarito && (
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {alternativaCorreta?.letra === alternativaSelecionada ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Resposta correta!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">
                      Resposta incorreta. A correta é: {alternativaCorreta?.letra}
                    </span>
                  </>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Tempo: {formatarTempo(tempoResposta)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
