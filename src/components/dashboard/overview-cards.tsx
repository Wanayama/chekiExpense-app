"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard, Landmark } from "lucide-react"

interface OverviewCardsProps {
    income: number;
    expenses: number;
    balance: number;
}

export function OverviewCards({ income, expenses, balance }: OverviewCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${income.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Your total income for this period.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${expenses.toLocaleString()}</div>
                     <p className="text-xs text-muted-foreground">
                        {((expenses / income) * 100).toFixed(2)}% of income
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Balance</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Your remaining balance.</p>
                </CardContent>
            </Card>
        </div>
    )
}
