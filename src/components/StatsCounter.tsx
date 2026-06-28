import { useState, useEffect } from 'react';

interface StatProps {
  label: string;
  target?: number;
  suffix?: string;
  id: string;
  textOverride?: string;
  key?: string;
}

function CounterItem({ label, target, suffix, id, textOverride }: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === undefined) return;
    let start = 0;
    const duration = 1500; // ms
    const increment = Math.ceil(target / (duration / 16)); // ~60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div id={`stat-card-${id}`} className="bg-white rounded-xl shadow-xs border border-slate-100 p-6 text-center transform hover:-translate-y-1 transition-all duration-300">
      <div 
        id={`stat-count-${id}`} 
        className="text-3xl sm:text-4xl font-display font-extrabold text-[#1763B6] tracking-tight mb-1"
      >
        {textOverride ? textOverride : `${count.toLocaleString()}${suffix || ''}`}
      </div>
      <div 
        id={`stat-label-${id}`} 
        className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider"
      >
        {label}
      </div>
    </div>
  );
}

export default function StatsCounter() {
  const stats: StatProps[] = [
    { id: 'students', label: 'Students Trained', target: 500, suffix: '+' },
    { id: 'modules', label: 'SAP Specialized Modules', target: 20, suffix: '+' },
    { id: 'satisfaction', label: 'Programs Quality', textOverride: 'Top Tier' },
    { id: 'experience', label: 'Years Experience', target: 15, suffix: '+' }
  ];

  return (
    <div id="stats-counter-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <CounterItem 
          key={stat.id} 
          id={stat.id}
          label={stat.label} 
          target={stat.target} 
          suffix={stat.suffix} 
          textOverride={stat.textOverride}
        />
      ))}
    </div>
  );
}
