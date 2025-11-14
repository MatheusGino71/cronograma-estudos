'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, BookOpen, BarChart3, Menu, X, FileText, LogIn, Sun, Moon, Bot, GraduationCap, Shield } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { UserMenu } from "@/components/auth/UserMenu"

const navigation = [
  {
    name: 'Cronograma',
    href: '/cronograma',
    icon: Calendar,
    description: 'Organize seus estudos'
  },
  {
    name: 'Disciplinas',
    href: '/disciplinas',
    icon: BookOpen,
    description: 'Catálogo de matérias'
  },
  {
    name: 'Questões',
    href: '/questoes',
    icon: GraduationCap,
    description: 'Pratique com questões reais'
  },
  {
    name: 'Chat IA',
    href: '/chat-ia',
    icon: Bot,
    description: 'Chat direto com MindLegal AI'
  },
  {
    name: 'Simulado',
    href: '/simulado',
    icon: FileText,
    description: 'Questões e provas'
  },
  {
    name: 'Progresso',
    href: '/progresso',
    icon: BarChart3,
    description: 'Analytics e métricas'
  }
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user } = useAuth()
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-20 items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mr-10 group transition-all hover:scale-105">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] rounded-lg blur opacity-40 group-hover:opacity-70 transition"></div>
            <Image 
              src="/logo-penal-oab.svg" 
              alt="Penal OAB - Mapa Mental" 
              width={180}
              height={56}
              className="h-14 w-auto drop-shadow-xl relative"
              priority
            />
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium flex-1">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            // Alterna entre vermelho e azul
            const activeColor = index % 2 === 0 
              ? 'bg-gradient-to-r from-[#FF3347]/15 to-[#FF3347]/5 text-[#FF3347] border-[#FF3347]/40 shadow-sm' 
              : 'bg-gradient-to-r from-[#3D5AFE]/15 to-[#3D5AFE]/5 text-[#3D5AFE] border-[#3D5AFE]/40 shadow-sm'
            const hoverColor = index % 2 === 0 
              ? 'hover:bg-[#FF3347]/8 hover:text-[#FF3347] hover:border-[#FF3347]/20' 
              : 'hover:bg-[#3D5AFE]/8 hover:text-[#3D5AFE] hover:border-[#3D5AFE]/20'
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 border-2 border-transparent font-semibold whitespace-nowrap",
                  isActive ? activeColor : `text-muted-foreground ${hoverColor}`
                )}
                title={item.description}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.name}</span>
              </Link>
            )
          })}
          
          {/* Admin Link - Only for admins */}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 border-2 font-semibold whitespace-nowrap",
                pathname.startsWith('/admin')
                  ? 'bg-gradient-to-r from-purple-500/15 to-purple-500/5 text-purple-600 border-purple-500/40 shadow-sm'
                  : 'text-muted-foreground hover:bg-purple-500/8 hover:text-purple-600 hover:border-purple-500/20 border-transparent'
              )}
              title="Painel Administrativo"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          )}
        </nav>
        
        <div className="flex items-center justify-end gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full hover:bg-muted transition-all"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-[#3D5AFE]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <UserMenu />
            ) : (
              <AuthModal>
                <Button 
                  size="default" 
                  className="gap-2 bg-gradient-to-r from-[#3D5AFE] to-[#2648C7] hover:from-[#2648C7] hover:to-[#1E3BA3] text-white font-semibold shadow-lg hover:shadow-xl transition-all px-6"
                >
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Button>
              </AuthModal>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="md:hidden"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md transition-colors hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              )
            })}
            
            {/* Admin Link Mobile - Only for admins */}
            {user?.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md transition-colors hover:bg-accent",
                  pathname.startsWith('/admin') ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <Shield className="h-5 w-5" />
                <div>
                  <div className="font-medium">Admin</div>
                  <div className="text-xs text-muted-foreground">Painel Administrativo</div>
                </div>
              </Link>
            )}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t space-y-3">
              {/* Theme Toggle Mobile */}
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="w-full gap-2 justify-start"
              >
                {resolvedTheme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Modo Claro
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Modo Escuro
                  </>
                )}
              </Button>

              {user ? (
                <div className="px-3 py-2">
                  <div className="font-medium">{user.name} {user.lastName}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              ) : (
                <AuthModal>
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Button>
                </AuthModal>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
