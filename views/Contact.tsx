
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';

interface ContactProps {
  onNavigate: (view: string) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    country: '',
    reason: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      country: '',
      reason: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col w-full bg-[#fcfaf2]">
      {/* Header Section */}
      <section className="py-16 px-6 text-center max-w-4xl mx-auto space-y-4">
        <p className="text-blue-600 font-bold serif italic">Have Question?</p>
        <h1 className="text-5xl font-bold text-slate-900 serif">Contact Us!</h1>
      </section>

      {/* Form Section */}
      <section className="px-6 max-w-3xl mx-auto mb-20 w-full">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Your email address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Include country code, e.g., +1 234 567 890"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Your country"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Reason for Contact</label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all bg-white appearance-none"
              >
                <option value="">Select a reason</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Course Information">Course Information</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing">Billing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all resize-none"
                placeholder="Write your question here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full gradient-bg text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Submit</span>
            </button>

            <p className="text-center text-slate-400 text-[10px] leading-relaxed">
              This site is protected by reCAPTCHA and the Google <button type="button" className="underline">Privacy Policy</button> and <button type="button" className="underline">Terms of Service</button> apply.
            </p>
          </form>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-4 rounded-2xl text-white">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Email Us</h4>
              <p className="text-sm text-slate-500">support@deenimadrasa.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-4 rounded-2xl text-white">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Address</h4>
              <p className="text-sm text-slate-500">Dhanmondi Dhaka, Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-4 rounded-2xl text-white">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Call Us</h4>
              <p className="text-sm text-slate-500">+880 130665 3785</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-4 rounded-2xl text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Support</h4>
              <p className="text-sm text-slate-500">We are available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[500px] relative">
        <img 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1600" 
          className="w-full h-full object-cover grayscale opacity-50" 
          alt="Location Map" 
        />
        <div className="absolute inset-0 bg-blue-900/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white p-4 rounded-full shadow-2xl animate-bounce">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
