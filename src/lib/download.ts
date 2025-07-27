import type { Expense } from './types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const downloadAsCSV = (expenses: Expense[]) => {
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
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', 'expenses.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadAsPDF = (expenses: Expense[]) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  doc.text('Expenses Report', 14, 16);
  
  const tableColumn = ["Date", "Description", "Category", "Amount"];
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
  const totalRow = ["", "", "Total", totalExpenses.toFixed(2)];
  tableRows.push(totalRow);


  doc.autoTable({
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
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
    },
    foot: [
      [{ content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, { content: totalExpenses.toFixed(2), styles: { fontStyle: 'bold' } }]
    ],
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: 0,
      fontStyle: 'bold'
    }
  });

  doc.save('expenses.pdf');
};
