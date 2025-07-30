"use client";


import { useState, useEffect } from 'react';
import type { Expense } from '@/lib/types';
import { mockCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Download } from 'lucide-react';
import { columns } from '@/components/expenses/columns';
import { DataTable } from '@/components/expenses/data-table';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/context/auth-context';
import { addExpense as addExpenseToDB, getExpenses, deleteExpense as deleteExpenseFromDB, updateExpense as updateExpenseInDB } from '@/services/expenses';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { downloadAsCSV, downloadAsPDF } from '@/lib/download';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setMounted(true);
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

  if (!mounted || isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">Manage and track your expenses.</p>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadAsCSV(expenses)}>Download as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadAsPDF(expenses)}>Download as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
      </div>
      <DataTable 
        columns={columns({ deleteExpense, editExpense })} 
        data={expenses} 
        categories={mockCategories}
      />
    </div>
  );
};
