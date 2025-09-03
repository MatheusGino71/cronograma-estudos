import { NextRequest, NextResponse } from 'next/server';
import { askGemini, generateStudyPlan, explainLegalConcept, generateQuestions } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'question':
        result = await askGemini(data.question, data.context);
        break;
        
      case 'study-plan':
        result = await generateStudyPlan(data);
        break;
        
      case 'explain-concept':
        result = await explainLegalConcept(data.concept, data.subject);
        break;
        
      case 'generate-questions':
        result = await generateQuestions(data.subject, data.difficulty, data.quantity);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Tipo de requisição não reconhecido' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: result.text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API da IA:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
