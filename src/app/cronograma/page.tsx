'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SchedulerCalendar } from "@/components/scheduler/SchedulerCalendar"
import { AdherenceWidget } from "@/components/scheduler/AdherenceWidget"
import { PlanWizard } from "@/components/scheduler/PlanWizard"
import { useNotifications } from "@/hooks/useSchedule"
import { Wand2, Bell, BellOff, Calendar, Target } from "lucide-react"

export default function CronogramaPage() {
  const [isWizardOpen, setIsWizardOpen] = React.useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false)
  const { requestPermission, scheduleTodayNotifications } = useNotifications()
  
  React.useEffect(() => {
    // Verificar se as notificações estão habilitadas
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }, [])
  
  const handleEnableNotifications = async () => {
    const granted = await requestPermission()
    setNotificationsEnabled(granted)
    
    if (granted) {
      scheduleTodayNotifications()
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent">
              Cronograma de Estudos
            </span>
          </h1>
          <p className="text-muted-foreground">
            Organize seus estudos de forma inteligente e acompanhe seu progresso
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleEnableNotifications}
            disabled={notificationsEnabled}
            className={notificationsEnabled 
              ? "bg-[#FF3347] hover:bg-[#D92637] text-white font-semibold shadow-md disabled:opacity-50" 
              : "bg-[#3D5AFE] hover:bg-[#2648C7] text-white font-semibold shadow-md"}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Notificações ativas
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Ativar notificações
              </>
            )}
          </Button>
          
          <Button onClick={() => setIsWizardOpen(true)} className="bg-[#FF3347] hover:bg-[#D92637] text-white font-semibold shadow-md">
            <Wand2 className="h-4 w-4 mr-2" />
            Assistente de Planejamento
          </Button>
        </div>
      </div>
      
      {/* Métricas de Aderência */}
      <AdherenceWidget />
      
      {/* Calendário Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seu Cronograma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SchedulerCalendar />
        </CardContent>
      </Card>
      
      {/* Cards de Ação Rápida */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-all border-2 border-[#FF3347]/20 hover:border-[#FF3347]/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-[#FF3347]">
              <Target className="h-5 w-5" />
              Templates Prontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Use modelos pré-configurados: Intensivo, Equilíbrio ou Revisão
            </p>
            <Button size="sm" className="w-full bg-[#FF3347] hover:bg-[#D92637] text-white font-semibold">
              Explorar Templates
            </Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all border-2 border-[#3D5AFE]/20 hover:border-[#3D5AFE]/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-[#3D5AFE]">
              <Calendar className="h-5 w-5" />
              Revisão Automática
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Sistema de espaçamento 1-3-7 dias para fixação do conteúdo
            </p>
            <Button size="sm" className="w-full bg-[#3D5AFE] hover:bg-[#2648C7] text-white font-semibold">
              Ver Revisões Pendentes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all border-2 border-[#FF3347]/20 hover:border-[#FF3347]/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-[#FF3347]">
              <Bell className="h-5 w-5" />
              Lembretes Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Notificações personalizadas para início de cada sessão de estudo
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleEnableNotifications}
              disabled={notificationsEnabled}
            >
              {notificationsEnabled ? 'Configurar' : 'Ativar'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Wizard de Planejamento */}
      <PlanWizard 
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
      />
    </div>
  )
}
