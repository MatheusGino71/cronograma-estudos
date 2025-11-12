'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Discipline } from "@/types"
import { useDisciplineStore } from "@/store/discipline"
import { useAddDisciplineToSchedule } from "@/hooks/useDisciplines"
import { Heart, Plus, Eye, Clock, BookOpen, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface DisciplineCardProps {
  discipline: Discipline
  progress?: number
  className?: string
  onViewDetails?: (discipline: Discipline) => void
}

const levelColors = {
  'Iniciante': 'bg-green-100 text-green-800 border-green-200',
  'Intermediário': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Avançado': 'bg-red-100 text-red-800 border-red-200'
}

const levelIcons = {
  'Iniciante': '🌱',
  'Intermediário': '🌿', 
  'Avançado': '🌳'
}

export function DisciplineCard({ 
  discipline, 
  progress = 0, 
  className,
  onViewDetails 
}: DisciplineCardProps) {
  const { 
    isFavorite, 
    addToFavorites, 
    removeFromFavorites,
    addToComparison,
    canAddToComparison,
    comparison
  } = useDisciplineStore()
  
  const addToSchedule = useAddDisciplineToSchedule()
  const isFav = isFavorite(discipline.id)
  const isInComparison = comparison.includes(discipline.id)
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFav) {
      removeFromFavorites(discipline.id)
    } else {
      addToFavorites(discipline.id)
    }
  }
  
  const handleAddToComparison = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isInComparison && canAddToComparison()) {
      addToComparison(discipline.id)
    }
  }
  
  const handleQuickAdd = async (type: 'Estudo' | 'Revisão' | 'Simulado') => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const timeSlots = {
      'Estudo': { start: '19:00', end: '20:30' },
      'Revisão': { start: '18:00', end: '18:25' },
      'Simulado': { start: '14:00', end: '15:30' }
    }
    
    try {
      await addToSchedule.mutateAsync({
        disciplineId: discipline.id,
        type,
        date: tomorrow.toISOString().split('T')[0],
        time: timeSlots[type]
      })
    } catch (error) {
      console.error('Error adding to schedule:', error)
    }
  }

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">
              {discipline.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {discipline.board}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleToggleFavorite}
            >
              <Heart className={cn(
                "h-4 w-4 transition-colors",
                isFav ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
              )} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleAddToComparison}
              disabled={isInComparison || !canAddToComparison()}
            >
              <Plus className={cn(
                "h-4 w-4",
                isInComparison ? "text-red-500" : "text-muted-foreground"
              )} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level and Duration */}
        <div className="flex items-center justify-between">
          <Badge className={cn("text-xs font-medium", levelColors[discipline.level])}>
            {levelIcons[discipline.level]} {discipline.level}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {Math.round(discipline.durationMin / 60)}h
          </div>
        </div>
        
        {/* Progress */}
        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {discipline.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
              {tag}
            </Badge>
          ))}
          {discipline.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{discipline.tags.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Materials Summary */}
        {discipline.materials && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {discipline.materials.exercises || 0} questões
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {discipline.materials.pdfs || 0} materiais
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={() => onViewDetails?.(discipline)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Detalhes
          </Button>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              className="text-xs h-8 px-2"
              onClick={() => handleQuickAdd('Estudo')}
              disabled={addToSchedule.isPending}
            >
              25min
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-8 px-2"
              onClick={() => handleQuickAdd('Revisão')}
              disabled={addToSchedule.isPending}
            >
              Rev
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              className="text-xs h-8 px-2"
              onClick={() => handleQuickAdd('Simulado')}
              disabled={addToSchedule.isPending}
            >
              Sim
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
