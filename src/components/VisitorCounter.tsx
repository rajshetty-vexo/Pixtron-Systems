import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

const BASE_COUNT = 900;
const SPARK_BARS = [40, 65, 50, 80, 60, 90, 100];

export const VisitorCounter: React.FC = () => {
  const [targetCount, setTargetCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const fetchRealVisitors = async () => {
      const alreadyCounted = sessionStorage.getItem('pixtron-visit-counted');
      const endpoint = alreadyCounted
        ? '/api/visitor-count'
        : '/api/visitor-count?hit=true';

      try {
        const res = await fetch(endpoint);
        const data = await res.json();

        if (typeof data.count === 'number') {
          setTargetCount(data.count);
          if (!alreadyCounted) {
            sessionStorage.setItem('pixtron-visit-counted', 'true');
          }
        } else {
          setTargetCount(BASE_COUNT);
        }
      } catch (err) {
        console.error('Visitor counter error:', err);
        setTargetCount(BASE_COUNT);
      }
    };

    fetchRealVisitors();
  }, []);

  // Smooth count-up animation jab target count mil jaye
  useEffect(() => {
    if (targetCount === null) return;

    const duration = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.floor(eased * targetCount));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [targetCount]);

  return (
    <div className="inline-flex items-center gap-3.5 bg-secondary rounded-full pl-4 pr-6 py-2.5 sm:py-3 shadow-lg shadow-secondary/30 hover:shadow-secondary/50 transition-shadow">
      {/* Live pulse dot */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
      </span>

      {/* Mini sparkline graph */}
      <div className="flex items-end gap-[3px] h-5 sm:h-6 shrink-0">
        {SPARK_BARS.map((h, i) => (
          <span
            key={i}
            className="w-[4px] rounded-full bg-primary/70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <Users size={18} className="text-primary shrink-0" />

      <span className="text-sm sm:text-base font-bold text-primary whitespace-nowrap">
        <span className="font-black tabular-nums text-lg sm:text-xl">
          {displayCount.toLocaleString()}
        </span>{' '}
        Visitors
      </span>
    </div>
  );
};

export default VisitorCounter;