"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Expense } from '@/lib/types';
import { mockIncome } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { getExpenses } from '@/services/expenses';

import { DollarSign, CreditCard, Landmark, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { AiBudgetSuggester } from '@/components/dashboard/ai-budget-suggester';

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income] = useState<number>(mockIncome);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const unsubscribe = getExpenses(user.uid, (expenses) => {
        setExpenses(expenses);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = income - totalExpenses;

  if (loading || isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4">
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
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {income > 0 ? ((totalExpenses / income) * 100).toFixed(2) : 0}% of income
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>A look at your spending trends over the last few months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ExpenseChart expenses={expenses} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 col-span-4">
          <CardHeader>
            <CardTitle>AI Budget Helper</CardTitle>
            <CardDescription>AI-powered suggestions to optimize your budget.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiBudgetSuggester expenses={expenses} income={income} />
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your most recent expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentExpenses expenses={expenses.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
}
