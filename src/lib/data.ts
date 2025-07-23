import type { Expense, Category } from '@/lib/types';
import { ShoppingCart, Utensils, Home, Car, Shirt, Clapperboard, Fuel, Plane, HeartPulse, Dumbbell } from 'lucide-react';

export const mockCategories: Category[] = [
  { id: '1', name: 'Groceries', icon: ShoppingCart },
  { id: '2', name: 'Dining Out', icon: Utensils },
  { id: '3', name: 'Housing', icon: Home },
  { id: '4', name: 'Transportation', icon: Car },
  { id: '5', name: 'Shopping', icon: Shirt },
  { id: '6', name: 'Entertainment', icon: Clapperboard },
  { id: '7', name: 'Fuel', icon: Fuel },
  { id: '8', name: 'Travel', icon: Plane },
  { id: '9', name: 'Health', icon: HeartPulse },
  { id: '10', name: 'Fitness', icon: Dumbbell },
];
