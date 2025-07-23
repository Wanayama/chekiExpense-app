"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import type { Expense } from "@/lib/types"

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <div className="space-y-8">
      {expenses.map(expense => (
        <div className="flex items-center" key={expense.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>{expense.category.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{expense.description}</p>
            <p className="text-sm text-muted-foreground">{expense.category}</p>
          </div>
          <div className="ml-auto font-medium">+${expense.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
