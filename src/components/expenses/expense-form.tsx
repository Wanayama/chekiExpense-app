"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import type { Category, Expense } from "@/lib/types"
import { suggestExpenseCategories } from "@/ai/flows/suggest-expense-categories"
import React from "react"

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  date: z.date(),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
})

type FormSubmitData = Omit<Expense, 'id' | 'userId'>

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (data: FormSubmitData) => void;
  onCancel: () => void;
  initialData?: Omit<Expense, 'userId'>;
}

export function ExpenseForm({ categories, onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const [suggestedCategories, setSuggestedCategories] = React.useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        amount: initialData.amount
    } : {
      description: "",
      amount: 0,
      date: new Date(),
      category: "",
    },
  })

  const handleDescriptionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('description', e.target.value);
    const description = e.target.value;
    if (description.length > 3) {
      setIsSuggesting(true);
      try {
        const result = await suggestExpenseCategories({ description });
        setSuggestedCategories(result.categories);
      } catch (error) {
        console.error("Failed to fetch category suggestions", error);
        setSuggestedCategories([]);
      } finally {
        setIsSuggesting(false);
      }
    } else {
      setSuggestedCategories([]);
    }
  };

  
  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Coffee with a friend" {...field} onChange={handleDescriptionChange} />
              </FormControl>
              <FormMessage />
              {isSuggesting && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Suggesting categories...</p>}
              {suggestedCategories.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Suggestions: {suggestedCategories.map(cat => (
                    <Button 
                      key={cat} 
                      variant="outline" 
                      size="sm" 
                      className="h-6 px-2 mr-1" 
                      onClick={() => form.setValue('category', cat)}
                    >
                        {cat}
                    </Button>
                  ))}
                </div>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Expense</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
