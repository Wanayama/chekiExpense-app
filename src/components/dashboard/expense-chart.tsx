"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { Expense } from "@/lib/types"
import { format } from "date-fns"

interface ExpenseChartProps {
  expenses: Expense[]
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const monthlyExpenses: { [key: string]: number } = {}

  expenses.forEach(expense => {
    const month = format(expense.date, 'MMM yyyy')
    if (!monthlyExpenses[month]) {
      monthlyExpenses[month] = 0
    }
    monthlyExpenses[month] += expense.amount
  })

  const data = Object.keys(monthlyExpenses).map(month => ({
    name: month,
    total: monthlyExpenses[month],
  })).sort((a, b) => new Date(a.name) > new Date(b.name) ? 1 : -1);


  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
            cursor={{fill: 'hsl(var(--muted))'}}
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
