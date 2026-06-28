export interface SAPCourse {
  id: string;
  code: string;
  name: string;
  category: 'Functional' | 'Technical' | 'Cloud' | 'Administrative';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  description: string;
  fullDetails?: string[];
  syllabus?: string[];
  isLive: boolean;
  isUpcoming?: boolean;
  rating: number;
}

export interface StudentReview {
  id: string;
  name: string;
  avatar: string;
  module: string;
  rating: number;
  text: string;
  date: string;
  designation?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Courses' | 'Schedule' | 'Careers';
}

export interface ClassSchedule {
  id: string;
  courseName: string;
  instructor: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  meetingLink?: string;
}

export interface Recording {
  id: string;
  title: string;
  courseName: string;
  duration: string;
  uploadDate: string;
  videoUrl: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  grade?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  purpose: string;
  status: 'Paid' | 'Processing' | 'Failed';
  receiptNo: string;
}
