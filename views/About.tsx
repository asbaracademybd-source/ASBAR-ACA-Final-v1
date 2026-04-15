
import React from 'react';
import { Check, Play, MapPin, Globe, Users, BookOpen, Award, Star, Shield, Target, Eye, Heart } from 'lucide-react';

interface AboutProps {
  onNavigate: (view: string) => void;
  content?: any;
}

const About: React.FC<AboutProps> = ({ onNavigate, content }) => {
  const header = content?.header || {
    title: "About Asbar Academy",
    description: "Asbar Academy is a center of Islamic learning, nurturing faith, discipline, and knowledge through Quranic teachings, Hadith studies, and moral guidance for students.",
    subtext: "Asbar Academy is an educational project of Nextgen EdTech Services Limited, a registered company in Bangladesh.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600"
  };

  const whoWeAre = content?.whoWeAre || {
    title: "Who We Are",
    description1: "Asbar Academy is a global online Islamic learning platform dedicated to making authentic Quranic and Islamic education accessible to every home. With students joining from across the world, we provide structured courses that combine traditional knowledge with modern, interactive teaching methods.",
    description2: "Our team of qualified teachers delivers personalized one-to-one sessions, small group classes, and comprehensive programs designed for children, adults, and new Muslims alike. Beyond teaching Quran and Islamic studies, we focus on tarbiyah (character building), nurturing faith, and instilling values that help our students live as practicing Muslims with sincerity, confidence, and kindness."
  };

  const missionVision = content?.missionVision || {
    mission: "To provide accessible and authentic Islamic education worldwide through modern technology. From foundational learning to advanced studies, we aim to make Qur'anic and Sunnah-based knowledge easy to learn for children, parents, and new Muslims — building stronger individuals, families, and communities.",
    vision: "To bring the light of the Qur'an and Sunnah into every home, empowering children, families, and new Muslims to live guided by Islamic values. We especially focus on supporting communities with limited access to mosques or madrasas, and helping new Muslims begin their journey with confidence."
  };

  const stats = content?.stats || [
    { label: "Satisfaction Rate", value: "99%", icon: <Star className="h-6 w-6 text-gold" /> },
    { label: "Successful Completed Sessions", value: "100k+", icon: <BookOpen className="h-6 w-6 text-gold" /> },
    { label: "Countries Worldwide Reach", value: "25+", icon: <Globe className="h-6 w-6 text-gold" /> },
    { label: "Registered Students", value: "15k+", icon: <Users className="h-6 w-6 text-gold" /> },
  ];

  const team = content?.team || [
    {
      name: "Md Ashraf Ali.",
      role: "Founder & CEO of Asbar Academy",
      country: "Bangladesh",
      flag: "🇧🇩",
      image: "https://picsum.photos/seed/ashraf/400/500"
    },
    {
      name: "Mufti Abdul Hannan al Habib",
      role: "Advisor — Khatib",
      country: "Bangladesh",
      flag: "🇧🇩",
      image: "https://picsum.photos/seed/hannan/400/500"
    },
    {
      name: "Ahsan Al-Hadi",
      role: "Advisor — Khatib in London",
      country: "UK",
      flag: "🇬🇧",
      image: "https://picsum.photos/seed/ahsan/400/500"
    }
  ];

  const comparison = content?.comparison || [
    { feature: "Certified Tutors", other: false, deeni: "Hand-picked, trained & qualified" },
    { feature: "Hifz System", other: "Varies", deeni: "Saudi-based proven method" },
    { feature: "Gamification", other: false, deeni: "XP-based motivation system" },
    { feature: "Blended Learning", other: "Some", deeni: "Full blend: Live + Quiz + Assignment in LMS" },
    { feature: "Structured Curriculum", other: "Varies", deeni: "Complete path: Qaida → Hifz → Islamic Studies" },
    { feature: "Advanced Learning System", other: false, deeni: "Organized online portal for classes, homework & progress tracking" },
    { feature: "Attendance Tracking", other: "Manual", deeni: "Smart attendance + calendar" },
    { feature: "Invoicing & Scheduling", other: false, deeni: "Automated: invoices, rescheduling, Make-up class credits" },
  ];

  const uniqueFeatures = content?.uniqueFeatures || [
    { title: "Structured Curriculum & Courses", icon: "📚" },
    { title: "Qualified Multilingual Tutors Male & Female", icon: "🎓" },
    { title: "Custom-Built Virtual Classroom", icon: "💻" },
    { title: "Advanced Attendance & Scheduling", icon: "📅" },
    { title: "Proven Hifz Memorization Method", icon: "📖" },
    { title: "Gamified Learning Experience", icon: "🎮" },
    { title: "Teaching with Tarbiyah & Akhlaq", icon: "🤝" },
    { title: "Own-Pace Blended Learning", icon: "⏳" },
    { title: "Progress Monitoring", icon: "📈" },
    { title: "Oral Exams & Certification", icon: "📜" },
    { title: "Flexible Scheduling", icon: "⏰" },
  ];

  const programs = content?.programs || [
    { title: "Kids Program", desc: "Interactive and engaging programs for kids, fostering growth, learning, discipline, and a passion for knowledge.", icon: "🎯" },
    { title: "Adult Program", desc: "Adult programs focused on personal growth, spiritual development, and living a purposeful, fulfilling life.", icon: "🧘" },
    { title: "Homework Support", desc: "Offering dedicated homework support to help students understand concepts and excel in their studies.", icon: "📝" },
    { title: "New Muslim Program", desc: "Providing support and essential teachings for new Muslims to strengthen their faith and community connection.", icon: "✨" },
    { title: "Islamic Consulting", desc: "Tutors combine spiritual wisdom, academic knowledge, and personal guidance for balanced development.", icon: "💡" }
  ];

  const feedback = content?.feedback || [
    { name: "Yazdan Chowdhury", from: "From UK", img: "https://picsum.photos/seed/s1/400/600" },
    { name: "Inaaya Baksh", from: "From UK", img: "https://picsum.photos/seed/s2/400/600" },
    { name: "Ayaana parent", from: "From UK", img: "https://picsum.photos/seed/s3/400/600" },
    { name: "Aaban & Aiman Rahman", from: "From USA", img: "https://picsum.photos/seed/s4/400/600" }
  ];

  return (
    <div className="flex flex-col w-full bg-[#fcfaf2]">
      {/* Header Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl font-bold text-slate-900 serif">{header.title}</h1>
        <p className="text-slate-600 leading-relaxed">
          {header.description}
        </p>
        <p className="text-slate-500 text-sm italic">
          {header.subtext}
        </p>
      </section>

      {/* Hero Image */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
          <img 
            src={header.image} 
            className="w-full h-[500px] object-cover" 
            alt="Asbar Academy Scholars" 
          />
        </div>
      </section>

      {/* Who We Are / Mission / Vision */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900 serif">{whoWeAre.title}</h2>
            <p className="text-slate-600 leading-relaxed">
              {whoWeAre.description1}
            </p>
            <p className="text-slate-600 leading-relaxed">
              {whoWeAre.description2}
            </p>
          </div>
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="bg-blue-50 p-4 rounded-2xl h-fit">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {missionVision.mission}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="bg-blue-50 p-4 rounded-2xl h-fit">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Vision</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {missionVision.vision}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s: any, i: number) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2">
              <div className="mb-2">{s.icon}</div>
              <h3 className="text-4xl font-bold text-slate-900 serif">{s.value}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Team */}
      <section className="py-24 bg-[#fcfaf2] px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 serif">{content?.teamSection?.title || "Our Core Team"}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {content?.teamSection?.description || "Our international scholars bring diverse expertise, guiding students with wisdom, faith, and cultural understanding from across the globe."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member: any, i: number) => (
              <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg group hover:shadow-2xl transition-all">
                <div className="h-80 overflow-hidden relative">
                  <img src={member.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={member.name} />
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <span>{member.flag}</span> {member.country}
                  </div>
                </div>
                <div className="p-8 text-left space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                  <p className="text-slate-500 text-sm font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 serif">Comparison Table</h2>
            <p className="text-slate-500">How Asbar Academy adds more value to your child's learning journey.</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-6 font-bold text-slate-900">Feature</th>
                  <th className="p-6 font-bold text-slate-900">Other Online Madrasas</th>
                  <th className="p-6 font-bold text-blue-600">Asbar Academy</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="p-6 text-sm font-semibold text-slate-700">{row.feature}</td>
                    <td className="p-6 text-sm text-slate-500">
                      {typeof row.other === 'boolean' ? (
                        row.other ? <Check className="text-green-500 h-5 w-5" /> : <span className="text-red-400">✕</span>
                      ) : row.other}
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5 flex-shrink-0" />
                      {row.deeni}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What Makes Us Unique */}
      <section className="py-24 bg-[#fcfaf2] px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 serif">What Makes Us Unique</h2>
            <p className="text-slate-500">We stand out by blending knowledge, guidance, and values to inspire confident, balanced, and purposeful growth.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {uniqueFeatures.map((f: any, i: number) => (
              <div key={i} className="flex flex-col items-center space-y-4 p-6 hover:scale-105 transition-transform">
                <div className="text-4xl bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-md border border-blue-100">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">{f.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Parent Feedback */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 serif">Student Parent feedback</h2>
            <p className="text-slate-500">Discover how our students and parents share their learning journey with us.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {feedback.map((f: any, i: number) => (
              <div key={i} className="space-y-4">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] shadow-xl group cursor-pointer">
                  <img src={f.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={f.name} />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white/90 p-4 rounded-full shadow-lg">
                      <Play className="fill-blue-600 text-blue-600 h-6 w-6 ml-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{f.name}</h4>
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">{f.from}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section className="py-24 bg-[#fcfaf2] px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 serif">Our Programs</h2>
            <p className="text-slate-500">We offer four core programs designed to meet diverse learner needs:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.slice(0, 3).map((p: any, i: number) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all text-center space-y-6 border border-slate-100">
                <div className="text-4xl bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
                  {p.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {programs.slice(3).map((p: any, i: number) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all text-center space-y-6 border border-slate-100">
                <div className="text-4xl bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
                  {p.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto gradient-bg rounded-[3rem] p-16 text-center text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-5xl font-bold serif">{content?.cta?.title || "Ready to Begin?"}</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              {content?.cta?.description || "Begin your child's Qur'an journey with confidence and Barakah."}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => window.open('https://wa.me/yournumber?text=I want to book a free trial', '_blank')}
                className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Book Free Trial
              </button>
              <button onClick={() => onNavigate('courses')} className="bg-blue-800/30 border border-blue-400 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-800/50 transition-all">Explore Courses</button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default About;
