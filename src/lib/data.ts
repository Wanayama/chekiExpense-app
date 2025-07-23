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

export const mockIncome = 5000;

export const mockExpenses: Expense[] = [
  { id: '1', description: 'Weekly groceries', amount: 125.50, date: new Date('2024-07-28'), category: 'Groceries' },
  { id: '2', description: 'Dinner with friends', amount: 85.00, date: new Date('2024-07-27'), category: 'Dining Out' },
  { id: '3', description: 'Monthly rent', amount: 1500.00, date: new Date('2024-07-01'), category: 'Housing' },
  { id: '4', description: 'Gas for car', amount: 50.25, date: new Date('2024-07-25'), category: 'Fuel' },
  { id: '5', description: 'New running shoes', amount: 120.00, date: new Date('2024-07-22'), category: 'Shopping' },
  { id: '6', description: 'Movie tickets', amount: 30.00, date: new Date('2024-07-20'), category: 'Entertainment' },
  { id: '7', description: 'Gym membership', amount: 40.00, date: new Date('2024-07-05'), category: 'Fitness' },
  { id: '8', description: 'Doctor co-pay', amount: 25.00, date: new Date('2024-07-18'), category: 'Health' },
  { id: '9', description: 'Weekly groceries', amount: 110.75, date: new Date('2024-06-28'), category: 'Groceries' },
  { id: '10', description: 'Lunch meeting', amount: 45.50, date: new Date('2024-06-26'), category: 'Dining Out' },
  { id: '11', description: 'Monthly rent', amount: 1500.00, date: new Date('2024-06-01'), category: 'Housing' },
  { id: '12', description: 'Bus pass', amount: 60.00, date: new Date('2024-06-02'), category: 'Transportation' },
  { id: '13', description: 'Concert tickets', amount: 150.00, date: new Date('2024-06-15'), category: 'Entertainment' },
  { id: '14', description: 'Weekly groceries', amount: 130.00, date: new Date('2024-05-29'), category: 'Groceries' },
  { id: '15', description: 'Monthly rent', amount: 1500.00, date: new Date('2024-05-01'), category: 'Housing' },
  { id: '16', description: 'Flight to NYC', amount: 350.00, date: new Date('2024-05-10'), category: 'Travel' },
  { id: '17', description: 'New shirt', amount: 45.00, date: new Date('2024-05-20'), category: 'Shopping' },
  { id: '18', description: 'Gas for car', amount: 55.00, date: new Date('2024-06-20'), category: 'Fuel' },
  { id: '19', description: 'Coffee shop', amount: 12.50, date: new Date('2024-07-29'), category: 'Dining Out' },
];
