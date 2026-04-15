
import mongoose from 'mongoose';
import { UserRole, LearningMode, CourseType } from '../types';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
  location: {
    city: String,
    state: String,
    country: String
  },
  bio: String,
  expertise: [String],
  interests: [String],
  learningMode: { type: String, enum: Object.values(LearningMode) },
  isVerified: { type: Boolean, default: false },
  avatar: String,
  // Registration Fields
  passportPhoto: String,
  phone: String,
  whatsapp: String,
  learningInterests: String,
  lessonPreference: { type: String, enum: ['INDIVIDUAL', 'BATCH'] },
  budgetPerHour: Number,
  suitableDays: [String],
  suitableTime: String,
  timezone: String,
  preferredLanguage: String,
  cvUrl: String,
  languagesSpoken: [String],
  expectedSalary: Number,
  canOperateTools: Boolean
}, { timestamps: true });

const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  day: { type: Number, default: 1 },
  videoUrl: String,
  imageUrl: String,
  content: { type: String, required: true },
  attachments: [String]
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherName: { type: String, required: true },
  price: { type: Number, default: 0 },
  type: { type: String, enum: Object.values(CourseType), default: CourseType.FREE },
  duration: { type: String, required: true },
  studentLimit: { type: Number, default: 100 },
  enrolledCount: { type: Number, default: 0 },
  lessons: [lessonSchema],
  assignments: [assignmentSchema],
  rating: { type: Number, default: 5.0 },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  learningOutcomes: [String]
}, { timestamps: true });

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  completedLessonIds: [{ type: String }],
  marks: Number,
  feedback: String,
  completed: { type: Boolean, default: false },
  certificateId: String,
  enrollmentDate: { type: Date, default: Date.now }
}, { timestamps: true });

const certificateSchema = new mongoose.Schema({
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseTitle: { type: String, required: true },
  teacherName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  verificationUrl: String
}, { timestamps: true });

const pageContentSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
export const CourseModel = mongoose.model('Course', courseSchema);
export const EnrollmentModel = mongoose.model('Enrollment', enrollmentSchema);
export const CertificateModel = mongoose.model('Certificate', certificateSchema);
export const PageContentModel = mongoose.model('PageContent', pageContentSchema);
