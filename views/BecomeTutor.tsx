
import React from 'react';
import { CheckCircle, Users, Globe, BookOpen, Award, DollarSign, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface BecomeTutorProps {
  onNavigate: (view: string) => void;
}

const BecomeTutor: React.FC<BecomeTutorProps> = ({ onNavigate }) => {
  const benefits = [
    {
      title: "Global Reach",
      desc: "Teach students from over 25 countries including UK, USA, Canada, and Australia.",
      icon: <Globe className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Flexible Scheduling",
      desc: "Choose your own working hours and days that fit your lifestyle.",
      icon: <Clock className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Competitive Compensation",
      desc: "Earn a competitive salary based on your expertise and teaching hours.",
      icon: <DollarSign className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Professional Growth",
      desc: "Access to our custom-built virtual classroom and modern teaching tools.",
      icon: <Award className="h-8 w-8 text-blue-600" />
    }
  ];

  const requirements = [
    "Hafiz, Maulana, or Mufti with authentic certification.",
    "Strong proficiency in Tajweed and Quranic Arabic.",
    "Previous experience in online or offline teaching.",
    "Basic computer literacy and ability to use Zoom/Google Meet.",
    "Stable internet connection and a quiet teaching environment.",
    "Commitment to student progress and character building (Tarbiyah)."
  ];

  return (
    <div className="flex flex-col w-full bg-[#fcfaf2]">
      {/* Hero Section */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
          Join Our Mission
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 serif leading-tight">
          Become an Online Tutor at <span className="text-blue-600">Asbar Academy</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Share the light of the Quran and Sunnah with students worldwide. Join a community of dedicated educators and make a lasting impact.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button 
            onClick={() => onNavigate('register-teacher')}
            className="gradient-bg text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
          >
            Apply Now <ArrowRight className="h-5 w-5" />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('benefits');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white border-2 border-slate-200 text-slate-600 px-10 py-4 rounded-xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Image Section */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative">
          <img 
            src="https://images.unsplash.com/photo-1577891729319-82439e4f6d51?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-[500px] object-cover" 
            alt="Teacher in classroom" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-12">
            <div className="text-white space-y-2">
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">Our Teaching Community</p>
              <h3 className="text-3xl font-bold serif">Empowering Educators, Inspiring Students</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 serif">Why Teach With Us?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We provide the platform, tools, and support you need to focus on what you do best: teaching.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="p-8 bg-[#fcfaf2] rounded-[2.5rem] border border-slate-100 space-y-6 hover:shadow-xl transition-all">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-blue-50">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-24 bg-[#fcfaf2] px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900 serif">Tutor Requirements</h2>
            <p className="text-slate-600 leading-relaxed">
              We maintain high standards to ensure our students receive the best possible education. Here's what we look for in our tutors:
            </p>
            <div className="space-y-4">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{req}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" 
              className="rounded-[3rem] shadow-2xl border-4 border-white" 
              alt="Requirements" 
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
              <p className="text-slate-600 italic text-sm">
                "Teaching at Asbar Academy has been a rewarding experience. The support from the management and the enthusiasm of the students is truly inspiring."
              </p>
              <p className="mt-4 font-bold text-slate-900">— Hafiz Mohammad, Senior Tutor</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-4xl font-bold text-slate-900 serif">How to Get Started</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            
            {[
              { step: "01", title: "Submit Application", desc: "Fill out the tutor registration form with your details and certifications." },
              { step: "02", title: "Interview & Demo", desc: "Our team will review your application and invite you for a demo session." },
              { step: "03", title: "Start Teaching", desc: "Once approved, set your schedule and start welcoming students to your classes." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 space-y-6">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto gradient-bg rounded-[3rem] p-16 text-center text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-5xl font-bold serif">Ready to Join Our Team?</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Start your journey as an online tutor today and help us build a more knowledgeable Ummah.
            </p>
            <div className="flex justify-center pt-4">
              <button 
                onClick={() => onNavigate('register-teacher')}
                className="bg-white text-blue-600 px-12 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl"
              >
                Apply as a Tutor
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default BecomeTutor;
