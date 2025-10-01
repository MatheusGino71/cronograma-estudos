import { Questao } from '@/types/simulado';

/**
 * Remove tags HTML e limpa o texto
 */
function cleanHtmlText(html: string): string {
  if (typeof window === 'undefined') {
    // Se estivermos no servidor, fazer uma limpeza básica
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // No cliente, usar DOM
  const temp = document.createElement('div');
  temp.innerHTML = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  
  let text = temp.textContent || temp.innerText || '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Parse de linha CSV mais robusto
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  values.push(current);
  return values;
}

export function parseCSVToQuestions(csvContent: string): Questao[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  console.log(`Total de linhas no CSV: ${lines.length}`);
  
  // Mapa para agrupar questões pelo ID
  const questoesMap = new Map<number, {
    id: number;
    disciplina: string;
    enunciado: string;
    alternativas: Array<{ letra: string; texto: string; correta: boolean }>;
  }>();

  // Processar cada linha do CSV (pular cabeçalho)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    try {
      const values = parseCSVLine(line);
      
      if (values.length < 7) {
        console.warn(`Linha ${i + 1} tem menos de 7 colunas:`, values.length);
        continue;
      }
      
      const objectQuestionId = parseInt(values[1]); // ObjectQuestionId é a segunda coluna
      const area = values[2]?.trim() || ''; // Area
      const questionStem = values[3]?.trim() || ''; // QuestionStem  
      const letter = values[4]?.trim() || ''; // Letter
      const description = values[5]?.trim() || ''; // Description
      const correct = values[6]?.trim() === '1'; // Correct

      // Validar dados essenciais
      if (!objectQuestionId || isNaN(objectQuestionId)) {
        console.warn(`Linha ${i + 1}: ID de questão inválido:`, values[1]);
        continue;
      }
      
      if (!letter || !description) {
        console.warn(`Linha ${i + 1}: Alternativa incompleta:`, { letter, description: description.substring(0, 50) });
        continue;
      }

        // Se a questão não existe no mapa, criar
      if (!questoesMap.has(objectQuestionId)) {
        questoesMap.set(objectQuestionId, {
          id: objectQuestionId,
          disciplina: area,
          enunciado: cleanHtmlText(questionStem),
          alternativas: []
        });
      }

      // Adicionar a alternativa
      const questao = questoesMap.get(objectQuestionId)!;
      questao.alternativas.push({
        letra: letter,
        texto: cleanHtmlText(description),
        correta: correct
      });
      
    } catch (error) {
      console.error(`Erro ao processar linha ${i + 1}:`, error);
      continue;
    }
  }

  console.log(`Total de questões processadas: ${questoesMap.size}`);

  // Converter para array e ordenar alternativas
  const questoes: Questao[] = Array.from(questoesMap.values()).map(q => ({
    ...q,
    alternativas: q.alternativas.sort((a, b) => a.letra.localeCompare(b.letra))
  }));

  console.log(`Questões finais: ${questoes.length}`);
  questoes.forEach(q => {
    console.log(`Questão ${q.id}: ${q.alternativas.length} alternativas`);
  });

  return questoes;
}

export function agruparPorDisciplina(questoes: Questao[]): Record<string, Questao[]> {
  return questoes.reduce((acc, questao) => {
    if (!acc[questao.disciplina]) {
      acc[questao.disciplina] = [];
    }
    acc[questao.disciplina].push(questao);
    return acc;
  }, {} as Record<string, Questao[]>);
}

export function embaralharQuestoes(questoes: Questao[]): Questao[] {
  const questoesCopy = [...questoes];
  for (let i = questoesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questoesCopy[i], questoesCopy[j]] = [questoesCopy[j], questoesCopy[i]];
  }
  return questoesCopy;
}

export function embaralharAlternativas(questao: Questao): Questao {
  const alternativasEmbaralhadas = [...questao.alternativas];
  for (let i = alternativasEmbaralhadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [alternativasEmbaralhadas[i], alternativasEmbaralhadas[j]] = [alternativasEmbaralhadas[j], alternativasEmbaralhadas[i]];
  }
  
  return {
    ...questao,
    alternativas: alternativasEmbaralhadas
  };
}

export function formatarTempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${minutos.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

export function calcularEstatisticas(respostas: any[], questoes: Questao[]) {
  const acertos = respostas.filter(r => r.correta).length;
  const erros = respostas.filter(r => !r.correta).length;
  
  // Agrupar por disciplina
  const disciplinas = [...new Set(questoes.map(q => q.disciplina))];
  const resultadosPorDisciplina = disciplinas.map(disciplina => {
    const questoesDisciplina = questoes.filter(q => q.disciplina === disciplina);
    const respostasDisciplina = respostas.filter(r => 
      questoesDisciplina.some(q => q.id === r.questaoId)
    );
    
    const acertosDisciplina = respostasDisciplina.filter(r => r.correta).length;
    const totalDisciplina = respostasDisciplina.length;
    
    return {
      disciplina,
      total: totalDisciplina,
      acertos: acertosDisciplina,
      erros: totalDisciplina - acertosDisciplina,
      percentual: totalDisciplina > 0 ? (acertosDisciplina / totalDisciplina) * 100 : 0
    };
  });

  return {
    questoesRespondidas: respostas.length,
    totalQuestoes: questoes.length,
    acertos,
    erros,
    percentualGeral: respostas.length > 0 ? (acertos / respostas.length) * 100 : 0,
    tempoTotal: respostas.reduce((acc, r) => acc + r.tempo, 0),
    resultadosPorDisciplina,
    respostas
  };
}
