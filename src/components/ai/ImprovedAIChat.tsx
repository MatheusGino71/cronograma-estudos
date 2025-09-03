'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, Lightbulb, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

export default function ImprovedAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Sou o **MindLegal AI**, seu assistente especializado em Direito e concursos públicos. Como posso ajudar você hoje?',
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
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-blue-600" />
          MindLegal AI
          <Badge variant="secondary" className="ml-auto text-xs">
            Assistente Jurídico
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }: any) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                        ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                        li: ({ children }: any) => <li className="mb-1">{children}</li>,
                        strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
                        code: ({ children }: any) => (
                          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                            {children}
                          </code>
                        ),
                        h1: ({ children }: any) => <h1 className="text-lg font-bold mb-2 text-blue-600">{children}</h1>,
                        h2: ({ children }: any) => <h2 className="text-md font-semibold mb-2 text-blue-600">{children}</h2>,
                        h3: ({ children }: any) => <h3 className="text-sm font-semibold mb-1 text-blue-600">{children}</h3>,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                  
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.isUser ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      Processando sua pergunta...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
              💡 Sugestões rápidas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {QUICK_SUGGESTIONS.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <Icon className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium text-blue-600">
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

        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre Direito..."
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-gray-800"
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={!inputText.trim() || isLoading}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Pressione <kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">Enter</kbd> para enviar
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
