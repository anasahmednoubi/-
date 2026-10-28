import React, { useState } from 'react';
import { Task, Routine, PeriodType } from '../types';
import { t, cap } from '../translations';
import { Icon } from '../icons';
import {
  ORDER,
  getDayName,
  today,
  key,
  due,
  pct,
  col,
} from '../utils';

interface StatsViewProps {
  tasks: Task[];
  routines: Routine[];
  period: PeriodType;
  onChangePeriod: (p: PeriodType) => void;
  lang: 'ar' | 'en';
}

export const StatsView: React.FC<StatsViewProps> = ({
  tasks,
  routines,
  period,
  onChangePeriod,
  lang,
}) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleOpen = (keyStr: string) => {
    setOpenItems((prev) => ({ ...prev, [keyStr]: !prev[keyStr] }));
  };

  const tDate = today();
  const stDate = (() => {
    if (period === 'M') return new Date(tDate.getFullYear(), tDate.getMonth(), 1);
    const d = new Date(tDate);
    d.setDate(d.getDate() - ((tDate.getDay() + 1) % 7));
    return d;
  })();

  const enDate = (() => {
    if (period === 'M') {
      return new Date(tDate.getFullYear(), tDate.getMonth() + 1, 0);
    }
    return new Date(stDate.getFullYear(), stDate.getMonth(), stDate.getDate() + 6);
  })();

  const ks = key(stDate);
  const kt = key(tDate);

  // Routine stats
  let totalScheduled = 0;
  let totalDone = 0;
  const routineStats = routines.map((r) => {
    let sc = 0;
    let dn = 0;
    for (const d = new Date(stDate); d <= tDate; d.setDate(d.getDate() + 1)) {
      const kd = key(d);
      if (kd < r.created || !due(r, d)) continue;
      sc++;
      if (r.log[kd]) dn++;
    }
    totalScheduled += sc;
    totalDone += dn;
    return {
      r,
      sc,
      dn,
      p: sc > 0 ? Math.round((dn / sc) * 100) : null,
    };
  });
  const routineOverallPct =
    totalScheduled > 0 ? Math.round((totalDone / totalScheduled) * 100) : null;

  // Task stats
  const inRange = (d?: string) => !!d && d >= ks && d <= kt;
  const closedTasks = tasks.filter((x) => x.finished && inRange(x.fin));
  const touchedTasks = tasks.filter(
    (x) =>
      (x.hist || []).some((h) => inRange(h.d)) ||
      (x.finished && inRange(x.fin))
  );
  const taskOverallPct = touchedTasks.length
    ? Math.round(
        touchedTasks.reduce((acc, curr) => acc + pct(curr), 0) /
          touchedTasks.length
      )
    : null;

  const validVals = [routineOverallPct, taskOverallPct].filter(
    (v): v is number => v !== null
  );
  const overallPct = validVals.length
    ? Math.round(validVals.reduce((a, b) => a + b, 0) / validVals.length)
    : null;

  // Day-by-day commitment chart data
  const chartDays: {
    date: Date;
    pct: number | null;
    label: string;
  }[] = [];

  for (const d = new Date(stDate); d <= enDate; d.setDate(d.getDate() + 1)) {
    let sc = 0;
    let dn = 0;
    const kd = key(d);
    if (d <= tDate) {
      routines.forEach((r) => {
        if (kd < r.created) return;
        sc++;
        if (r.log[kd]) dn++;
      });
      tasks.forEach((x) => {
        const touched =
          (x.hist || []).some((h) => h.d === kd) ||
          (x.finished && x.fin === kd);
        if (touched || !x.finished || (x.fin && x.fin >= kd)) {
          sc++;
          if (touched) dn++;
        }
      });
    }
    const p = sc > 0 ? Math.round((dn / sc) * 100) : null;
    const lbl =
      period === 'M'
        ? d.getDate() % 5 === 0 || d.getDate() === 1
          ? String(d.getDate())
          : ''
        : getDayName(d.getDay(), lang);
    chartDays.push({ date: new Date(d), pct: p, label: lbl });
  }

  // Sorted routines for best/weakest
  const sortedRoutines = routineStats
    .filter((x) => x.p !== null)
    .sort((a, b) => (b.p ?? 0) - (a.p ?? 0));

  const periodLabel =
    period === 'M' ? t('خلال الشهر', lang) : t('خلال الأسبوع', lang);

  const renderGrid = (
    evalStatus: (d: Date, k: string) => 'd' | 'm' | 'u' | ''
  ) => {
    const days: { date: Date; status: string }[] = [];
    for (const d = new Date(stDate); d <= enDate; d.setDate(d.getDate() + 1)) {
      days.push({
        date: new Date(d),
        status: evalStatus(d, key(d)),
      });
    }

    const startOffset = period === 'M' ? ORDER.indexOf(stDate.getDay()) : 0;

    return (
      <div className="gd">
        {period === 'M' &&
          Array.from({ length: startOffset }, (_, i) => <span key={`empty_${i}`} />)}
        {days.map((item, idx) => (
          <span
            key={idx}
            className={`gc ${item.status ? 'gx-' + item.status : ''}`}
          >
            {period !== 'M' && (
              <small>{getDayName(item.date.getDay(), lang)}</small>
            )}
            <b>{item.date.getDate()}</b>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div id="pS">
      <div className="tabs main">
        <button
          type="button"
          id="xW"
          className={period === 'W' ? 'on' : ''}
          onClick={() => onChangePeriod('W')}
          aria-label={t('الأسبوع', lang)}
        >
          <span className="ti">
            <Icon name="i:week" />
          </span>
          <span className="tn">{t('الأسبوع', lang)}</span>
        </button>
        <button
          type="button"
          id="xM"
          className={period === 'M' ? 'on' : ''}
          onClick={() => onChangePeriod('M')}
          aria-label={t('الشهر', lang)}
        >
          <span className="ti">
            <Icon name="i:month" />
          </span>
          <span className="tn">{t('الشهر', lang)}</span>
        </button>
      </div>

      {/* Overall card */}
      <div className="task" id="sOv">
        <div className="sub">
          {t('إنجازك الكلي', lang)} {periodLabel}
        </div>
        <div className="big" style={{ color: col(overallPct) }}>
          {overallPct === null ? '—' : `${overallPct}%`}
        </div>
        <div className="bar">
          <div
            className="fill"
            style={{
              width: `${overallPct || 0}%`,
              background: col(overallPct),
            }}
          />
        </div>
        <div className="sub">
          {t('الروتين:', lang)}{' '}
          {routineOverallPct === null ? '—' : `${routineOverallPct}%`} •{' '}
          {t('المهام:', lang)} {taskOverallPct === null ? '—' : `${taskOverallPct}%`}
        </div>
      </div>

      {/* Daily commitment bar chart */}
      <div className="task" id="sCh">
        <b>{t('الالتزام يومًا بعد يوم', lang)}</b>
        <div
          style={{
            display: 'flex',
            gap: '3px',
            height: '80px',
            marginTop: '10px',
          }}
        >
          {chartDays.map((c, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height:
                    c.pct === null
                      ? '5%'
                      : `${Math.max(c.pct, 8)}%`,
                  background: c.pct === null ? 'var(--track)' : col(c.pct),
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease',
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
          {chartDays.map((c, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: period === 'M' ? '9px' : '10px',
                color: 'var(--mute)',
              }}
            >
              {c.label}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks stats */}
      <div className="task" id="sTk">
        <b>{t('المهام', lang)}</b>
        <div className="meta" style={{ margin: '10px 0 4px' }}>
          <span>{t('مهام مغلقة', lang)}</span>
          <span>{closedTasks.length}</span>
        </div>
        <div className="meta" style={{ margin: '0 0 4px' }}>
          <span>{t('مهام عملت عليها', lang)}</span>
          <span>{touchedTasks.length}</span>
        </div>
        <div className="meta" style={{ margin: 0 }}>
          <span>{t('متوسط نسبة إنجازها', lang)}</span>
          <span style={{ color: col(taskOverallPct), fontWeight: 600 }}>
            {taskOverallPct === null ? '—' : `${taskOverallPct}%`}
          </span>
        </div>

        {touchedTasks.map((x) => {
          const ds = new Set<string>();
          (x.hist || []).forEach((h) => {
            if (inRange(h.d)) ds.add(h.d);
          });
          if (x.finished && inRange(x.fin)) ds.add(x.fin!);

          const isOpen = !!openItems['T' + x.id];
          return (
            <div key={x.id} style={{ marginTop: '12px' }}>
              <div
                className="head sx"
                onClick={() => toggleOpen('T' + x.id)}
                role="button"
                tabIndex={0}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name={x.icon || 'i:pin'} />
                  <span>{x.name}</span>
                </span>
                <span
                  style={{
                    color: 'var(--mute)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {ds.size} {t('يوم', lang)}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
              <div className={`collapsible-drawer ${isOpen ? 'open' : ''}`}>
                <div className="collapsible-drawer-inner">
                  <div className="xp">
                    <div className="sub" style={{ marginTop: '8px' }}>
                      {t('عملت عليها', lang)} {ds.size} {t('يوم', lang)}{' '}
                      {periodLabel}
                    </div>
                    {renderGrid((_, kd) =>
                      ds.has(kd) ? 'd' : kd > kt ? '' : 'u'
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Routine stats */}
      <div className="task" id="sRt">
        <b>{cap(t('الروتين', lang))}</b>
        {routineStats.length === 0 ? (
          <div className="sub" style={{ marginTop: '8px' }}>
            {t('لا يوجد روتين بعد.', lang)}
          </div>
        ) : (
          <>
            {sortedRoutines
              .concat(routineStats.filter((x) => x.p === null))
              .map(({ r, sc, dn, p }) => {
                const isOpen = !!openItems['R' + r.id];
                return (
                  <div key={r.id} style={{ marginTop: '12px' }}>
                    <div
                      className="head sx"
                      onClick={() => toggleOpen('R' + r.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Icon name={r.icon || 'i:repeat'} />
                        <span>{r.name}</span>
                      </span>
                      <span
                        style={{
                          color: col(p),
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {p === null ? '—' : `${p}%`}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </div>

                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${p || 0}%`,
                          background: col(p),
                        }}
                      />
                    </div>

                    <div className="sub">
                      {dn} {t('من', lang)} {sc}
                    </div>

                    <div className={`collapsible-drawer ${isOpen ? 'open' : ''}`}>
                      <div className="collapsible-drawer-inner">
                        <div className="xp">
                          <div className="sub" style={{ marginTop: '8px' }}>
                            {t('التزمت', lang)} {dn} {t('يوم من', lang)} {sc}{' '}
                            {periodLabel}
                          </div>
                          {renderGrid((d, kd) => {
                            if (kd < r.created || !due(r, d)) return 'u';
                            if (r.log[kd]) return 'd';
                            return kd < kt ? 'm' : '';
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {sortedRoutines.length > 1 && (
              <div className="sub" style={{ marginTop: '12px' }}>
                {t('الأفضل:', lang)} {sortedRoutines[0].r.name} (
                {sortedRoutines[0].p}%) • {t('الأضعف:', lang)}{' '}
                {sortedRoutines[sortedRoutines.length - 1].r.name} (
                {sortedRoutines[sortedRoutines.length - 1].p}%)
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
