'use client'

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlanSettings } from "@/types"
import { disciplines, templates } from "@/lib/seed"
import { useGenerateSchedule } from "@/hooks/useDisciplines"
import { Calendar, Clock, Target, Wand2, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addWeeks } from "date-fns"
import { ptBR } from "date-fns/locale"

const planSchema = z.object({
  weeklyHours: z.number().min(5).max(70),
  examDate: z.string().optional(),
  template: z.enum(['Intensivo', 'Equilíbrio', 'Revisão']).optional(),
  disciplines: z.array(z.object({
    disciplineId: z.string(),
    mastery: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
  })).min(1)
})

interface PlanWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlanWizard({ open, onOpenChange }: PlanWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [previewData, setPreviewData] = React.useState<any>(null)
  const generateSchedule = useGenerateSchedule()
  
  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      weeklyHours: 25,
      examDate: format(addWeeks(new Date(), 12), 'yyyy-MM-dd'),
      template: 'Equilíbrio',
      disciplines: []
    }
  })
  
  const watchedValues = form.watch()
  const totalSteps = 4
  
  const handleNext = async () => {
    if (currentStep === totalSteps - 1) {
      // Gerar preview
      const values = form.getValues()
      try {
        const result = await generateSchedule.mutateAsync(values)
        setPreviewData(result)
      } catch (error) {
        console.error('Error generating preview:', error)
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSubmit = () => {
    onOpenChange(false)
    setCurrentStep(1)
    setPreviewData(null)
  }
  
  const handleDisciplineToggle = (disciplineId: string, checked: boolean) => {
    const currentDisciplines = form.getValues('disciplines')
    
    if (checked) {
      form.setValue('disciplines', [
        ...currentDisciplines,
        { disciplineId, mastery: 3 }
      ])
    } else {
      form.setValue('disciplines', 
        currentDisciplines.filter(d => d.disciplineId !== disciplineId)
      )
    }
  }
  
  const handleMasteryChange = (disciplineId: string, mastery: number) => {
    const currentDisciplines = form.getValues('disciplines')
    const updated = currentDisciplines.map(d => 
      d.disciplineId === disciplineId ? { ...d, mastery: mastery as 1 | 2 | 3 | 4 | 5 } : d
    )
    form.setValue('disciplines', updated)
  }
  
  const selectedDisciplines = form.watch('disciplines')
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Clock className="h-12 w-12 mx-auto text-red-500" />
              <h3 className="text-xl font-semibold">Configuração Básica</h3>
              <p className="text-muted-foreground">
                Defina sua disponibilidade semanal e data da prova
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="weeklyHours">Horas semanais disponíveis</Label>
                <Controller
                  name="weeklyHours"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="5"
                      max="70"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Entre 5 e 70 horas por semana
                </p>
              </div>
              
              <div>
                <Label htmlFor="examDate">Data da prova (opcional)</Label>
                <Controller
                  name="examDate"
                  control={form.control}
                  render={({ field }) => (
                    <Input {...field} type="date" />
                  )}
                />
              </div>
            </div>
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 mx-auto text-red-500" />
              <h3 className="text-xl font-semibold">Escolha um Template</h3>
              <p className="text-muted-foreground">
                Selecione o estilo de cronograma que melhor se adequa ao seu perfil
              </p>
            </div>
            
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    watchedValues.template === template.name ? 'ring-2 ring-red-500' : ''
                  }`}
                  onClick={() => form.setValue('template', template.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.weeklyHours}h/semana
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(template.studyToReviewRatio * 100)}% estudo
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 mx-auto text-red-500" />
              <h3 className="text-xl font-semibold">Selecione as Disciplinas</h3>
              <p className="text-muted-foreground">
                Escolha as matérias e avalie seu nível de domínio (1-5)
              </p>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {disciplines.map((discipline) => {
                const isSelected = selectedDisciplines.some(d => d.disciplineId === discipline.id)
                const selectedDiscipline = selectedDisciplines.find(d => d.disciplineId === discipline.id)
                
                return (
                  <Card key={discipline.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked: boolean) => 
                            handleDisciplineToggle(discipline.id, checked)
                          }
                        />
                        <div>
                          <h4 className="font-medium">{discipline.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {discipline.board} • {discipline.level}
                          </p>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Domínio:</Label>
                          <Select
                            value={selectedDiscipline?.mastery.toString()}
                            onValueChange={(value) => 
                              handleMasteryChange(discipline.id, Number(value))
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map(level => (
                                <SelectItem key={level} value={level.toString()}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Wand2 className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-xl font-semibold">Preview do Cronograma</h3>
              <p className="text-muted-foreground">
                Seu cronograma personalizado foi gerado com sucesso!
              </p>
            </div>
            
            {previewData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Blocos totais:</strong> {previewData.summary?.totalBlocks || 0}
                  </div>
                  <div>
                    <strong>Média semanal:</strong> {previewData.summary?.weeklyAverage || 0}
                  </div>
                  <div>
                    <strong>Blocos de estudo:</strong> {previewData.summary?.studyBlocks || 0}
                  </div>
                  <div>
                    <strong>Blocos de revisão:</strong> {previewData.summary?.reviewBlocks || 0}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Disciplinas selecionadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDisciplines.map(d => {
                      const discipline = disciplines.find(disc => disc.id === d.disciplineId)
                      return (
                        <Badge key={d.disciplineId} variant="secondary">
                          {discipline?.name} (Domínio: {d.mastery}/5)
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Assistente de Planejamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Etapa {currentStep} de {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} />
          </div>
          
          {/* Step Content */}
          {renderStep()}
          
          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <Button
              onClick={currentStep === totalSteps ? handleSubmit : handleNext}
              disabled={generateSchedule.isPending}
            >
              {generateSchedule.isPending ? (
                'Gerando...'
              ) : currentStep === totalSteps ? (
                'Finalizar'
              ) : (
                <>
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
