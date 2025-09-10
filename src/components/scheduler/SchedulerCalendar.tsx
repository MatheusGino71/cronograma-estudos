'use client'

import * as React from "react"
import { format, startOfWeek, addDays, isSameDay, parseISO, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar, Grid3X3 } from "lucide-react"
import { StudyBlockCard } from "./StudyBlockCard"
import { useScheduleStore } from "@/store/schedule"
import { StudyBlock } from "@/types"

interface SchedulerCalendarProps {
  className?: string
}

export function SchedulerCalendar({ className }: SchedulerCalendarProps) {
  const { 
    blocks, 
    selectedDate, 
    viewMode, 
    setSelectedDate, 
    setViewMode,
    update
  } = useScheduleStore()
  
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [draggedBlock, setDraggedBlock] = React.useState<StudyBlock | null>(null)
  
  const handlePreviousPeriod = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setMonth(currentDate.getMonth() - 1)
      setCurrentDate(newDate)
    }
  }
  
  const handleNextPeriod = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setMonth(currentDate.getMonth() + 1)
      setCurrentDate(newDate)
    }
  }
  
  const handleDragStart = (block: StudyBlock) => (e: React.DragEvent) => {
    setDraggedBlock(block)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragEnd = () => {
    setDraggedBlock(null)
  }
  
  const handleDrop = (date: string) => (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedBlock) {
      const updatedBlock = { ...draggedBlock, date }
      update(updatedBlock)
      setDraggedBlock(null)
    }
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const getDaysToShow = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { locale: ptBR })
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    } else {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      return eachDayOfInterval({ start: monthStart, end: monthEnd })
    }
  }
  
  const getBlocksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return blocks.filter(block => block.date === dateStr)
  }
  
  const days = getDaysToShow()
  const periodTitle = viewMode === 'week' 
    ? `Semana de ${format(days[0], 'dd/MM', { locale: ptBR })} a ${format(days[days.length - 1], 'dd/MM/yyyy', { locale: ptBR })}`
    : format(currentDate, 'MMMM yyyy', { locale: ptBR })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold capitalize">{periodTitle}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Toggle de visualização */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="h-7"
            >
              <Calendar className="h-3 w-3" />
              Semana
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="h-7"
            >
              <Grid3X3 className="h-3 w-3" />
              Mês
            </Button>
          </div>
          
          {/* Navegação */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPeriod}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPeriod}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Grade do calendário */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'
      )}>
        {viewMode === 'week' && (
          // Cabeçalho dos dias da semana
          <>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </>
        )}
        
        {days.map((date) => {
          const dayBlocks = getBlocksForDate(date)
          const isToday = isSameDay(date, new Date())
          const isSelected = selectedDate === format(date, 'yyyy-MM-dd')
          
          return (
            <Card
              key={date.toISOString()}
              className={cn(
                "min-h-[120px] cursor-pointer transition-all hover:shadow-md",
                isToday && "ring-2 ring-red-500",
                isSelected && "bg-accent"
              )}
              onClick={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
              onDrop={handleDrop(format(date, 'yyyy-MM-dd'))}
              onDragOver={handleDragOver}
            >
              <CardHeader className="pb-1 px-2 pt-2">
                <CardTitle className="text-xs font-medium flex items-center justify-between">
                  <span className={cn(
                    viewMode === 'week' ? 'text-lg' : 'text-sm',
                    isToday && 'text-red-600 font-bold'
                  )}>
                    {format(date, viewMode === 'week' ? 'd' : 'd')}
                  </span>
                  {viewMode === 'month' && (
                    <span className="text-xs text-muted-foreground">
                      {format(date, 'EEE', { locale: ptBR })}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0 px-2 pb-2 space-y-1">
                {dayBlocks.map((block) => (
                  <StudyBlockCard
                    key={block.id}
                    block={block}
                    className="text-xs"
                    draggable
                    onDragStart={handleDragStart(block)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
                
                {dayBlocks.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-2 border border-dashed border-gray-200 rounded text-xs">
                    Arraste aqui
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
