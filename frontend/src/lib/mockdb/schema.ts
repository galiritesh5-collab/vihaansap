import { Lead, ServerAccessConfig, ServerEnquiry } from '../../types';

export interface DatabaseSchema {
  courses: any[];
  schemaVersion?: number;
  coursesSeeded?: boolean;
  coursesSeeded_v2?: boolean;
  coursesSeeded_v3?: boolean;
  coursesSeeded_v4?: boolean;
  coursesSeeded_v5?: boolean;
  coursesSeeded_v6?: boolean;
  coursesSeeded_v7?: boolean;
  coursesSeeded_v8?: boolean;
  coursesSeeded_v9?: boolean;
  students: any[];
  mentors: any[];
  batches: any[];
  batchPlanner: any[];
  batchSessions: any[];
  liveClasses: any[];
  studyMaterials: any[];
  sessionFeedback: any[];
  courseRatings: any[];
  blogs: any[];
  reviews: any[];
  reviewCampaigns: any[];
  faqs: any[];
  schedules: any[];
  recordings: any[];
  assignments: any[];
  payments: any[];
  doubts: any[];
  doubtReplies: any[];
  notifications: any[];
  events: any[];
  leads: Lead[];
  websiteContent: {
    heroTitle: string;
    heroSubtitle: string;
    contactEmail: string;
    contactPhone: string;
  };
  serverAccessConfig?: ServerAccessConfig;
  serverEnquiries?: ServerEnquiry[];
  accounts?: any[];
  serverPayments?: any[];
}
