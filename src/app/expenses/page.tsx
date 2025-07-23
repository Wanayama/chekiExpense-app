"use client";

import { useState, useEffect } from 'react';
import type { Expense } from '@/lib/types';
import { mockCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { columns } from '@/components/expenses/columns';
import { DataTable } from '@/components/expenses/data-table';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/auth-context';
import { addExpense as addExpenseToDB, getExpenses, deleteExpense as deleteExpenseFromDB, updateExpense as updateExpenseInDB } from '@/services/expenses';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const unsubscribe = getExpenses(user.uid, (expenses) => {
        setExpenses(expenses);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  const addExpense = async (newExpenseData: Omit<Expense, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await addExpenseToDB(user.uid, newExpenseData);
      setIsFormOpen(false);
       toast({
        title: "Expense added",
        description: "Your expense has been successfully added.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add expense.",
      });
    }
  };
  
  const deleteExpense = async (id: string) => {
    try {
      await deleteExpenseFromDB(user!.uid, id);
      toast({
        title: "Expense deleted",
        description: "Your expense has been successfully deleted.",
      });
    } catch(error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete expense.",
      });
    }
  }
  
  const editExpense = async (updatedExpense: Omit<Expense, 'userId'>) => {
    try {
        await updateExpenseInDB(user!.uid, updatedExpense);
        toast({
            title: "Expense updated",
            description: "Your expense has been successfully updated.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update expense.",
        });
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">Manage and track your expenses.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Expense
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                        Fill in the details of your new expense.
                    </DialogDescription>
                </DialogHeader>
                <ExpenseForm 
                    categories={mockCategories}
                    onSubmit={addExpense} 
                    onCancel={() => setIsFormOpen(false)}
                />
            </DialogContent>
        </Dialog>
      </div>
      <DataTable 
        columns={columns({ deleteExpense, editExpense })} 
        data={expenses} 
        categories={mockCategories}
      />
    </div>
  );
}
