'use client'

import { useState, useRef } from 'react'
import { useNotebookIA } from '@/hooks/useNotebookIA'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Download, 
  Share2, 
  Zap
} from 'lucide-react'

interface MindMapNode {
  id: string
  text: string
  level: number
  children: MindMapNode[]
  x?: number
  y?: number
  color?: string
}

interface MindMapData {
  central: string
  nodes: MindMapNode[]
  theme: string
}

interface MindMapGeneratorProps {
  onAulaCriada?: (dados: MindMapData) => void
}

export function MindMapGenerator({ onAulaCriada }: MindMapGeneratorProps = {}) {
  const [content, setContent] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('modern')
  const [mindMap, setMindMap] = useState<MindMapData | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { isLoading: isGenerating, generateMindMap: generateWithIA } = useNotebookIA()

  const themes = {
    modern: { name: 'Moderno', colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'] },
    academic: { name: 'Acadêmico', colors: ['#1E40AF', '#0369A1', '#0284C7', '#0891B2', '#06B6D4'] },
    nature: { name: 'Natureza', colors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'] },
    warm: { name: 'Caloroso', colors: ['#DC2626', '#EA580C', '#D97706', '#CA8A04', '#EAB308'] },
    cool: { name: 'Frio', colors: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'] }
  }

  const generateMindMap = async () => {
    if (!content.trim()) return

    const result = await generateWithIA(content, selectedTheme)
    
    if (result.success && result.data) {
      const data = result.data as { central: string; nodes: MindMapNode[] }
      // Adiciona cores aos nós baseado no tema
      const processedNodes = data.nodes.map((node, index) => ({
        ...node,
        color: themes[selectedTheme as keyof typeof themes].colors[index % themes[selectedTheme as keyof typeof themes].colors.length],
        children: node.children.map((child, childIndex) => ({
          ...child,
          color: themes[selectedTheme as keyof typeof themes].colors[(childIndex + 1) % themes[selectedTheme as keyof typeof themes].colors.length],
          children: child.children.map((grandChild, grandChildIndex) => ({
            ...grandChild,
            color: themes[selectedTheme as keyof typeof themes].colors[(grandChildIndex + 2) % themes[selectedTheme as keyof typeof themes].colors.length]
          }))
        }))
      }))
      
      setMindMap({
        central: data.central,
        theme: selectedTheme,
        nodes: processedNodes
      })
    } else {
      // Fallback para dados mockados
      const mockMindMap: MindMapData = {
        central: 'Estudos de Matemática',
        theme: selectedTheme,
        nodes: [
          {
            id: '1',
            text: 'Álgebra',
            level: 1,
            color: themes[selectedTheme as keyof typeof themes].colors[0],
            children: [
              {
                id: '1.1',
                text: 'Equações',
                level: 2,
                color: themes[selectedTheme as keyof typeof themes].colors[1],
                children: [
                  { id: '1.1.1', text: '1º Grau', level: 3, children: [], color: themes[selectedTheme as keyof typeof themes].colors[2] },
                  { id: '1.1.2', text: '2º Grau', level: 3, children: [], color: themes[selectedTheme as keyof typeof themes].colors[2] }
                ]
              }
            ]
          }
        ]
      }
      setMindMap(mockMindMap)
    }
  }

  const renderNode = (node: MindMapNode, x: number, y: number, angle: number, distance: number) => {
    const nodeX = x + Math.cos(angle) * distance
    const nodeY = y + Math.sin(angle) * distance
    
    return (
      <g key={node.id}>
        {/* Connection line */}
        <line 
          x1={x} 
          y1={y} 
          x2={nodeX} 
          y2={nodeY} 
          stroke={node.color} 
          strokeWidth="2"
          opacity="0.6"
        />
        
        {/* Node circle */}
        <circle
          cx={nodeX}
          cy={nodeY}
          r={Math.max(30 - node.level * 5, 15)}
          fill={node.color}
          opacity="0.8"
        />
        
        {/* Node text */}
        <text
          x={nodeX}
          y={nodeY}
          textAnchor="middle"
          dy="0.35em"
          fill="white"
          fontSize={Math.max(12 - node.level, 8)}
          fontWeight="bold"
        >
          {node.text.length > 8 ? node.text.substring(0, 8) + '...' : node.text}
        </text>
        
        {/* Render children */}
        {node.children.map((child, index) => {
          const childAngle = angle + (index - (node.children.length - 1) / 2) * 0.5
          const childDistance = distance * 0.7
          return renderNode(child, nodeX, nodeY, childAngle, childDistance)
        })}
      </g>
    )
  }

  const downloadSVG = () => {
    if (!svgRef.current) return
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mapa-mental.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Gerador de Mapa Mental
          </CardTitle>
          <CardDescription>
            Transforme seus conteúdos em mapas mentais visuais e interativos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Descreva o conteúdo que deseja transformar em mapa mental..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Tema Visual</label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(themes).map(([key, theme]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {theme.colors.slice(0, 3).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        {theme.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={generateMindMap}
            disabled={!content.trim() || isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Gerando Mapa...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Gerar Mapa Mental
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Mind Map Visualization */}
      {mindMap && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {mindMap.central}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={downloadSVG}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-slate-50 to-white">
              <svg
                ref={svgRef}
                width="100%"
                height="600"
                viewBox="0 0 800 600"
                className="w-full"
              >
                {/* Central node */}
                <circle
                  cx="400"
                  cy="300"
                  r="40"
                  fill={themes[selectedTheme as keyof typeof themes].colors[0]}
                  opacity="0.9"
                />
                <text
                  x="400"
                  y="300"
                  textAnchor="middle"
                  dy="0.35em"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {mindMap.central.length > 10 ? mindMap.central.substring(0, 10) + '...' : mindMap.central}
                </text>
                
                {/* Main branches */}
                {mindMap.nodes.map((node, index) => {
                  const angle = (index * 2 * Math.PI) / mindMap.nodes.length
                  return renderNode(node, 400, 300, angle, 120)
                })}
              </svg>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {mindMap.nodes.map((node) => (
                <Badge key={node.id} variant="secondary" style={{ backgroundColor: node.color + '20', color: node.color }}>
                  {node.text}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}