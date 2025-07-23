"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import type { Expense, Category } from "@/lib/types"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  categories: Category[]
}

export function DataTable<TData extends Expense, TValue>({
  columns,
  data,
  categories
}: DataTableProps<TData, TValue>) {
    const [descriptionFilter, setDescriptionFilter] = React.useState("")
    const [categoryFilter, setCategoryFilter] = React.useState("all")
    const [sorting, setSorting] = React.useState<{id: string, desc: boolean} | null>(null);

    const filteredData = React.useMemo(() => {
        let filtered = data.filter(item =>
            item.description.toLowerCase().includes(descriptionFilter.toLowerCase())
        );

        if (categoryFilter !== "all") {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        if (sorting) {
            filtered.sort((a, b) => {
                const valA = a[sorting.id as keyof TData];
                const valB = b[sorting.id as keyof TData];

                if (valA < valB) return sorting.desc ? 1 : -1;
                if (valA > valB) return sorting.desc ? -1 : 1;
                return 0;
            });
        }

        return filtered
    }, [data, descriptionFilter, categoryFilter, sorting]);

    const handleSort = (id: string) => {
        setSorting(prev => {
            if (prev?.id === id) {
                return { id, desc: !prev.desc };
            }
            return { id, desc: false };
        });
    }

  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter by description..."
          value={descriptionFilter}
          onChange={(event) =>
            setDescriptionFilter(event.target.value)
          }
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>
                  {column.header && typeof column.header === 'function' ? column.header({
                    column: {
                        toggleSorting: () => handleSort(column.id || (column.accessorKey as string)),
                        getIsSorted: () => sorting?.id === (column.id || (column.accessorKey as string)) ? (sorting.desc ? 'desc' : 'asc') : false
                    }
                  }) : column.header as React.ReactNode}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell && typeof column.cell === 'function'
                        ? column.cell({ row: { original: row } } as any)
                        : (row as any)[column.accessorKey as string]}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
