'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, BookOpen, BarChart3, Menu, X, FileText, LogIn, Sun, Moon, Bot } from "lucide-react"
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
    name: 'Chat IA',
    href: '/chat-ia',
    icon: Bot,
    description: 'Chat direto com MindLegal AI'
  },
  {
    name: 'Assistente IA',
    href: '/assistente-ia',
    icon: Bot,
    description: 'MindLegal AI - Recursos completos'
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
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-8">
          <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <span className="hidden font-bold sm:inline-block">
            MindTech
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <UserMenu />
            ) : (
              <AuthModal>
                <Button variant="outline" size="sm" className="gap-2">
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
