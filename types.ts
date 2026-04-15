
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export enum CourseType {
  FREE = 'FREE',
  PAID = 'PAID'
}

export enum LearningMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  bio?: string;
  expertise?: string[];
  interests?: string[];
  learningMode?: LearningMode;
  isVerified?: boolean;
  avatar?: string;
  // Registration Fields
  passportPhoto?: string;
  phone?: string;
  whatsapp?: string;
  learningInterests?: string;
  lessonPreference?: 'INDIVIDUAL' | 'BATCH';
  budgetPerHour?: number;
  suitableDays?: string[];
  suitableTime?: string;
  timezone?: string;
  preferredLanguage?: string;
  cvUrl?: string;
  languagesSpoken?: string[];
  expectedSalary?: number;
  canOperateTools?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  price: number;
  type: CourseType;
  duration: string;
  studentLimit: number;
  enrolledCount: number;
  lessons: Lesson[];
  assignments: Assignment[];
  rating: number;
  category: string;
  thumbnail: string;
  learningOutcomes?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  day: number;
  videoUrl?: string;
  imageUrl?: string;
  content: string;
  attachments: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number; // 0-100
  completedLessonIds: string[];
  marks?: number;
  feedback?: string;
  completed: boolean;
  certificateId?: string;
  enrollmentDate: string;
}

export interface Certificate {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  teacherName: string;
  issueDate: string;
  verificationUrl: string;
}

export interface Stats {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  totalRevenue: number;
}

export interface PageContent {
  pageId: string;
  content: any;
}
