"use client";

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { suggestBudgetAllocations, SuggestBudgetAllocationsOutput } from '@/ai/flows/suggest-budget-allocations';
import type { Expense } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

interface AiBudgetSuggesterProps {
  expenses: Expense[];
  income: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d'];

export function AiBudgetSuggester({ expenses, income }: AiBudgetSuggesterProps) {
  const [suggestions, setSuggestions] = useState<SuggestBudgetAllocationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const formattedExpenses = expenses.map(e => ({
          ...e,
          date: e.date.toISOString().split('T')[0]
      }));
      const result = await suggestBudgetAllocations({ expenses: formattedExpenses, income });
      setSuggestions(result);
    } catch (error) {
      console.error('Error generating budget suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate budget suggestions.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categoryTotals = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: categoryTotals[category],
  }));

  return (
    <div className="space-y-4">
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{
                    backgroundColor: theme === 'dark' ? 'hsl(var(--background))' : '#fff',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Button onClick={handleGenerateSuggestions} disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Generating...' : 'Generate AI Budget Suggestions'}
      </Button>

      {suggestions && (
        <Accordion type="single" collapsible className="w-full">
          {suggestions.suggestedAllocations.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex justify-between w-full pr-4">
                  <span>{item.category}</span>
                  <span className="text-primary font-semibold">${item.amount.toLocaleString()} ({item.percentage}%)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>{item.justification}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
