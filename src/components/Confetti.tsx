import React, { useEffect, useState } from 'react';
import { t } from '../translations';
import { Icon } from '../icons';

interface ConfettiProps {
  show: boolean;
  onDone: () => void;
  lang: 'ar' | 'en';
}

export const Confetti: React.FC<ConfettiProps> = ({ show, onDone, lang }) => {
  const [particles, setParticles] = useState<
    { left: string; bg: string; dx: number; rt: number; t: number; dl: number; w: number; h: number }[]
  >([]);

  useEffect(() => {
    if (show) {
      const cl = [
        '#16a34a',
        '#2563eb',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#ec4899',
        '#14b8a6',
      ];
      const items = Array.from({ length: 70 }, (_, i) => {
        const r = Math.random;
        return {
          left: (r() * 100).toFixed(1) + '%',
          bg: cl[i % cl.length],
          dx: Math.round((r() - 0.5) * 180),
          rt: Math.round(300 + r() * 700),
          t: +(2.2 + r() * 1.6).toFixed(2),
          dl: +(r() * 0.9).toFixed(2),
          w: Math.round(6 + r() * 5),
          h: Math.round(10 + r() * 8),
        };
      });
      setParticles(items);

      const timer = setTimeout(() => {
        onDone();
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  if (!show) return null;

  return (
    <>
      <div className="cf">
        {particles.map((p, i) => (
          <i
            key={i}
            style={
              {
                left: p.left,
                background: p.bg,
                '--dx': p.dx + 'px',
                '--rt': p.rt + 'deg',
                '--t': p.t + 's',
                '--dl': p.dl + 's',
                width: p.w + 'px',
                height: p.h + 'px',
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="cfb">
        <Icon name="i:check" size="18px" />
        <span>{t('ما شاء الله! أنجزت كل مهام اليوم', lang)}</span>
      </div>
    </>
  );
};
