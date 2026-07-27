import React, { useState } from 'react';
import { PixtronArrows } from './PixtronArrows';

interface ContactFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

const RATE_LIMIT_KEY = 'pixtron_contact_submission_times';
const RATE_LIMIT_MAX_SUBMISSIONS = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function sanitizeInput(value: string): string {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
}

function isRateLimited(): boolean {
  const now = Date.now();
  const raw = window.localStorage.getItem(RATE_LIMIT_KEY);
  const timestamps = raw ? (JSON.parse(raw) as number[]) : [];
  const recent = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  return recent.length >= RATE_LIMIT_MAX_SUBMISSIONS;
}

function registerSubmission(): void {
  const now = Date.now();
  const raw = window.localStorage.getItem(RATE_LIMIT_KEY);
  const timestamps = raw ? (JSON.parse(raw) as number[]) : [];
  const recent = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
}

function validateForm(data: ContactFormData): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+\d\s()-]{8,20}$/;

  if (!data.fullName) return 'Full name is required.';
  if (!data.email || !emailRegex.test(data.email)) return 'Please enter a valid email address.';
  if (!data.phone || !phoneRegex.test(data.phone)) return 'Please enter a valid phone number.';
  if (!data.message || data.message.length < 10) return 'Please share at least 10 characters about your requirement.';

  return null;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange =
    (field: keyof ContactFormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const sanitized: ContactFormData = {
      fullName: sanitizeInput(formData.fullName),
      company: sanitizeInput(formData.company),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      message: sanitizeInput(formData.message),
    };

    const validationError = validateForm(sanitized);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isRateLimited()) {
      setError('Too many submissions. Please wait a few minutes before trying again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized),
      });

      if (!response.ok) {
        let serverMessage = 'Unable to submit your request right now.';
        try {
          const payload = (await response.json()) as { message?: string };
          if (payload.message) serverMessage = payload.message;
        } catch {
          // Ignore JSON parsing issues and keep default error text.
        }
        throw new Error(serverMessage);
      }

      registerSubmission();
      setSuccess('Your inquiry has been submitted. Our team will contact you shortly.');
      setFormData({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="bg-primary rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute -right-24 -bottom-20 opacity-10 pointer-events-none">
              <PixtronArrows size={380} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <PixtronArrows size={20} />
                <span className="font-bold tracking-widest uppercase text-sm text-secondary">Get In Touch</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black leading-tight mb-6">Work With Vision Experts</h3>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
                Share your production challenges and quality goals. Our vision experts will connect with a practical plan.
              </p>
              <div className="space-y-4 text-sm font-medium text-white/90">
                <p>Email: projects@pixtronsystems.com</p>
                <p>Phone: +91 9146707884</p>
                <p>Office Hours: 10:00 AM - 4:00 PM IST</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/60"
          >
            <h4 className="text-2xl font-black text-slate-900 mb-8">Contact Form</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange('company')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <input
                type="email"
                placeholder="Work Email"
                value={formData.email}
                onChange={handleChange('email')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange('phone')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <textarea
              rows={5}
              placeholder="Tell us about your inspection requirements"
              value={formData.message}
              onChange={handleChange('message')}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 mb-4 resize-none"
            />

            {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}
            {success && <p className="mb-4 text-sm font-medium text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
