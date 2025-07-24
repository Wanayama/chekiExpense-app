"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Expense } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { getExpenses } from '@/services/expenses';
import { getIncome, setIncome } from '@/services/income';

import { DollarSign, CreditCard, Landmark, Loader2, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { AiBudgetSuggester } from '@/components/dashboard/ai-budget-suggester';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncomeState] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [newIncome, setNewIncome] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const unsubscribeExpenses = getExpenses(user.uid, (expenses) => {
        setExpenses(expenses);
        if(isLoading) setIsLoading(false);
      });
      const unsubscribeIncome = getIncome(user.uid, (income) => {
        setIncomeState(income);
        setNewIncome(income.toString());
         if(isLoading) setIsLoading(false);
      });
      return () => {
        unsubscribeExpenses();
        unsubscribeIncome();
      };
    }
  }, [user]);

  const handleIncomeUpdate = async () => {
    if (user && !isNaN(parseFloat(newIncome))) {
      const incomeValue = parseFloat(newIncome);
      try {
        await setIncome(user.uid, incomeValue);
        toast({
          title: "Income Updated",
          description: "Your income has been successfully updated.",
        });
        setIsIncomeDialogOpen(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update income.",
        });
      }
    }
  };

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
             <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Income</DialogTitle>
                        <DialogDescription>Enter your total income for the current period.</DialogDescription>
                    </DialogHeader>
                    <Input 
                        type="number"
                        value={newIncome}
                        onChange={(e) => setNewIncome(e.target.value)}
                        placeholder="e.g. 5000"
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                             <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleIncomeUpdate}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {income.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Your total income for this period.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalExpenses.toLocaleString()}</div>
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
            <div className="text-2xl font-bold">KES {balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Your remaining balance.</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>A look at your spending trends over the last few months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ExpenseChart expenses={expenses} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
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
