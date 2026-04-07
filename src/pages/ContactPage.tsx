import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { PixtronArrows } from '../components/PixtronArrows';
import { ContactForm } from '../components/ContactForm';

const offices = [
  { region: 'North', city: 'Chandigarh' },
  { region: 'East', city: 'Kolkata' },
  { region: 'West', city: 'Pune' },
  { region: 'South', city: 'Chennai' },
  { region: 'Head Office', city: 'Goa' },
];

export const ContactPage: React.FC = () => {
  return (
    <main className="pt-28 sm:pt-32 bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="flex items-center gap-2 mb-4">
          <PixtronArrows size={20} />
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Contact</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6">Connect With Vision Experts</h1>
        <p className="text-slate-600 max-w-3xl text-base sm:text-lg">
          Reach out to Pixtron Systems for high-speed inspection planning, deployment guidance, and support.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <article className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Contact Details</h2>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-slate-700">
                <Mail size={20} className="text-primary shrink-0" />
                <span>projects@pixtronsystems.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <Phone size={20} className="text-primary shrink-0" />
                <span>+91 9637495512</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <MapPin size={20} className="text-primary shrink-0" />
                <span>Head Office: Goa</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <Clock size={20} className="text-primary shrink-0" />
                <span>Office Hours: 10:00 AM - 4:00 PM IST</span>
              </li>
            </ul>
          </article>

          <article className="bg-primary rounded-3xl p-6 sm:p-8 text-white">
            <h2 className="text-2xl font-black mb-6">Our Presence</h2>
            <ul className="space-y-4">
              {offices.map((office) => (
                <li key={office.city} className="flex items-center gap-3 text-white/90">
                  <PixtronArrows size={14} />
                  <span>
                    {office.city} ({office.region})
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <ContactForm />
    </main>
  );
};
