
/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { User, UserRole, Course, Enrollment, Certificate } from './types'; 
// Removed INITIAL_USERS and INITIAL_COURSES imports
import Navbar from './components/Navbar';
import Home from './views/Home';
import Login from './views/Login';
import StudentDashboard from './views/StudentDashboard';
import TeacherDashboard from './views/TeacherDashboard';
import AdminDashboard from './views/AdminDashboard';
import CourseDetail from './views/CourseDetail';
import Checkout from './views/Checkout';
import CertificateView from './views/CertificateView';
import CertificateVerification from './views/CertificateVerification';
import BrowseCourses from './views/BrowseCourses';
import About from './views/About';
import Pricing from './views/Pricing';
import Contact from './views/Contact';
import Footer from './components/Footer';
import BecomeTutor from './views/BecomeTutor';
import WhatsAppButton from './components/WhatsAppButton';
import { auth } from './src/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Toaster, toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [pageContent, setPageContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await fetch(`/api/users/${firebaseUser.uid}`);
          if (res.ok) {
            const userData = await res.json();
            setCurrentUser({ ...userData, id: userData._id });
          } else {
            // Sync user if not found in DB
            const syncRes = await fetch('/api/users/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'User',
                avatar: firebaseUser.photoURL,
                role: UserRole.STUDENT
              })
            });
            const userData = await syncRes.json();
            setCurrentUser({ ...userData, id: userData._id });
          }
        } catch (err) {
          console.error('Auth sync error:', err);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes, enrollmentsRes, certsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/courses'),
          fetch('/api/enrollments'),
          fetch('/api/certificates')
        ]);

        const usersData = await usersRes.json();
        const coursesData = await coursesRes.json();
        const enrollmentsData = await enrollmentsRes.json();
        const certsData = await certsRes.json();

        // Map _id to id for frontend compatibility
        const mapId = (item: any) => ({ ...item, id: item._id });

        setUsers(usersData.map(mapId));
        setCourses(coursesData.map(mapId));
        setEnrollments(enrollmentsData.map(mapId));
        setCertificates(certsData.map(mapId));
        setDataLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pages = ['home', 'about', 'pricing', 'certificate', 'settings'];
        const contentMap: Record<string, any> = {};
        
        await Promise.all(pages.map(async (pageId) => {
          const res = await fetch(`/api/content/${pageId}`);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              contentMap[pageId] = data.content;
            }
          }
        }));
        
        setPageContent(prev => ({ ...prev, ...contentMap }));
      } catch (err) {
        console.error('Failed to fetch page content:', err);
      }
    };
    fetchContent();
  }, []);

  // Handle Stripe Redirects
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      toast.success('Payment successful! You are now enrolled.');
      // Refresh enrollments
      fetch('/api/enrollments')
        .then(res => res.json())
        .then(data => setEnrollments(data.map((item: any) => ({ ...item, id: item._id }))));
      window.history.replaceState({}, '', '/');
    }
    if (query.get('payment') === 'cancel') {
      toast.error('Payment cancelled.');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Simple Router logic
  const navigate = (view: string) => {
    setCurrentView(view);
    const path = view === 'home' ? '/' : `/${view}`;
    window.history.pushState({}, '', path);
    window.scrollTo(0, 0);
  };

  // Sync view with path on load and popstate change
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      if (path) {
        setCurrentView(path);
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial check

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    navigate('home');
    toast.success('Logged out successfully');
  };

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.firebaseUid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser({ ...data, id: data._id });
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const enrollInCourse = async (courseId: string, skipPayment: boolean = false) => {
    if (!currentUser) return navigate('login');
    if (currentUser.role === UserRole.TEACHER || currentUser.role === UserRole.ADMIN) {
      return toast.error("Teachers and Admins cannot enroll in courses.");
    }
    const existing = enrollments.find(e => e.courseId === courseId && e.studentId === currentUser.id);
    if (existing) return toast.error("Already enrolled!");
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    if (course.price > 0 && !skipPayment) {
      try {
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            studentId: currentUser.id,
            studentEmail: currentUser.email
          })
        });
        const { id } = await res.json();
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        if (stripe) {
          await (stripe as any).redirectToCheckout({ sessionId: id });
        }
      } catch (err) {
        toast.error("Payment failed to initialize");
      }
      return;
    }

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser.id,
          courseId,
          progress: 0,
          completed: false
        })
      });

      if (!res.ok) throw new Error('Enrollment failed');
      
      const newEnrollment = await res.json();
      const mappedEnrollment = { ...newEnrollment, id: newEnrollment._id };
      
      setEnrollments([...enrollments, mappedEnrollment]);
      
      // Update course enrolled count locally
      setCourses(courses.map(c => c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c));
      
      toast.success("Enrolled successfully!");
      navigate('student-dashboard');
    } catch (err) {
      toast.error("Enrollment failed. Please try again.");
    }
  };

  const onAddCourse = async (newCourse: Course) => {
    try {
      const { id, ...courseData } = newCourse;
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      const savedCourse = await res.json();
      setCourses([...courses, { ...savedCourse, id: savedCourse._id }]);
    } catch (err) {
      alert("Failed to add course");
    }
  };

  const onCompleteLesson = async (enrollmentId: string, lessonId: string) => {
    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}/complete-lesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId })
      });
      const updatedEnrollment = await res.json();
      setEnrollments(enrollments.map(e => e.id === enrollmentId ? { ...updatedEnrollment, id: updatedEnrollment._id } : e));
    } catch (err) {
      alert("Failed to mark lesson as completed");
    }
  };

  const onUpdateCourse = async (updatedCourse: Course) => {
    try {
      const { id, ...courseData } = updatedCourse;
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      const savedCourse = await res.json();
      setCourses(courses.map(c => c.id === id ? { ...savedCourse, id: savedCourse._id } : c));
    } catch (err) {
      alert("Failed to update course");
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== courseId));
      }
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  const onGenerateCertificate = async (enrollmentId: string) => {
    try {
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      if (!enrollment) return;
      
      const student = users.find(u => u.id === enrollment.studentId);
      const course = courses.find(c => c.id === enrollment.courseId);
      
      if (!student || !course) return;

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          studentId: student.id,
          studentName: student.name,
          courseId: course.id,
          courseTitle: course.title,
          teacherName: course.teacherName
        })
      });
      
      const newCert = await res.json();
      if (res.ok) {
        const mappedCert = { ...newCert, id: newCert._id };
        setCertificates([...certificates, mappedCert]);
        // Update enrollment locally
        setEnrollments(enrollments.map(e => e.id === enrollmentId ? { ...e, certificateId: mappedCert.id } : e));
        alert("Certificate generated successfully!");
      } else {
        alert(newCert.error || "Failed to generate certificate");
      }
    } catch (err) {
      alert("Error generating certificate");
    }
  };

  const onUpdatePageContent = async (pageId: string, content: any) => {
    try {
      const res = await fetch(`/api/content/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        const data = await res.json();
        setPageContent(prev => ({ ...prev, [pageId]: data.content }));
        toast.success(`${pageId} content updated!`);
      }
    } catch (err) {
      toast.error('Failed to update content');
    }
  };

  const renderView = () => {
    if (loading || dataLoading) return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

    if (currentView === 'become-tutor') return <BecomeTutor onNavigate={navigate} />;
    if (currentView === 'home') return <Home onNavigate={navigate} featuredCourses={courses} content={pageContent.home} />;
    if (currentView === 'about') return <About onNavigate={navigate} content={pageContent.about} />;
    if (currentView === 'pricing') return <Pricing onNavigate={navigate} content={pageContent.pricing} />;
    if (currentView === 'contact') return <Contact onNavigate={navigate} />;
    if (currentView === 'courses') return <BrowseCourses courses={courses} onNavigate={navigate} />;
    if (currentView === 'login' || currentView === 'register') return <Login mode={currentView} onNavigate={navigate} />;
    if (currentView === 'register-teacher') return <Login mode="register" onNavigate={navigate} initialRole={UserRole.TEACHER} />;
    
    if (currentView === 'student-dashboard' && currentUser?.role === UserRole.STUDENT) {
      return (
        <StudentDashboard 
          user={currentUser} 
          enrollments={enrollments.filter(e => e.studentId === currentUser.id)} 
          courses={courses}
          allUsers={users}
          onNavigate={navigate}
          onCompleteLesson={onCompleteLesson}
          onUpdateProfile={handleUpdateProfile}
        />
      );
    }

    if (currentView === 'teacher-dashboard' && currentUser?.role === UserRole.TEACHER) {
      return (
        <TeacherDashboard 
          user={currentUser} 
          courses={courses.filter(c => c.teacherId === currentUser.id)}
          allEnrollments={enrollments}
          onNavigate={navigate}
          onAddCourse={onAddCourse}
          onUpdateCourse={onUpdateCourse}
          onDeleteCourse={onDeleteCourse}
          onUpdateProfile={handleUpdateProfile}
        />
      );
    }

    if (currentView === 'admin-dashboard' && currentUser?.role === UserRole.ADMIN) {
      return (
        <AdminDashboard 
          stats={{
            totalStudents: users.filter(u => u.role === UserRole.STUDENT).length,
            totalTeachers: users.filter(u => u.role === UserRole.TEACHER).length,
            activeCourses: courses.length,
            totalRevenue: courses.reduce((acc, c) => acc + (c.price * c.enrolledCount), 0)
          }}
          users={users}
          courses={courses}
          enrollments={enrollments}
          onNavigate={navigate}
          onAddCourse={onAddCourse}
          onUpdateCourse={onUpdateCourse}
          onDeleteCourse={onDeleteCourse}
          onGenerateCertificate={onGenerateCertificate}
          pageContent={pageContent}
          onUpdatePageContent={onUpdatePageContent}
        />
      );
    }

    if (currentView.startsWith('verify-certificate/')) {
      const certId = currentView.split('/')[1];
      return <CertificateVerification certificateId={certId} onNavigate={navigate} />;
    }

    if (currentView.startsWith('cert-')) {
      const certId = currentView.split('-')[1];
      const cert = certificates.find(c => c.id === certId);
      if (cert) {
        const enrollment = enrollments.find(e => e.id === cert.enrollmentId);
        const course = courses.find(c => c.id === cert.courseId);
        const student = users.find(u => u.id === cert.studentId);
        if (enrollment && course && student) {
          return (
            <CertificateView 
              certificate={cert} 
              enrollment={enrollment} 
              course={course} 
              student={student} 
              onNavigate={navigate} 
              background={pageContent.certificate?.background}
            />
          );
        }
      }
    }

    if (currentView.startsWith('course/')) {
      const courseIdOrSlug = currentView.replace('course/', '');
      if (!courseIdOrSlug || courseIdOrSlug === 'undefined') {
        return (
          <div className="p-20 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Course not found</h2>
            <button onClick={() => navigate('courses')} className="text-blue-600 font-bold hover:underline">Browse all courses</button>
          </div>
        );
      }
      const course = courses.find(c => c.slug === courseIdOrSlug || c.id === courseIdOrSlug);
      if (course) return <CourseDetail course={course} currentUser={currentUser} onEnroll={enrollInCourse} onNavigate={navigate} />;
    }

    if (currentView.startsWith('checkout/')) {
      const courseId = currentView.replace('checkout/', '');
      const course = courses.find(c => c.id === courseId);
      if (course) return <Checkout course={course} currentUser={currentUser} onComplete={enrollInCourse} onNavigate={navigate} />;
    }

    return <div className="p-20 text-center">View not found</div>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Navbar user={currentUser} onLogout={handleLogout} onNavigate={navigate} />
      <main className="flex-grow flex flex-col">
        {renderView()}
      </main>
      <Footer onNavigate={navigate} />
      <WhatsAppButton />
    </div>
  );
};

export default App;
