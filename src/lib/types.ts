export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  icon?: React.ElementType;
};

export type SuggestedAllocation = {
  category: string;
  percentage: number;
  amount: number;
  justification: string;
};
