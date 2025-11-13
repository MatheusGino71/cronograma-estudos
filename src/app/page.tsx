'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, BookOpen, BarChart3, ArrowRight, Clock, Target, TrendingUp, FileText } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { LoaderIcon } from "lucide-react"

const features = [
  {
    name: 'Cronograma Inteligente',
    description: 'Organize seus estudos com drag & drop e revisões espaçadas baseadas no método 1-3-7.',
    icon: Calendar,
    href: '/cronograma',
    color: 'text-red-600'
  },
  {
    name: 'Catálogo de Disciplinas',
    description: 'Explore, compare e favorite disciplinas. Filtros avançados para encontrar o que precisa.',
    icon: BookOpen,
    href: '/disciplinas',
    color: 'text-green-600'
  },
  {
    name: 'Simulados Interativos',
    description: 'Pratique com questões reais de concursos. Configure por disciplina e acompanhe seu desempenho.',
    icon: FileText,
    href: '/simulado',
    color: 'text-blue-600'
  },
  {
    name: 'Analytics de Progresso',
    description: 'Acompanhe métricas detalhadas, insights automáticos e exporte relatórios em PDF.',
    icon: BarChart3,
    href: '/progresso',
    color: 'text-purple-600'
  }
]

const stats = [
  { name: 'Taxa de Aderência Média', value: '87%', icon: Target },
  { name: 'Tempo de Estudo Diário', value: '4.2h', icon: Clock },
  { name: 'Progresso Semanal', value: '+12%', icon: TrendingUp },
]

export default function Home() {
  const { user, loading } = useAuth()
  
  // Se está carregando, mostra loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    )
  }
  
  // Se está logado, mostra dashboard com vídeo de fundo
  if (user) {
    return (
      <div className="flex flex-col">
        {/* Hero Section para usuários logados com vídeo de fundo */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover video-background-landing"
            >
              <source src="/video-pagina.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Fallback com gradiente profissional */}
            <div className="absolute inset-0 opacity-40 gradient-fallback"></div>
            {/* Overlay moderno com gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center w-full space-y-10">
            {/* Logo OAB NomeNaLista com efeito glow */}
            <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] rounded-full blur-xl opacity-60 group-hover:opacity-90 transition duration-1000 animate-pulse"></div>
                <div className="relative">
                  <Image 
                    src="/logo-nomenalista.png" 
                    alt="OAB NomeNaLista" 
                    width={160}
                    height={160}
                    className="h-32 w-auto drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Bem-vindo de volta,
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <span className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent drop-shadow-2xl">
                  {user.name}
                </span>
                <span className="text-white">! 👋</span>
              </h2>
            </div>
            
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-100 max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 drop-shadow-lg">
              Continue sua jornada rumo à <span className="text-[#3D5AFE] font-bold">aprovação na OAB</span>
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
              <Link href="/cronograma">
                <Button 
                  size="default" 
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#FF3347] to-[#D92637] hover:from-[#D92637] hover:to-[#C01F2D] text-white shadow-xl hover:shadow-[#FF3347]/50 px-6 py-3 font-bold transition-all hover:scale-105"
                >
                  <Calendar className="h-4 w-4" />
                  Acessar Cronograma
                </Button>
              </Link>
              <Link href="/simulado">
                <Button 
                  size="default" 
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#3D5AFE] to-[#2648C7] hover:from-[#2648C7] hover:to-[#1E3BA3] text-white shadow-xl hover:shadow-[#3D5AFE]/50 px-6 py-3 font-bold transition-all hover:scale-105"
                >
                  <FileText className="h-4 w-4" />
                  Iniciar Simulado
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid para usuários logados */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-[#3D5AFE]/5 dark:from-gray-900 dark:to-[#3D5AFE]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center mb-12">
              <span className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent">
                Suas Ferramentas de Estudo
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const iconColor = index % 2 === 0 ? 'text-[#3D5AFE]' : 'text-[#FF3347]'
                const iconBg = index % 2 === 0 ? 'bg-[#3D5AFE]/10' : 'bg-[#FF3347]/10'
                const borderHover = index % 2 === 0 ? 'hover:border-[#3D5AFE]' : 'hover:border-[#FF3347]'
                
                return (
                  <Link key={feature.name} href={feature.href}>
                    <div className={`relative group bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-transparent ${borderHover} shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}>
                      <div>
                        <span className={`inline-flex p-3 rounded-lg ${iconBg}`}>
                          <feature.icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
                        </span>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {feature.name}
                          <span className="absolute inset-0" aria-hidden="true" />
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <span className={`pointer-events-none absolute top-6 right-6 ${iconColor} group-hover:opacity-100 opacity-50 transition-opacity`} aria-hidden="true">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Para usuários não logados, mostra landing page
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover video-background-landing"
          >
            <source src="/video-pagina.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Fallback com gradiente profissional */}
          <div className="absolute inset-0 opacity-40 gradient-fallback"></div>
          {/* Overlay moderno com gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center w-full space-y-10">
          {/* Logo OAB NomeNaLista com efeito glow */}
          <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] rounded-full blur-xl opacity-60 group-hover:opacity-90 transition duration-1000 animate-pulse"></div>
              <div className="relative">
                <Image 
                  src="/logo-nomenalista.png" 
                  alt="OAB NomeNaLista" 
                  width={160}
                  height={160}
                  className="h-32 w-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Organize seus estudos
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <span className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent drop-shadow-2xl">
                com inteligência
              </span>
            </h2>
          </div>
          
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-100 max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 drop-shadow-lg">
            Sistema completo para sua <span className="text-[#3D5AFE] font-bold">aprovação na OAB</span>
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <AuthModal defaultMode="register">
              <Button 
                size="default" 
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#FF3347] to-[#D92637] hover:from-[#D92637] hover:to-[#C01F2D] text-white shadow-xl hover:shadow-[#FF3347]/50 px-6 py-3 font-bold transition-all hover:scale-105"
              >
                Começar Gratuitamente
                <ArrowRight className="h-4 w-4" />
              </Button>
            </AuthModal>
            <AuthModal defaultMode="login">
              <Button 
                size="default" 
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#3D5AFE] to-[#2648C7] hover:from-[#2648C7] hover:to-[#1E3BA3] text-white shadow-xl hover:shadow-[#3D5AFE]/50 px-6 py-3 font-bold transition-all hover:scale-105"
              >
                Fazer Login
              </Button>
            </AuthModal>
          </div>
        </div>
      </section>

      {/* Stats Section - Profissional e moderno */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#3D5AFE]/5 via-background to-[#FF3347]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent">
                Resultados Comprovados
              </span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Métricas reais de estudantes que confiam na nossa plataforma
            </p>
          </div>
          
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              const iconColor = index % 2 === 0 ? 'text-[#3D5AFE]' : 'text-[#FF3347]'
              const gradientFrom = index % 2 === 0 ? 'from-[#3D5AFE]/10' : 'from-[#FF3347]/10'
              const gradientTo = index % 2 === 0 ? 'to-[#3D5AFE]/5' : 'to-[#FF3347]/5'
              const borderColor = index % 2 === 0 ? 'border-[#3D5AFE]/30' : 'border-[#FF3347]/30'
              const shadowColor = index % 2 === 0 ? 'hover:shadow-[#3D5AFE]/20' : 'hover:shadow-[#FF3347]/20'
              
              return (
                <div 
                  key={stat.name} 
                  className={`group flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} border-2 ${borderColor} hover:scale-105 hover:shadow-xl ${shadowColor} transition-all duration-300`}
                >
                  <div className={`p-3 rounded-full bg-background/80 mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                  </div>
                  <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">{stat.name}</dt>
                  <dd className={`text-4xl font-extrabold tracking-tight ${iconColor}`}>{stat.value}</dd>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      {/* Features Section - Design Premium */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ferramentas <span className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent">Poderosas</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tudo que você precisa para alcançar a aprovação
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              // Alterna entre vermelho e azul
              const cardColor = index % 2 === 0 ? 'border-[#3D5AFE]/30 hover:border-[#3D5AFE]/60' : 'border-[#FF3347]/30 hover:border-[#FF3347]/60'
              const iconBg = index % 2 === 0 ? 'bg-gradient-to-br from-[#3D5AFE]/20 to-[#3D5AFE]/5' : 'bg-gradient-to-br from-[#FF3347]/20 to-[#FF3347]/5'
              const iconColor = index % 2 === 0 ? 'text-[#3D5AFE]' : 'text-[#FF3347]'
              const shadowColor = index % 2 === 0 ? 'hover:shadow-xl hover:shadow-[#3D5AFE]/10' : 'hover:shadow-xl hover:shadow-[#FF3347]/10'
              const linkColor = index % 2 === 0 ? 'text-[#3D5AFE]' : 'text-[#FF3347]'
              
              return (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className={`group relative p-6 bg-card rounded-xl border-2 ${cardColor} ${shadowColor} transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`inline-flex p-3 rounded-xl ${iconBg} shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <h3 className={`mt-5 text-lg font-bold ${iconColor} transition-colors`}>
                    {feature.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className={`mt-5 flex items-center text-sm font-bold ${linkColor} group-hover:translate-x-2 transition-transform`}>
                    Explorar agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1]"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Comece sua jornada rumo à
            </h2>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl">
              Aprovação na OAB
            </h3>
          </div>
          
          <p className="text-base sm:text-lg leading-relaxed text-white/95 max-w-2xl mx-auto font-medium">
            Junte-se a milhares de estudantes que já transformaram seus estudos. 
            <span className="font-bold"> Grátis para começar.</span>
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <AuthModal defaultMode="register">
              <Button 
                size="default" 
                className="w-full sm:w-auto gap-2 bg-white hover:bg-gray-100 text-[#FF3347] shadow-xl px-8 py-3 font-bold transition-all hover:scale-105"
              >
                Começar Agora
                <Calendar className="h-4 w-4" />
              </Button>
            </AuthModal>
            <AuthModal defaultMode="login">
              <Button 
                size="default" 
                variant="outline"
                className="w-full sm:w-auto gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white/80 hover:border-white shadow-xl px-8 py-3 font-bold transition-all hover:scale-105"
              >
                Fazer Login
              </Button>
            </AuthModal>
          </div>
        </div>
      </section>
    </div>
  )
}
