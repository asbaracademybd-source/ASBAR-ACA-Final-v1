
import React, { useEffect } from 'react';
import { Course, CourseType, User, UserRole } from '../types';
import { toast } from 'react-hot-toast';
import { Clock, Users, Star, PlayCircle, FileText, CheckCircle, ShieldCheck, Award, ArrowLeft, Lock } from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  currentUser: User | null;
  onEnroll: (courseId: string) => void;
  onNavigate: (view: string) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, currentUser, onEnroll, onNavigate }) => {
  const isTeacherOrAdmin = currentUser?.role === UserRole.TEACHER || currentUser?.role === UserRole.ADMIN;
  useEffect(() => {
    // Update document title and meta tags for SEO
    const originalTitle = document.title;
    document.title = `${course.title} - Asbar Academy`;
    
    // Helper to update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaTag('description', course.description);
    
    // Open Graph
    updateMetaTag('og:title', `${course.title} - Asbar Academy`, true);
    updateMetaTag('og:description', course.description, true);
    updateMetaTag('og:image', course.thumbnail, true);
    updateMetaTag('og:url', window.location.href, true);
    updateMetaTag('og:type', 'website', true);

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `${course.title} - Asbar Academy`);
    updateMetaTag('twitter:description', course.description);
    updateMetaTag('twitter:image', course.thumbnail);

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // Cleanup
    return () => {
      document.title = originalTitle;
      // We don't necessarily need to remove the tags, but we could reset them if we had defaults
    };
  }, [course]);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <button 
        onClick={() => onNavigate('courses')}
        className="flex items-center text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Courses
      </button>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        {/* Left: Course Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">{course.category}</span>
              <div className="flex items-center text-yellow-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="ml-1 font-bold text-slate-700">{course.rating}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{course.title}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 pt-4 text-slate-500 font-medium">
              <div className="flex items-center"><Clock className="mr-2 h-5 w-5" /> {course.duration}</div>
              <div className="flex items-center"><Users className="mr-2 h-5 w-5" /> {course.enrolledCount}/{course.studentLimit} Students</div>
              <div className="flex items-center"><PlayCircle className="mr-2 h-5 w-5" /> {course.lessons.length} Lessons</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">What you'll learn</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(course.learningOutcomes && course.learningOutcomes.length > 0 ? course.learningOutcomes : [
                "Modern architecture and best practices",
                "Advanced state management techniques",
                "Integration with real-world APIs",
                "Performance optimization strategies",
                "UI/UX fundamentals for developers",
                "Testing and deployment pipelines"
              ]).map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0 mt-1" />
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Curriculum</h3>
            <div className="space-y-4">
              {course.lessons.map((lesson, idx) => (
                <div key={lesson.id} className="group flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-2 rounded-lg text-slate-400 group-hover:text-blue-500 font-bold">{idx + 1}</div>
                    <span className="font-semibold text-slate-700">{lesson.title}</span>
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" /> 15 min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sidebar / Sticky Enrollment Card */}
        <div className="sticky top-28">
           <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-center">
              <img src={course.thumbnail} className="w-full h-48 rounded-2xl object-cover mb-8 shadow-lg" alt={course.title} />
              
              <div className="w-full space-y-6">
                <div className="flex items-baseline justify-center space-x-2">
                  <span className="text-4xl font-bold text-slate-900">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                  {course.price > 0 && <span className="text-slate-400 line-through font-medium">$99.99</span>}
                </div>
                {course.price > 0 && <p className="text-center text-slate-400 text-xs font-medium -mt-4">Negotiable</p>}

                <button 
                  disabled={isTeacherOrAdmin}
                  onClick={() => {
                    if (course.price > 0) {
                      onNavigate(`checkout/${course.id}`);
                    } else {
                      onEnroll(course.id);
                    }
                  }}
                  className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
                    isTeacherOrAdmin 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'gradient-bg text-white hover:scale-[1.02]'
                  }`}
                >
                  {isTeacherOrAdmin ? (
                    <>
                      <Lock className="h-5 w-5" />
                      Enrollment Restricted
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </button>

                <button 
                  onClick={() => window.open(`https://wa.me/yournumber?text=I'm interested in the course: ${course.title}`, '_blank')}
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  Register via WhatsApp
                </button>

                <button 
                  onClick={() => toast.success('Trial booked! We will contact you soon.')}
                  className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-slate-200 transition-all"
                >
                  Book Free Trial
                </button>

                <p className="text-center text-slate-500 text-sm font-medium">30-Day Money-Back Guarantee</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
