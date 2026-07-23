export interface Mentor {
  id: string;
  uid?: string;
  role?: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  qualification?: string;
  experience?: string;
  designation?: string;
  profilePhoto?: string;
  bio?: string;
  notes?: string;
  assignedBatchIds?: string[];
  status: 'Active' | 'Inactive';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'alert' | 'success';
  target: 'Everyone' | 'Students' | 'Mentors' | 'Batch' | 'Course' | 'Specific Student';
  targetId?: string;
  visibilitySettings?: { mode: 'All' | 'Selected'; studentIds?: string[] };
  isFeedbackRequest?: boolean;
}

export interface DoubtTicket {
  id: string;
  studentId: string;
  studentName?: string;
  batchId?: string;
  subject: string;
  description: string;
  status: 'Pending' | 'Answered' | 'Closed';
  date: string;
  responses?: DoubtResponse[];
}

export interface DoubtResponse {
  id: string;
  authorId: string;
  authorName: string;
  role: 'student' | 'admin' | 'mentor';
  message: string;
  date: string;
}

export interface SystemEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'Holiday' | 'Batch Start' | 'Batch End' | 'Live Class' | 'Placement Event' | 'Other';
  target: 'Everyone' | 'Students' | 'Batch';
  targetId?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
  id?: string;
}

export interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  paidDate?: string;
}

export interface StudentAccount {
  id: string;
  studentId: string;
  studentName: string;
  courseName: string;
  totalFee: number;
  admissionDate: string;
  installments: Installment[];
}

export interface ServerPayment {
  id: string;
  studentName: string;
  serverDuration: string;
  serverAmount: number;
  purchaseDate: string;
  expiryDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface PaymentHistoryRecord {
  id: string;
  studentId?: string;
  studentName: string;
  date: string;
  amount: number;
  purpose: string;
  installmentNumber?: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  remarks?: string;
}
