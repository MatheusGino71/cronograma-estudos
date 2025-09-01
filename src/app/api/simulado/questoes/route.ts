import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Configurações para export estático
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'Simulado Correto Diagnóstico(Planilha1).csv');
    const csvContent = await readFile(filePath, 'utf-8');
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'public, max-age=86400' // Cache por 24 horas
      }
    });
  } catch (error) {
    console.error('Erro ao ler arquivo CSV:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar questões do simulado' },
      { status: 500 }
    );
  }
}
