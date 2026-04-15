
import { UserRole, CourseType, LearningMode, Course, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ahmed Khan',
    email: 'student@deenimadrasa.com',
    role: UserRole.STUDENT,
    location: { city: 'London', state: 'England', country: 'UK' },
    interests: ['Quran', 'Islamic Studies'],
    learningMode: LearningMode.ONLINE,
    avatar: 'https://i.pravatar.cc/150?u=student'
  },
  {
    id: 't1',
    name: 'Maulana Hasibur Rahman',
    email: 'teacher@deenimadrasa.com',
    role: UserRole.TEACHER,
    location: { city: 'Dhaka', state: 'Dhaka', country: 'Bangladesh' },
    expertise: ['Hafiz', 'Maulana', 'Mufti', 'Quran'],
    bio: 'Specialist in Tajweed and Hifz with 15 years experience.',
    isVerified: true,
    avatar: 'https://picsum.photos/seed/t1/200/200'
  },
  {
    id: 't2',
    name: 'Mohammad Al-Arabi',
    email: 'teacher2@deenimadrasa.com',
    role: UserRole.TEACHER,
    location: { city: 'Cairo', state: 'Cairo', country: 'Egypt' },
    expertise: ['Hafiz', 'Arabic Grammar'],
    bio: 'Native Arabic speaker specializing in Quranic linguistics.',
    isVerified: true,
    avatar: 'https://picsum.photos/seed/t2/200/200'
  },
  {
    id: 'u3',
    name: 'Academy Admin',
    email: 'admin@deenimadrasa.com',
    role: UserRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=admin'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    slug: 'after-school-maktab',
    title: 'After School Maktab – Complete Qaida & Basic Islamic Studies',
    description: 'A comprehensive program for children to master Arabic letters and foundational Islamic knowledge.',
    teacherId: 't1',
    teacherName: 'Maulana Hasibur Rahman',
    price: 35.00,
    type: CourseType.PAID,
    duration: '12 Months',
    studentLimit: 30,
    enrolledCount: 18,
    lessons: [
      {
        id: 'l1',
        title: 'Arabic Alphabet - Part 1',
        day: 1,
        content: 'In this lesson, we will learn the first 5 letters of the Arabic alphabet: Alif, Ba, Ta, Tha, and Jeem.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        imageUrl: 'https://picsum.photos/seed/arabic1/800/600',
        attachments: []
      },
      {
        id: 'l2',
        title: 'Arabic Alphabet - Part 2',
        day: 2,
        content: 'Continuing our journey, we learn Ha, Kha, Dal, Thal, and Ra.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        imageUrl: 'https://picsum.photos/seed/arabic2/800/600',
        attachments: []
      }
    ],
    assignments: [],
    rating: 4.9,
    category: 'Kids Program',
    thumbnail: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    learningOutcomes: [
      'Master Arabic letters and pronunciation',
      'Learn basic Islamic manners and ethics',
      'Memorize short Surahs from Juz Amma',
      'Understand foundational pillars of Islam'
    ]
  },
  {
    id: 'c2',
    slug: 'complete-quran-nazira',
    title: "Complete Qur'an Nazira – Read Fluently with Correct Tajweed",
    description: 'Focus on perfect pronunciation and fluent reading of the Holy Quran.',
    teacherId: 't2',
    teacherName: 'Mohammad Al-Arabi',
    price: 45.00,
    type: CourseType.PAID,
    duration: '6 Months',
    studentLimit: 20,
    enrolledCount: 12,
    lessons: [
      {
        id: 'l3',
        title: 'Introduction to Tajweed',
        day: 1,
        content: 'Tajweed means "to make better". It is the set of rules for the correct pronunciation of the letters with all their qualities and applying the various traditional methods of recitation.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        imageUrl: 'https://picsum.photos/seed/tajweed1/800/600',
        attachments: []
      }
    ],
    assignments: [],
    rating: 5.0,
    category: 'Quranic Studies',
    thumbnail: 'https://images.unsplash.com/photo-1594474038202-602923985794?auto=format&fit=crop&q=80&w=800',
    learningOutcomes: [
      'Perfect pronunciation of Arabic letters',
      'Apply Tajweed rules during recitation',
      'Improve fluency in reading the Holy Quran',
      'Understand common recitation mistakes'
    ]
  },
  {
    id: 'c3',
    slug: 'juz-amma-hifz-course',
    title: 'Juz Amma Hifz Course (Juz 30)',
    description: 'Guided memorization of the 30th Juz for all ages with professional tutors.',
    teacherId: 't1',
    teacherName: 'Maulana Hasibur Rahman',
    price: 40.00,
    type: CourseType.PAID,
    duration: '8 Months',
    studentLimit: 15,
    enrolledCount: 9,
    lessons: [],
    assignments: [],
    rating: 4.8,
    category: 'Hifz Program',
    thumbnail: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    learningOutcomes: [
      'Memorize the entire 30th Juz (Juz Amma)',
      'Maintain strong retention through revision',
      'Recite memorized Surahs with Tajweed',
      'Build a habit of daily Quran engagement'
    ]
  }
];
