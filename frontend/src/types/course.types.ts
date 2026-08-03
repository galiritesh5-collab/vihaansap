export interface Course {
  id: string;
  name: string;
  duration: string;
  modules: number;
  status: 'Active' | 'Draft' | 'Archived';
  thumbnail?: string;
}

export interface SAPCourse {
  [key: string]: any;
  id: string;
  name: string;
  description: string;
  duration: string;
  mode: string;
  icon?: any;
  modules: any[];
  syllabus?: string[];
  careerOpportunities?: string[];
  features: string[];
  rating?: number;
  thumbnail?: string;
  code?: string;
  isLive?: boolean;
  showSkillLevel?: boolean;
  level?: string;
  showDuration?: boolean;
  showRating?: boolean;
  showButtons?: boolean;
  buttonExploreText?: string;
  buttonRegisterDisabled?: boolean;
  buttonRegisterText?: string;
}

export interface Batch {
  id: string;
  name: string;
  course: string;
  mentor: string;
  students: number;
  maxStudents: number;
  startDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  externalReviewLink?: string;
  studentIds?: string[];
}

export interface ClassSchedule {
  id: string;
  topic: string;
  date: string;
  time: string;
  mentor: string;
  batch: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  meetingLink?: string;
  recordingUrl?: string;
}

export interface PlannerTopicItem {
  id: string;
  title: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  subTopics?: { id: string; title: string; status: 'Upcoming' | 'Completed' }[];
}

export interface BatchPlannerWeek {
  id: string;
  batchId: string;
  weekNumber: number;
  title: string;
  topics: string[];
  topicItems?: PlannerTopicItem[];
  status?: 'Upcoming' | 'In Progress' | 'Completed';
}

export interface SubTopic {
  id: string;
  title: string;
  date: string;
  notes?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface BatchSession {
  id: string;
  batchId: string;
  topic: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  meetingLink?: string;
  recordingUrl?: string;
  subTopics?: SubTopic[];
  syllabusIndex?: number;
  visibleFrom?: string;
  visibleUntil?: string;
}

export interface StudyMaterial {
  id: string;
  batchId: string;
  title: string;
  description?: string;
  type: 'PDF' | 'PPT' | 'PPTX' | 'DOC' | 'DOCX' | 'Excel' | 'ZIP' | 'TXT' | 'Images' | 'Video Links' | 'Google Drive Links' | 'OneDrive Links' | 'Microsoft Teams Files' | 'Link' | string;
  url: string;
  uploadDate: string;
  visibility?: 'Students' | 'Hidden';
  downloadAllowed?: boolean;
  sessionId?: string;
  visibilitySettings?: { mode: 'All' | 'Selected'; studentIds?: string[] };
}

export interface Recording {
  id: string;
  title: string;
  courseName: string;
  batchId?: string;
  description?: string;
  receiptNo?: string;
  purpose?: string;
  date: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  source?: string;
  visibility?: 'Students' | 'Hidden';
  topic?: string;
  uploadDate?: string;
  visibilitySettings?: { mode: 'All' | 'Selected'; studentIds?: string[] };
}
