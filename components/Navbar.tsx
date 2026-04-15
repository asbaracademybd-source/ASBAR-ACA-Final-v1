
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, BookOpen, User as UserIcon, Menu, X, Bell } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  siteSettings?: any;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, siteSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const logo = siteSettings?.logo || "AA";
  const name = siteSettings?.name || "Asbar Academy";
  const subline = siteSettings?.subline || "Online Islamic Academy";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
        >
          <a href="/" className="flex items-center space-x-3" onClick={(e) => e.preventDefault()}>
            <div className="gradient-bg p-2 rounded-lg">
               <span className="text-white font-serif font-bold text-xl">{logo}</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block leading-none">{name}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{subline}</span>
            </div>
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="text-slate-600 hover:text-blue-600 font-bold">Home</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="text-slate-600 hover:text-blue-600 font-bold">About</a>
          <a href="/courses" onClick={(e) => { e.preventDefault(); onNavigate('courses'); }} className="text-slate-600 hover:text-blue-600 font-bold">Courses</a>
          <a href="/pricing" onClick={(e) => { e.preventDefault(); onNavigate('pricing'); }} className="text-slate-600 hover:text-blue-600 font-bold">Pricing</a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="text-slate-600 hover:text-blue-600 font-bold">Contact</a>
          
          {user ? (
            <div className="flex items-center space-x-4 border-l pl-8">
              <button 
                onClick={() => {
                  if (user.role === UserRole.STUDENT) onNavigate('student-dashboard');
                  else if (user.role === UserRole.TEACHER) onNavigate('teacher-dashboard');
                  else onNavigate('admin-dashboard');
                }}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-all"
              >
                <img src={user.avatar} className="h-6 w-6 rounded-full border border-blue-200" alt="Avatar" />
                <span className="text-sm font-semibold text-slate-700">{(user.name || '').split(' ')[0]}</span>
              </button>
              <button onClick={onLogout} className="text-red-500 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button onClick={() => onNavigate('login')} className="text-slate-600 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">Login</button>
              <button 
                onClick={() => onNavigate('register')}
                className="gradient-bg text-white px-6 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-blue-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-xl p-6 flex flex-col space-y-4">
            <a href="/" className="text-left font-bold" onClick={(e) => { e.preventDefault(); onNavigate('home'); setIsMenuOpen(false); }}>Home</a>
            <a href="/about" className="text-left font-bold" onClick={(e) => { e.preventDefault(); onNavigate('about'); setIsMenuOpen(false); }}>About</a>
            <a href="/courses" className="text-left font-bold" onClick={(e) => { e.preventDefault(); onNavigate('courses'); setIsMenuOpen(false); }}>Courses</a>
            {user ? (
               <a href="/student-dashboard" className="text-left font-bold" onClick={(e) => { e.preventDefault(); onNavigate('student-dashboard'); setIsMenuOpen(false); }}>Dashboard</a>
            ) : (
               <a href="/login" className="text-left font-bold" onClick={(e) => { e.preventDefault(); onNavigate('login'); setIsMenuOpen(false); }}>Login</a>
            )}
          </div>
        )}
    </nav>
  );
};

export default Navbar;
