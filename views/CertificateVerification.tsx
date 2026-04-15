
import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { ShieldCheck, Award, Calendar, User, BookOpen, Search, AlertCircle, ArrowLeft } from 'lucide-react';

interface CertificateVerificationProps {
  certificateId?: string;
  onNavigate: (view: string) => void;
}

const CertificateVerification: React.FC<CertificateVerificationProps> = ({ certificateId, onNavigate }) => {
  const [searchId, setSearchId] = useState(certificateId || '');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCertificate = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/certificates/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCertificate({ ...data, id: data._id });
      } else {
        setCertificate(null);
        setError("Invalid Certificate ID. Please check and try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying the certificate.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      verifyCertificate(certificateId);
    }
  }, [certificateId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCertificate(searchId);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <ShieldCheck className="text-white h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">Certificate Verification</h1>
          <p className="text-slate-500 max-w-md mx-auto">Verify the authenticity of certificates issued by Asbar Academy Academy.</p>
        </div>

        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Certificate ID or Student ID"
            className="w-full pl-14 pr-32 py-5 rounded-3xl border-2 border-white bg-white shadow-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all text-lg"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center space-x-4 animate-in fade-in slide-in-from-top-4">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="text-red-600 h-6 w-6" />
            </div>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {certificate && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-blue-600 p-8 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Verified Certificate</p>
                  <h2 className="text-2xl font-bold">Authentic Achievement</h2>
                </div>
              </div>
              <div className="hidden md:block bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-xs font-mono">
                ID: {certificate.id}
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <User className="h-3 w-3 mr-1" /> Recipient Name
                  </p>
                  <p className="text-xl font-bold text-slate-900">{certificate.studentName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" /> Course Completed
                  </p>
                  <p className="text-xl font-bold text-slate-900">{certificate.courseTitle}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> Issue Date
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Issued By
                  </p>
                  <p className="text-xl font-bold text-slate-900">Asbar Academy Academy</p>
                </div>
              </div>

              <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-3 text-green-600 bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
                  <ShieldCheck className="h-6 w-6" />
                  <span className="font-bold">This certificate is valid and authentic.</span>
                </div>
                <button 
                  onClick={() => onNavigate('home')}
                  className="text-slate-500 hover:text-blue-600 font-bold flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification;
