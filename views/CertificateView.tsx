
import React from 'react';
import { Enrollment, Course, User, Certificate } from '../types';
import { Award, ShieldCheck, Download, Share2, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateProps {
  certificate: Certificate;
  enrollment: Enrollment;
  course: Course;
  student: User;
  onNavigate: (view: string) => void;
  background?: string;
}

const CertificateView: React.FC<CertificateProps> = ({ certificate, enrollment, course, student, onNavigate, background }) => {
  if (!certificate) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Certificate Not Found</h2>
        <button onClick={() => onNavigate('student-dashboard')} className="text-blue-600 font-bold">Back to Dashboard</button>
      </div>
    );
  }

  const dateStr = new Date(certificate.issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-20 flex flex-col items-center animate-in fade-in duration-500">
      <div className="flex justify-between w-full mb-10">
         <div className="space-y-2">
            <button 
              onClick={() => onNavigate('student-dashboard')}
              className="flex items-center text-slate-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Your Achievement</h1>
            <p className="text-slate-500">You have successfully completed this journey.</p>
         </div>
         <div className="flex space-x-4 items-end">
            <button className="flex items-center space-x-2 bg-slate-100 px-6 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-200 transition-colors" onClick={() => window.print()}>
               <Download className="h-5 w-5" /> <span>Download PDF</span>
            </button>
            <button className="gradient-bg text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">
               <Share2 className="h-5 w-5" />
            </button>
         </div>
      </div>

      {/* The Certificate itself */}
      <div 
        className="w-full aspect-[1.414/1] bg-white rounded-lg shadow-2xl relative overflow-hidden print:shadow-none bg-cover bg-center"
        style={{ backgroundImage: `url("${background || 'https://storage.googleapis.com/file-extract.appspot.com/v0/b/file-extract.appspot.com/o/65893769-1662-421b-8575-f21394c86f03.png?alt=media&token=487d8538-4e8c-449e-8835-f0967389665e'}")` }}
      >
        <div className="w-full h-full p-20 flex flex-col items-center text-center relative z-10">
          
          <div className="mt-12">
            <Award className="h-20 w-20 text-yellow-600/50 mb-6" />
          </div>
          
          <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-slate-500 mb-6">Certificate of Completion</h2>
          
          <p className="text-lg text-slate-400 mb-2 italic">This is to certify that</p>
          
          <h3 className="text-6xl font-serif font-bold text-slate-900 mb-8 tracking-wide">{student.name}</h3>
          
          <p className="text-lg text-slate-400 mb-6 italic">has successfully completed all requirements for the course</p>
          
          <h4 className="text-4xl font-bold text-slate-800 mb-12">{course.title}</h4>
          
          <div className="w-full grid grid-cols-3 gap-10 mt-auto">
            <div className="flex flex-col items-start space-y-4">
              <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-sm">
                <QRCodeSVG 
                  value={`${certificate.verificationUrl}${certificate.id}`}
                  size={70}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-left space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student ID: <span className="text-slate-700">{certificate.studentId.substring(0, 8).toUpperCase()}</span></p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Issued: <span className="text-slate-700">{dateStr}</span></p>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center opacity-20">
               <ShieldCheck className="h-24 w-24 text-slate-400" />
            </div>

            <div className="flex flex-col items-center justify-end">
              <div className="w-full border-b-2 border-slate-300 pb-2 mb-2 italic text-slate-700 font-serif text-2xl">
                 {course.teacherName}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teacher ID: {course.teacherId.substring(0, 8).toUpperCase()}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lead Instructor</p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono">
            Certificate ID: {certificate.id.toUpperCase()} • Verify at {certificate.verificationUrl}{certificate.id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
