import re

def update_admin_types():
    with open('frontend/src/types/admin.types.ts', 'r') as f:
        content = f.read()

    # Replace DoubtTicket with Doubt
    content = re.sub(
        r'export interface DoubtTicket \{.*?\n\}',
        '''export interface Doubt {
  id: string;
  studentId: string;
  studentName?: string;
  batchId: string;
  courseId: string;
  mentorId: string;
  topic: string;
  title: string;
  question: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Answered' | 'Need More Information' | 'Closed';
  createdAt: string;
  updatedAt?: string;
}''',
        content, flags=re.DOTALL
    )

    # Replace DoubtResponse with DoubtReply
    content = re.sub(
        r'export interface DoubtResponse \{.*?\n\}',
        '''export interface DoubtReply {
  id: string;
  doubtId: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'admin' | 'mentor';
  content: string;
  createdAt: string;
}''',
        content, flags=re.DOTALL
    )

    # Add 'review_request' to Notification type
    content = re.sub(
        r"type: 'info' \| 'alert' \| 'success';",
        "type: 'info' | 'alert' | 'success' | 'review_request';",
        content
    )

    with open('frontend/src/types/admin.types.ts', 'w') as f:
        f.write(content)

def update_student_types():
    with open('frontend/src/types/student.types.ts', 'r') as f:
        content = f.read()

    content = re.sub(
        r'status\?: \'Pending\' \| \'Approved\' \| \'Rejected\';',
        '''status?: 'Pending' | 'Approved' | 'Rejected';
  trainerRating?: number;
  contentRating?: number;
  supportRating?: number;
  recommend?: boolean;
  batchId?: string;''',
        content
    )

    with open('frontend/src/types/student.types.ts', 'w') as f:
        f.write(content)

def update_course_types():
    with open('frontend/src/types/course.types.ts', 'r') as f:
        content = f.read()
    
    content = re.sub(
        r'status: \'Upcoming\' \| \'Ongoing\' \| \'Completed\';',
        '''status: 'Upcoming' | 'Ongoing' | 'Completed';
  externalReviewLink?: string;''',
        content
    )

    with open('frontend/src/types/course.types.ts', 'w') as f:
        f.write(content)

def update_index():
    with open('frontend/src/types/index.ts', 'r') as f:
        content = f.read()
    
    content = content.replace('DoubtTicket', 'Doubt')
    content = content.replace('DoubtResponse', 'DoubtReply')
    
    with open('frontend/src/types/index.ts', 'w') as f:
        f.write(content)

update_admin_types()
update_student_types()
update_course_types()
update_index()
