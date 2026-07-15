import { SAPCourse, StudentReview, FAQItem, ClassSchedule, Recording, Assignment, PaymentRecord } from './types';

export const SAP_COURSES: SAPCourse[] = [
  {
    "id": "sap-fico",
    "name": "SAP FICO (Financial & Controlling)",
    "tag": "SAP FUNCTIONAL",
    "category": "Functional",
    "description": "Master core accounting controls, general ledger, accounts payable/receivable, asset management and cost center accounting.",
    "features": [
      "Comprehensive accounting configuration from scratch",
      "Integration configurations with SAP Material Management (MM) and Sales (SD)",
      "Hands-on execution of live SAP general ledger transactions",
      "Cost center allocation, month-end close, Cost Center, Profit Center, and Internal Order accounting"
    ],
    "duration": "10 Weeks (Live Virtual)",
    "level": "BEGINNER",
    "sandboxPractice": "24/7 Cloud Access",
    "rating": 4.8,
    "status": "Live",
    "isUpcoming": false,
    "isLive": true,
    "code": "FICO",
    "modules": [],
    "buttonExploreText": "Explore Syllabus",
    "buttonRegisterDisabled": false,
    "buttonRegisterText": "Inquire Now",
    "showButtons": true,
    "showRating": true,
    "showDuration": true,
    "showSkillLevel": true,
    "fullDetails": [
      "Comprehensive accounting configuration from scratch",
      "Integration configurations with SAP Material Management (MM) and Sales (SD)",
      "Hands-on execution of live SAP general ledger transactions",
      "Cost center allocation, month-end close, Cost Center, Profit Center, and Internal Order accounting"
    ],
    "mode": "Live Virtual",
    "thumbnail": "",
    "banner": "",
    "syllabus": [
      "Introduction to SAP ERP and S/4HANA Finance",
      "Enterprise Structure Configuration",
      "Financial Accounting Global Settings (FAGS)",
      "General Ledger (GL) Accounting",
      "Accounts Payable (AP) and Accounts Receivable (AR)",
      "Bank Accounting and Cash Management",
      "Asset Accounting Configuration",
      "Controlling (CO) Master Data and Cost Element Accounting",
      "Cost Center and Profit Center Accounting",
      "Integration with MM and SD Modules",
      "Month-End and Year-End Closing Processes"
    ]
  },
  {
    "id": "sap-mm",
    "name": "SAP MM (Materials Management)",
    "tag": "SAP FUNCTIONAL",
    "category": "Functional",
    "description": "Learn complete procurement lifecycle, inventory management, purchasing workflow, material requirements planning (MRP), and invoice verification.",
    "features": [
      "End-to-end procurement process from purchase requisition to invoice validation",
      "Material requirements planning (MRP) and master data creation",
      "Configuring complex purchasing formats, requests, and vendor management",
      "Inventory management with cycle counting, integrated warehouse management"
    ],
    "duration": "8 Weeks (Live Virtual)",
    "level": "BEGINNER",
    "sandboxPractice": "24/7 Cloud Access",
    "rating": 4.7,
    "status": "Live",
    "isUpcoming": false,
    "isLive": true,
    "code": "MM",
    "modules": [],
    "buttonExploreText": "Explore Syllabus",
    "buttonRegisterDisabled": false,
    "buttonRegisterText": "Inquire Now",
    "showButtons": true,
    "showRating": true,
    "showDuration": true,
    "showSkillLevel": true,
    "fullDetails": [
      "End-to-end procurement process from purchase requisition to invoice validation",
      "Material requirements planning (MRP) and master data creation",
      "Configuring complex purchasing formats, requests, and vendor management",
      "Inventory management with cycle counting, integrated warehouse management"
    ],
    "mode": "Live Virtual",
    "thumbnail": "",
    "banner": "",
    "syllabus": [
      "Introduction to SAP Materials Management (MM)",
      "Enterprise Structure and Organizational Units in MM",
      "Master Data: Material, Vendor, and Purchasing Info Records",
      "Source Determination and Procurement Process",
      "Purchasing: Requisitions, Quotations, and Purchase Orders",
      "Inventory Management: Goods Movements and Physical Inventory",
      "Material Requirements Planning (MRP) Configuration",
      "Invoice Verification and Account Determination",
      "Valuation and Account Assignment",
      "Integration of MM with FICO and SD"
    ]
  },
  {
    "id": "sap-sd",
    "name": "SAP SD (Sales & Distribution)",
    "tag": "SAP FUNCTIONAL",
    "category": "Functional",
    "description": "Optimize order-to-cash process, customer partner determination, logistics execution, shipping operations, and customer billing routines.",
    "features": [
      "Analyze the complete Order-To-Cash (OTC) sales cycle",
      "Master material scheduling, transportation planning, and shipment partner functions",
      "Integrated pricing rules, conditional taxes, and discounts",
      "Integration seamlessly with SAP FI/CO for instant revenue postings"
    ],
    "duration": "9 Weeks (Live Virtual)",
    "level": "BEGINNER",
    "sandboxPractice": "24/7 Cloud Access",
    "rating": 4.9,
    "status": "Live",
    "isUpcoming": false,
    "isLive": true,
    "code": "SD",
    "modules": [],
    "buttonExploreText": "Explore Syllabus",
    "buttonRegisterDisabled": false,
    "buttonRegisterText": "Inquire Now",
    "showButtons": true,
    "showRating": true,
    "showDuration": true,
    "showSkillLevel": true,
    "fullDetails": [
      "Analyze the complete Order-To-Cash (OTC) sales cycle",
      "Master material scheduling, transportation planning, and shipment partner functions",
      "Integrated pricing rules, conditional taxes, and discounts",
      "Integration seamlessly with SAP FI/CO for instant revenue postings"
    ],
    "mode": "Live Virtual",
    "thumbnail": "",
    "banner": "",
    "syllabus": [
      "Introduction to SAP Sales and Distribution",
      "SD Enterprise Structure and Master Data",
      "Order-to-Cash (O2C) Cycle and Sales Document Processing",
      "Pricing Procedures and Condition Techniques",
      "Item Category and Schedule Line Category Determination",
      "Delivery Processing and Logistics Execution",
      "Billing Processes and Invoice Creation",
      "Credit Management and Risk Control",
      "Output Management and Partner Determination",
      "SD Integration with MM and FICO"
    ]
  },
  {
    "id": "sap-abap",
    "name": "SAP ABAP (Advanced Business Application Programming)",
    "tag": "SAP TECHNICAL",
    "category": "Technical",
    "description": "The foundation of SAP programming. Master reports, data dictionary, dialog programming, interfaces, BAPIs, and user exits.",
    "features": [
      "Deep dive into SAP programming syntax and internal database structures",
      "Developing Object-Oriented ABAP, ALV Grid reports, and enhancement techniques",
      "Data Dictionary configuration including custom database tables, structures, and views",
      "Debugging applications, memory variable tracking, and performance profiling"
    ],
    "duration": "12 Weeks (Live Virtual)",
    "level": "BEGINNER",
    "sandboxPractice": "24/7 Cloud Access",
    "rating": 4.9,
    "status": "Live",
    "isUpcoming": false,
    "isLive": true,
    "code": "ABAP",
    "modules": [],
    "buttonExploreText": "Explore Syllabus",
    "buttonRegisterDisabled": false,
    "buttonRegisterText": "Inquire Now",
    "showButtons": true,
    "showRating": true,
    "showDuration": true,
    "showSkillLevel": true,
    "fullDetails": [
      "Deep dive into SAP programming syntax and internal database structures",
      "Developing Object-Oriented ABAP, ALV Grid reports, and enhancement techniques",
      "Data Dictionary configuration including custom database tables, structures, and views",
      "Debugging applications, memory variable tracking, and performance profiling"
    ],
    "mode": "Live Virtual",
    "thumbnail": "",
    "banner": "",
    "syllabus": [
      "Introduction to SAP Architecture and ABAP Workbench",
      "ABAP Data Dictionary (DDIC) and Data Types",
      "Basic ABAP Programming and Control Structures",
      "Modularization Techniques: Includes, Subroutines, and Function Modules",
      "Database Access: Open SQL and Internal Tables",
      "ABAP List Viewer (ALV) Reporting",
      "Dialog Programming and Screen Painter (Module Pool)",
      "Object-Oriented ABAP (OO ABAP)",
      "SAP Enhancements: BAPIs, BADIs, and User Exits",
      "ABAP Debugging and Performance Tuning"
    ]
  },
  {
    "id": "sap-hcm",
    "name": "SAP HCM (Human Capital Management)",
    "tag": "SAP FUNCTIONAL",
    "category": "Functional",
    "description": "Manage human resources, organizational design, personnel administration, recruitment workflow, and time tracking logic.",
    "features": [
      "Establish human resource hierarchies and reporting dependencies",
      "Configure time management schemas and shift patterns",
      "Master employee master data, self-service portals and automated notification workflow",
      "Remote payroll setups configuration, integration and migration payroll processes"
    ],
    "duration": "8 Weeks (Live Virtual)",
    "level": "INTERMEDIATE",
    "sandboxPractice": "24/7 Cloud Access",
    "rating": 4.8,
    "status": "Upcoming",
    "isUpcoming": true,
    "isLive": false,
    "code": "HCM",
    "modules": [],
    "buttonExploreText": "Explore Syllabus",
    "buttonRegisterDisabled": true,
    "buttonRegisterText": "Coming Soon",
    "showButtons": true,
    "showRating": true,
    "showDuration": true,
    "showSkillLevel": true,
    "fullDetails": [
      "Establish human resource hierarchies and reporting dependencies",
      "Configure time management schemas and shift patterns",
      "Master employee master data, self-service portals and automated notification workflow",
      "Remote payroll setups configuration, integration and migration payroll processes"
    ],
    "mode": "Live Virtual",
    "thumbnail": "",
    "banner": "",
    "syllabus": [
      "Introduction to SAP Human Capital Management",
      "Organizational Management (OM) Configuration",
      "Personnel Administration (PA) Master Data",
      "Time Management: Schedules, Quotas, and Evaluation",
      "Payroll Processing and Schemas",
      "Benefits Administration and Setup",
      "Recruitment Process and Onboarding",
      "Employee Self-Service (ESS) and Manager Self-Service (MSS)",
      "Personnel Development and Talent Management",
      "HCM Integration with Finance and Controlling"
    ]
  },
  {
    "id": "sap-basis",
    "name": "SAP BASIS (System Administration)",
    "tag": "SAP TECHNICAL",
    "category": "Technical",
    "description": "Learn system administration, user authorization, security profiles, database backup patterns, system installation, and performance tuning.",
    "features": [
      "System installation, client administration, and secure system landscape transport protocols",
      "Application server background job monitoring and parameter optimization",
      "Complete user role management, profile generation, and authorization structures",
      "Database integration configuration and troubleshooting for connection failures"
    ],
    "duration": "10 Weeks (Live Virtual)",
    "level": "ADVANCED",
    "sandboxPractice": "24/7 Cloud Access",
    "rating": 4.8,
    "status": "Upcoming",
    "isUpcoming": true,
    "isLive": false,
    "code": "BASIS",
    "modules": [],
    "buttonExploreText": "Explore Syllabus",
    "buttonRegisterDisabled": true,
    "buttonRegisterText": "Coming Soon",
    "showButtons": true,
    "showRating": true,
    "showDuration": true,
    "showSkillLevel": true,
    "fullDetails": [
      "System installation, client administration, and secure system landscape transport protocols",
      "Application server background job monitoring and parameter optimization",
      "Complete user role management, profile generation, and authorization structures",
      "Database integration configuration and troubleshooting for connection failures"
    ],
    "mode": "Live Virtual",
    "thumbnail": "",
    "banner": "",
    "syllabus": [
      "Introduction to SAP NetWeaver and System Architecture",
      "SAP System Installation and Post-Installation Steps",
      "Client Administration and System Copies",
      "User Administration, Roles, and Authorizations",
      "Background Job Processing and Monitoring",
      "SAP Transport Management System (TMS)",
      "Spool Administration and Output Management",
      "Database Administration and Backup/Recovery",
      "System Performance Tuning and Workload Analysis",
      "SAP Security, Patches, and Kernel Upgrades"
    ]
  },
  {
    "id": "sap-pp",
    "name": "SAP PP (Production Planning)",
    "tag": "SAP FUNCTIONAL",
    "category": "Functional",
    "description": "Master manufacturing processes, bills of materials (BOM), routing details, production orders, and capacity planning parameters.",
    "features": [
      "Define production routing configuration and bills of material",
      "Configure Material Requirements Planning (MRP) calculations and capacity checks",
      "Execute assembly operations, batch flushing, and material sourcing plans",
      "Support Discrete, Repetitive, and Kanban manufacturing configurations"
    ],
    "duration": "8 Weeks (Live Virtual)",
    "level": "INTERMEDIATE",
    "sandboxPractice": "24/7 Cloud Access",
    "rating": 4.5,
    "status": "Upcoming",
    "isUpcoming": true,
    "isLive": false,
    "code": "PP",
    "modules": [],
    "buttonExploreText": "Explore Syllabus",
    "buttonRegisterDisabled": true,
    "buttonRegisterText": "Coming Soon",
    "showButtons": true,
    "showRating": true,
    "showDuration": true,
    "showSkillLevel": true,
    "fullDetails": [
      "Define production routing configuration and bills of material",
      "Configure Material Requirements Planning (MRP) calculations and capacity checks",
      "Execute assembly operations, batch flushing, and material sourcing plans",
      "Support Discrete, Repetitive, and Kanban manufacturing configurations"
    ],
    "mode": "Live Virtual",
    "thumbnail": "",
    "banner": "",
    "syllabus": [
      "Introduction to SAP Production Planning",
      "Enterprise Structure and PP Master Data",
      "Bill of Materials (BOM) and Routing Configuration",
      "Work Centers and Capacity Planning",
      "Sales and Operations Planning (SOP)",
      "Demand Management and Planned Independent Requirements",
      "Material Requirements Planning (MRP) and MPS",
      "Production Order Execution and Control",
      "Discrete, Repetitive, and Process Manufacturing (PI) Overview",
      "PP Integration with MM, SD, and FICO"
    ]
  },
  {
    "id": "sap-successfactors",
    "name": "SAP SuccessFactors (Cloud HR)",
    "tag": "SAP CLOUD",
    "category": "Cloud",
    "description": "Implement modern cloud-hosted Human Capital Management. Cover Employee Central, performance tracking, dynamic goals, and cloud learning systems.",
    "features": [
      "Learn cloud HR setups, Employee Central models, and role permissions setup",
      "Configure employee lifecycle transactions and automated notification workflow",
      "Design performance goals management and cloud learning content management"
    ],
    "duration": "10 Weeks (Live Virtual)",
    "level": "INTERMEDIATE",
    "sandboxPractice": "24/7 Cloud Access",
    "rating": 4.9,
    "status": "Upcoming",
    "isUpcoming": true,
    "isLive": false,
    "code": "SUCCESSFACTORS",
    "modules": [],
    "buttonExploreText": "Explore Syllabus",
    "buttonRegisterDisabled": true,
    "buttonRegisterText": "Coming Soon",
    "showButtons": true,
    "showRating": true,
    "showDuration": true,
    "showSkillLevel": true,
    "fullDetails": [
      "Learn cloud HR setups, Employee Central models, and role permissions setup",
      "Configure employee lifecycle transactions and automated notification workflow",
      "Design performance goals management and cloud learning content management"
    ],
    "mode": "Live Virtual",
    "thumbnail": "",
    "banner": "",
    "syllabus": [
      "Introduction to Cloud HR and SuccessFactors Architecture",
      "Employee Central (EC) Core Configuration",
      "Role-Based Permissions (RBP) and Security",
      "Foundation Objects and Corporate Data Models",
      "Performance and Goals Management (PMGM)",
      "Compensation Management and Variable Pay",
      "Recruiting Management (RCM) and Onboarding",
      "Learning Management System (LMS) Administration",
      "Succession Planning and Career Development",
      "Reporting, Analytics, and SAP HCM Integration"
    ]
  }
];

export const STUDENT_REVIEWS: StudentReview[] = [
  {
    id: "rev-1",
    name: "Anjali Sharma",
    role: "Candidate",
    company: "",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    content: "Sri Vihaan Consulting completely transformed my career path! Coming from a generic B.Com background, I had zero SAP experience. The trainer explained configurations step-by-step. The real-time assignments and projects gave me the confidence to face technical interviews successfully! Highly recommended.",
    text: "Sri Vihaan Consulting completely transformed my career path! Coming from a generic B.Com background, I had zero SAP experience. The trainer explained configurations step-by-step. The real-time assignments and projects gave me the confidence to face technical interviews successfully! Highly recommended.",
    rating: 5,
    module: "SAP FICO Consultant",
    course: "SAP FICO Consultant",
    status: "Approved"
  },
  {
    id: "rev-2",
    name: "Rohan Deshmukh",
    role: "Candidate",
    company: "",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    content: "The ABAP training at Sri Vihaan Consulting was incredible. It focused deeply on syntax, data dictionary, and debugging techniques. Not just boilerplate code but real optimization, performance tuning, and how to write production-ready code. Handled with fantastic precision!",
    text: "The ABAP training at Sri Vihaan Consulting was incredible. It focused deeply on syntax, data dictionary, and debugging techniques. Not just boilerplate code but real optimization, performance tuning, and how to write production-ready code. Handled with fantastic precision!",
    rating: 5,
    module: "SAP ABAP Consultant",
    course: "SAP ABAP Consultant",
    status: "Approved"
  },
  {
    id: "rev-3",
    name: "Karthik Rao",
    role: "Candidate",
    company: "",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    content: "Excellent structure, well-organized classes, and fantastic session recordings that saved me multiple times when my work timings conflicted. The integration scenarios with FICO and SD modules were the highlight for me, as they reflect actual complex enterprise configurations.",
    text: "Excellent structure, well-organized classes, and fantastic session recordings that saved me multiple times when my work timings conflicted. The integration scenarios with FICO and SD modules were the highlight for me, as they reflect actual complex enterprise configurations.",
    rating: 4,
    module: "SAP MM Consultant",
    course: "SAP MM Consultant",
    status: "Approved"
  }
];

export const FAQS = [
  {
    id: "faq-1",
    question: "What is SAP?",
    answer: "SAP stands for Systems, Applications, and Products in Data Processing. It is an enterprise resource planning (ERP) software that helps businesses manage operations and customer relations seamlessly.",
    category: "General"
  },
  {
    id: "faq-2",
    question: "Do I need coding knowledge to learn SAP?",
    answer: "It depends on the module. Functional modules like SAP FICO, MM, and SD do not require coding knowledge. However, technical modules like SAP ABAP require strong programming fundamentals.",
    category: "General"
  },
  {
    id: "faq-3",
    question: "How are live classes conducted?",
    answer: "Our classes are conducted live virtually using premium webinar platforms. You can interact with the instructor, ask questions, and share your screen if you encounter issues during practical exercises.",
    category: "Learning"
  },
  {
    id: "faq-4",
    question: "Will I receive recordings of the live sessions?",
    answer: "Yes, all live sessions are recorded and uploaded to your student portal within 24 hours. You can access them anytime for revision.",
    category: "Learning"
  },
  {
    id: "faq-5",
    question: "Is placement assistance provided?",
    answer: "Yes, we provide 100% placement assistance. This includes resume building, mock interviews, and direct referrals to our partner companies.",
    category: "Career"
  },
  {
    id: "faq-6",
    question: "Can working professionals join?",
    answer: "Absolutely! We offer flexible weekend and evening batches specifically designed to accommodate the schedules of working professionals.",
    category: "General"
  },
  {
    id: "faq-7",
    question: "What is SAP Server Access?",
    answer: "SAP Server Access provides you with a cloud-based sandbox environment. It allows you to practice configurations and transactions on a real SAP system 24/7.",
    category: "Technical"
  },
  {
    id: "faq-8",
    question: "How long are the courses?",
    answer: "Our courses typically range from 8 to 12 weeks depending on the module. Each course includes theoretical concepts and extensive practical hands-on sessions.",
    category: "Learning"
  },
  {
    id: "faq-9",
    question: "How do I make payments?",
    answer: "You can securely make payments via UPI, bank transfer, or credit/debit cards. We also offer flexible installment options for our courses.",
    category: "Payments"
  },
  {
    id: "faq-10",
    question: "How do I contact support?",
    answer: "You can reach our support team via email at info@srivihaansap.com, through the Doubt Support section in your portal, or directly on WhatsApp for urgent queries.",
    category: "Support"
  }
];

// Mock dashboard schedules, videos, assignments, payments for students/admins
export const MOCK_SCHEDULES: ClassSchedule[] = [];

export const MOCK_RECORDINGS: Recording[] = [];

export const MOCK_ASSIGNMENTS: Assignment[] = [];

export const MOCK_PAYMENTS: PaymentRecord[] = [];
