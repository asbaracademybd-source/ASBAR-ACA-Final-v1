
import React, { useState } from 'react';
import { ArrowRight, Star, CheckCircle, Award, Users, BookOpen, Play, MapPin, Search, Globe, ChevronDown, Check, Sparkles, Shield, Zap, Clock } from 'lucide-react';
import { Course } from '../types';
import { motion } from 'framer-motion';

interface HomeProps {
  onNavigate: (view: string) => void;
  featuredCourses: Course[];
  content?: any;
}

const Home: React.FC<HomeProps> = ({ onNavigate, featuredCourses, content }) => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState('Top Courses');

  // Use dynamic content if available, otherwise use defaults
  const hero = content?.hero || {
    title: "Asbar Academy",
    subtitle: "An Online Islamic Academy",
    description: "A globally trusted online platform — delivering authentic Quran and Islamic education to kids, adults, and new Muslims through a structured, international-standard curriculum since 2020.",
    image1: "https://images.unsplash.com/photo-1594474038202-602923985794?auto=format&fit=crop&q=80&w=400",
    image2: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=400",
    image3: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
    image4: "https://images.unsplash.com/photo-1621112904887-419379ce6824?auto=format&fit=crop&q=80&w=400",
  };

  const stats = content?.stats || [
    { label: "Satisfaction", value: "99%", icon: <Star className="h-5 w-5 text-yellow-500" /> },
    { label: "Sessions", value: "100k+", icon: <Zap className="h-5 w-5 text-blue-500" /> },
    { label: "Countries", value: "25+", icon: <Globe className="h-5 w-5 text-green-500" /> },
    { label: "Students", value: "15k+", icon: <Users className="h-5 w-5 text-purple-500" /> },
  ];

  const features = content?.features || [
    { title: "Structured Curriculum", desc: "Core programs for Kids, Adults, and New Muslims.", icon: <BookOpen className="h-6 w-6" />, color: "bg-blue-50 text-blue-600" },
    { title: "Qualified Tutors", desc: "Male & Female Huffaz and Ulama chosen for their expertise.", icon: <Award className="h-6 w-6" />, color: "bg-emerald-50 text-emerald-600" },
    { title: "Virtual Classroom", desc: "Custom-built environment designed for Quran learning.", icon: <Play className="h-6 w-6" />, color: "bg-orange-50 text-orange-600" },

    // CHANGE_01 
    // { title: "Gamified Learning", desc: "Earn points and level up to make learning exciting.", icon: <Sparkles className="h-6 w-6" />, color: "bg-purple-50 text-purple-600" },
    // { title: "Progress Monitoring", desc: "Detailed LMS reports covering lessons and assignments.", icon: <Clock className="h-6 w-6" />, color: "bg-indigo-50 text-indigo-600" },
    // { title: "Proven Hifz Method", desc: "International methods inspired by Saudi Tahfizul Quran.", icon: <Shield className="h-6 w-6" />, color: "bg-rose-50 text-rose-600" },
  ];

  const tutors = content?.tutors || [
    { name: "Hasibur Rahman", title: "Hafiz, Maulana, Mufti", avatar: "https://picsum.photos/seed/t1/200/200" },
    { name: "Mohammad Al-Arabi", title: "Hafiz, Maulana, Mufti", avatar: "https://picsum.photos/seed/t2/200/200" },
    { name: "Osman Goni", title: "Hafiz, Maulana", avatar: "https://picsum.photos/seed/t3/200/200" },
  ];

  const filteredCourses = activeTab === 'Top Courses' 
    ? featuredCourses.slice(0, 6) 
    : featuredCourses.filter(c => c.category.toLowerCase().includes(activeTab.replace(' Program', '').toLowerCase()));

  return (
    <div className="flex flex-col w-full bg-[#fcfaf2]">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center py-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-600 font-bold tracking-widest uppercase text-xs">
                <span className="h-px w-8 bg-blue-600"></span>
                <span>Established 2020</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold text-slate-900 serif leading-[0.9] tracking-tight">
                {hero.title}
              </h1>
              <p className="text-2xl font-medium text-slate-500 serif italic">{hero.subtitle}</p>
            </div>
            
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-light">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => onNavigate('courses')}
                className="gradient-bg text-white px-10 py-5 rounded-2xl font-bold shadow-2xl flex items-center gap-3 hover:scale-105 transition-all group"
              >
                Explore Courses
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => window.open('https://wa.me/yournumber?text=I want to book a free trial', '_blank')}
                className="bg-white border border-slate-200 px-10 py-5 rounded-2xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                Book Free Trial
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
               {stats.slice(0, 2).map((s: any, i: number) => (
                 <div key={i} className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900 serif">{s.value}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</span>
                 </div>
               ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-6">
                  <img src={hero.image1} className="w-full h-80 object-cover rounded-[3rem] shadow-2xl border-8 border-white" alt="Collage 1" />
                  <img src={hero.image2} className="w-full h-64 object-cover rounded-[3rem] shadow-2xl border-8 border-white" alt="Collage 2" />
               </div>
               <div className="space-y-6 pt-16">
                  <img src={hero.image3} className="w-full h-64 object-cover rounded-[3rem] shadow-2xl border-8 border-white" alt="Collage 3" />
                  <img src={hero.image4} className="w-full h-80 object-cover rounded-[3rem] shadow-2xl border-8 border-white" alt="Collage 4" />
               </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 hidden md:block">
               <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-2xl">
                     <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certified by</p>
                     <p className="text-lg font-bold text-slate-900 serif">Islamic Board</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features - Bento Grid Style */}
      <section id="features" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-slate-900 serif leading-tight">
              {content?.whyChoose?.title || "Why Choose Asbar Academy?"}
            </h2>
            <p className="text-slate-500">We combine traditional Islamic values with modern educational technology to provide the best learning experience.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f: any, i: number) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="p-10 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 space-y-6 hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${f.color} transition-transform group-hover:scale-110`}>
                  {f.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative group max-w-5xl mx-auto rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white">
             <img src={content?.whyChoose?.videoThumbnail || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"} className="w-full h-[500px] object-cover" alt="Video cover" />
             <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group-hover:bg-slate-900/20 transition-all">
                <div className="bg-white p-8 rounded-full shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                   <Play className="fill-blue-600 text-blue-600 h-10 w-10 ml-1" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Course Listing - Clean & Modern */}
      <section className="py-32 bg-[#fcfaf2] px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <h2 className="text-5xl font-bold text-slate-900 serif">Our Courses</h2>
               <p className="text-slate-500 max-w-md">Explore our thoughtfully designed courses, inspiring Islamic learning for all ages and levels.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Top Courses', 'Kids Program', 'Adult Program', 'New Muslim Program'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab ? 'gradient-bg text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {filteredCourses.map(course => (
              <motion.div 
                layout
                key={course.id} 
                className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-2xl hover:border-blue-100 transition-all flex flex-col"
              >
                 <div className="h-64 overflow-hidden relative">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={course.title} />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
                       <span className="text-sm font-bold text-blue-600">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                    </div>
                 </div>
                 <div className="p-10 space-y-6 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight serif">{course.title}</h3>
                    
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                       <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.enrolledCount || 0} Enrolled</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>4.9</span>
                       </div>
                    </div>

                    <div className="space-y-3 pt-4 mt-auto">
                      <button 
                        onClick={() => onNavigate(`course/${course.slug || course.id}`)}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all text-sm shadow-lg"
                      >
                        View Details
                      </button>
                      
                      <button 
                        onClick={() => window.open(`https://wa.me/yournumber?text=I'm interested in the course: ${course.title}`, '_blank')}
                        className="w-full border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2"
                      >
                        WhatsApp Register
                      </button>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center gap-2 text-slate-900 font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition-colors"
            >
              Explore All Courses <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats - Minimal & Integrated */}
      <section className="py-24 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s: any, i: number) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50">
                {s.icon}
              </div>
              <h3 className="text-5xl font-bold text-slate-900 serif">{s.value}</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tutors Section - Warm Organic */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-slate-900 serif">Meet Our Tutors</h2>
            <p className="text-slate-500">Our educators are chosen for their deep knowledge, teaching ability, and commitment to student growth.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {tutors.map((t: any, i: number) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className="group flex flex-col items-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-full scale-110 -rotate-6 group-hover:rotate-0 transition-transform"></div>
                  <img src={t.avatar} className="relative w-48 h-48 rounded-full object-cover border-8 border-white shadow-2xl" alt={t.name} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-2xl font-bold text-slate-900 serif">{t.name}</h3>
                   <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">{t.title}</p>
                </div>
                <div className="w-full max-w-[200px] bg-slate-50 rounded-full h-12 flex items-center px-4 space-x-3 border border-slate-100">
                   <Play className="h-4 w-4 text-blue-600 fill-blue-600" />
                   <div className="flex-grow bg-slate-200 h-1 rounded-full relative">
                      <div className="absolute left-0 top-0 h-full bg-blue-600 w-[30%] rounded-full"></div>
                   </div>
                   <span className="text-[10px] text-slate-400 font-bold italic">Intro</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Clean Accordion */}
      <section className="py-32 bg-[#fcfaf2] px-6">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-5xl font-bold text-slate-900 serif">Common Questions</h2>
             <p className="text-slate-500">Everything you need to know about our academy and learning process.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "What is Asbar Academy?", a: "Asbar Academy is a global online Islamic academy providing structured Quran and Islamic studies for all ages." },
              { q: "Who can join your programs?", a: "Our programs are open to children, adults, and new Muslims from all backgrounds." },
              { q: "What makes Asbar Academy unique?", a: "Our custom virtual classroom and gamified learning ensure maximum student engagement." },
              { q: "Do you teach only Quran?", a: "No, we cover foundational Islamic studies, Tajweed, Hifz, and modern Islamic consulting." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all">
                <button 
                  onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                  className="w-full p-8 text-left flex justify-between items-center group"
                >
                  <span className={`text-lg font-bold transition-colors ${activeFAQ === i ? 'text-blue-600' : 'text-slate-800'}`}>{faq.q}</span>
                  <div className={`p-2 rounded-full transition-all ${activeFAQ === i ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>
                {activeFAQ === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-8 pb-8 text-slate-500 leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners/Trust Section - Minimal */}
      <section className="py-32 bg-white px-6 text-center space-y-20">
         <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 serif">A Global Community</h2>
            <p className="text-slate-500">Trusted by students in over 25 countries worldwide.</p>
         </div>

         <div className="max-w-5xl mx-auto relative">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" className="w-full opacity-10 grayscale" alt="World Map" />
            <MapPin className="absolute top-[30%] left-[20%] text-blue-600 h-8 w-8 animate-pulse" />
            <MapPin className="absolute top-[35%] left-[45%] text-blue-600 h-8 w-8 animate-pulse" />
            <MapPin className="absolute top-[60%] left-[80%] text-blue-600 h-8 w-8 animate-pulse" />
         </div>

{/* CHANGE - 02  */}
         {/* <div className="pt-12 space-y-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Our Global Partners</p>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 hover:opacity-100 transition-all duration-700">
               <span className="text-2xl font-bold text-slate-900 serif">BANZI (NZ)</span>
               <span className="text-2xl font-bold text-slate-900 serif">One Soul (AUS)</span>
               <span className="text-2xl font-bold text-slate-900 serif">RAZ Foundation (USA)</span>
            </div>
         </div> */}
      </section>
    </div>
  );
};

export default Home;
