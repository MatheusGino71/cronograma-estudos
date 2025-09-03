import { NextRequest, NextResponse } from 'next/server';
import { PlanSettings, StudyBlock } from '@/types';
import { addDays, addWeeks, formatISO, parseISO } from 'date-fns';
import { disciplines, defaultTimeSlots } from '@/lib/seed';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PlanSettings;
    const blocks: StudyBlock[] = [];
    
    // Validações básicas
    if (!body.weeklyHours || body.weeklyHours <= 0) {
      return NextResponse.json(
        { error: 'Weekly hours must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (!body.disciplines || body.disciplines.length === 0) {
      return NextResponse.json(
        { error: 'At least one discipline is required' },
        { status: 400 }
      );
    }
    
    const startDate = new Date();
    const examDate = body.examDate ? parseISO(body.examDate) : addWeeks(startDate, 12);
    const totalWeeks = Math.ceil((examDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    // Calcular distribuição de tempo por disciplina baseada no nível de domínio
    const totalMastery = body.disciplines.reduce((sum, d) => sum + (6 - d.mastery), 0);
    const sessionsPerWeek = Math.floor(body.weeklyHours / 1.5); // Assumindo sessões de 1.5h em média
    
    let blockId = 1;
    
    // Gerar blocos para cada semana
    for (let week = 0; week < totalWeeks; week++) {
      const weekStart = addWeeks(startDate, week);
      let dailySlotIndex = 0;
      let dailyBlocks = 0;
      const maxBlocksPerDay = Math.ceil(sessionsPerWeek / 7);
      
      body.disciplines.forEach((disciplineConfig, disciplineIndex) => {
        const discipline = disciplines.find(d => d.id === disciplineConfig.disciplineId);
        if (!discipline) return;
        
        // Calcular número de blocos para esta disciplina nesta semana
        const masteryWeight = 6 - disciplineConfig.mastery;
        const disciplineRatio = masteryWeight / totalMastery;
        const blocksForDiscipline = Math.max(1, Math.floor(sessionsPerWeek * disciplineRatio));
        
        // Gerar blocos de estudo para a disciplina
        for (let blockCount = 0; blockCount < blocksForDiscipline; blockCount++) {
          const dayOffset = Math.floor(dailyBlocks / maxBlocksPerDay);
          const blockDate = addDays(weekStart, dayOffset % 7);
          const timeSlot = defaultTimeSlots[dailySlotIndex % defaultTimeSlots.length];
          
          // Bloco principal de estudo
          blocks.push({
            id: `${blockId++}`,
            disciplineId: discipline.id,
            title: `${discipline.name} - Estudo`,
            date: formatISO(blockDate, { representation: 'date' }),
            start: timeSlot.start,
            end: timeSlot.end,
            type: 'Estudo',
            pomodoros: 2,
            completed: false
          });
          
          // Aplicar técnica de espaçamento (revisões 1-3-7 dias após)
          if (week > 0) { // Só criar revisões após a primeira semana
            [1, 3, 7].forEach((revisionDay) => {
              const revisionDate = addDays(blockDate, revisionDay);
              if (revisionDate <= examDate) {
                const revisionTimeSlot = defaultTimeSlots[(dailySlotIndex + revisionDay) % defaultTimeSlots.length];
                
                blocks.push({
                  id: `${blockId++}`,
                  disciplineId: discipline.id,
                  title: `${discipline.name} - Revisão (${revisionDay}d)`,
                  date: formatISO(revisionDate, { representation: 'date' }),
                  start: revisionTimeSlot.start,
                  end: addMinutes(revisionTimeSlot.start, 25), // Revisões mais curtas
                  type: 'Revisão',
                  pomodoros: 1,
                  completed: false
                });
              }
            });
          }
          
          dailyBlocks++;
          dailySlotIndex++;
        }
        
        // Adicionar simulados baseados no template
        const simulationFrequency = getSimulationFrequency(body.template);
        if (week % simulationFrequency === 0 && week > 1) {
          const simulationDate = addDays(weekStart, 6); // Sábados
          const timeSlot = defaultTimeSlots[0]; // Manhã
          
          blocks.push({
            id: `${blockId++}`,
            disciplineId: discipline.id,
            title: `${discipline.name} - Simulado`,
            date: formatISO(simulationDate, { representation: 'date' }),
            start: timeSlot.start,
            end: addMinutes(timeSlot.start, 90), // Simulados mais longos
            type: 'Simulado',
            pomodoros: 3,
            completed: false
          });
        }
      });
    }
    
    return NextResponse.json({
      blocks: blocks.slice(0, 100), // Limitar para evitar sobrecarga
      summary: {
        totalBlocks: blocks.length,
        weeklyAverage: Math.round(blocks.length / totalWeeks),
        studyBlocks: blocks.filter(b => b.type === 'Estudo').length,
        reviewBlocks: blocks.filter(b => b.type === 'Revisão').length,
        simulationBlocks: blocks.filter(b => b.type === 'Simulado').length
      }
    });
  } catch (error) {
    console.error('Error generating schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function addMinutes(timeStr: string, minutes: number): string {
  const [hours, mins] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

function getSimulationFrequency(template?: string): number {
  switch (template) {
    case 'Intensivo':
      return 1; // Toda semana
    case 'Equilíbrio':
      return 2; // A cada 2 semanas
    case 'Revisão':
      return 3; // A cada 3 semanas
    default:
      return 2;
  }
}
