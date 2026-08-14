
import { useState, useRef, useEffect, SyntheticEvent } from "react";

// Global cache: Tracks images already loaded during this session
const loadedMediaCache = new Set<string>();

export interface SmartMediaProps {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
  title?: string;
  draggable?: boolean;
  className?: string;
  onError?: (e: SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => void;
}

export const SmartMedia = ({
  type,
  src,
  poster,
  alt = "",
  title,
  draggable,
  className = "",
  onError,
}: SmartMediaProps) => {
  // Check if media was already cached/loaded previously
  const isAlreadyCached = loadedMediaCache.has(src);
  const [isLoaded, setIsLoaded] = useState<boolean>(isAlreadyCached);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // If media source is already in memory cache, show instantly
    if (loadedMediaCache.has(src)) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  const handleLoad = () => {
    loadedMediaCache.add(src); // Save URL to global cache
    setIsLoaded(true);
  };

  const handleError = (e: SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    setIsLoaded(true); // Stop shimmer wave immediately on broken link/error
    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* ── DARK SHIMMER WAVE SKELETON ── */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 bg-slate-900/90 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent animate-shimmer" />
        </div>
      )}

      {/* ── MEDIA ── */}
      {type === "image" ? (
        <img
          src={src}
          alt={alt}
          title={title}
          draggable={draggable}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-contain transition-opacity duration-300 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          title={title}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};