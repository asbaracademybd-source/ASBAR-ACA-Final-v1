
import React, { useState, useMemo } from 'react';
import { Course, CourseType } from '../types';
import { Search, Filter, Star, Clock, Users, ArrowRight } from 'lucide-react';

interface BrowseCoursesProps {
  courses: Course[];
  onNavigate: (view: string) => void;
}

const BrowseCourses: React.FC<BrowseCoursesProps> = ({ courses, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'price-low' | 'price-high'>('newest');

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = useMemo(() => {
    let result = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesType = selectedType === 'All' || 
                         (selectedType === 'Free' && course.price === 0) || 
                         (selectedType === 'Paid' && course.price > 0);
      return matchesSearch && matchesCategory && matchesType;
    });

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // Default sorting
    });

    return result;
  }, [courses, searchQuery, selectedCategory, selectedType, sortBy]);

  return (
    <div className="flex-grow bg-slate-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-slate-900">Explore Our <span className="gradient-text">Courses</span></h1>
          <p className="text-slate-500 max-w-xl mx-auto">Discover expert-led courses designed to help you master new skills and advance your career.</p>
          
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for anything (React, UI Design, Marketing...)" 
              className="w-full pl-16 pr-6 py-5 rounded-[2rem] border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none bg-slate-50 transition-all text-lg shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center">
              <Filter className="h-4 w-4 mr-2" /> Categories
            </h3>
            <div className="flex flex-col space-y-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Course Type</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Free', 'Paid'].map(type => (
                <button 
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all ${selectedType === type ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Sort By</h3>
            <select 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Course Grid */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-500 font-medium">Showing <span className="text-slate-900 font-bold">{filteredCourses.length}</span> results</p>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div 
                  key={course.id} 
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full cursor-pointer" 
                  onClick={() => onNavigate(`course/${course.slug || course.id}`)}
                >
                  <div className="relative h-48">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 shadow-sm uppercase tracking-widest">
                      {course.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center space-x-2 text-yellow-500 mb-2">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold text-slate-700">{course.rating}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                      {course.description}
                    </p>
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <div className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {course.duration}</div>
                        <div className="flex items-center"><Users className="h-3 w-3 mr-1" /> {course.enrolledCount}</div>
                      </div>
                      <div className="pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img src={`https://picsum.photos/seed/${course.teacherId}/50/50`} className="h-6 w-6 rounded-full" alt={course.teacherName} />
                          <span className="text-xs font-semibold text-slate-600">{(course.teacherName || '').split(' ')[0]}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-slate-900">
                            {course.price === 0 ? 'Free' : `$${course.price}`}
                          </span>
                          {course.price > 0 && <span className="text-[10px] text-slate-400 font-medium">Negotiable</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedType('All'); }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCourses;
