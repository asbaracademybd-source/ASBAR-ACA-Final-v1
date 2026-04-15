
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Shield, BookOpen, Briefcase, Chrome, Phone, Globe, Clock, CheckCircle, Upload, Camera } from 'lucide-react';
import { auth, googleProvider } from '../src/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { UserRole } from '../types';

interface LoginProps {
  mode: string;
  onNavigate: (view: string) => void;
  initialRole?: UserRole;
}

const Login: React.FC<LoginProps> = ({ mode, onNavigate, initialRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Registration specific state
  const [regStep, setRegStep] = useState(mode === 'register' && initialRole ? 1 : 0); // 0: Basic, 1: Role, 2: Details
  const [role, setRole] = useState<UserRole>(initialRole || UserRole.STUDENT);
  
  // Detailed fields
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [passportPhoto, setPassportPhoto] = useState('');
  const [suitableDays, setSuitableDays] = useState<string[]>([]);
  const [suitableTime, setSuitableTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  
  // Student specific
  const [learningInterests, setLearningInterests] = useState('');
  const [lessonPreference, setLessonPreference] = useState<'INDIVIDUAL' | 'BATCH'>('INDIVIDUAL');
  const [budgetPerHour, setBudgetPerHour] = useState('');
  
  // Tutor specific
  const [cvUrl, setCvUrl] = useState('');
  const [languagesSpoken, setLanguagesSpoken] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [canOperateTools, setCanOperateTools] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const toggleDay = (day: string) => {
    setSuitableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register' && regStep < 2) {
      setRegStep(regStep + 1);
      return;
    }

    if (mode === 'register' && role === UserRole.TEACHER && !agreedToTerms) {
      return toast.error('Please agree to the terms and conditions');
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Prepare extra data
        const extraData: any = {
          firebaseUid: userCredential.user.uid,
          email,
          name,
          role,
          phone,
          whatsapp,
          passportPhoto,
          suitableDays,
          suitableTime,
          timezone,
          preferredLanguage
        };

        if (role === UserRole.STUDENT) {
          extraData.learningInterests = learningInterests;
          extraData.lessonPreference = lessonPreference;
          extraData.budgetPerHour = Number(budgetPerHour);
        } else {
          extraData.cvUrl = cvUrl;
          extraData.languagesSpoken = languagesSpoken.split(',').map(s => s.trim());
          extraData.expectedSalary = Number(expectedSalary);
          extraData.canOperateTools = canOperateTools;
        }
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(extraData)
        });

        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully!');
      }
      onNavigate('home');
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // For Google login, we might need to prompt for role if it's a new user
      // But for now, let's just sync with default role
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          avatar: result.user.photoURL,
          role: UserRole.STUDENT // Default
        })
      });
      toast.success('Logged in with Google!');
      onNavigate('home');
    } catch (err: any) {
      toast.error(err.message || 'Google login failed');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.error('Please enter your email first');
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-[#fcfaf2]">
      <div className={`w-full glass p-10 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500 ${mode === 'register' && regStep === 2 ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="text-center">
          <span className="text-2xl serif text-slate-700 block mb-2">﷽</span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 serif">
            {mode === 'login' ? 'Welcome Back' : (regStep === 0 ? 'Create Account' : (regStep === 1 ? 'Choose Your Role' : 'Complete Your Profile'))}
          </h2>
          <p className="text-slate-500 text-sm">
            {mode === 'login' ? 'Sign in to Asbar Academy' : 'Start your Islamic learning journey'}
          </p>
        </div>

        {mode === 'login' && (
          <>
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              <Chrome className="h-5 w-5 text-blue-500" />
              Continue with Google
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400"><span className="bg-[#fcfaf2] px-4">Or with email</span></div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && regStep === 0 && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Name as in Passport or NID</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {mode === 'register' && regStep === 1 && (
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => setRole(UserRole.STUDENT)}
                className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-6 text-left ${role === UserRole.STUDENT ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${role === UserRole.STUDENT ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <div className="font-bold text-xl text-slate-900">I am a Student</div>
                  <p className="text-sm text-slate-500">I want to learn Quran, Tajweed, and Islamic studies from qualified tutors.</p>
                </div>
                {role === UserRole.STUDENT && <CheckCircle className="h-6 w-6 text-blue-600 ml-auto" />}
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.TEACHER)}
                className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-6 text-left ${role === UserRole.TEACHER ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${role === UserRole.TEACHER ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Briefcase className="h-8 w-8" />
                </div>
                <div>
                  <div className="font-bold text-xl text-slate-900">I am a Tutor</div>
                  <p className="text-sm text-slate-500">I want to teach and share my knowledge with students around the world.</p>
                </div>
                {role === UserRole.TEACHER && <CheckCircle className="h-6 w-6 text-blue-600 ml-auto" />}
              </button>
            </div>
          )}

          {mode === 'register' && regStep === 2 && (
            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Identity Verification
                </h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Name as in Passport or NID</label>
                  <input 
                    type="text" 
                    value={name}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Photo of Passport or NID (URL)</label>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input 
                      type="text" 
                      value={passportPhoto}
                      onChange={(e) => setPassportPhoto(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      placeholder="Paste image link here"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Please upload your document to a service like Imgur and paste the link here.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      placeholder="+1 234 567 890"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input 
                      type="text" 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      placeholder="+1 234 567 890"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {role === UserRole.STUDENT ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">What do you want to learn?</label>
                    <textarea 
                      value={learningInterests}
                      onChange={(e) => setLearningInterests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white"
                      rows={3}
                      placeholder="e.g. I want to learn Quran Tajweed and basic Arabic conversation..."
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Lesson Preference</label>
                      <select 
                        value={lessonPreference}
                        onChange={(e) => setLessonPreference(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="INDIVIDUAL">One to One (Individual)</option>
                        <option value="BATCH">In Batches</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Budget per hour (USD)</label>
                      <input 
                        type="number" 
                        value={budgetPerHour}
                        onChange={(e) => setBudgetPerHour(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        placeholder="e.g. 10"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Upload CV (URL)</label>
                    <div className="relative">
                      <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <input 
                        type="text" 
                        value={cvUrl}
                        onChange={(e) => setCvUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        placeholder="Link to your CV (Google Drive/Dropbox)"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Languages you can speak</label>
                    <input 
                      type="text" 
                      value={languagesSpoken}
                      onChange={(e) => setLanguagesSpoken(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      placeholder="Arabic, English, Urdu..."
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Expected Salary per hour (USD)</label>
                      <input 
                        type="number" 
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        placeholder="e.g. 15"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input 
                        type="checkbox" 
                        id="tools"
                        checked={canOperateTools}
                        onChange={(e) => setCanOperateTools(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="tools" className="text-sm font-bold text-slate-700">Can operate Zoom/Meet</label>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase block">Suitable days in week</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${suitableDays.includes(day) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Suitable Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input 
                      type="text" 
                      value={suitableTime}
                      onChange={(e) => setSuitableTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      placeholder="e.g. 10:00 AM - 02:00 PM"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Timezone</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input 
                      type="text" 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      placeholder="e.g. GMT+6"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Preferred Language for Communication</label>
                <input 
                  type="text" 
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  placeholder="e.g. English"
                  required
                />
              </div>

              {role === UserRole.TEACHER && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Please read the terms and conditions from this link: <a href="https://www.teachaway.com/tutor-terms" target="_blank" className="text-blue-600 underline">Tutor Terms</a>
                  </p>
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-xs font-bold text-slate-700">
                      I have carefully read all the terms and conditions from the link has been given above and totally agree with that
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'login' && (
            <>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
              <div className="text-right">
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          <div className="flex gap-4">
            {mode === 'register' && regStep > 0 && (
              <button 
                type="button"
                onClick={() => setRegStep(regStep - 1)}
                className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Back
              </button>
            )}
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] gradient-bg text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-95 transition-all flex items-center justify-center group disabled:opacity-50"
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : (regStep < 2 ? 'Continue' : 'Register Now'))}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <p className="text-center text-slate-500 text-sm">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => {
              onNavigate(mode === 'login' ? 'register' : 'login');
              setRegStep(0);
            }}
            className="text-blue-600 font-bold hover:underline"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
