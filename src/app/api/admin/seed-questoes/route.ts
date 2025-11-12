import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore'

export async function POST() {
  try {
    console.log('🌱 Iniciando seed de questões...')
    
    const questoesRef = collection(db, 'questoes')
    const snapshot = await getDocs(questoesRef)
    
    if (snapshot.size > 0) {
      return NextResponse.json({
        success: false,
        message: `Já existem ${snapshot.size} questões no banco. Use /admin/migrar-questoes para atualizar.`,
        total: snapshot.size
      })
    }
    
    // Questões de exemplo para todas as disciplinas
    const questoesExemplo = [
      {
        id: 1,
        disciplina: 'Direito Civil',
        area: 'Civil',
        enunciado: 'Sobre a capacidade civil das pessoas naturais, é correto afirmar que:',
        alternativas: [
          { letra: 'A', texto: 'Os absolutamente incapazes são representados', correta: true },
          { letra: 'B', texto: 'Os relativamente incapazes são representados', correta: false },
          { letra: 'C', texto: 'A maioridade civil é atingida aos 21 anos', correta: false },
          { letra: 'D', texto: 'A emancipação só ocorre por decisão judicial', correta: false }
        ]
      },
      {
        id: 2,
        disciplina: 'Direito Penal',
        area: 'Penal',
        enunciado: 'Considera-se crime consumado quando:',
        alternativas: [
          { letra: 'A', texto: 'Se reúnem todos os elementos de sua definição legal', correta: true },
          { letra: 'B', texto: 'Inicia-se a execução', correta: false },
          { letra: 'C', texto: 'Há apenas a cogitação', correta: false },
          { letra: 'D', texto: 'Ocorre a tentativa', correta: false }
        ]
      },
      {
        id: 3,
        disciplina: 'Direito Constitucional',
        area: 'Constitucional',
        enunciado: 'São direitos sociais constitucionalmente garantidos:',
        alternativas: [
          { letra: 'A', texto: 'Educação, saúde e trabalho', correta: true },
          { letra: 'B', texto: 'Apenas educação e saúde', correta: false },
          { letra: 'C', texto: 'Apenas trabalho e moradia', correta: false },
          { letra: 'D', texto: 'Nenhuma das anteriores', correta: false }
        ]
      },
      {
        id: 4,
        disciplina: 'Direito Administrativo',
        area: 'Administrativo',
        enunciado: 'São princípios da Administração Pública, EXCETO:',
        alternativas: [
          { letra: 'A', texto: 'Legalidade', correta: false },
          { letra: 'B', texto: 'Impessoalidade', correta: false },
          { letra: 'C', texto: 'Moralidade', correta: false },
          { letra: 'D', texto: 'Discricionariedade absoluta', correta: true }
        ]
      },
      {
        id: 5,
        disciplina: 'Processo Civil',
        area: 'Processo Civil',
        enunciado: 'Sobre a litisconsórcio, é correto afirmar:',
        alternativas: [
          { letra: 'A', texto: 'Pode ser ativo, passivo ou misto', correta: true },
          { letra: 'B', texto: 'Só pode ser ativo', correta: false },
          { letra: 'C', texto: 'Só pode ser passivo', correta: false },
          { letra: 'D', texto: 'Não existe no processo civil', correta: false }
        ]
      },
      {
        id: 6,
        disciplina: 'Processo Penal',
        area: 'Processo Penal',
        enunciado: 'A denúncia é a peça inicial da ação penal pública oferecida por:',
        alternativas: [
          { letra: 'A', texto: 'Ministério Público', correta: true },
          { letra: 'B', texto: 'Vítima', correta: false },
          { letra: 'C', texto: 'Juiz', correta: false },
          { letra: 'D', texto: 'Delegado', correta: false }
        ]
      },
      {
        id: 7,
        disciplina: 'Direito Tributário',
        area: 'Tributário',
        enunciado: 'São tributos de competência da União:',
        alternativas: [
          { letra: 'A', texto: 'IR, IPI e IOF', correta: true },
          { letra: 'B', texto: 'ICMS e ISS', correta: false },
          { letra: 'C', texto: 'IPTU e ITBI', correta: false },
          { letra: 'D', texto: 'IPVA e ITCMD', correta: false }
        ]
      },
      {
        id: 8,
        disciplina: 'Direito do Trabalho',
        area: 'Trabalho',
        enunciado: 'A jornada normal de trabalho não excederá:',
        alternativas: [
          { letra: 'A', texto: '8 horas diárias e 44 horas semanais', correta: true },
          { letra: 'B', texto: '10 horas diárias e 50 horas semanais', correta: false },
          { letra: 'C', texto: '6 horas diárias e 36 horas semanais', correta: false },
          { letra: 'D', texto: '12 horas diárias e 60 horas semanais', correta: false }
        ]
      },
      {
        id: 9,
        disciplina: 'Direito Empresarial',
        area: 'Empresarial',
        enunciado: 'Considera-se empresário quem exerce profissionalmente atividade:',
        alternativas: [
          { letra: 'A', texto: 'Econômica organizada para a produção ou circulação de bens ou serviços', correta: true },
          { letra: 'B', texto: 'Apenas intelectual', correta: false },
          { letra: 'C', texto: 'Exclusivamente científica', correta: false },
          { letra: 'D', texto: 'Somente artística', correta: false }
        ]
      },
      {
        id: 10,
        disciplina: 'Ética Profissional',
        area: 'Ética Profissional',
        enunciado: 'É vedado ao advogado, EXCETO:',
        alternativas: [
          { letra: 'A', texto: 'Recusar-se a depor como testemunha em processo no qual funcionou como advogado', correta: true },
          { letra: 'B', texto: 'Advogar contra literal disposição de lei', correta: false },
          { letra: 'C', texto: 'Aceitar procuração sem poderes especiais', correta: false },
          { letra: 'D', texto: 'Exercer a advocacia antes da inscrição na OAB', correta: false }
        ]
      }
    ]
    
    // Salva no Firebase
    const batch = writeBatch(db)
    
    questoesExemplo.forEach((questao) => {
      const docRef = doc(questoesRef)
      batch.set(docRef, {
        ...questao,
        criadoEm: new Date(),
        ativo: true
      })
    })
    
    await batch.commit()
    
    console.log(`✅ ${questoesExemplo.length} questões de exemplo adicionadas!`)
    
    return NextResponse.json({
      success: true,
      message: `${questoesExemplo.length} questões de exemplo foram adicionadas ao banco de dados!`,
      total: questoesExemplo.length,
      disciplinas: [...new Set(questoesExemplo.map(q => q.disciplina))]
    })
    
  } catch (error) {
    console.error('❌ Erro ao popular questões:', error)
    
    return NextResponse.json({
      success: false,
      message: `Erro: ${(error as Error).message}`
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const questoesRef = collection(db, 'questoes')
    const snapshot = await getDocs(questoesRef)
    
    return NextResponse.json({
      total: snapshot.size,
      message: snapshot.size === 0 
        ? 'Banco vazio. Use POST /api/admin/seed-questoes para adicionar questões de exemplo'
        : `${snapshot.size} questões disponíveis no banco`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Erro: ${(error as Error).message}`
    }, { status: 500 })
  }
}
