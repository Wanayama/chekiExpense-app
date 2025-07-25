'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBudgetAllocationsInputSchema = z.object({
  expenses: z.array(
    z.object({
      category: z.string().describe('The category of the expense.'),
      amount: z.number().describe('The amount of the expense.'),
      date: z.string().describe('The date of the expense (YYYY-MM-DD).'),
      description: z.string().optional().describe('A description of the expense.'),
    })
  ).describe('An array of past expenses.'),
  income: z.number().describe('The user provided total income for the duration covered by the expenses.'),
});
export type SuggestBudgetAllocationsInput = z.infer<typeof SuggestBudgetAllocationsInputSchema>;

const SuggestBudgetAllocationsOutputSchema = z.object({
  suggestedAllocations: z.array(
    z.object({
      category: z.string().describe('The category of the budget allocation.'),
      percentage: z.number().describe('The suggested percentage of income to allocate to this category.'),
      amount: z.number().describe('The suggested amount to allocate to this category, calculated from the percentage and income.'),
      justification: z.string().describe('A short justification for the suggested allocation.'),
    })
  ).describe('An array of suggested budget allocations for each category.'),
});
export type SuggestBudgetAllocationsOutput = z.infer<typeof SuggestBudgetAllocationsOutputSchema>;

export async function suggestBudgetAllocations(input: SuggestBudgetAllocationsInput): Promise<SuggestBudgetAllocationsOutput> {
  return suggestBudgetAllocationsFlow(input);
}

const suggestBudgetAllocationsPrompt = ai.definePrompt({
  name: 'suggestBudgetAllocationsPrompt',
  input: {schema: SuggestBudgetAllocationsInputSchema},
  output: {schema: SuggestBudgetAllocationsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's past spending habits and suggest budget allocations for different categories. 

Analyze these past expenses:
{{#each expenses}}
- Category: {{category}}, Amount: {{amount}}, Date: {{date}}, Description: {{description}}
{{/each}}

Total Income: {{income}}

Based on this spending data and income, suggest budget allocations for each category as a percentage of income, the equivalent amount, and provide a brief justification for each suggestion. Be mindful of the total income so that the total suggested allocation isn't larger than the income. The amount field should be rounded to the nearest dollar.`,
});

const suggestBudgetAllocationsFlow = ai.defineFlow(
  {
    name: 'suggestBudgetAllocationsFlow',
    inputSchema: SuggestBudgetAllocationsInputSchema,
    outputSchema: SuggestBudgetAllocationsOutputSchema,
  },
  async input => {
    const {output} = await suggestBudgetAllocationsPrompt(input);
    return output!;
  }
);
