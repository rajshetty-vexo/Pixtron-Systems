import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Youtube, Building2, Quote } from "lucide-react";
import { PixtronArrows } from "./PixtronArrows";
import { SmartMedia } from "./SmartMedia";

export interface TestimonialSlide {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  initials: string;
  photo?: string;
  mediaType: "youtube" | "video" | "image";
  mediaUrl: string;
}

const testimonials: TestimonialSlide[] = [
  {
    id: "Mac",
    quote:
      "Since switching to Pixtron Machine Vision systems, our defect detection rate reached 99.9%. The setup was smooth, and print inspection is totally flawless.",
    name: "Mac",
    role: "Managing Director",
    company: "Lite-banana",
    initials: "LB",
    photo: "https://res.cloudinary.com/mfutgeij/image/upload/v1786906017/My_Img_e0oalj.png",
    mediaType: "youtube",
    mediaUrl: "https://www.youtube.com/embed/xtm0oCCrNTs?si=11cf74oUJTytgDKK",
  },
  {
    id: "anita-pillai",
    quote:
      "Their AI vision software integrated into our packaging line seamlessly within 2 days. We saved hundreds of hours in manual quality checks.",
    name: "Anita Pillai",
    role: "Plant Head",
    company: "Wellness Foods Pvt Ltd",
    initials: "AP",
    photo: "",
    mediaType: "youtube",
    mediaUrl: "",
  },
  {
    id: "sandeep-kulkarni",
    quote:
      "Pixtron Systems provided the most stable OCR inspection unit we have ever deployed. Zero downtime recorded in over six months of high-speed sorting.",
    name: "Sandeep Kulkarni",
    role: "Operations Manager",
    company: "Sunrise Beverages",
    initials: "SK",
    photo: "",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "meera-joshi",
    quote:
      "High precision, prompt technical support, and intuitive software user interface. Pixtron is now our go-to partner for automated vision inspection.",
    name: "Meera Joshi",
    role: "Quality Assurance Lead",
    company: "Nova Pharma Pack",
    initials: "MJ",
    photo: "",
    mediaType: "youtube",
    mediaUrl: "",
  },
];

const AUTOPLAY_MS = 8000;

let ytApiReady = false;
let ytApiCallbacks: Array<() => void> = [];

function loadYouTubeAPI(cb: () => void) {
  if (ytApiReady) {
    cb();
    return;
  }
  ytApiCallbacks.push(cb);
  if (!document.getElementById("youtubeIframeApiScript")) {
    const tag = document.createElement("script");
    tag.id = "youtubeIframeApiScript";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }
  window.onYouTubeIframeAPIReady = () => {
    ytApiReady = true;
    ytApiCallbacks.forEach((fn) => fn());
    ytApiCallbacks = [];
  };
}

function parseYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const m = u.pathname.match(/\/embed\/([^/?]+)/);
    if (m) return m[1];
  } catch {
    // Ignore error
  }
  return null;
}

function fetchThumbnail(videoId: string): Promise<string> {
  return fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`
    )}&format=json`
  )
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data) => {
      if (data?.thumbnail_url) return data.thumbnail_url as string;
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    })
    .catch(() => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const ClientAvatar = ({
  photo,
  initials,
  name,
}: {
  photo?: string;
  initials: string;
  name: string;
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = photo && !imgFailed;

  return (
    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl p-[2px] bg-gradient-to-tr from-primary via-primary/80 to-secondary shrink-0 overflow-hidden shadow-md">
      <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {showPhoto ? (
          <img
            src={photo}
            alt={name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-extrabold text-sm sm:text-base tracking-wider">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef<any>(null);
  const videoHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    testimonials.forEach((slide) => {
      if (slide.mediaType === "youtube") {
        const videoId = parseYouTubeId(slide.mediaUrl);
        if (videoId) {
          fetchThumbnail(videoId).then((src) => {
            setThumbnails((prev) => ({ ...prev, [slide.id]: src }));
          });
        }
      }
    });
  }, []);

  const stopAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, []);

  const stopInlinePlayer = () => {
    if (playerRef.current?.destroy) playerRef.current.destroy();
    playerRef.current = null;
    setPlayingId(null);
  };

  const goTo = (index: number) => {
    stopInlinePlayer();
    setActive(index);
    startAutoplay();
  };

  const playInline = (slide: TestimonialSlide) => {
    if (slide.mediaType !== "youtube") return;
    const videoId = parseYouTubeId(slide.mediaUrl);
    if (!videoId || playingId === slide.id) return;

    stopAutoplay();
    stopInlinePlayer();
    setPlayingId(slide.id);
  };

  useEffect(() => {
    if (!playingId) return;
    const slide = testimonials.find((s) => s.id === playingId);
    const videoId = slide ? parseYouTubeId(slide.mediaUrl) : null;
    if (!videoId || !videoHostRef.current) return;

    loadYouTubeAPI(() => {
      if (!videoHostRef.current) return;
      playerRef.current = new window.YT.Player(videoHostRef.current, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: { autoplay: 1, mute: 0, playsinline: 1, rel: 0 },
        events: {
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              stopInlinePlayer();
              setActive((prev) => (prev + 1) % testimonials.length);
              startAutoplay();
            }
          },
        },
      });
    });
  }, [playingId]);

  const handleMouseEnter = () => stopAutoplay();
  const handleMouseLeave = () => {
    if (!playingId) startAutoplay();
  };

  const current = testimonials[active];

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 bg-white relative overflow-hidden font-sans text-slate-900 border-t border-slate-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <PixtronArrows size={14} />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Client Feedback
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Discover how our vision systems help pharmaceutical, food, and manufacturing units maintain zero-defect standards.
           </p>
        </div>

        {/* 🌟 GUARANTEED ANIMATED GRADIENT BORDER CONTAINER 🌟 */}
       <div className="relative rounded-3xl border-[2px] border-[#fbbb0d] bg-white p-6 shadow-2xl">
          


          {/* Inner Content Card (Masking the center to reveal only 3px border) */}
          <div className="relative z-10 grid lg:grid-cols-[1fr_1.1fr] gap-6 sm:gap-10 items-stretch bg-slate-50 rounded-[21px] p-5 sm:p-8 lg:p-10">
            
            {/* Left Text Column - Zero Jump Fixed Height Layout */}
            <div className="flex flex-col justify-between h-full">
              <div className="p-2.5 bg-white w-fit rounded-xl border border-slate-200 shadow-sm text-primary mb-4 sm:mb-6">
                <Quote size={24} className="fill-primary/10" />
              </div>

              {/* Minimum Height Container for Seamless Fit */}
              <div className="relative w-full min-h-[250px] sm:min-h-[220px] lg:min-h-[210px] flex flex-col justify-between my-auto">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col justify-between w-full h-full"
                  >
                    <p className="text-sm sm:text-lg lg:text-xl font-semibold text-slate-800 leading-relaxed italic tracking-tight">
                      "{current.quote}"
                    </p>

                    <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/80 mt-auto">
                      <ClientAvatar
                        photo={current.photo}
                        initials={current.initials}
                        name={current.name}
                      />
                      <div>
                        <h4 className="font-bold text-slate-950 text-base">
                          {current.name}
                        </h4>
                        <p className="text-primary font-bold text-[11px] sm:text-xs uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                          <Building2 size={13} />
                          {current.role} {current.company ? `• ${current.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Media Column - Fixed Aspect Ratio */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group my-auto shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full relative flex items-center justify-center"
                >
                  {playingId === current.id ? (
                    <div ref={videoHostRef} className="absolute inset-0 w-full h-full" />
                  ) : (
                    <>
                      {current.mediaType === "image" ? (
                        <SmartMedia
                          type="image"
                          src={current.mediaUrl}
                          alt={current.name}
                          className="w-full h-full [&>img]:object-cover"
                        />
                      ) : current.mediaType === "video" ? (
                        <video
                          src={current.mediaUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                          onEnded={() => {
                            setActive((prev) => (prev + 1) % testimonials.length);
                            startAutoplay();
                          }}
                        />
                      ) : (
                <div
  role="button"
  tabIndex={0}
  onClick={() => playInline(current)}
  className="relative w-full h-full cursor-pointer overflow-hidden group/play"
>
  <SmartMedia
    type="image"
    src={thumbnails[current.id] || `https://img.youtube.com/vi/${parseYouTubeId(current.mediaUrl)}/hqdefault.jpg`}
    alt={current.name}
    className="w-full h-full [&>img]:object-cover transition-transform duration-500 group-hover/play:scale-105"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

  {/* Top Badge - Scaled for Mobile */}
  <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 flex items-center gap-1.5 sm:gap-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-slate-700/60 z-10">
    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-primary flex items-center justify-center text-white text-[8px] sm:text-[9px] font-black">
      P
    </div>
    <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wide">
      Pixtron Systems
    </span>
  </div>

  {/* Center Play Button - Responsive Size */}
  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 group-hover/play:scale-110 transition-transform duration-300">
      <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-current ml-0.5" />
    </div>
  </div>

  {/* Bottom Badge - Scaled for Mobile */}
  <div className="absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 bg-slate-900/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 border border-slate-700 z-10">
    <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
    <span>Watch Video</span>
  </div>
</div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Slide Dots */}
        <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === active
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};