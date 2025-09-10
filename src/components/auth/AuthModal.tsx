'use client'

import * as React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

interface AuthModalProps {
  children: React.ReactNode;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ children, defaultMode = 'login' }: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const handleToggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const handleClose = () => {
    setOpen(false);
    // Reset to default mode when closing
    setTimeout(() => setMode(defaultMode), 200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{mode === 'login' ? 'Login' : 'Cadastro'}</DialogTitle>
        </DialogHeader>
        {mode === 'login' ? (
          <LoginForm 
            onToggleMode={handleToggleMode} 
            onClose={handleClose}
          />
        ) : (
          <RegisterForm 
            onToggleMode={handleToggleMode} 
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
