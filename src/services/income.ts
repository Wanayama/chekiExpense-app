"use client";

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const getIncomeDocRef = (userId: string) => {
    return doc(db, 'users', userId, 'income', 'userIncome');
}

// Get income for a user in real-time
export const getIncome = (userId: string, callback: (income: number) => void) => {
    const incomeDocRef = getIncomeDocRef(userId);
    
    return onSnapshot(incomeDocRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data().amount);
        } else {
            callback(0); // Default to 0 if no income is set
        }
    });
};

// Set or update income for a user
export const setIncome = async (userId: string, amount: number) => {
    const incomeDocRef = getIncomeDocRef(userId);
    return await setDoc(incomeDocRef, { amount });
};
