import { db } from '@/lib/firebase';
import type { Expense } from '@/lib/types';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';

type RawExpense = Omit<Expense, 'date'> & { date: Timestamp };
type ExpenseInput = Omit<Expense, 'id' | 'userId' | 'date'> & { date: Date };


// Get expenses for a user in real-time
export const getExpenses = (userId: string, callback: (expenses: Expense[]) => void) => {
  const expensesCol = collection(db, 'users', userId, 'expenses');
  const q = query(expensesCol, orderBy('date', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map(doc => {
      const data = doc.data() as RawExpense;
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      };
    });
    callback(expenses);
  });
};

// Add a new expense
export const addExpense = async (userId: string, expense: Omit<Expense, 'id' | 'userId'>) => {
  const expensesCol = collection(db, 'users', userId, 'expenses');
  return await addDoc(expensesCol, { ...expense, userId });
};

// Delete an expense
export const deleteExpense = async (userId: string, expenseId: string) => {
  const expenseDoc = doc(db, 'users', userId, 'expenses', expenseId);
  return await deleteDoc(expenseDoc);
};

// Update an expense
export const updateExpense = async (userId: string, expense: Omit<Expense, 'userId'>) => {
  const { id, ...expenseData } = expense;
  const expenseDoc = doc(db, 'users', userId, 'expenses', id);
  return await updateDoc(expenseDoc, expenseData);
};
