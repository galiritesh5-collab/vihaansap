export interface Student {
  id: string;
  uid?: string;
  role?: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  photoUrl?: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  joinDate: string;
  lastLogin?: string;
}

export interface StudentReview {
  id: string;
  name: string;
  role: string;
  company?: string;
  image?: string;
  content: string;
  rating?: number;
  text?: string;
  avatar?: string;
  module?: string;
  course: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  campaignId?: string;
  trainerRating?: number;
  contentRating?: number;
  supportRating?: number;
  recommend?: boolean;
  batchId?: string;
  batchName?: string;
  // Additional properties for backward compatibility with older review objects
  student?: string;
  studentName?: string;
  designation?: string;
  courseName?: string;
  feedback?: string;
  review?: string;
}

export interface CourseRating {
  id: string;
  batchId: string;
  courseId: string;
  studentId: string;
  overallRating: number;
  comments: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  batchId: string;
  studentId: string;
  helpful: boolean;
  rating?: number;
  text?: string;
  avatar?: string;
  module?: string;
  comments: string;
  date: string;
}

export interface Assignment {
  id: string;
  batchId: string;
  title: string;
  description: string;
  dueDate: string;
  marks: number;
  status: 'Active' | 'Closed' | 'Graded' | 'Submitted' | 'Pending';
  courseName?: string;
  grade?: string;
  topic?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  method: string;
  invoiceUrl?: string;
  receiptNo?: string;
  purpose?: string;
  courseName: string;
}

export interface ReviewCampaign {
  id: string;
  batchId: string;
  name: string;
  description: string;
  externalLink?: string;
  recipientIds: string[];
  status: 'Active' | 'Closed';
  createdAt: string;
  createdBy: string;
}
