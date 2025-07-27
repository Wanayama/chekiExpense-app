import type { Expense } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const downloadAsCSV = (expenses: Expense[]) => {
  if (!expenses.length) return;
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  const csvRows = [
    headers.join(','),
    ...expenses.map(expense => 
      [
        format(expense.date, 'yyyy-MM-dd'),
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.category,
        expense.amount,
      ].join(',')
    ),
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', 'expenses.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAsPDF = (expenses: Expense[]) => {
  if (!expenses.length) return;
  const doc = new jsPDF();

  doc.text('Expenses Report', 14, 16);
  
  const tableColumn = ["Date", "Description", "Category", "Amount (KES)"];
  const tableRows: (string | number)[][] = [];

  expenses.forEach(expense => {
    const expenseData = [
      format(expense.date, 'yyyy-MM-dd'),
      expense.description,
      expense.category,
      expense.amount.toFixed(2),
    ];
    tableRows.push(expenseData);
  });
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    theme: 'striped',
    styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 2,
    },
    headStyles: {
        fillColor: [30, 136, 229], // A nice blue color
        textColor: 255,
        fontStyle: 'bold',
    },
    foot: [
        [{ content: `Total Expenses: KES ${totalExpenses.toFixed(2)}`, colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } }]
    ],
    footStyles: {
        fillColor: [240, 240, 240]
    }
  });

  doc.save('expenses.pdf');
};
