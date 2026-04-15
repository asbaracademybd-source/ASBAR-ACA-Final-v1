
import React, { useState } from 'react';
import { User, Course, Enrollment, UserRole, CourseType, Lesson } from '../types';
import { PlusCircle, Edit, Users, DollarSign, Book, Settings, LayoutGrid, Plus, Edit2, Trash2, X, Video, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';

interface TeacherDashboardProps {
  user: User;
  courses: Course[];
  allEnrollments: Enrollment[];
  onNavigate: (view: string) => void;
  onAddCourse?: (course: Course) => void;
  onUpdateCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onUpdateProfile?: (updatedData: Partial<User>) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, courses, allEnrollments, onNavigate, onAddCourse, onUpdateCourse, onDeleteCourse, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'analytics' | 'profile'>('courses');
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    bio: user.bio || '',
    city: user.location?.city || '',
    country: user.location?.country || '',
    expertise: user.expertise?.join(', ') || '',
    phone: user.phone || '',
    whatsapp: user.whatsapp || '',
    timezone: user.timezone || '',
    preferredLanguage: user.preferredLanguage || '',
    languagesSpoken: user.languagesSpoken?.join(', ') || '',
    expectedSalary: user.expectedSalary || 0,
    canOperateTools: user.canOperateTools || false
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile?.({
      name: profileForm.name,
      bio: profileForm.bio,
      location: {
        city: profileForm.city,
        state: user.location?.state || '',
        country: profileForm.country
      },
      expertise: (profileForm.expertise || '').split(',').map(i => i.trim()).filter(i => i !== ''),
      phone: profileForm.phone,
      whatsapp: profileForm.whatsapp,
      timezone: profileForm.timezone,
      preferredLanguage: profileForm.preferredLanguage,
      languagesSpoken: (profileForm.languagesSpoken || '').split(',').map(i => i.trim()).filter(i => i !== ''),
      expectedSalary: profileForm.expectedSalary,
      canOperateTools: profileForm.canOperateTools
    });
  };
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [modalLessons, setModalLessons] = useState<Lesson[]>([]);

  const teacherEnrollments = allEnrollments.filter(e => courses.some(c => c.id === e.courseId));
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.enrolledCount), 0);

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

    const title = formData.get('title') as string;
    const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const courseData: Course = {
      id: editingCourse?.id || Math.random().toString(36).substr(2, 9),
      slug: editingCourse?.slug || slug,
      title: title,
      description: formData.get('description') as string,
      teacherId: user.id,
      teacherName: user.name,
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
    <div className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex flex-col space-y-2">
        <div className="p-6 bg-white rounded-3xl shadow-sm border mb-6 flex flex-col items-center text-center">
          <img src={user.avatar} className="h-20 w-20 rounded-full mb-4 border-4 border-blue-100" alt={user.name} />
          <h3 className="font-bold text-slate-900">{user.name}</h3>
          <p className="text-xs text-blue-600 font-bold mb-2">Verified Instructor</p>
          <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] text-slate-500 font-mono uppercase tracking-widest">ID: {user.id}</div>
        </div>
        
        <button 
          onClick={() => setActiveTab('courses')}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'courses' ? 'gradient-bg text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Book className="h-5 w-5" />
          <span className="font-semibold">My Courses</span>
        </button>
        <button 
          onClick={() => setActiveTab('students')}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'students' ? 'gradient-bg text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Users className="h-5 w-5" />
          <span className="font-semibold">Student List</span>
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'analytics' ? 'gradient-bg text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <DollarSign className="h-5 w-5" />
          <span className="font-semibold">Revenue</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'profile' ? 'gradient-bg text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Settings className="h-5 w-5" />
          <span className="font-semibold">Profile</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow space-y-8 animate-in fade-in slide-in-from-right duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h2>
          {activeTab === 'courses' && (
            <button 
              onClick={() => handleOpenModal()}
              className="gradient-bg text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Course
            </button>
          )}
        </div>

        {activeTab === 'courses' && (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course, idx) => (
              <div key={`${course.id}-${idx}`} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group">
                <div className="relative mb-4">
                  <img src={course.thumbnail} className="w-full h-40 rounded-2xl object-cover" alt={course.title} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 uppercase">{course.category}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
                <div className="flex items-center justify-between text-slate-500 text-sm mb-6">
                   <div className="flex items-center"><Users className="h-4 w-4 mr-1" /> {course.enrolledCount} Students</div>
                   <div className="flex items-center font-bold text-slate-900">${course.price}</div>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => handleOpenModal(course)}
                    className="flex-grow bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200"
                   >
                    Edit Details
                   </button>
                   <button 
                    onClick={() => onDeleteCourse?.(course.id)}
                    className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold hover:bg-red-100"
                   >
                    <Trash2 className="h-5 w-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Student Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Course</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Progress</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teacherEnrollments.length > 0 ? teacherEnrollments.map((e, idx) => (
                  <tr key={`${e.id}-${idx}`} className="hover:bg-slate-50">
                    <td className="px-6 py-4 flex items-center space-x-3">
                       <img src={`https://picsum.photos/seed/${e.studentId}/40/40`} className="h-8 w-8 rounded-full" alt="Student" />
                       <span className="font-semibold text-slate-800">Student {e.studentId.substr(-3)}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                       {courses.find(c => c.id === e.courseId)?.title}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center space-x-2">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                             <div className="bg-green-500 h-full" style={{ width: `${e.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-500">{e.progress}%</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <button className="text-blue-600 font-bold text-sm hover:underline">Grade Task</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-400">No students enrolled yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100">
                  <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-1">Total Earnings</p>
                  <h3 className="text-4xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</h3>
                  <p className="text-xs text-green-500 mt-2">+12% from last month</p>
               </div>
               <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                  <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-1">Active Students</p>
                  <h3 className="text-4xl font-bold text-slate-900">{teacherEnrollments.length}</h3>
                  <p className="text-xs text-blue-500 mt-2">+5 new this week</p>
               </div>
               <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                  <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-1">Avg. Rating</p>
                  <h3 className="text-4xl font-bold text-slate-900">4.8</h3>
                  <p className="text-xs text-blue-500 mt-2">Based on 24 reviews</p>
               </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
               <h3 className="text-xl font-bold text-slate-900 mb-6">Revenue Overview</h3>
               <div className="h-64 w-full bg-slate-50 rounded-2xl flex items-end justify-between p-6 gap-2">
                  {[40, 60, 45, 90, 65, 80, 55, 75, 95, 40, 60, 85].map((h, i) => (
                    <div key={`revenue-bar-${i}`} className="flex-grow bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
               <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold text-slate-900">Profile Settings</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Expertise (comma separated)</label>
                  <input 
                    type="text" 
                    value={profileForm.expertise}
                    onChange={(e) => setProfileForm({...profileForm, expertise: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Quran, Arabic, Tajweed"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone Number</label>
                  <input 
                    type="text" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+880..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={profileForm.whatsapp}
                    onChange={(e) => setProfileForm({...profileForm, whatsapp: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+880..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Timezone</label>
                  <input 
                    type="text" 
                    value={profileForm.timezone}
                    onChange={(e) => setProfileForm({...profileForm, timezone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="GMT+6"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Preferred Language</label>
                  <input 
                    type="text" 
                    value={profileForm.preferredLanguage}
                    onChange={(e) => setProfileForm({...profileForm, preferredLanguage: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="English, Bengali..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Languages Spoken (comma separated)</label>
                  <input 
                    type="text" 
                    value={profileForm.languagesSpoken}
                    onChange={(e) => setProfileForm({...profileForm, languagesSpoken: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="English, Arabic, Bengali"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Expected Salary ($/hr)</label>
                  <input 
                    type="number" 
                    value={profileForm.expectedSalary}
                    onChange={(e) => setProfileForm({...profileForm, expectedSalary: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <input 
                  type="checkbox" 
                  id="canOperateTools"
                  checked={profileForm.canOperateTools}
                  onChange={(e) => setProfileForm({...profileForm, canOperateTools: e.target.checked})}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="canOperateTools" className="text-sm font-bold text-slate-700 cursor-pointer">
                  I can operate online teaching tools (Zoom, Google Meet, etc.)
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">City</label>
                  <input 
                    type="text" 
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Country</label>
                  <input 
                    type="text" 
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({...profileForm, country: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Bio</label>
                <textarea 
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <button type="submit" className="gradient-bg text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </form>
          </div>
        )}
      </main>

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
                      <div key={`${lesson.id}-${index}`} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative">
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

export default TeacherDashboard;
