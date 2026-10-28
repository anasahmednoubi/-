import { Task, Routine } from './types';
import { t } from './translations';

export const ORDER = [6, 0, 1, 2, 3, 4, 5]; // Sat (6), Sun (0), Mon (1), Tue (2), Wed (3), Thu (4), Fri (5)

export function getDayName(d: number, lang: 'ar' | 'en'): string {
  const map: Record<number, string> = {
    6: 'السبت',
    0: 'الأحد',
    1: 'الاثنين',
    2: 'الثلاثاء',
    3: 'الأربعاء',
    4: 'الخميس',
    5: 'الجمعة',
  };
  return t(map[d] || '', lang);
}

export function key(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function pct(t: Task): number {
  if (!t.target || t.target <= 0) return 0;
  return Math.min(100, Math.round((t.done / t.target) * 100));
}

export function col(p: number | null | undefined): string {
  if (p === null || p === undefined) return 'var(--mute)';
  return 'hsl(' + Math.round(p * 1.25) + ', 72%, 44%)';
}

export function due(r: Routine, d: Date): boolean {
  if (r.mode === 'M') {
    return (r.md || []).includes(d.getDate());
  }
  return r.days.includes(d.getDay());
}

export function schedTxt(r: Routine, lang: 'ar' | 'en'): string {
  if (r.mode === 'M') {
    const list = (r.md || []).slice().sort((x, y) => x - y).join(t('، ', lang));
    return t('شهريًا:', lang) + ' ' + list;
  }
  if (r.days.length === 7) {
    return t('كل يوم', lang);
  }
  return ORDER.filter(d => r.days.includes(d))
    .map(d => getDayName(d, lang))
    .join(t('، ', lang));
}

export function wkStart(): Date {
  const t = today();
  const d = new Date(t);
  d.setDate(d.getDate() - ((t.getDay() + 1) % 7));
  return d;
}

export function pStart(period: 'W' | 'M'): Date {
  const t = today();
  if (period === 'M') return new Date(t.getFullYear(), t.getMonth(), 1);
  const d = new Date(t);
  d.setDate(d.getDate() - ((t.getDay() + 1) % 7));
  return d;
}

export function statRoutine(r: Routine, period: 'W' | 'M'): { sc: number; dn: number; p: number | null } {
  const t = today();
  const from = new Date(Math.max(pStart(period).getTime(), new Date(r.created + 'T00:00:00').getTime()));
  let sc = 0;
  let dn = 0;
  for (const d = new Date(from); d <= t; d.setDate(d.getDate() + 1)) {
    if (due(r, d)) {
      sc++;
      if (r.log[key(d)]) dn++;
    }
  }
  return { sc, dn, p: sc ? Math.round((dn / sc) * 100) : null };
}

export function normalizeStr(s: string): string {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}
