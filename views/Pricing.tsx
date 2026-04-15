
import React, { useState } from 'react';
import { Check, ChevronDown, Play } from 'lucide-react';

interface PricingProps {
  onNavigate: (view: string) => void;
  content?: any;
}

const Pricing: React.FC<PricingProps> = ({ onNavigate, content }) => {
  const [currency, setCurrency] = useState<'USD' | 'BDT'>('USD');
  const [duration, setDuration] = useState<'40' | '60' | 'Group'>('40');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState('Pricing & Payment');

  const header = content?.header || {
    title: "Our Flexible Course Pricing",
    subtitle: "Our Session Pricing",
    description: "Which currency would you like to see the pricing in?"
  };

  const PRICING_DATA = content?.pricingData || {
    USD: {
      '40': [35, 48, 62, 75, 88],
      '60': [46, 64, 82, 100, 118],
      'Group': [20, 28, 36, 44, 52]
    },
    BDT: {
      '40': [3500, 4800, 6200, 7500, 8800],
      '60': [4800, 6800, 8800, 10800, 12800],
      'Group': [2200, 3000, 3800, 4600, 5400]
    }
  };

  const getPlans = () => {
    const symbol = currency === 'USD' ? '$' : '৳';
    const prices = PRICING_DATA[currency][duration];
    const durLabel = duration === 'Group' ? 'Group Session' : `${duration} Minutes`;

    return [
      {
        name: "Free Trial",
        price: "0",
        period: "One-time",
        features: [`${symbol}0 / per class`, durLabel, "1 Free Class"],
        buttonText: "Book Free Trial",
        color: "bg-emerald-500",
        tag: null
      },
      ...prices.map((price: number, i: number) => {
        const days = i + 2;
        const classesPerMonth = days * 4;
        const perClass = (price / classesPerMonth).toFixed(2);
        return {
          name: `${days} Days per week`,
          price: price.toString(),
          period: "Monthly",
          features: [`${symbol}${perClass} / per class`, durLabel, `${classesPerMonth} Classes/Month`],
          buttonText: "Sign Up",
          color: "bg-blue-600",
          tag: String.fromCharCode(65 + i)
        };
      })
    ];
  };

  const FAQS = content?.faqs || {
    'General': [
      { q: "What is Deeni Madrasa?", a: "Deeni Madrasa is a global online Islamic academy providing structured Quran and Islamic studies for all ages." },
      { q: "Who can join your programs?", a: "Our programs are open to children, adults, and new Muslims from all backgrounds." }
    ],
    'Courses': [
      { q: "What courses do you offer?", a: "We offer Quran Nazira, Hifz, Tajweed, Islamic Studies, and Arabic language courses." },
      { q: "Are the courses certified?", a: "Yes, we provide certificates upon successful completion of our core programs." }
    ],
    'Tutors': [
      { q: "Who are the tutors?", a: "Our tutors are qualified scholars, Huffaz, and trained educators from around the world." },
      { q: "Can I choose my tutor?", a: "We match you with the best tutor based on your level and schedule, but you can request a change if needed." }
    ],
    'Learning & Progress': [
      { q: "How do you track progress?", a: "We use a custom LMS to track attendance, lesson completion, and assignment scores." },
      { q: "What is the virtual classroom like?", a: "It's a custom-built, interactive environment designed specifically for effective Quran learning." }
    ],
    'Pricing & Payment': [
      { q: "How are the fees structured at Deeni Madrasa?", a: "We don't charge per class. The cost depends on the class length and how many times per week you choose. Payments can be made monthly or quarterly." },
      { q: "Do you offer discounts for siblings?", a: "Yes, we offer a sibling discount where we combine the total classes per week for a lower per-class rate." },
      { q: "What is the Refer-a-Friend program?", a: "Our referral program gives your friend a 50% discount on their first month, and you gain spiritual rewards." },
      { q: "How do quarterly payments work?", a: "Quarterly payments allow you to pay for three months at once, saving you around 5-6%." },
      { q: "Do you offer group class payments?", a: "Yes, small groups of 2-3 can share the cost of a 1-to-1 session price." },
      { q: "How do I make a payment for classes?", a: "Payments can be made securely through our online portal using various international payment methods." }
    ]
  };

  const savings = content?.savings || {
    title: "Save Around 5–6% when You Choose Quarterly Payment!",
    siblingDiscount: {
      title: "Sibling Discount: More Savings for Families",
      description: "When two or more siblings enroll, we add up their weekly classes and give the lower per-class rate from our chart. For example, if both children take 3 classes per week (normally $3.00 per class each), that's 6 classes in total. Instead of paying separately, the family pays the 6-day rate of $2.75 per class — about 8% less. This way, families always save more with every additional child enrolled."
    },
    groupPricing: {
      title: "Group Class Pricing",
      description: "Our listed prices are for 1-to-1 sessions, but they also apply if you form a small group of 2 or 3 students in one class. The cost per class (monthly or quarterly) remains the same — families simply share the price among themselves.",
      subtext: "For group classes with 4 to 10 students, please see our Group Class Pricing."
    }
  };

  const referAFriend = content?.referAFriend || {
    title: "Share the Gift of Qur'an – Refer a Friend",
    description: "Invite a family you know to join Deeni Madrasa. They will enjoy a 50% discount in their first month of classes. By referring them, you gain the reward of guiding another family towards Qur'an and Islamic learning, In shaa Allah."
  };

  const plans = getPlans();
  const symbol = currency === 'USD' ? '$' : '৳';

  return (
    <div className="flex flex-col w-full bg-[#fcfaf2]">
      {/* Header */}
      <section className="gradient-bg py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold serif">{header.title}</h1>
      </section>

      {/* Pricing Controls */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 serif">{header.subtitle}</h2>
          <p className="text-slate-500 text-sm">{header.description}</p>
          
          <div className="flex justify-center items-center gap-4 pt-4">
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${currency === 'USD' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border'}`}
            >
              USD
            </button>
            <button 
              onClick={() => setCurrency('BDT')}
              className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${currency === 'BDT' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border'}`}
            >
              BDT
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {['40 Minutes', '60 Minutes', 'Group Session'].map(d => (
            <button 
              key={d}
              onClick={() => setDuration(d.split(' ')[0] as any)}
              className={`px-6 py-2 rounded-lg text-sm font-bold border transition-all ${duration === d.split(' ')[0] ? 'bg-blue-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 pt-8">
          {plans.map((plan, i) => (
            <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border hover:shadow-xl transition-all flex flex-col relative">
              {plan.tag && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold text-lg border-4 border-[#fcfaf2]">
                  {plan.tag}
                </div>
              )}
              <div className={`${plan.color} py-6 text-white font-bold text-lg`}>
                {plan.name}
              </div>
              <div className="p-10 flex-grow space-y-8 bg-[#fffcf5]">
                <div className="space-y-1">
                  <div className="text-5xl font-bold text-slate-900">{symbol}{plan.price}</div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{plan.period}</div>
                </div>
                
                <ul className="space-y-4 text-left">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <Check className="h-4 w-4 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    if (plan.name === "Free Trial") {
                      window.open('https://wa.me/yournumber?text=I want to book a free trial', '_blank');
                    } else {
                      window.open(`https://wa.me/yournumber?text=I want to sign up for ${plan.name} (${duration} session)`, '_blank');
                    }
                  }}
                  className="w-full py-3 rounded-full border-2 border-slate-200 font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Savings Info */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center space-y-16">
        <h2 className="text-4xl font-bold text-slate-900 serif">{savings.title}</h2>
        
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">{savings.siblingDiscount.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {savings.siblingDiscount.description}
            </p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">{savings.groupPricing.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {savings.groupPricing.description}
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              {savings.groupPricing.subtext}
            </p>
            <button className="text-blue-600 font-bold text-sm hover:underline">Visit Our Group Class Pricing</button>
          </div>
        </div>

        {/* Refer a Friend */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-2">
            <h3 className="text-xl font-bold text-slate-900">{referAFriend.title}</h3>
            <p className="text-slate-500 text-sm">
              {referAFriend.description}
            </p>
          </div>
          <a 
            href={`https://wa.me/?text=${encodeURIComponent("Assalamu Alaikum, I found this amazing Online Islamic Academy called Deeni Madrasa. You should check it out! https://deenimadrasa.com")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-800 text-white px-8 py-3 rounded-xl font-bold whitespace-nowrap hover:bg-blue-900 transition-colors inline-block"
          >
            Refer On WhatsApp
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 serif">Frequently Asked Questions (FAQ)</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(FAQS).map(tag => (
                <button 
                  key={tag} 
                  onClick={() => { setFaqCategory(tag); setActiveFAQ(0); }}
                  className={`px-4 py-1.5 border rounded-full text-xs font-bold transition-all ${tag === faqCategory ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-500 hover:text-blue-600 hover:border-blue-200'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {(FAQS[faqCategory as keyof typeof FAQS] || []).map((faq: any, i: number) => (
              <div key={i} className="bg-[#fcfaf2] border rounded-2xl overflow-hidden transition-all">
                <button 
                  onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center group"
                >
                  <span className={`font-bold transition-colors ${activeFAQ === i ? 'text-blue-600' : 'text-slate-800'}`}>{faq.q}</span>
                  <div className="text-2xl font-light text-slate-400">
                    {activeFAQ === i ? '−' : '+'}
                  </div>
                </button>
                {activeFAQ === i && (
                  <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed animate-in slide-in-from-top-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
