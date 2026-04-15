
import React from 'react';
import { Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  siteSettings?: any;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, siteSettings }) => {
  const logo = siteSettings?.logo || "AA";
  const name = siteSettings?.name || "Asbar Academy";

  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="gradient-bg p-2 rounded-lg">
              <span className="text-white font-serif font-bold text-xl">{logo}</span>
            </div>
            <span className="text-2xl font-bold serif">{name}</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Empowering the next generation with authentic Quranic knowledge through modern technology.
          </p>
          <div className="flex space-x-4">
             <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
               <Facebook className="h-5 w-5" />
             </div>
             <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
               <Twitter className="h-5 w-5" />
             </div>
             <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
               <Instagram className="h-5 w-5" />
             </div>
             <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
               <Youtube className="h-5 w-5" />
             </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-8 serif">Pages</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-blue-400 transition-colors">Home</a></li>
            <li><a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="/courses" onClick={(e) => { e.preventDefault(); onNavigate('courses'); }} className="hover:text-blue-400 transition-colors">Courses</a></li>
            <li><a href="/pricing" onClick={(e) => { e.preventDefault(); onNavigate('pricing'); }} className="hover:text-blue-400 transition-colors">Pricing</a></li>
            <li><a href="/verify-certificate/" onClick={(e) => { e.preventDefault(); onNavigate('verify-certificate/'); }} className="hover:text-blue-400 transition-colors">Verify Certificate</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-8 serif">Opportunities</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><a href="/become-tutor" onClick={(e) => { e.preventDefault(); onNavigate('become-tutor'); }} className="hover:text-blue-400 transition-colors font-semibold text-blue-400">Become a Tutor</a></li>
            <li><button className="hover:text-blue-400 transition-colors">Volunteer</button></li>
            <li><button className="hover:text-blue-400 transition-colors">Careers</button></li>
            <li><a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-blue-400 transition-colors">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-8 serif">Contact Details</h4>
          <ul className="space-y-6 text-slate-400 text-sm">
            <li className="flex items-center space-x-3">
               <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-blue-400">
                 <Phone className="h-4 w-4" />
               </span>
               <span>+8801506655785</span>
            </li>
            <li className="flex items-center space-x-3">
               <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-blue-400">
                 <Mail className="h-4 w-4" />
               </span>
               <span>support@deenimadrasa.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-widest gap-4">
        <p>© {new Date().getFullYear()} Asbar Academy. All rights reserved.</p>
        <div className="flex space-x-8">
          <button className="hover:text-white transition-colors">Privacy Policy</button>
          <button className="hover:text-white transition-colors">Terms & Conditions</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
