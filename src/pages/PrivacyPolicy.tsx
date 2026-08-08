import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <div className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Last updated: August 2026
          </p>
        </div>

        {/* POLICY CONTENT */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
          
          {/* Introduction */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Introduction
            </h2>
            <p>
              Pixtron Systems respects the privacy of visitors to our website. This policy explains what information we receive through our website and how we use it.
            </p>
          </section>

          {/* Information We Receive */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Information We Receive
            </h2>
            <p className="mb-3">
              When you contact us through our website, email, or WhatsApp, we may receive:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Your name</li>
              <li>Company name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Details of your product inquiry or support request</li>
            </ul>
          </section>

          {/* How We Use the Information */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              How We Use the Information
            </h2>
            <p className="mb-3">
              We use the information only to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Respond to your inquiry</li>
              <li>Provide product or technical information regarding our machine vision systems</li>
              <li>Communicate regarding automated inspection solutions and integration</li>
              <li>Provide customer assistance related to your request</li>
            </ul>
          </section>

          {/* Email Communication */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Email Communication
            </h2>
            <p>
              Information submitted through the website is sent to our official company email address. We may retain email conversations for record-keeping and customer support purposes.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Data Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Cookies
            </h2>
            <p>
              Our website may use essential cookies required for website functionality and basic analytics cookies to understand website traffic and improve user experience.
            </p>
          </section>

          {/* CONTACT US BOX */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm mt-10">
            <h3 className="text-xl font-bold text-primary mb-4">
              Contact Us
            </h3>
            
            <p className="font-semibold text-slate-800 mb-3">
              Pixtron Systems
            </p>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="text-[#fbbb0d] shrink-0" size={18} />
                <span className="font-medium text-slate-600">Email:</span>
                <a 
                  href="mailto:projects@pixtronsystems.com" 
                  className="text-primary hover:text-[#fbbb0d] font-medium underline transition-colors"
                >
                  projects@pixtronsystems.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="text-[#fbbb0d] shrink-0" size={18} />
                <span className="font-medium text-slate-600">Phone:</span>
                <a 
                  href="tel:+919146707884" 
                  className="text-primary hover:text-[#fbbb0d] font-medium underline transition-colors"
                >
                  +91 9146707884
                </a>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <MapPin className="text-[#fbbb0d] shrink-0" size={18} />
                <span className="font-medium text-slate-600">Head Office:</span>
                <span className="text-slate-700">Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};