import React, { useState } from "react";
import { PixtronArrows } from "./PixtronArrows";

export interface Client {
  id: string;
  name: string;
  logoText: string;
  logoUrl?: string;
}

const clientsData: Client[] = [
  {
    id: "1",
    name: "DCI Pharmaceuticals Pvt. Ltd.",
    logoText: "DCI",
    logoUrl: "https://res.cloudinary.com/owsr7mjw/image/upload/v1787124528/DCI_Logo_wajceq.jpg",
  },
  {
    id: "2",
    name: "Vicco Ayurveda",
    logoText: "VA",
    logoUrl: "https://res.cloudinary.com/owsr7mjw/image/upload/v1787124528/Vicco_Ayurveda_dljfvi.jpg",
  },
];

export const OurClients: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Smooth infinite loop ke liye 6x array duplication (seamless scrolling without lag)
  const displayClients = [
    ...clientsData,
    ...clientsData,
    ...clientsData,
    ...clientsData,
    ...clientsData,
    ...clientsData,
  ];

  return (
    <section className="py-12 sm:py-16 bg-white text-slate-900 relative overflow-hidden font-sans border-t border-slate-100">
      
      {/* GPU Accelerated Hardware-Smooth Marquee Animation */}
      <style>{`
        @keyframes clientsMarquee {
          0% { 
            transform: translate3d(0%, 0, 0); 
          }
          100% { 
            transform: translate3d(-50%, 0, 0); 
          }
        }
        .animate-clients-marquee {
          display: flex;
          width: max-content;
          animation: clientsMarquee 25s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .clients-marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Gemini Blue Glow Background Effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[350px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(14, 116, 233, 0.28) 0%, rgba(6, 68, 162, 0.12) 45%, rgba(255, 255, 255, 0) 75%)",
          filter: "blur(35px)",
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[180px] pointer-events-none z-0 opacity-80"
        style={{
          background: "radial-gradient(circle, rgba(8, 120, 232, 0.35) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(45px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          
          {/* Subtitle with Pixtron Arrows */}
          <div className="inline-flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[#003882] mb-3">
            <PixtronArrows size={14} />
            TRUSTED BY
          </div>

          {/* Main Title - Single Black Color & 48px Desktop Font Size */}
          <h2 className="text-3xl sm:text-4xl md:text-[48px] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Our Valuable Clients
          </h2>

          {/* Subtitle Description Text (Matching Solutions Section Style) */}
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
            Empowerment through Our Clients: Driving industry excellence with trusted vision inspection technology.
          </p>
        </div>

        {/* Marquee Track with Pause on Hover */}
        <div
          className="relative w-full overflow-hidden py-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Side Fade Gradients */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Cards Track */}
          <div
            className={`animate-clients-marquee gap-5 sm:gap-6 ${
              isPaused ? "clients-marquee-paused" : ""
            }`}
          >
            {displayClients.map((client, idx) => (
              <div
                key={`${client.id}-${idx}`}
                className="group relative flex items-center gap-4 bg-slate-50/90 hover:bg-white border border-slate-200/80 hover:border-[#FFD400] px-5 py-4 rounded-2xl min-w-[280px] sm:min-w-[320px] shrink-0 transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer hover:-translate-y-1 backdrop-blur-xs"
              >
                {/* Logo Box */}
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#FFD400]/60 transition-colors overflow-hidden p-1">
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <span className="font-extrabold text-sm text-slate-800 group-hover:text-[#003882] transition-colors">
                      {client.logoText}
                    </span>
                  )}
                </div>

                {/* Client Name (Full text visible, no truncation/dots) */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-slate-900 font-bold text-sm sm:text-base leading-snug whitespace-nowrap group-hover:text-[#003882] transition-colors">
                    {client.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default OurClients;