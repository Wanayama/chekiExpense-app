"use client"


import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import type { Expense } from "@/lib/types"
import { mockCategories } from "@/lib/data";

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {

  const getCategoryIcon = (categoryName: string) => {
    const category = mockCategories.find(cat => cat.name === categoryName);
    return category?.icon ? <category.icon className="h-4 w-4 text-muted-foreground" /> : categoryName.charAt(0);
  }

  return (
    <div className="space-y-8">
      {expenses.map(expense => (
        <div className="flex items-center" key={expense.id}>
          <Avatar className="h-9 w-9 flex items-center justify-center bg-secondary">
             <AvatarFallback className="bg-transparent">
                {getCategoryIcon(expense.category)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{expense.description}</p>
            <p className="text-sm text-muted-foreground">{expense.category}</p>
          </div>
          <div className="ml-auto font-medium">-KES{expense.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
