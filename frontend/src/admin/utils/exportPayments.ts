import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const jsPDFWithPlugin = jsPDF as any;

export const exportPaymentsExcel = (accounts: any[]) => {
  const wsData = [
    ['Payments Export'],
    ['Generated', new Date().toLocaleDateString()],
    [],
    ['Student', 'Batch', 'Course', 'Installments', 'Paid Amount', 'Pending Amount', 'Due Date', 'Status', 'Payment Date', 'Receipt Number']
  ];

  accounts.forEach(acc => {
    acc.installments?.forEach((inst: any) => {
      wsData.push([
        acc.studentName,
        acc.batchName,
        acc.courseName,
        acc.installments.length,
        inst.status === 'Paid' ? inst.amount : 0,
        inst.status !== 'Paid' ? inst.amount : 0,
        inst.dueDate,
        inst.status,
        inst.paidDate || 'N/A',
        inst.receiptNo || 'N/A'
      ]);
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Payments');
  XLSX.writeFile(wb, `Payments_Export.xlsx`);
};

export const exportPaymentsCSV = (accounts: any[]) => {
  const headers = ['Student', 'Batch', 'Course', 'Installments', 'Paid Amount', 'Pending Amount', 'Due Date', 'Status', 'Payment Date', 'Receipt Number'];
  
  const rows = accounts.flatMap(acc => 
    (acc.installments || []).map((inst: any) => [
      `"${acc.studentName}"`,
      `"${acc.batchName}"`,
      `"${acc.courseName}"`,
      acc.installments.length,
      inst.status === 'Paid' ? inst.amount : 0,
      inst.status !== 'Paid' ? inst.amount : 0,
      `"${inst.dueDate}"`,
      `"${inst.status}"`,
      `"${inst.paidDate || 'N/A'}"`,
      `"${inst.receiptNo || 'N/A'}"`
    ].join(','))
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Payments_Export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPaymentsPDF = (accounts: any[]) => {
  const doc = new jsPDFWithPlugin();
  
  doc.setFontSize(20);
  doc.text('Sri Vihaan SAP Consulting', 14, 22);
  
  doc.setFontSize(14);
  doc.text('Payments Report', 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 40);

  const tableData = accounts.flatMap(acc => 
    (acc.installments || []).map((inst: any) => [
      acc.studentName,
      acc.batchName,
      inst.amount.toString(),
      inst.dueDate,
      inst.status,
      inst.paidDate || 'N/A'
    ])
  );

  doc.autoTable({
    startY: 48,
    head: [['Student', 'Batch', 'Amount', 'Due Date', 'Status', 'Paid Date']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] } // Indigo-600
  });

  doc.save(`Payments_Export.pdf`);
};
