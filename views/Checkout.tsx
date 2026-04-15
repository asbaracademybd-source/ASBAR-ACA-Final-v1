
import React, { useState } from 'react';
import { Course, User, UserRole } from '../types';
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle2, Smartphone, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CheckoutProps {
  course: Course;
  currentUser: User | null;
  onComplete: (courseId: string, skipPayment?: boolean) => void;
  onNavigate: (view: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ course, currentUser, onComplete, onNavigate }) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'bkash'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const isTeacherOrAdmin = currentUser?.role === UserRole.TEACHER || currentUser?.role === UserRole.ADMIN;
  const USD_TO_BDT = 120; // Example conversion rate
  const bdtAmount = course.price * USD_TO_BDT;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast.success(`Payment successful via ${paymentMethod === 'stripe' ? 'Stripe' : 'bKash'}!`);
    onComplete(course.id, true);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <button 
        onClick={() => onNavigate(`course/${course.slug || course.id}`)}
        className="flex items-center text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Course
      </button>

      <div className="grid md:grid-cols-5 gap-12">
        <div className="md:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('stripe')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className={`p-3 rounded-xl ${paymentMethod === 'stripe' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className={`font-bold ${paymentMethod === 'stripe' ? 'text-blue-600' : 'text-slate-500'}`}>Stripe</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('bkash')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'bkash' ? 'border-pink-600 bg-pink-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className={`p-3 rounded-xl ${paymentMethod === 'bkash' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Smartphone className="h-6 w-6" />
                </div>
                <span className={`font-bold ${paymentMethod === 'bkash' ? 'text-pink-600' : 'text-slate-500'}`}>bKash</span>
              </button>
            </div>

            {paymentMethod === 'stripe' ? (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Card Information</label>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm italic">
                    Stripe Card Element Placeholder
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">CVC</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div className="p-6 rounded-2xl bg-pink-50 border border-pink-100 space-y-4">
                  <div className="flex items-center gap-3 text-pink-600">
                    <Smartphone className="h-5 w-5" />
                    <span className="font-bold">Pay with bKash</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    You will be redirected to bKash payment gateway to complete your transaction securely.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">bKash Number</label>
                    <input type="text" placeholder="01XXXXXXXXX" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            <button 
              disabled={isProcessing || isTeacherOrAdmin}
              onClick={handlePayment}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                isTeacherOrAdmin 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : paymentMethod === 'stripe' ? 'gradient-bg text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : isTeacherOrAdmin ? (
                <>
                  <Lock className="h-6 w-6" />
                  Payment Restricted
                </>
              ) : (
                <>
                  < ShieldCheck className="h-6 w-6" />
                  Pay {paymentMethod === 'bkash' ? `৳${bdtAmount}` : `$${course.price}`} Now
                </>
              )}
            </button>
            
            <p className="text-center text-slate-400 text-xs font-medium">
              Secure encrypted transaction. Your data is safe with us.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>
            
            <div className="flex gap-4">
              <img src={course.thumbnail} className="w-20 h-20 rounded-xl object-cover shadow-sm" alt={course.title} />
              <div className="flex-grow">
                <h4 className="font-bold text-slate-900 line-clamp-2 text-sm">{course.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{course.duration}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Course Price</span>
                <span>${course.price}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span className="text-green-600">-$0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 pt-2">
                <span>Total</span>
                <div className="text-right">
                  <div>{paymentMethod === 'bkash' ? `৳${bdtAmount}` : `$${course.price}`}</div>
                  {paymentMethod === 'bkash' && (
                    <div className="text-[10px] text-slate-400 font-medium">Converted from ${course.price} (1$ = ৳{USD_TO_BDT})</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Lifetime access to course content</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Certificate of completion</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Direct support from instructor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
