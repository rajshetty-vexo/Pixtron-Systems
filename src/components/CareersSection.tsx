import React from 'react';
import { Briefcase, Mail, ArrowRight, Cpu, Rocket, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { PixtronArrows } from "./PixtronArrows";

export const CareersSection: React.FC = () => {
  const email = "social.pixtronsystems@gmail.com";
  const subject = encodeURIComponent("Career Opportunities - Interested in joining Pixtron Systems");
  const body = encodeURIComponent(
`Hello Pixtron Systems Team,

I am very interested in exploring career opportunities at your company. I believe my skills would be a great fit for your innovative vision. 

Please find my resume attached for your consideration.

Looking forward to hearing from you.

Best regards,
[Your Name]
[Your Contact Number]`
  );

  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

  // Why Join Us Features Data
  const perks = [
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: 'Cutting-Edge AI & Vision',
      description: 'Work directly with high-speed industrial vision systems, deep learning models, and real-time automation.',
    },
    {
      icon: <Rocket className="w-6 h-6 text-primary" />,
      title: 'High-Impact Growth',
      description: 'Solve real-world shopfloor challenges with cross-functional teams where your ideas get deployed fast.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-primary" />,
      title: 'Collaborative Culture',
      description: 'We value initiative, continuous learning, and end-to-end ownership in everything we build.',
    },
  ];

  // Open Departments
  const hiringDomains = [
    'Computer Vision & AI',
    'Embedded Systems',
    'Industrial Automation',
    'Technical Support',
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/5 mb-4">
              <div className="inline-flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[#003882]">
                   <PixtronArrows size={14} />
                     Careers at Pixtron Systems
                 </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight">
            Build the Future of Industrial Automation
          </h2>
          
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            We are always looking for passionate engineers, problem solvers, and creative minds to help us push the boundaries of high-speed machine vision.
          </p>
        </div>

        {/* 1. WHY JOIN US GRID (Matches the About Cards layout above) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {perks.map((perk, idx) => (
            <div 
              key={idx}
              className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-slate-100/80 rounded-xl flex items-center justify-center mb-5">
                  {perk.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {perk.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {perk.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. HIRING DOMAINS / TAGS */}
        {/* <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm mb-12 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
            Key Areas We Always Look For Talent In:
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {hiringDomains.map((domain) => (
              <span 
                key={domain}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm"
              >
                <CheckCircle2 size={16} className="text-primary" />
                {domain}
              </span>
            ))}
          </div>
        </div> */}

        {/* 3. HERO RESUME CTA CARD */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 border-2 border-secondary shadow-xl shadow-secondary/10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto overflow-hidden">
          
          {/* Subtle Background Decoration */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center md:text-left max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-2">
              <Mail size={20} />
              <span>Direct Application</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Don’t see an exact opening?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Drop us an email with your updated resume and a quick introduction. If your profile aligns with our future engineering or business needs, our team will get in touch!
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <a
              href={mailtoLink}
              className="group flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 w-full md:w-auto"
            >
              <span>Send your resume</span>
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};