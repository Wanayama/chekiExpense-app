"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Expense } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { ExpenseForm } from './expense-form';
import { mockCategories } from '@/lib/data';
import { useState } from "react"


interface ColumnsProps {
    deleteExpense: (id: string) => void;
    editExpense: (expense: Omit<Expense, 'userId'>) => void;
}

export const columns = ({ deleteExpense, editExpense }: ColumnsProps): ColumnDef<Expense>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      const formatted = date.toLocaleDateString()
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
       return (
        <div className="text-right">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted.replace("KES", "KES ")}</div>
    },
  },
  {
    id: "actions",
    cell: function Actions({ row }) {
        const expense = row.original;
        const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

        const handleEditSubmit = (updatedExpenseData: Omit<Expense, 'id' | 'userId'>) => {
            editExpense({ ...updatedExpenseData, id: expense.id });
            setIsEditDialogOpen(false);
        };

      
        return (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(expense.id)}
                    >
                    Copy expense ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                         <DropdownMenuItem>Edit expense</DropdownMenuItem>
                    </DialogTrigger>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-600">Delete expense</DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        expense and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteExpense(expense.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>

                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                    </DialogHeader>
                    <ExpenseForm 
                        categories={mockCategories} 
                        onSubmit={handleEditSubmit}
                        onCancel={() => setIsEditDialogOpen(false)} 
                        initialData={expense}
                    />
                </DialogContent>
            </AlertDialog>
            </Dialog>
        )
    },
  },
]
