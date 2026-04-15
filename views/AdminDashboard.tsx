
import React, { useState, useMemo } from 'react';
import { User, Course, Stats, UserRole, CourseType, Lesson, Enrollment, Certificate } from '../types';
import { Shield, TrendingUp, Users, BookOpen, AlertCircle, CheckCircle, XCircle, Search, Filter, Plus, Edit2, Trash2, X, ArrowUpDown, Video, Image as ImageIcon, FileText, Award, User2 } from 'lucide-react';

interface AdminDashboardProps {
  stats: Stats;
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  onNavigate: (view: string) => void;
  onAddCourse?: (course: Course) => void;
  onUpdateCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onGenerateCertificate?: (enrollmentId: string) => void;
  pageContent?: Record<string, any>;
  onUpdatePageContent?: (pageId: string, content: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  stats, users, courses, enrollments, onNavigate, onAddCourse, onUpdateCourse, onDeleteCourse, onGenerateCertificate,
  pageContent, onUpdatePageContent
}) => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'approvals' | 'courses' | 'enrollments' | 'content'>('stats');
  
  // User Details Modal State
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // User Search State
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Approvals Search State
  const [approvalSearchQuery, setApprovalSearchQuery] = useState('');

  // Enrollments Search State
  const [enrollmentSearchQuery, setEnrollmentSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return users;
    const query = userSearchQuery.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query) ||
      (u.phone && u.phone.toLowerCase().includes(query))
    );
  }, [users, userSearchQuery]);

  const filteredApprovals = useMemo(() => {
    const pendingTeachers = users.filter(u => u.role === UserRole.TEACHER && !u.isVerified);
    if (!approvalSearchQuery.trim()) return pendingTeachers;
    const query = approvalSearchQuery.toLowerCase();
    return pendingTeachers.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.expertise?.some(exp => exp.toLowerCase().includes(query))
    );
  }, [users, approvalSearchQuery]);

  const filteredEnrollments = useMemo(() => {
    if (!enrollmentSearchQuery.trim()) return enrollments;
    const query = enrollmentSearchQuery.toLowerCase();
    return enrollments.filter(e => {
      const student = users.find(u => u.id === e.studentId);
      const course = courses.find(c => c.id === e.courseId);
      return (
        student?.name.toLowerCase().includes(query) ||
        student?.email.toLowerCase().includes(query) ||
        course?.title.toLowerCase().includes(query)
      );
    });
  }, [enrollments, users, courses, enrollmentSearchQuery]);

  // Content Management State
  const [editingPage, setEditingPage] = useState<'home' | 'about' | 'pricing' | 'certificate' | 'settings'>('home');
  const [homeForm, setHomeForm] = useState(pageContent?.home || {
    hero: {
      title: "Deeni Madrasa",
      subtitle: "An Online Islamic Academy",
      description: "A globally trusted online platform — delivering authentic Quran and Islamic education to kids, adults, and new Muslims through a structured, international-standard curriculum since 2020.",
      image1: "https://images.unsplash.com/photo-1594474038202-602923985794?auto=format&fit=crop&q=80&w=400",
      image2: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=400",
      image3: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
      image4: "https://images.unsplash.com/photo-1621112904887-419379ce6824?auto=format&fit=crop&q=80&w=400",
    },
    whyChoose: {
      title: "Why Choose Deeni Madrasa?",
      videoThumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
    },
    tutors: [
      { name: "Hasibur Rahman", title: "Hafiz, Maulana, Mufti", avatar: "https://picsum.photos/seed/t1/200/200" },
      { name: "Mohammad Al-Arabi", title: "Hafiz, Maulana, Mufti", avatar: "https://picsum.photos/seed/t2/200/200" },
      { name: "Osman Goni", title: "Hafiz, Maulana", avatar: "https://picsum.photos/seed/t3/200/200" },
    ]
  });

  const [settingsForm, setSettingsForm] = useState(pageContent?.settings || {
    logo: "DM",
    name: "Deeni Madrasa",
    subline: "Online Islamic Academy"
  });

  const [aboutForm, setAboutForm] = useState(pageContent?.about || {
    header: {
      title: "About Deeni Madrasa",
      description: "Deeni Madrasa is a center of Islamic learning, nurturing faith, discipline, and knowledge through Quranic teachings, Hadith studies, and moral guidance for students.",
      subtext: "Deeni Madrasa is an educational project of Nextgen EdTech Services Limited, a registered company in Bangladesh.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600"
    },
    whoWeAre: {
      title: "Who We Are",
      description1: "Deeni Madrasa is a global online Islamic learning platform dedicated to making authentic Quranic and Islamic education accessible to every home. With students joining from across the world, we provide structured courses that combine traditional knowledge with modern, interactive teaching methods.",
      description2: "Our team of qualified teachers delivers personalized one-to-one sessions, small group classes, and comprehensive programs designed for children, adults, and new Muslims alike. Beyond teaching Quran and Islamic studies, we focus on tarbiyah (character building), nurturing faith, and instilling values that help our students live as practicing Muslims with sincerity, confidence, and kindness."
    }
  });

  const [pricingForm, setPricingForm] = useState(pageContent?.pricing || {
    header: {
      title: "Our Flexible Course Pricing",
      subtitle: "Our Session Pricing",
      description: "Which currency would you like to see the pricing in?"
    },
    pricingData: {
      USD: {
        '40': [35, 48, 62, 75, 88],
        '60': [46, 64, 82, 100, 118],
        'Group': [20, 28, 36, 44, 52]
      },
      BDT: {
        '40': [3500, 4800, 6200, 7500, 8800],
        '60': [4800, 6800, 8800, 10800, 12800],
        'Group': [2200, 3000, 3800, 4600, 5400]
      }
    },
    faqs: {
      'General': [
        { q: "What is Deeni Madrasa?", a: "Deeni Madrasa is a global online Islamic academy providing structured Quran and Islamic studies for all ages." },
        { q: "Who can join your programs?", a: "Our programs are open to children, adults, and new Muslims from all backgrounds." }
      ],
      'Courses': [
        { q: "What courses do you offer?", a: "We offer Quran Nazira, Hifz, Tajweed, Islamic Studies, and Arabic language courses." },
        { q: "Are the courses certified?", a: "Yes, we provide certificates upon successful completion of our core programs." }
      ],
      'Tutors': [
        { q: "Who are the tutors?", a: "Our tutors are qualified scholars, Huffaz, and trained educators from around the world." },
        { q: "Can I choose my tutor?", a: "We match you with the best tutor based on your level and schedule, but you can request a change if needed." }
      ],
      'Learning & Progress': [
        { q: "How do you track progress?", a: "We use a custom LMS to track attendance, lesson completion, and assignment scores." },
        { q: "What is the virtual classroom like?", a: "It's a custom-built, interactive environment designed specifically for effective Quran learning." }
      ],
      'Pricing & Payment': [
        { q: "How are the fees structured at Deeni Madrasa?", a: "We don't charge per class. The cost depends on the class length and how many times per week you choose. Payments can be made monthly or quarterly." },
        { q: "Do you offer discounts for siblings?", a: "Yes, we offer a sibling discount where we combine the total classes per week for a lower per-class rate." },
        { q: "What is the Refer-a-Friend program?", a: "Our referral program gives your friend a 50% discount on their first month, and you gain spiritual rewards." },
        { q: "How do quarterly payments work?", a: "Quarterly payments allow you to pay for three months at once, saving you around 5-6%." },
        { q: "Do you offer group class payments?", a: "Yes, small groups of 2-3 can share the cost of a 1-to-1 session price." },
        { q: "How do I make a payment for classes?", a: "Payments can be made securely through our online portal using various international payment methods." }
      ]
    },
    savings: {
      title: "Save Around 5–6% when You Choose Quarterly Payment!",
      siblingDiscount: {
        title: "Sibling Discount: More Savings for Families",
        description: "When two or more siblings enroll, we add up their weekly classes and give the lower per-class rate from our chart."
      },
      groupPricing: {
        title: "Group Class Pricing",
        description: "Our listed prices are for 1-to-1 sessions, but they also apply if you form a small group of 2 or 3 students in one class.",
        subtext: "For group classes with 4 to 10 students, please see our Group Class Pricing."
      }
    },
    referAFriend: {
      title: "Share the Gift of Qur'an – Refer a Friend",
      description: "Invite a family you know to join Deeni Madrasa. They will enjoy a 50% discount in their first month of classes."
    }
  });

  const [certificateForm, setCertificateForm] = useState(pageContent?.certificate || {
    background: "https://storage.googleapis.com/file-extract.appspot.com/v0/b/file-extract.appspot.com/o/65893769-1662-421b-8575-f21394c86f03.png?alt=media&token=487d8538-4e8c-449e-8835-f0967389665e"
  });

  // Sync forms when pageContent prop changes
  React.useEffect(() => {
    if (pageContent?.home) setHomeForm(pageContent.home);
    if (pageContent?.about) setAboutForm(pageContent.about);
    if (pageContent?.pricing) setPricingForm(pageContent.pricing);
    if (pageContent?.certificate) setCertificateForm(pageContent.certificate);
    if (pageContent?.settings) setSettingsForm(pageContent.settings);
  }, [pageContent]);

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    let content = {};
    if (editingPage === 'home') content = homeForm;
    else if (editingPage === 'about') content = aboutForm;
    else if (editingPage === 'pricing') content = pricingForm;
    else if (editingPage === 'certificate') content = certificateForm;
    else if (editingPage === 'settings') content = settingsForm;
    
    onUpdatePageContent?.(editingPage, content);
  };
  
  // Course Management State
  const [courseSearch, setCourseSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'enrolled'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [modalLessons, setModalLessons] = useState<Lesson[]>([]);

  // Filter and Sort Courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (courseSearch) {
      result = result.filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase()));
    }

    if (categoryFilter !== 'All') {
      result = result.filter(c => c.category === categoryFilter);
    }

    if (typeFilter !== 'All') {
      result = result.filter(c => c.type === (typeFilter === 'Free' ? CourseType.FREE : CourseType.PAID));
    }

    result.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (sortBy === 'enrolled') {
        valA = a.enrolledCount;
        valB = b.enrolledCount;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [courses, courseSearch, categoryFilter, typeFilter, sortBy, sortOrder]);

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const handleOpenModal = (course?: Course) => {
    setEditingCourse(course || null);
    setModalLessons(course?.lessons || []);
    setIsModalOpen(true);
  };

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      day: modalLessons.length + 1,
      content: '',
      attachments: [],
      videoUrl: '',
      imageUrl: ''
    };
    setModalLessons([...modalLessons, newLesson]);
  };

  const handleUpdateLesson = (id: string, field: keyof Lesson, value: any) => {
    setModalLessons(modalLessons.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleRemoveLesson = (id: string) => {
    setModalLessons(modalLessons.filter(l => l.id !== id));
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const teacher = users.find(u => u.role === UserRole.TEACHER) || users[0];

    const title = formData.get('title') as string;
    const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const courseData: Course = {
      id: editingCourse?.id || Math.random().toString(36).substr(2, 9),
      slug: editingCourse?.slug || slug,
      title: title,
      description: formData.get('description') as string,
      teacherId: teacher.id,
      teacherName: teacher.name,
      price: parseFloat(formData.get('price') as string) || 0,
      type: parseFloat(formData.get('price') as string) > 0 ? CourseType.PAID : CourseType.FREE,
      duration: formData.get('duration') as string || '10 hours',
      studentLimit: parseInt(formData.get('studentLimit') as string) || 100,
      enrolledCount: editingCourse?.enrolledCount || 0,
      lessons: modalLessons,
      assignments: editingCourse?.assignments || [],
      rating: editingCourse?.rating || 5.0,
      category: formData.get('category') as string,
      thumbnail: (formData.get('thumbnail') as string) || `https://picsum.photos/seed/${Math.random()}/600/400`,
      learningOutcomes: (formData.get('learningOutcomes') as string || '').split('\n').map(i => i.trim()).filter(i => i !== ''),
    };

    if (editingCourse) {
      onUpdateCourse?.(courseData);
    } else {
      onAddCourse?.(courseData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-10 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Command Center</h1>
            <p className="text-slate-500">Monitor and manage Deeni Madrasa's entire ecosystem.</p>
         </div>
         <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl gap-1">
            <button 
              onClick={() => setActiveView('stats')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeView === 'stats' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Analytics
            </button>
            <button 
              onClick={() => setActiveView('users')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeView === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Users
            </button>
            <button 
              onClick={() => setActiveView('courses')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeView === 'courses' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Courses
            </button>
            <button 
              onClick={() => setActiveView('enrollments')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeView === 'enrollments' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Enrollments
            </button>
            <button 
              onClick={() => setActiveView('approvals')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeView === 'approvals' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Approvals
            </button>
            <button 
              onClick={() => setActiveView('content')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeView === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Content
            </button>
         </div>
      </div>

      {activeView === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass p-8 rounded-[2rem] border border-blue-100">
             <Users className="text-blue-500 mb-4 h-8 w-8" />
             <h3 className="text-3xl font-bold text-slate-900">{stats.totalStudents}</h3>
             <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mt-1">Total Students</p>
          </div>
          <div className="glass p-8 rounded-[2rem] border border-blue-100">
             <Shield className="text-blue-500 mb-4 h-8 w-8" />
             <h3 className="text-3xl font-bold text-slate-900">{stats.totalTeachers}</h3>
             <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mt-1">Active Teachers</p>
          </div>
          <div className="glass p-8 rounded-[2rem] border border-blue-100">
             <BookOpen className="text-blue-500 mb-4 h-8 w-8" />
             <h3 className="text-3xl font-bold text-slate-900">{stats.activeCourses}</h3>
             <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mt-1">Live Courses</p>
          </div>
          <div className="glass p-8 rounded-[2rem] border border-green-100">
             <TrendingUp className="text-green-500 mb-4 h-8 w-8" />
             <h3 className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</h3>
             <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mt-1">Gross Revenue</p>
          </div>
        </div>
      )}

      {activeView === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-3xl border shadow-sm flex items-center space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email, ID, or phone..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
              />
            </div>
            <div className="text-sm text-slate-500 font-medium px-4">
              Showing {filteredUsers.length} users
            </div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">User</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Role</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((u, idx) => (
                  <tr key={`${u.id}-${idx}`} className="hover:bg-slate-50">
                    <td className="px-6 py-4 flex items-center space-x-3">
                       <img src={u.avatar} className="h-10 w-10 rounded-full border" alt={u.name} />
                       <div>
                         <p className="font-bold text-slate-900">{u.name}</p>
                         <p className="text-xs text-slate-500">{u.email}</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === UserRole.ADMIN ? 'bg-red-100 text-red-600' : u.role === UserRole.TEACHER ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
                         {u.role}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${u.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-sm text-slate-600">{u.isVerified ? 'Verified' : 'Pending'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex space-x-2">
                          <button 
                            onClick={() => setViewingUser(u)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                          >
                            View Details
                          </button>
                          <button className="text-red-500 hover:text-red-700 text-sm font-bold">Ban User</button>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No users found matching "{userSearchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'courses' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search courses by title..." 
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-all shadow-sm"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="gradient-bg text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="mr-2 h-5 w-5" /> New Course
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <Filter className="h-4 w-4 text-slate-400" />
              <span>Category:</span>
              <select 
                className="bg-transparent focus:outline-none cursor-pointer" 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span>Type:</span>
              <select 
                className="bg-transparent focus:outline-none cursor-pointer"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <span>Sort By:</span>
              <select 
                className="bg-transparent focus:outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="enrolled">Enrollment</option>
              </select>
              <button 
                className="ml-2 text-blue-600 font-bold"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder.toUpperCase()}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Course</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Instructor</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Price</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Enrollment</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCourses.length > 0 ? filteredCourses.map((c, idx) => (
                  <tr key={`${c.id}-${idx}`} className="hover:bg-slate-50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {c.thumbnail ? (
                          <img src={c.thumbnail} className="h-12 w-20 rounded-xl object-cover border shadow-sm" alt={c.title} referrerPolicy="no-referrer" />
                        ) : (
                          <div className="h-12 w-20 rounded-xl bg-slate-100 flex items-center justify-center border shadow-sm">
                            <BookOpen className="h-6 w-6 text-slate-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.title}</p>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{c.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <img src={c.teacherId ? `https://picsum.photos/seed/${c.teacherId}/40/40` : "https://picsum.photos/seed/default/40/40"} className="h-6 w-6 rounded-full" alt="" referrerPolicy="no-referrer" />
                        <span className="text-sm font-semibold text-slate-700">{c.teacherName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {c.price === 0 ? <span className="text-green-600">Free</span> : `$${c.price}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-blue-500 h-full" style={{ width: `${(c.enrolledCount / c.studentLimit) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{c.enrolledCount}/{c.studentLimit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex space-x-2">
                          <button 
                            onClick={() => onNavigate(`course/${c.slug}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Public Page"
                          >
                             <Award className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenModal(c)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Course"
                          >
                             <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteCourse?.(c.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Course"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                       <AlertCircle className="mx-auto h-10 w-10 mb-4 opacity-20" />
                       <p className="font-medium">No courses found matching your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'approvals' && (
        <div className="space-y-6 animate-in fade-in duration-300">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">Pending Teacher Verification</h3>
              <div className="text-sm text-slate-500 font-medium">
                {filteredApprovals.length} pending
              </div>
           </div>

           <div className="bg-white p-4 rounded-3xl border shadow-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or expertise..."
                  value={approvalSearchQuery}
                  onChange={(e) => setApprovalSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
                />
              </div>
           </div>

           <div className="space-y-4">
              {filteredApprovals.length > 0 ? (
                 filteredApprovals.map(u => (
                    <div key={u.id} className="glass p-6 rounded-3xl border border-yellow-100 flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <img src={u.avatar} className="h-14 w-14 rounded-2xl border" alt={u.name} />
                          <div>
                             <h4 className="font-bold text-slate-900">{u.name}</h4>
                             <p className="text-sm text-slate-500">{u.expertise?.join(', ')}</p>
                          </div>
                       </div>
                       <div className="flex space-x-2">
                          <button className="bg-green-100 text-green-600 p-3 rounded-xl hover:bg-green-200 transition-colors">
                             <CheckCircle className="h-5 w-5" />
                          </button>
                          <button className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-colors">
                             <XCircle className="h-5 w-5" />
                          </button>
                       </div>
                    </div>
                 ))
              ) : (
                <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                   <AlertCircle className="mx-auto h-10 w-10 text-slate-300 mb-4" />
                   <p className="text-slate-500">
                     {approvalSearchQuery ? `No pending teachers matching "${approvalSearchQuery}"` : 'No pending teacher verifications at the moment.'}
                   </p>
                </div>
              )}
           </div>
        </div>
      )}

      {activeView === 'enrollments' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-3xl border shadow-sm flex items-center space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by student name, email, or course title..."
                value={enrollmentSearchQuery}
                onChange={(e) => setEnrollmentSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
              />
            </div>
            <div className="text-sm text-slate-500 font-medium px-4">
              Showing {filteredEnrollments.length} enrollments
            </div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Student</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Course</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Progress</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                  {filteredEnrollments.map((e, idx) => {
                    const student = users.find(u => u.id === e.studentId);
                    const course = courses.find(c => c.id === e.courseId);
                    return (
                      <tr key={`${e.id}-${idx}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        {student?.avatar ? (
                          <img src={student.avatar} className="h-8 w-8 rounded-full" alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <User2 className="h-4 w-4 text-slate-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{student?.name}</p>
                          <p className="text-xs text-slate-500">{student?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {course?.title}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{ width: `${e.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-500">{e.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {e.completed ? (
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Completed</span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">In Progress</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {e.completed && !e.certificateId && (
                          <button 
                            onClick={() => onGenerateCertificate?.(e.id)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-bold text-sm"
                          >
                            <Award className="h-4 w-4" />
                            <span>Generate Certificate</span>
                          </button>
                        )}
                        {e.certificateId && (
                          <span className="flex items-center space-x-2 text-green-600 font-bold text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Certificate Issued</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredEnrollments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No enrollments found matching "{enrollmentSearchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'content' && (
        <div className="space-y-8 animate-in fade-in duration-300">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">Page Content Management</h3>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                 {(['home', 'about', 'pricing', 'certificate', 'settings'] as const).map(p => (
                   <button 
                    key={p}
                    onClick={() => setEditingPage(p)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${editingPage === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                   >
                     {p}
                   </button>
                 ))}
              </div>
           </div>

           <form onSubmit={handleSaveContent} className="bg-white rounded-3xl border p-8 space-y-8 shadow-sm">
              {editingPage === 'home' && (
                <div className="space-y-10">
                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2">Hero Section</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hero Title</label>
                            <input 
                              value={homeForm.hero.title} 
                              onChange={(e) => setHomeForm({...homeForm, hero: {...homeForm.hero, title: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hero Subtitle</label>
                            <input 
                              value={homeForm.hero.subtitle} 
                              onChange={(e) => setHomeForm({...homeForm, hero: {...homeForm.hero, subtitle: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hero Description</label>
                            <textarea 
                              value={homeForm.hero.description} 
                              onChange={(e) => setHomeForm({...homeForm, hero: {...homeForm.hero, description: e.target.value}})}
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hero Image 1</label>
                            <input 
                              value={homeForm.hero.image1} 
                              onChange={(e) => setHomeForm({...homeForm, hero: {...homeForm.hero, image1: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hero Image 2</label>
                            <input 
                              value={homeForm.hero.image2} 
                              onChange={(e) => setHomeForm({...homeForm, hero: {...homeForm.hero, image2: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hero Image 3</label>
                            <input 
                              value={homeForm.hero.image3} 
                              onChange={(e) => setHomeForm({...homeForm, hero: {...homeForm.hero, image3: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hero Image 4</label>
                            <input 
                              value={homeForm.hero.image4} 
                              onChange={(e) => setHomeForm({...homeForm, hero: {...homeForm.hero, image4: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2">Why Choose Section</h4>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Section Title</label>
                             <input 
                               value={homeForm.whyChoose.title} 
                               onChange={(e) => setHomeForm({...homeForm, whyChoose: {...homeForm.whyChoose, title: e.target.value}})}
                               className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Video Thumbnail URL</label>
                             <input 
                               value={homeForm.whyChoose.videoThumbnail} 
                               onChange={(e) => setHomeForm({...homeForm, whyChoose: {...homeForm.whyChoose, videoThumbnail: e.target.value}})}
                               className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="font-bold text-slate-900 border-b pb-2">Meet Our Tutors</h4>
                       <div className="space-y-4">
                          {homeForm.tutors?.map((tutor: any, idx: number) => (
                            <div key={idx} className="p-4 border rounded-xl space-y-4 bg-slate-50">
                               <div className="flex justify-between items-center">
                                  <span className="text-sm font-bold text-slate-700">Tutor #{idx + 1}</span>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newTutors = [...homeForm.tutors];
                                      newTutors.splice(idx, 1);
                                      setHomeForm({...homeForm, tutors: newTutors});
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                               </div>
                               <div className="grid md:grid-cols-3 gap-4">
                                  <div className="space-y-1">
                                     <label className="text-[10px] font-bold text-slate-500 uppercase">Name</label>
                                     <input 
                                       value={tutor.name} 
                                       onChange={(e) => {
                                         const newTutors = [...homeForm.tutors];
                                         newTutors[idx].name = e.target.value;
                                         setHomeForm({...homeForm, tutors: newTutors});
                                       }}
                                       className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" 
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                                     <input 
                                       value={tutor.title} 
                                       onChange={(e) => {
                                         const newTutors = [...homeForm.tutors];
                                         newTutors[idx].title = e.target.value;
                                         setHomeForm({...homeForm, tutors: newTutors});
                                       }}
                                       className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" 
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[10px] font-bold text-slate-500 uppercase">Avatar URL</label>
                                     <input 
                                       value={tutor.avatar} 
                                       onChange={(e) => {
                                         const newTutors = [...homeForm.tutors];
                                         newTutors[idx].avatar = e.target.value;
                                         setHomeForm({...homeForm, tutors: newTutors});
                                       }}
                                       className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" 
                                     />
                                  </div>
                               </div>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => {
                              const newTutors = [...(homeForm.tutors || []), { name: "", title: "", avatar: "" }];
                              setHomeForm({...homeForm, tutors: newTutors});
                            }}
                            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                          >
                            <Plus className="h-4 w-4" /> Add Tutor
                          </button>
                       </div>
                    </div>
                 </div>
              )}

              {editingPage === 'about' && (
                <div className="space-y-10">
                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2">Header Section</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Page Title</label>
                            <input 
                              value={aboutForm.header.title} 
                              onChange={(e) => setAboutForm({...aboutForm, header: {...aboutForm.header, title: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Header Image URL</label>
                            <input 
                              value={aboutForm.header.image} 
                              onChange={(e) => setAboutForm({...aboutForm, header: {...aboutForm.header, image: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea 
                              value={aboutForm.header.description} 
                              onChange={(e) => setAboutForm({...aboutForm, header: {...aboutForm.header, description: e.target.value}})}
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                            />
                         </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtext (Legal/Company Info)</label>
                            <input 
                              value={aboutForm.header.subtext} 
                              onChange={(e) => setAboutForm({...aboutForm, header: {...aboutForm.header, subtext: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2">Who We Are Section</h4>
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Section Title</label>
                            <input 
                              value={aboutForm.whoWeAre.title} 
                              onChange={(e) => setAboutForm({...aboutForm, whoWeAre: {...aboutForm.whoWeAre, title: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Paragraph 1</label>
                            <textarea 
                              value={aboutForm.whoWeAre.description1} 
                              onChange={(e) => setAboutForm({...aboutForm, whoWeAre: {...aboutForm.whoWeAre, description1: e.target.value}})}
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Paragraph 2</label>
                            <textarea 
                              value={aboutForm.whoWeAre.description2} 
                              onChange={(e) => setAboutForm({...aboutForm, whoWeAre: {...aboutForm.whoWeAre, description2: e.target.value}})}
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                            />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {editingPage === 'pricing' && (
                <div className="space-y-10">
                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2 text-lg">Header Section</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Page Title</label>
                            <input 
                              value={pricingForm.header.title} 
                              onChange={(e) => setPricingForm({...pricingForm, header: {...pricingForm.header, title: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtitle</label>
                            <input 
                              value={pricingForm.header.subtitle} 
                              onChange={(e) => setPricingForm({...pricingForm, header: {...pricingForm.header, subtitle: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <input 
                              value={pricingForm.header.description} 
                              onChange={(e) => setPricingForm({...pricingForm, header: {...pricingForm.header, description: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2 text-lg">Pricing Data (Monthly Rates)</h4>
                      <div className="grid md:grid-cols-2 gap-10">
                        {/* USD Pricing */}
                        <div className="space-y-6">
                          <h5 className="font-bold text-blue-600 uppercase text-xs tracking-widest">USD Pricing ($)</h5>
                          {['40', '60', 'Group'].map(dur => (
                            <div key={`usd-${dur}`} className="space-y-3 p-4 bg-slate-50 rounded-2xl border">
                              <label className="text-xs font-bold text-slate-700 uppercase">{dur === 'Group' ? 'Group Session' : `${dur} Minutes`}</label>
                              <div className="grid grid-cols-5 gap-2">
                                {pricingForm.pricingData.USD[dur].map((price: number, idx: number) => (
                                  <div key={idx} className="space-y-1">
                                    <span className="text-[10px] text-slate-400 font-bold">{idx + 2}d/w</span>
                                    <input 
                                      type="number"
                                      value={price}
                                      onChange={(e) => {
                                        const newData = {...pricingForm.pricingData};
                                        newData.USD[dur][idx] = parseFloat(e.target.value) || 0;
                                        setPricingForm({...pricingForm, pricingData: newData});
                                      }}
                                      className="w-full px-2 py-1.5 rounded-lg border text-xs font-bold text-center"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* BDT Pricing */}
                        <div className="space-y-6">
                          <h5 className="font-bold text-green-600 uppercase text-xs tracking-widest">BDT Pricing (৳)</h5>
                          {['40', '60', 'Group'].map(dur => (
                            <div key={`bdt-${dur}`} className="space-y-3 p-4 bg-slate-50 rounded-2xl border">
                              <label className="text-xs font-bold text-slate-700 uppercase">{dur === 'Group' ? 'Group Session' : `${dur} Minutes`}</label>
                              <div className="grid grid-cols-5 gap-2">
                                {pricingForm.pricingData.BDT[dur].map((price: number, idx: number) => (
                                  <div key={idx} className="space-y-1">
                                    <span className="text-[10px] text-slate-400 font-bold">{idx + 2}d/w</span>
                                    <input 
                                      type="number"
                                      value={price}
                                      onChange={(e) => {
                                        const newData = {...pricingForm.pricingData};
                                        newData.BDT[dur][idx] = parseFloat(e.target.value) || 0;
                                        setPricingForm({...pricingForm, pricingData: newData});
                                      }}
                                      className="w-full px-2 py-1.5 rounded-lg border text-xs font-bold text-center"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2 text-lg">Savings & Referral</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border">
                          <h5 className="font-bold text-slate-900">Savings Title</h5>
                          <input 
                            value={pricingForm.savings.title}
                            onChange={(e) => setPricingForm({...pricingForm, savings: {...pricingForm.savings, title: e.target.value}})}
                            className="w-full px-4 py-2 rounded-xl border text-sm"
                          />
                          <h5 className="font-bold text-slate-900 mt-4">Sibling Discount</h5>
                          <input 
                            value={pricingForm.savings.siblingDiscount.title}
                            onChange={(e) => setPricingForm({...pricingForm, savings: {...pricingForm.savings, siblingDiscount: {...pricingForm.savings.siblingDiscount, title: e.target.value}}})}
                            className="w-full px-4 py-2 rounded-xl border text-sm mb-2"
                            placeholder="Title"
                          />
                          <textarea 
                            value={pricingForm.savings.siblingDiscount.description}
                            onChange={(e) => setPricingForm({...pricingForm, savings: {...pricingForm.savings, siblingDiscount: {...pricingForm.savings.siblingDiscount, description: e.target.value}}})}
                            className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                            rows={3}
                            placeholder="Description"
                          />
                        </div>
                        <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border">
                          <h5 className="font-bold text-slate-900">Refer a Friend</h5>
                          <input 
                            value={pricingForm.referAFriend.title}
                            onChange={(e) => setPricingForm({...pricingForm, referAFriend: {...pricingForm.referAFriend, title: e.target.value}})}
                            className="w-full px-4 py-2 rounded-xl border text-sm mb-2"
                            placeholder="Title"
                          />
                          <textarea 
                            value={pricingForm.referAFriend.description}
                            onChange={(e) => setPricingForm({...pricingForm, referAFriend: {...pricingForm.referAFriend, description: e.target.value}})}
                            className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                            rows={3}
                            placeholder="Description"
                          />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2 text-lg">FAQ Management</h4>
                      <div className="space-y-6">
                        {Object.entries(pricingForm.faqs).map(([category, items]: [string, any]) => (
                          <div key={category} className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="font-bold text-blue-600 text-sm uppercase tracking-widest">{category}</h5>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newFaqs = {...pricingForm.faqs};
                                  newFaqs[category] = [...(newFaqs[category] || []), { q: "", a: "" }];
                                  setPricingForm({...pricingForm, faqs: newFaqs});
                                }}
                                className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" /> Add FAQ
                              </button>
                            </div>
                            <div className="grid gap-4">
                              {items.map((faq: any, idx: number) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-xl border relative group">
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newFaqs = {...pricingForm.faqs};
                                      newFaqs[category].splice(idx, 1);
                                      setPricingForm({...pricingForm, faqs: newFaqs});
                                    }}
                                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                  <div className="space-y-3">
                                    <input 
                                      value={faq.q}
                                      onChange={(e) => {
                                        const newFaqs = {...pricingForm.faqs};
                                        newFaqs[category][idx].q = e.target.value;
                                        setPricingForm({...pricingForm, faqs: newFaqs});
                                      }}
                                      className="w-full px-3 py-2 rounded-lg border text-sm font-bold"
                                      placeholder="Question"
                                    />
                                    <textarea 
                                      value={faq.a}
                                      onChange={(e) => {
                                        const newFaqs = {...pricingForm.faqs};
                                        newFaqs[category][idx].a = e.target.value;
                                        setPricingForm({...pricingForm, faqs: newFaqs});
                                      }}
                                      className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                                      rows={2}
                                      placeholder="Answer"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              )}

              {editingPage === 'certificate' && (
                <div className="space-y-10">
                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2">Certificate Settings</h4>
                      <div className="grid md:grid-cols-1 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Certificate Background Image URL</label>
                            <div className="flex gap-4">
                              <input 
                                value={certificateForm.background} 
                                onChange={(e) => setCertificateForm({...certificateForm, background: e.target.value})}
                                className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="https://..."
                              />
                            </div>
                            <p className="text-[10px] text-slate-400">This image will be used as the background for all generated certificates. Recommended aspect ratio: 1.414:1 (A4 landscape).</p>
                         </div>
                         {certificateForm.background && (
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">Preview</label>
                              <div className="border rounded-2xl overflow-hidden bg-slate-50 aspect-[1.414/1] max-w-md">
                                <img src={certificateForm.background} alt="Certificate Background Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              )}

              {editingPage === 'settings' && (
                <div className="space-y-10">
                   <div className="space-y-6">
                      <h4 className="font-bold text-slate-900 border-b pb-2">Site Identity</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Site Logo (Short Name)</label>
                            <input 
                              value={settingsForm.logo} 
                              onChange={(e) => setSettingsForm({...settingsForm, logo: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Site Name</label>
                            <input 
                              value={settingsForm.name} 
                              onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Sub Line / Tagline</label>
                            <input 
                              value={settingsForm.subline} 
                              onChange={(e) => setSettingsForm({...settingsForm, subline: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t">
                 <button type="submit" className="gradient-bg text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-opacity">
                    Save Changes
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* User Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingUser(null)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center shrink-0">
               <div className="flex items-center space-x-4">
                  <img src={viewingUser.avatar} className="h-16 w-16 rounded-2xl border shadow-sm" alt="" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{viewingUser.name}</h2>
                    <p className="text-slate-500 font-medium">{viewingUser.email} • <span className="text-blue-600 uppercase text-xs font-bold tracking-widest">{viewingUser.role}</span></p>
                  </div>
               </div>
               <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
               {/* Basic Info */}
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Contact Information</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">Phone:</span>
                           <span className="text-sm font-bold text-slate-900">{viewingUser.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">WhatsApp:</span>
                           <span className="text-sm font-bold text-slate-900">{viewingUser.whatsapp || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">Location:</span>
                           <span className="text-sm font-bold text-slate-900">
                              {viewingUser.location ? `${viewingUser.location.city}, ${viewingUser.location.country}` : 'N/A'}
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">Timezone:</span>
                           <span className="text-sm font-bold text-slate-900">{viewingUser.timezone || 'N/A'}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Preferences</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">Language:</span>
                           <span className="text-sm font-bold text-slate-900">{viewingUser.preferredLanguage || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">Verified:</span>
                           <span className={`text-sm font-bold ${viewingUser.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                              {viewingUser.isVerified ? 'Yes' : 'No'}
                           </span>
                        </div>
                        {viewingUser.role === UserRole.STUDENT && (
                           <>
                              <div className="flex justify-between">
                                 <span className="text-sm text-slate-500">Learning Mode:</span>
                                 <span className="text-sm font-bold text-slate-900 uppercase">{viewingUser.learningMode || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-sm text-slate-500">Lesson Pref:</span>
                                 <span className="text-sm font-bold text-slate-900 uppercase">{viewingUser.lessonPreference || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-sm text-slate-500">Budget:</span>
                                 <span className="text-sm font-bold text-slate-900">${viewingUser.budgetPerHour || 0}/hr</span>
                              </div>
                           </>
                        )}
                        {viewingUser.role === UserRole.TEACHER && (
                           <div className="flex justify-between">
                              <span className="text-sm text-slate-500">Exp. Salary:</span>
                              <span className="text-sm font-bold text-slate-900">${viewingUser.expectedSalary || 0}/hr</span>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Availability for Students */}
               {viewingUser.role === UserRole.STUDENT && (
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Availability</h4>
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">Suitable Days:</span>
                           <span className="text-sm font-bold text-slate-900">{viewingUser.suitableDays?.join(', ') || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">Suitable Time:</span>
                           <span className="text-sm font-bold text-slate-900">{viewingUser.suitableTime || 'N/A'}</span>
                        </div>
                     </div>
                  </div>
               )}

               {/* Bio */}
               <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Bio</h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl italic">
                     {viewingUser.bio || 'No bio provided.'}
                  </p>
               </div>

               {/* Role Specific Info */}
               <div className="grid md:grid-cols-2 gap-8">
                  {viewingUser.role === UserRole.TEACHER && (
                     <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Expertise & Skills</h4>
                        <div className="flex flex-wrap gap-2">
                           {viewingUser.expertise?.map((exp, i) => (
                              <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{exp}</span>
                           )) || <span className="text-sm text-slate-400">None listed</span>}
                        </div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 mt-4">Languages Spoken</h4>
                        <div className="flex flex-wrap gap-2">
                           {viewingUser.languagesSpoken?.map((lang, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{lang}</span>
                           )) || <span className="text-sm text-slate-400">None listed</span>}
                        </div>
                     </div>
                  )}
                  
                  {viewingUser.role === UserRole.STUDENT && (
                     <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                           {viewingUser.interests?.map((int, i) => (
                              <span key={i} className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">{int}</span>
                           )) || <span className="text-sm text-slate-400">None listed</span>}
                        </div>
                     </div>
                  )}

                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Account Details</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between">
                           <span className="text-sm text-slate-500">User ID:</span>
                           <span className="text-xs font-mono text-slate-400">{viewingUser.id}</span>
                        </div>
                        {viewingUser.cvUrl && (
                           <div className="flex justify-between">
                              <span className="text-sm text-slate-500">CV/Resume:</span>
                              <a href={viewingUser.cvUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline">View Document</a>
                           </div>
                        )}
                        {viewingUser.passportPhoto && (
                           <div className="flex justify-between">
                              <span className="text-sm text-slate-500">Passport Photo:</span>
                              <a href={viewingUser.passportPhoto} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline">View Photo</a>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="p-8 border-t bg-slate-50 flex justify-end shrink-0">
               <button 
                  onClick={() => setViewingUser(null)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-opacity"
               >
                  Close Profile
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-900">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
            </div>
            <form onSubmit={handleSaveCourse} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Course Title</label>
                    <input name="title" defaultValue={editingCourse?.title} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Master CSS Grid" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <input name="category" defaultValue={editingCourse?.category} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Web Development" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Price ($)</label>
                    <input name="price" type="number" step="0.01" defaultValue={editingCourse?.price} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0 for Free" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Duration</label>
                    <input name="duration" defaultValue={editingCourse?.duration} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 15 hours" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Student Limit</label>
                    <input name="studentLimit" type="number" defaultValue={editingCourse?.studentLimit} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 50" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Thumbnail URL (optional)</label>
                    <input name="thumbnail" defaultValue={editingCourse?.thumbnail} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://..." />
                 </div>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea name="description" defaultValue={editingCourse?.description} required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Enter course description..."></textarea>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">What you'll learn (one per line)</label>
                  <textarea name="learningOutcomes" defaultValue={editingCourse?.learningOutcomes?.join('\n')} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="e.g. Modern architecture and best practices&#10;Advanced state management techniques"></textarea>
               </div>

               {/* Lessons Management */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Course Lessons (Day Content)</h3>
                    <button 
                      type="button" 
                      onClick={handleAddLesson}
                      className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Lesson
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {modalLessons.map((lesson, index) => (
                      <div key={lesson.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveLesson(lesson.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Day</label>
                            <input 
                              type="number" 
                              value={lesson.day} 
                              onChange={(e) => handleUpdateLesson(lesson.id, 'day', parseInt(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Lesson Title</label>
                            <input 
                              type="text" 
                              value={lesson.title} 
                              onChange={(e) => handleUpdateLesson(lesson.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              placeholder="e.g. Introduction to Tajweed"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center">
                              <Video className="h-3 w-3 mr-1" /> Video URL
                            </label>
                            <input 
                              type="text" 
                              value={lesson.videoUrl} 
                              onChange={(e) => handleUpdateLesson(lesson.id, 'videoUrl', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              placeholder="YouTube/Vimeo link"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center">
                              <ImageIcon className="h-3 w-3 mr-1" /> Image URL
                            </label>
                            <input 
                              type="text" 
                              value={lesson.imageUrl} 
                              onChange={(e) => handleUpdateLesson(lesson.id, 'imageUrl', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              placeholder="Image link"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center">
                            <FileText className="h-3 w-3 mr-1" /> Lesson Content (Text)
                          </label>
                          <textarea 
                            value={lesson.content} 
                            onChange={(e) => handleUpdateLesson(lesson.id, 'content', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
                            placeholder="Enter lesson text content..."
                          ></textarea>
                        </div>
                      </div>
                    ))}
                    
                    {modalLessons.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-slate-400 text-sm">No lessons added yet. Click "Add Lesson" to start building your course content.</p>
                      </div>
                    )}
                  </div>
               </div>
               
               <div className="flex gap-4 pt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                 <button type="submit" className="flex-grow gradient-bg text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-opacity">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
