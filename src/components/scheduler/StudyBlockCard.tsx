import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StudyBlock } from "@/types"
import { Clock, BookOpen, RotateCcw, FileText, Play, Pause, Check } from "lucide-react"
import { useScheduleStore } from "@/store/schedule"

interface StudyBlockCardProps {
  block: StudyBlock
  className?: string
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
}

const typeIcons = {
  'Estudo': BookOpen,
  'Revisão': RotateCcw,
  'Simulado': FileText
}

const typeColors = {
  'Estudo': 'bg-red-500',
  'Revisão': 'bg-green-500', 
  'Simulado': 'bg-purple-500'
}

export function StudyBlockCard({ 
  block, 
  className, 
  draggable = false,
  onDragStart,
  onDragEnd 
}: StudyBlockCardProps) {
  const { toggle, remove } = useScheduleStore()
  const [isPlaying, setIsPlaying] = React.useState(false)
  
  const Icon = typeIcons[block.type]
  
  const handleToggleComplete = () => {
    toggle(block.id)
  }
  
  const handleStartStudy = () => {
    setIsPlaying(!isPlaying)
    // Aqui poderia integrar com um timer Pomodoro
  }
  
  const duration = React.useMemo(() => {
    const start = new Date(`2000-01-01T${block.start}`)
    const end = new Date(`2000-01-01T${block.end}`)
    const minutes = (end.getTime() - start.getTime()) / (1000 * 60)
    return minutes
  }, [block.start, block.end])

  return (
    <Card 
      className={cn(
        "relative cursor-pointer transition-all hover:shadow-md",
        block.completed && "opacity-60",
        draggable && "cursor-move",
        className
      )}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className={cn("absolute left-0 top-0 h-full w-1", typeColors[block.type])} />
      
      <CardHeader className="pb-1 px-2 pt-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            <CardTitle className="text-xs font-medium leading-tight">
              {block.title.split(' - ')[0]} {/* Só o nome da disciplina */}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartStudy}
              className="h-4 w-4 p-0"
            >
              {isPlaying ? (
                <Pause className="h-2 w-2" />
              ) : (
                <Play className="h-2 w-2" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleComplete}
              className="h-4 w-4 p-0"
            >
              <Check className={cn(
                "h-2 w-2",
                block.completed && "text-green-600"
              )} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-2 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-2 w-2" />
              <span className="text-xs">{block.start}-{block.end}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-xs">{duration}min</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs py-0 px-1 h-4">
              {block.type}
            </Badge>
            
            {block.pomodoros && (
              <div className="text-xs text-muted-foreground">
                {block.pomodoros}🍅
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
