'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, BookOpen, BarChart3, ArrowRight, Clock, Target, TrendingUp, FileText } from "lucide-react"

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
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              filter: 'brightness(0.5)',
              background: '#000'
            }}
          >
            <source src="/video-pagina.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Fallback com gradiente se o vídeo não carregar */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          ></div>
          {/* Overlay sutil para legibilidade */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl" 
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' 
              }}>
            Organize seus estudos com
            <span className="text-red-400 block">inteligência</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-100 max-w-2xl mx-auto" 
             style={{ 
               textShadow: '1px 1px 3px rgba(0,0,0,0.8)' 
             }}>
            Plataforma completa para organização de cronogramas de estudo, 
            catálogo de disciplinas e acompanhamento de progresso com analytics avançados.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/cronograma">
              <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-xl">
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/disciplinas">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black shadow-xl backdrop-blur-sm"
              >
                Explorar disciplinas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.name} className="flex flex-col items-center text-center">
                  <Icon className="h-8 w-8 text-red-600 mb-4" />
                  <dt className="text-sm font-medium text-muted-foreground">{stat.name}</dt>
                  <dd className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</dd>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tudo que você precisa para estudar melhor
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas integradas para planejamento, organização e monitoramento 
              dos seus estudos em uma única plataforma.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="group relative p-8 bg-card rounded-2xl border hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-lg ${feature.color} bg-background`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground group-hover:text-red-600 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-red-600 group-hover:translate-x-1 transition-transform">
                    Acessar
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pronto para transformar seus estudos?
          </h2>
          <p className="mt-6 text-lg leading-8 text-red-100 max-w-2xl mx-auto">
            Comece agora mesmo a organizar seu cronograma de estudos e 
            acompanhe seu progresso em tempo real.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/cronograma">
              <Button size="lg" variant="secondary" className="gap-2">
                Criar cronograma
                <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
