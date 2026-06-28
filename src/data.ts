import { SAPCourse, StudentReview, FAQItem, ClassSchedule, Recording, Assignment, PaymentRecord } from './types';

export const SAP_COURSES: SAPCourse[] = [
  {
    id: 'sap-fico',
    code: 'FICO',
    name: 'SAP FICO (Financial & Controlling)',
    category: 'Functional',
    level: 'Beginner',
    duration: '10 Weeks (Live Virtual)',
    description: 'Master core accounting controls, general ledger, accounts payable/receivable, asset management, and cost center accounting.',
    isLive: true,
    rating: 4.8,
    fullDetails: [
      'Comprehensive accounting configuration from scratch',
      'Hands-on execution of live SAP general ledger transactions',
      'Integration configurations with SAP Material Management (MM) and Sales (SD)',
      'Controlling sub-module covers: Cost Center, Profit Center, and Internal Order accounting'
    ],
    syllabus: [
      'Introduction to ERP & SAP Navigation Architecture',
      'Enterprise Structure Setup (Company Code, Business Area)',
      'General Ledger Accounting (Chart of Accounts, Document Control)',
      'Accounts Payable & Accounts Receivable Configurations',
      'Asset Accounting Concepts and Depreciation Runs',
      'Cost Center Accounting & Profit Center Configuration',
      'Year-End & Month-End Closing Activities',
      'Real-Time Project Scenarios & Career Review'
    ]
  },
  {
    id: 'sap-mm',
    code: 'MM',
    name: 'SAP MM (Materials Management)',
    category: 'Functional',
    level: 'Beginner',
    duration: '8 Weeks (Live Virtual)',
    description: 'Learn complete procurement lifecycle, inventory management, purchasing workflows, material requirements planning (MRP), and invoice verification.',
    isLive: true,
    rating: 4.7,
    fullDetails: [
      'End-to-end procurement processes from purchase requisition to invoice validation',
      'Configuring complex inventory layouts, movement types, and storage parameters',
      'Material requirements planning (MRP) models and master data maintenance',
      'Vendor master files setup alongside material pricing schemas'
    ],
    syllabus: [
      'Introduction to SAP Logistics & Procurement Framework',
      'Organizational structure (Plants, Storage Locations, Purchasing Orgs)',
      'Material Master & Vendor Master Configurations',
      'Purchase Requisition & Purchase Order Management',
      'Pricing Procedure Determination & Schema Layouts',
      'Inventory Management (Goods Receipt, Goods Issue, Transfers)',
      'Invoice Verification (Three-way match logic)',
      'Real-time Assignments, Integration with FICO & SD'
    ]
  },
  {
    id: 'sap-sd',
    code: 'SD',
    name: 'SAP SD (Sales & Distribution)',
    category: 'Functional',
    level: 'Beginner',
    duration: '9 Weeks (Live Virtual)',
    description: 'Optimize order-to-cash process, customer partner determination, logistics execution, shipping operations, and customer billing routines.',
    isLive: true,
    rating: 4.9,
    fullDetails: [
      'Analyze the complete Order-To-Cash (OTC) sales cycle',
      'Master material scheduling, transportation planning, and partner functions',
      'Design advanced pricing rules, conditional taxes, and promotion setups',
      'Integrate seamlessly with SAP FI/CO for instant revenue posting'
    ],
    syllabus: [
      'Introduction to SAP SD & Enterprise Structures',
      'Customer Master & Material Master for Sales Operations',
      'Partner Functions & Partner Determination Setup',
      'Sales Document Structure (Inquiry, Quotation, Sales Order)',
      'Pricing Scenarios (Condition Techniques & Surcharges)',
      'Shipping Operations & Outbound Deliveries',
      'Billing (Invoicing, Credit & Debit Memos)',
      'Order-to-Cash Cycle (OTC) Integrated Scenario Run'
    ]
  },
  {
    id: 'sap-abap',
    code: 'ABAP',
    name: 'SAP ABAP (Advanced Business Application Programming)',
    category: 'Technical',
    level: 'Beginner',
    duration: '12 Weeks (Live Virtual)',
    description: 'The foundation of SAP programming. Master reports, data dictionary, dialog programming, smartforms, BAPIs, and user exits.',
    isLive: true,
    rating: 4.9,
    fullDetails: [
      'Deep dive into SAP programming syntax and internal database concepts',
      'Data Dictionary configuration including custom database tables, structures, and search helps',
      'Developing Object-Oriented ABAP, ALV Grid reports, and interactive selections',
      'Debugging applications, memory variables tracking, and application profiling'
    ],
    syllabus: [
      'ABAP Runtime Environment & Basic Open-SQL Syntax',
      'Data Dictionary (Tables, Views, Data Elements, Domains)',
      'Internal Tables Management & Modularization Techniques',
      'ALV Reporting (Classical, Interactive, and Object-oriented)',
      'Module Pool Programming (Dialog User Interfaces)',
      'Enhancements & Modifications (User Exits, BADIs, BAPIs)',
      'Smart Forms & Adobe Interactive Forms Intro',
      'Real-world debugging scenarios and performance tuning'
    ]
  },
  {
    id: 'sap-hcm',
    isUpcoming: true,
    code: 'HCM',
    name: 'SAP HCM (Human Capital Management)',
    category: 'Functional',
    level: 'Intermediate',
    duration: '8 Weeks (Live Virtual)',
    description: 'Manage human resources, organizational design, personnel administration, recruitment workflows, and time tracking logs.',
    isLive: true,
    rating: 4.6,
    fullDetails: [
      'Establish human resource hierarchies and reporting dependencies',
      'Maintain reliable personnel administration and info-type setups',
      'Configure time management schemes and attendance evaluation rules',
      'Core payroll setups and integration mappings with corporate finance reports'
    ],
    syllabus: [
      'Concepts of SAP HCM & Payroll Architecture',
      'Organizational Management (Objects, Jobs, Relationships)',
      'Personnel Administration (Infotypes, Actions, Personnel File)',
      'Recruitment & Onboarding Workflows Configurations',
      'Time Management (Schedules, Absences, Quota Generation)',
      'Payroll Management Core Concepts',
      'HCM Integration with Financial Controlling'
    ]
  },
  {
    id: 'sap-basis',
    isUpcoming: true,
    code: 'BASIS',
    name: 'SAP BASIS (System Administration)',
    category: 'Technical',
    level: 'Advanced',
    duration: '10 Weeks (Live Virtual)',
    description: 'Learn system administration, user authorizations, security profiles, database backup patterns, system installation, and performance tuning.',
    isLive: true,
    rating: 4.8,
    fullDetails: [
      'System installation, client administration, and secure system landscape transport protocols',
      'Complete user role provisioning, profile generator parameters, and authorization structures',
      'Application server background job monitors and memory parameters optimization',
      'Database integration updates and troubleshooting live connection failures'
    ],
    syllabus: [
      'SAP System Architecture & Basis Administration Overview',
      'Client Maintenance (Creation, Copies, Deletions)',
      'User Management & Role/Authorization Design (PFCG)',
      'SAP Change and Transport System (TMS Process)',
      'Spool Administration (Print and Output controls)',
      'Background Jobs Scheduling & Monitoring Parameters',
      'Performance Monitoring, System Logs & Database Checks'
    ]
  },
  {
    id: 'sap-pp',
    isUpcoming: true,
    code: 'PP',
    name: 'SAP PP (Production Planning)',
    category: 'Functional',
    level: 'Intermediate',
    duration: '8 Weeks (Live Virtual)',
    description: 'Master manufacturing processes, bills of materials (BOM), routing details, production orders, and capacity planning parameters.',
    isLive: false,
    rating: 4.5,
    fullDetails: [
      'Define production routing processes and bills of materials',
      'Configure Material Requirements Planning (MRP) calculations and capacity checks',
      'Execute assembly operations, back-flushing, and material issuance plans',
      'Support Discrete, Repetitive, and Kanban manufacturing configurations'
    ],
    syllabus: [
      'Introduction to SAP Supply Chain Planning',
      'Master Data Creation (BOM, Routing, Work Center)',
      'Sales and Operations Planning (SOP Rules)',
      'Demand Management (Independent Requirements Planning)',
      'Master Production Scheduling & MRP (Material Requirements Planning)',
      'Production Order Creation, Confirmation & Receipts',
      'Capacity Planning & Load Balancing Adjustments'
    ]
  },
  {
    id: 'sap-successfactors',
    isUpcoming: true,
    code: 'SF',
    name: 'SAP SuccessFactors (Cloud HR)',
    category: 'Cloud',
    level: 'Intermediate',
    duration: '10 Weeks (Live Virtual)',
    description: 'Implement modern cloud-hosted Human Capital Management. Cover Employee Central, performance tracking, dynamic goals, and cloud learning systems.',
    isLive: true,
    rating: 4.9,
    fullDetails: [
      'Learn cloud HR setups, foundation object models, and role permissions settings',
      'Design interactive employee workflows and automatic notification emails',
      'Generate visual performance reports and goal alignment matrices',
      'Implement global employee compensation schemes'
    ],
    syllabus: [
      'Introduction to Cloud HR & SuccessFactors Admin Center',
      'Employee Central Foundation (Data models & Core Objects)',
      'Role-Based Permissions (RBP Setup & Management)',
      'Performance and Goals Configuration (PMGM Module)',
      'Recruiting Management Cloud Layouts and Workflows',
      'Learning Management Systems Integration (LMS Setup)',
      'Cloud Provisioning Concepts & API integration configurations'
    ]
  }
];

export const STUDENT_REVIEWS: StudentReview[] = [
  {
    id: 'rev-1',
    name: 'Anjali Sharma',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    module: 'SAP FICO Consultant',
    rating: 5,
    text: 'Sri Vihaan Consulting completely transformed my career path! Coming from a generic B.Com background, I had zero SAP experience. The trainer explained configurations step-by-step. The real-time assignments and projects gave me the confidence to face technical interviews successfully! Highly recommended.',
    date: '2026-04-12',
    designation: ''
  },
  {
    id: 'rev-2',
    name: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    module: 'SAP ABAP Consultant',
    rating: 5,
    text: 'The ABAP training at Sri Vihaan Consulting was incredible. It focused deeply on syntax, data dictionary, and debugging techniques. Not just boilerplate code but real optimization, performance tuning, and how to write production-ready code. Handled with fantastic precision!',
    date: '2026-05-18',
    designation: ''
  },
  {
    id: 'rev-3',
    name: 'Karthik Rao',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    module: 'SAP MM Consultant',
    rating: 4,
    text: 'Excellent structure, well-organized classes, and fantastic session recordings that saved me multiple times when my work timings conflicted. The integration scenarios with FICO and SD modules were the highlight for me, as they reflect actual complex enterprise configurations.',
    date: '2026-05-29',
    designation: ''
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What is SAP and why are SAP skills highly valued?',
    answer: 'SAP (Systems, Applications, and Products in Data Processing) is the world leader in enterprise application software (ERP). Over 80% of Fortune 500 corporations run SAP to connect back-office operations. Since enterprise setups are highly complex, skilled SAP professionals are crucial for implementation, upgrades, and support. This high reliance leads to fantastic global career growth, premium starting salaries, and immense career stability.'
  },
  {
    id: 'faq-2',
    category: 'Careers',
    question: 'Do I need programming/coding knowledge to learn SAP?',
    answer: 'No coding is required for Functional modules! Modules like SAP FICO, SAP MM, and SAP SD rely on establishing business rules, workflow mapping, and parameters configurations inside the SAP GUI. Only Technical modules, primarily SAP ABAP, require standard software development knowledge and custom coding.'
  },
  {
    id: 'faq-3',
    category: 'Schedule',
    question: 'Are the training classes conducted live online?',
    answer: 'Yes! All classes are interactive, 100% live virtual sessions. Students join via online video conferencing, can share their screen, interact with trainers instantly, ask live questions, and participate in walk-throughs. You also receive high-speed cloud access to the actual sandbox SAP Server environment for practice.'
  },
  {
    id: 'faq-4',
    category: 'Schedule',
    question: 'Will recordings of the sessions be made available?',
    answer: 'Absolutely. Every live class is recorded and uploaded to your student portal dashboard within 2-3 hours of class completion. You gain lifetime access to these session videos, which allows you to review complex configs, catch up in case you miss a class, and study at your comfortable pace.'
  },
  {
    id: 'faq-5',
    category: 'Courses',
    question: 'Which SAP module is the best fit for beginners?',
    answer: 'It depends on your current domain background: (1) Finance/Accounting graduates should choose SAP FICO. (2) Supply chain, engineering, or operations backgrounds match perfectly with SAP MM or SAP PP. (3) Marketing, retail, or sales backgrounds fit SAP SD. (4) HR professionals should pursue SAP HCM or SuccessFactors. (5) Software programmers and IT developers fit SAP ABAP or SAP BASIS.'
  },
  {
    id: 'faq-6',
    category: 'Careers',
    question: 'Does Sri Vihaan Consulting provide placement or Career Support?',
    answer: 'Yes, we provide extensive career orientation support! Once you complete your course, we offer complete guidance including: custom Career Guidance (customized for SAP opportunities), LinkedIn profile indexing tips, dynamic mock technical interviews, and direct portfolio advice based on real-world industrial implementation scenarios.'
  },
  {
    id: 'faq-7',
    category: 'General',
    question: 'Are free demo classes available before enrollment?',
    answer: 'Yes! We support complete transparency. You can click "Book Free Demo" on our header or navbar, complete a simple form, and join a live introductory demo session. This lets you observe our instructors, inspect the SAP training infrastructure, review the course curriculum, and confirm if SAP matches your professional objectives.'
  }
];

// Mock dashboard schedules, videos, assignments, payments for students/admins
export const MOCK_SCHEDULES: ClassSchedule[] = [
  {
    id: 'sch-1',
    courseName: 'SAP FICO (Financial & Controlling)',
    instructor: 'Mr. Vivek Naidu (SAP Expert, 15+ Yrs)',
    date: '2026-06-13',
    time: '07:30 PM - 09:00 PM IST',
    status: 'Upcoming',
    meetingLink: 'https://meet.google.com/mock-sap-fico'
  },
  {
    id: 'sch-2',
    courseName: 'SAP ABAP Programming',
    instructor: 'Mr. Satish Kumar (Lead SAP Developer)',
    date: '2026-06-13',
    time: '09:00 AM - 10:30 AM IST',
    status: 'Upcoming',
    meetingLink: 'https://meet.google.com/mock-sap-abap'
  },
  {
    id: 'sch-3',
    courseName: 'SAP FICO (Financial & Controlling)',
    instructor: 'Mr. Vivek Naidu (SAP Expert, 15+ Yrs)',
    date: '2026-06-09',
    time: '07:30 PM - 09:00 PM IST',
    status: 'Live',
    meetingLink: 'https://meet.google.com/mock-sap-fico-live'
  },
  {
    id: 'sch-4',
    courseName: 'SAP MM Materials Management',
    instructor: 'Mrs. Rekha Rao (SAP Logistics Lead)',
    date: '2026-06-08',
    time: '06:00 PM - 07:30 PM IST',
    status: 'Completed'
  }
];

export const MOCK_RECORDINGS: Recording[] = [
  {
    id: 'rec-1',
    title: 'Session 04: General Ledger Accounts & Document Splitting',
    courseName: 'SAP FICO',
    duration: '1 hr 32 mins',
    uploadDate: '2026-06-08',
    videoUrl: '#'
  },
  {
    id: 'rec-2',
    title: 'Session 03: Company Code Parameters & Posting Periods',
    courseName: 'SAP FICO',
    duration: '1 hr 45 mins',
    uploadDate: '2026-06-05',
    videoUrl: '#'
  },
  {
    id: 'rec-3',
    title: 'Session 05: Data Dictionary & Custom Database Tables',
    courseName: 'SAP ABAP',
    duration: '1 hr 28 mins',
    uploadDate: '2026-06-07',
    videoUrl: '#'
  },
  {
    id: 'rec-4',
    title: 'Session 04: Internal Tables & Open SQL Joins',
    courseName: 'SAP ABAP',
    duration: '1 hr 52 mins',
    uploadDate: '2026-06-04',
    videoUrl: '#'
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Configure Company Code FI04 & Posting Period Variant',
    courseName: 'SAP FICO',
    dueDate: '2026-06-15',
    status: 'Pending'
  },
  {
    id: 'asg-2',
    title: 'Setup Custom Table ZSTU_INFO in ABAP Dictionary',
    courseName: 'SAP ABAP',
    dueDate: '2026-06-14',
    status: 'Submitted'
  },
  {
    id: 'asg-3',
    title: 'Define Chart of Accounts and Assign to Company Code',
    courseName: 'SAP FICO',
    dueDate: '2026-06-06',
    status: 'Graded',
    grade: 'A+'
  }
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    date: '2026-05-10',
    amount: 18500,
    purpose: 'SAP FICO Complete Module - Installment 1',
    status: 'Paid',
    receiptNo: 'REC-2026-9812'
  },
  {
    id: 'pay-2',
    date: '2026-06-05',
    amount: 18500,
    purpose: 'SAP FICO Complete Module - Installment 2',
    status: 'Paid',
    receiptNo: 'REC-2026-1049'
  }
];
