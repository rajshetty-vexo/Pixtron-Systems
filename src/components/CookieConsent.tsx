import React, { useState, useEffect } from 'react';
import { PixtronArrows } from './PixtronArrows';

const COOKIE_CONSENT_KEY = 'pixtron_cookie_consent';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner if no choice saved
      setIsVisible(true);
    } else if (consent === 'granted') {
      enableGoogleAnalytics();
    }
  }, []);

  const enableGoogleAnalytics = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'granted');
    enableGoogleAnalytics();
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'denied');
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 md:left-auto md:right-8 md:max-w-md z-50 animate-fade-in">
      <div className="bg-[#002b66] text-white p-6 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-md">
        
        {/* Background Pixtron Accent Watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <PixtronArrows size={180} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <PixtronArrows variant="white" size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-[#fbbb0d]">
              Cookie Preferences
            </span>
          </div>

          <h4 className="text-lg font-bold mb-2 text-white">We Value Your Privacy</h4>

          <p className="text-sm text-slate-200 leading-relaxed mb-5">
            We use cookies and Google Analytics to optimize your experience and analyze website traffic.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-[#fbbb0d] hover:bg-[#e0a60a] text-[#002b66] font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-sm font-medium transition-all"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};