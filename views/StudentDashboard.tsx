
import React, { useState, useEffect } from 'react';
import { User, Enrollment, Course, UserRole } from '../types';
// Fixed: Added Users to the imports
import { BookOpen, MapPin, Clock, Award, Briefcase, ChevronRight, Search, CheckCircle, Play, ArrowLeft, Settings } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  enrollments: Enrollment[];
  courses: Course[];
  allUsers: User[];
  onNavigate: (view: string) => void;
  onCompleteLesson?: (enrollmentId: string, lessonId: string) => void;
  onUpdateProfile?: (updatedData: Partial<User>) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, enrollments, courses, allUsers, onNavigate, onCompleteLesson, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'my-courses' | 'certificates' | 'profile'>('overview');
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    bio: user.bio || '',
    city: user.location?.city || '',
    country: user.location?.country || '',
    interests: user.interests?.join(', ') || '',
    phone: user.phone || '',
    whatsapp: user.whatsapp || '',
    timezone: user.timezone || '',
    preferredLanguage: user.preferredLanguage || '',
    learningMode: user.learningMode || 'ONLINE',
    lessonPreference: user.lessonPreference || 'INDIVIDUAL',
    budgetPerHour: user.budgetPerHour || 0,
    suitableDays: user.suitableDays?.join(', ') || '',
    suitableTime: user.suitableTime || ''
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
      interests: (profileForm.interests || '').split(',').map(i => i.trim()).filter(i => i !== ''),
      phone: profileForm.phone,
      whatsapp: profileForm.whatsapp,
      timezone: profileForm.timezone,
      preferredLanguage: profileForm.preferredLanguage,
      learningMode: profileForm.learningMode as any,
      lessonPreference: profileForm.lessonPreference as any,
      budgetPerHour: profileForm.budgetPerHour,
      suitableDays: (profileForm.suitableDays || '').split(',').map(i => i.trim()).filter(i => i !== ''),
      suitableTime: profileForm.suitableTime
    });
  };

  const enrolledCourses = enrollments.map(e => ({
    ...e,
    course: courses.find(c => c.id === e.courseId)
  })).filter(e => e.course) as (Enrollment & { course: Course })[];

  const currentEnrollment = enrollments.find(e => e.courseId === viewingCourseId);
  const currentCourse = courses.find(c => c.id === viewingCourseId);
  const currentLesson = currentCourse?.lessons.find(l => l.id === selectedLessonId);

  const handleMarkAsRead = async (lessonId: string) => {
    if (currentEnrollment && currentCourse) {
      await onCompleteLesson?.(currentEnrollment.id, lessonId);
      
      // Find next lesson automatically
      const sortedLessons = [...currentCourse.lessons].sort((a, b) => a.day - b.day);
      const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);
      if (currentIndex !== -1 && currentIndex < sortedLessons.length - 1) {
        setSelectedLessonId(sortedLessons[currentIndex + 1].id);
      }
    }
  };

  if (viewingCourseId && currentCourse && currentEnrollment) {
    return (
      <div className="max-w-7xl mx-auto w-full px-6 py-10 space-y-8 animate-in fade-in duration-500">
        <button 
          onClick={() => { setViewingCourseId(null); setSelectedLessonId(null); }}
          className="flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lesson List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{currentCourse.title}</h3>
              <div className="space-y-2">
                {currentCourse.lessons.sort((a, b) => a.day - b.day).map((lesson, idx) => {
                  const isCompleted = currentEnrollment.completedLessonIds?.includes(lesson.id);
                  const isSelected = selectedLessonId === lesson.id;
                  
                  return (
                    <button
                      key={`${lesson.id}-${idx}`}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`w-full flex items-center p-4 rounded-2xl transition-all text-left border ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20' 
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${
                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <span className="text-xs font-bold">{lesson.day}</span>}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Day {lesson.day}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentLesson ? (
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest">
                    <BookOpen className="h-4 w-4 mr-2" /> Day {currentLesson.day} Content
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">{currentLesson.title}</h2>
                </div>

                {currentLesson.videoUrl && (
                  <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                    <iframe 
                      src={currentLesson.videoUrl.replace('watch?v=', 'embed/')} 
                      className="w-full h-full"
                      title={currentLesson.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {currentLesson.imageUrl && (
                  <img 
                    src={currentLesson.imageUrl} 
                    alt={currentLesson.title} 
                    className="w-full rounded-3xl shadow-lg border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                )}

                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{currentLesson.content}</p>
                </div>

                <div className="pt-8 border-t flex justify-between items-center">
                  <div className="flex items-center text-slate-400 text-sm">
                    {currentEnrollment.completedLessonIds?.includes(currentLesson.id) ? (
                      <span className="flex items-center text-green-600 font-bold">
                        <CheckCircle className="h-5 w-5 mr-2" /> Completed
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" /> Not completed yet
                      </span>
                    )}
                  </div>
                  
                  {currentEnrollment.completedLessonIds?.includes(currentLesson.id) ? (
                    (() => {
                      const sortedLessons = [...currentCourse.lessons].sort((a, b) => a.day - b.day);
                      const currentIndex = sortedLessons.findIndex(l => l.id === currentLesson.id);
                      if (currentIndex !== -1 && currentIndex < sortedLessons.length - 1) {
                        return (
                          <button 
                            onClick={() => setSelectedLessonId(sortedLessons[currentIndex + 1].id)}
                            className="bg-blue-100 text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-200 transition-all flex items-center"
                          >
                            Next Lesson <ChevronRight className="ml-2 h-5 w-5" />
                          </button>
                        );
                      }
                      return null;
                    })()
                  ) : (
                    <button 
                      onClick={() => handleMarkAsRead(currentLesson.id)}
                      className="gradient-bg text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center"
                    >
                      Mark as Read & Continue
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center space-y-4">
                <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Play className="text-blue-600 h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Select a lesson to start learning</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">Choose a lesson from the sidebar to view its video, images, and text content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex flex-col space-y-2">
        <div className="p-6 bg-white rounded-3xl shadow-sm border mb-6 flex flex-col items-center text-center">
          <img src={user.avatar} className="h-20 w-20 rounded-full mb-4 border-4 border-blue-100" alt={user.name} />
          <h3 className="font-bold text-slate-900">{user.name}</h3>
          <p className="text-xs text-slate-500 mb-4">{user.email}</p>
          <div className="flex items-center text-xs text-slate-400"><MapPin className="h-3 w-3 mr-1" /> {user.location?.city}, {user.location?.country}</div>
        </div>
        
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'overview' ? 'gradient-bg text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Briefcase className="h-5 w-5" />
          <span className="font-semibold">Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab('my-courses')}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'my-courses' ? 'gradient-bg text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">My Courses</span>
        </button>
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'certificates' ? 'gradient-bg text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Award className="h-5 w-5" />
          <span className="font-semibold">Certificates</span>
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
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center text-center space-y-2">
                <BookOpen className="text-blue-600" />
                <h4 className="text-2xl font-bold text-slate-800">{enrolledCourses.length}</h4>
                <p className="text-sm text-slate-500">Courses Enrolled</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center text-center space-y-2">
                <Clock className="text-blue-600" />
                <h4 className="text-2xl font-bold text-slate-800">42h</h4>
                <p className="text-sm text-slate-500">Hours Learned</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center text-center space-y-2">
                <Award className="text-blue-600" />
                <h4 className="text-2xl font-bold text-slate-800">12</h4>
                <p className="text-sm text-slate-500">Certificates Earned</p>
              </div>
            </div>

            <section className="bg-white p-8 rounded-3xl shadow-sm border">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex justify-between items-center">
                Continue Learning
                <button onClick={() => setActiveTab('my-courses')} className="text-sm text-blue-600 font-bold hover:underline">View All</button>
              </h3>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-6">
                  {enrolledCourses.slice(0, 2).map((e, idx) => (
                    <div key={`${e.id}-${idx}`} className="group flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setViewingCourseId(e.courseId)}>
                      <img src={e.course.thumbnail} className="w-32 h-20 rounded-xl object-cover" alt={e.course.title} />
                      <div className="flex-grow">
                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600">{e.course.title}</h4>
                        <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                          <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${e.progress || 10}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">{e.progress || 10}% Complete</p>
                      </div>
                      <ChevronRight className="text-slate-300 h-6 w-6 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p>You haven't enrolled in any courses yet.</p>
                  <button onClick={() => onNavigate('courses')} className="mt-4 text-blue-600 font-bold">Start Browsing</button>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'my-courses' && (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCourses.map((e, idx) => (
              <div key={`${e.id}-${idx}-grid`} className="glass p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col justify-between">
                <div>
                  <img src={e.course.thumbnail} className="w-full h-40 rounded-2xl object-cover mb-4" alt={e.course.title} />
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{e.course.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{e.course.description}</p>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{e.progress}%</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${e.progress}%` }}></div>
                   </div>
                   <div className="flex gap-2">
                     <button 
                      className="flex-grow bg-blue-100 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-200" 
                      onClick={() => setViewingCourseId(e.courseId)}
                     >
                      View Lessons
                     </button>
                     {e.progress >= 100 && (
                       <button 
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90"
                        onClick={() => onNavigate(`cert-${e.certificateId}`)}
                       >
                         Certificate
                       </button>
                     )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Your Certificates</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {enrollments.filter(e => e.certificateId).length > 0 ? (
                  enrollments.filter(e => e.certificateId).map((e, idx) => {
                    const course = courses.find(c => c.id === e.courseId);
                    return (
                      <div key={`${e.id}-${idx}-cert`} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-blue-300 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{course?.title}</h4>
                            <p className="text-xs text-slate-500">Issued on {new Date(e.enrollmentDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => onNavigate(`cert-${e.certificateId}`)}
                          className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          View & Download
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-20 text-center space-y-4">
                    <Award className="h-16 w-16 text-slate-200 mx-auto" />
                    <p className="text-slate-400">No certificates issued yet. Complete a course to earn one!</p>
                  </div>
                )}
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Interests (comma separated)</label>
                  <input 
                    type="text" 
                    value={profileForm.interests}
                    onChange={(e) => setProfileForm({...profileForm, interests: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Quran, Arabic, Tajweed"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="text" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+880..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">WhatsApp Number</label>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Timezone</label>
                  <input 
                    type="text" 
                    value={profileForm.timezone}
                    onChange={(e) => setProfileForm({...profileForm, timezone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="GMT+6"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preferred Language</label>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Learning Mode</label>
                  <select 
                    value={profileForm.learningMode}
                    onChange={(e) => setProfileForm({...profileForm, learningMode: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lesson Preference</label>
                  <select 
                    value={profileForm.lessonPreference}
                    onChange={(e) => setProfileForm({...profileForm, lessonPreference: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="INDIVIDUAL">Individual (1-on-1)</option>
                    <option value="BATCH">Batch (Group)</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Budget Per Hour ($)</label>
                  <input 
                    type="number" 
                    value={profileForm.budgetPerHour}
                    onChange={(e) => setProfileForm({...profileForm, budgetPerHour: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suitable Time</label>
                  <input 
                    type="text" 
                    value={profileForm.suitableTime}
                    onChange={(e) => setProfileForm({...profileForm, suitableTime: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 6:00 PM - 9:00 PM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suitable Days (comma separated)</label>
                <input 
                  type="text" 
                  value={profileForm.suitableDays}
                  onChange={(e) => setProfileForm({...profileForm, suitableDays: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Monday, Wednesday, Friday"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">City</label>
                  <input 
                    type="text" 
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Country</label>
                  <input 
                    type="text" 
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({...profileForm, country: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bio</label>
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
    </div>
  );
};

export default StudentDashboard;
