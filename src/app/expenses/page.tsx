"use client";

import { useState } from 'react';
import type { Expense } from '@/lib/types';
import { mockExpenses, mockCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { columns } from '@/components/expenses/columns';
import { DataTable } from '@/components/expenses/data-table';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import type { Table } from '@tanstack/react-table';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addExpense = (newExpenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      id: (expenses.length + 1).toString(),
      ...newExpenseData,
    };
    setExpenses(prev => [newExpense, ...prev]);
    setIsFormOpen(false);
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  }
  
  const editExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => expense.id === updatedExpense.id ? updatedExpense : expense));
  }
  
  const tableColumns = (table: Table<Expense>) => columns({ deleteExpense, editExpense, table });

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
        columns={tableColumns} 
        data={expenses} 
        categories={mockCategories}
      />
    </div>
  );
}
