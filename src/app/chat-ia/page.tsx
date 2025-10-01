'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, Lightbulb, BookOpen, Calendar, HelpCircle, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  {
    icon: Calendar,
    text: "Crie um cronograma de estudos para Procurador",
    category: "Cronograma"
  },
  {
    icon: BookOpen,
    text: "Explique o princípio da legalidade",
    category: "Conceito"
  },
  {
    icon: HelpCircle,
    text: "5 questões de Direito Constitucional",
    category: "Questões"
  },
  {
    icon: Lightbulb,
    text: "Dicas para memorizar competências do STF",
    category: "Dicas"
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Sou o **MindLegal AI**, seu assistente especializado em Direito brasileiro e concursos públicos. Como posso ajudar você hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'question',
          data: {
            question: textToSend,
            context: messages.slice(-3).map(m => `${m.isUser ? 'Usuário' : 'AI'}: ${m.text}`).join('\n')
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ **Erro**: Não foi possível processar sua pergunta. ${error instanceof Error ? error.message : 'Tente novamente.'}`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/assistente-ia">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MindLegal AI
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Chat Interativo</p>
              </div>
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-4 h-[calc(100vh-80px)]">
        <div className="h-full max-w-4xl mx-auto flex flex-col">
          
          {/* Messages Area */}
          <div className="flex-1 mb-4">
            <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {!message.isUser && (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.isUser
                          ? 'bg-blue-600 text-white ml-auto rounded-br-md'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-bl-md'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          components={{
                            p: ({ children }: any) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({ children }: any) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }: any) => <li className="mb-1">{children}</li>,
                            strong: ({ children }: any) => <strong className="font-semibold text-blue-600 dark:text-blue-400">{children}</strong>,
                            code: ({ children }: any) => (
                              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                                {children}
                              </code>
                            ),
                            h1: ({ children }: any) => <h1 className="text-lg font-bold mb-3 text-blue-600 dark:text-blue-400 border-b pb-1">{children}</h1>,
                            h2: ({ children }: any) => <h2 className="text-md font-semibold mb-2 text-blue-600 dark:text-blue-400">{children}</h2>,
                            h3: ({ children }: any) => <h3 className="text-sm font-semibold mb-1 text-blue-600 dark:text-blue-400">{children}</h3>,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                      
                      <div className={`text-xs mt-2 opacity-70 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    {message.isUser && (
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Quick Suggestions - Only show on first message */}
          {messages.length === 1 && (
            <div className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium text-center">
                💡 Sugestões para começar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUICK_SUGGESTIONS.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <Button
                      key={`chat-suggestion-${suggestion.category}-${index}`}
                      variant="outline"
                      className="justify-start text-left h-auto py-3 px-4 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 transition-all duration-200"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                    >
                      <Icon className="h-4 w-4 mr-3 text-blue-600 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-blue-600 mb-1">
                          {suggestion.category}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {suggestion.text}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border rounded-2xl p-4 shadow-lg">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua dúvida jurídica ou peça ajuda com seus estudos..."
                  disabled={isLoading}
                  className="pr-12 h-12 text-base border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-400 focus:ring-blue-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Button 
                    onClick={() => sendMessage()} 
                    disabled={!inputText.trim() || isLoading}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700 h-8 w-8 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Pressione <kbd className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Enter</kbd> para enviar ou clique no botão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
