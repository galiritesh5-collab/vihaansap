import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Fix for TypeScript complaining about jspdf-autotable injection
const jsPDFWithPlugin = jsPDF as any;

export const exportBatchExcel = (batch: any, students: any[], accounts: any[]) => {
  const wsData = [
    ['Batch Details'],
    ['Batch Name', batch.name],
    ['Course', batch.course],
    ['Mentor', batch.mentor],
    ['Duration', batch.duration || 'N/A'],
    ['Total Students', students.length],
    [],
    ['Student Details'],
    ['Name', 'Email', 'Phone', 'Enrollment Date', 'Attendance', 'Status', 'Total Fee', 'Paid Amount', 'Pending Amount']
  ];

  students.forEach(s => {
    const account = accounts.find(a => a.studentId === s.id && a.batchId === batch.id);
    const paid = account?.installments?.filter((i: any) => i.status === 'Paid').reduce((sum: number, i: any) => sum + i.amount, 0) || 0;
    const pending = account?.installments?.filter((i: any) => i.status !== 'Paid').reduce((sum: number, i: any) => sum + i.amount, 0) || 0;
    const totalFee = account?.netFee || 0;
    
    wsData.push([
      s.name,
      s.email,
      s.phone || 'N/A',
      s.enrollmentDate || s.joinDate || 'N/A',
      s.attendance || '0%',
            s.status || 'Active',
      totalFee,
      paid,
      pending
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Batch Data');
  XLSX.writeFile(wb, `${batch.name}_Export.xlsx`);
};

export const exportBatchCSV = (batch: any, students: any[], accounts: any[]) => {
  const headers = ['Name', 'Email', 'Phone', 'Enrollment Date', 'Attendance', 'Status', 'Total Fee', 'Paid Amount', 'Pending Amount'];
  
  const rows = students.map(s => {
    const account = accounts.find(a => a.studentId === s.id && a.batchId === batch.id);
    const paid = account?.installments?.filter((i: any) => i.status === 'Paid').reduce((sum: number, i: any) => sum + i.amount, 0) || 0;
    const pending = account?.installments?.filter((i: any) => i.status !== 'Paid').reduce((sum: number, i: any) => sum + i.amount, 0) || 0;
    const totalFee = account?.netFee || 0;
    
    return [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.phone || 'N/A'}"`,
      `"${s.enrollmentDate || s.joinDate || 'N/A'}"`,
      `"${s.attendance || '0%'}"`,
      `"${s.progress || 0}%"`,
      `"${s.status || 'Active'}"`,
      totalFee,
      paid,
      pending
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${batch.name}_Export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportBatchPDF = (batch: any, students: any[], accounts: any[]) => {
  const doc = new jsPDFWithPlugin();
  
  doc.setFontSize(20);
  doc.text('Sri Vihaan SAP Consulting', 14, 22);
  
  doc.setFontSize(14);
  doc.text(`Batch Report: ${batch.name}`, 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Course: ${batch.course}`, 14, 40);
  doc.text(`Mentor: ${batch.mentor}`, 14, 46);
  doc.text(`Students: ${students.length}`, 14, 52);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 58);

  const tableData = students.map(s => {
    const account = accounts.find(a => a.studentId === s.id && a.batchId === batch.id);
    const paid = account?.installments?.filter((i: any) => i.status === 'Paid').reduce((sum: number, i: any) => sum + i.amount, 0) || 0;
    const pending = account?.installments?.filter((i: any) => i.status !== 'Paid').reduce((sum: number, i: any) => sum + i.amount, 0) || 0;
    return [
      s.name,
      s.phone || 'N/A',
      s.status || 'Active',
            paid.toString(),
      pending.toString()
    ];
  });

  doc.autoTable({
    startY: 65,
    head: [['Name', 'Phone', 'Status', 'Paid', 'Pending']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] } // Indigo-600
  });

  doc.save(`${batch.name}_Export.pdf`);
};
