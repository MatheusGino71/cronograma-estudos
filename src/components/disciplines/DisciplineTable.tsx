'use client'

import * as React from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Discipline } from "@/types"
import { useDisciplineStats } from "@/hooks/useDisciplines"
import { useDisciplineStore } from "@/store/discipline"
import { ChevronDown, Search, Filter, Heart, Plus, Eye, ArrowUpDown } from "lucide-react"

interface DisciplineTableProps {
  onViewDetails?: (discipline: Discipline) => void
}

export function DisciplineTable({ onViewDetails }: DisciplineTableProps) {
  const { data: disciplineStats = [] } = useDisciplineStats()
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    addToComparison,
    canAddToComparison
  } = useDisciplineStore()
  
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Nome
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const discipline = row.original
        return (
          <div className="space-y-1">
            <div className="font-medium">{discipline.name}</div>
            <div className="text-xs text-muted-foreground">{discipline.board}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "level",
      header: "Nível",
      cell: ({ row }) => {
        const level = row.getValue("level") as string
        const colors = {
          'Iniciante': 'bg-green-100 text-green-800',
          'Intermediário': 'bg-yellow-100 text-yellow-800',
          'Avançado': 'bg-red-100 text-red-800'
        }
        return (
          <Badge className={colors[level as keyof typeof colors]}>
            {level}
          </Badge>
        )
      },
    },
    {
      accessorKey: "durationMin",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Duração
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const minutes = row.getValue("durationMin") as number
        return `${Math.round(minutes / 60)}h`
      },
    },
    {
      accessorKey: "tags",
      header: "Assuntos",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[]
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const tags = row.getValue(id) as string[]
        return value.some((filterTag: string) => 
          tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase()))
        )
      },
    },
    {
      accessorKey: "progress",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Progresso
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const progress = row.original.progress || 0
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium">{progress}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "totalHours",
      header: "Horas Estudadas",
      cell: ({ row }) => {
        const hours = row.original.totalHours || 0
        return <span className="text-sm">{hours}h</span>
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const discipline = row.original
        const isFav = isFavorite(discipline.id)
        
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (isFav) {
                  removeFromFavorites(discipline.id)
                } else {
                  addToFavorites(discipline.id)
                }
              }}
            >
              <Heart className={isFav ? "h-3 w-3 fill-red-500 text-red-500" : "h-3 w-3"} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => canAddToComparison() && addToComparison(discipline.id)}
              disabled={!canAddToComparison()}
            >
              <Plus className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onViewDetails?.(discipline)}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: disciplineStats,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Aplicar filtros do store
  React.useEffect(() => {
    const newFilters: ColumnFiltersState = []
    
    if (searchTerm) {
      newFilters.push({ id: "name", value: searchTerm })
    }
    
    if (filters.board) {
      newFilters.push({ id: "board", value: filters.board })
    }
    
    if (filters.level) {
      newFilters.push({ id: "level", value: filters.level })
    }
    
    if (filters.tags && filters.tags.length > 0) {
      newFilters.push({ id: "tags", value: filters.tags })
    }
    
    setColumnFilters(newFilters)
  }, [searchTerm, filters])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar disciplinas..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-8"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2 space-y-2">
              <div>
                <label className="text-xs font-medium">Banca</label>
                <select 
                  className="w-full p-1 text-xs border rounded"
                  value={filters.board || ''}
                  onChange={(e) => setFilters({ ...filters, board: e.target.value || undefined })}
                >
                  <option value="">Todas</option>
                  <option value="CESPE/CEBRASPE">CESPE/CEBRASPE</option>
                  <option value="FCC">FCC</option>
                  <option value="FGV">FGV</option>
                  <option value="VUNESP">VUNESP</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium">Nível</label>
                <select 
                  className="w-full p-1 text-xs border rounded"
                  value={filters.level || ''}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value || undefined })}
                >
                  <option value="">Todos</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronDown className="mr-2 h-4 w-4" />
              Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhuma disciplina encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}

// Função para renderizar células (necessária para TanStack Table)
function flexRender(content: any, context: any) {
  if (typeof content === 'function') {
    return content(context)
  }
  return content
}
