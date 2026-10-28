import React, { useState } from 'react';
import { Routine, PeriodType } from '../types';
import { t } from '../translations';
import { Icon } from '../icons';
import { IconPicker } from './IconPicker';
import {
  ORDER,
  getDayName,
  today,
  key,
  wkStart,
  due,
  schedTxt,
  statRoutine,
  col,
} from '../utils';

interface RoutineViewProps {
  routines: Routine[];
  period: PeriodType;
  onChangePeriod: (p: PeriodType) => void;
  onAddRoutine: (newRoutine: Omit<Routine, 'id' | 'log' | 'created'>) => void;
  onTickDate: (id: number, dateKey: string) => void;
  onOpenEdit: (r: Routine) => void;
  onDeleteRoutine: (r: Routine) => void;
  onReorderRoutines: (reordered: Routine[]) => void;
  lang: 'ar' | 'en';
}

export const RoutineView: React.FC<RoutineViewProps> = ({
  routines,
  period,
  onChangePeriod,
  onAddRoutine,
  onTickDate,
  onOpenEdit,
  onDeleteRoutine,
  onReorderRoutines,
  lang,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [icon, setIcon] = useState('i:repeat');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'W' | 'M'>('W');
  const [selDays, setSelDays] = useState<number[]>([]);
  const [selMD, setSelMD] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [isReorderMode, setIsReorderMode] = useState(false);

  const kToday = key(today());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === 'W' && selDays.length === 0) return;
    if (mode === 'M' && selMD.length === 0) return;

    onAddRoutine({
      name: name.trim(),
      icon,
      days: selDays.slice(),
      mode,
      md: selMD.slice(),
    });
    setName('');
    setSelDays([]);
    setSelMD([]);
    setIsAddOpen(false);
  };

  const toggleDay = (d: number) => {
    setSelDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const toggleAllDays = () => {
    setSelDays((prev) => (prev.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6]));
  };

  const toggleMonthDay = (n: number) => {
    setSelMD((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  const moveRoutine = (index: number, dir: number) => {
    const target = index + dir;
    if (target < 0 || target >= routines.length) return;
    const copy = [...routines];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    onReorderRoutines(copy);
  };

  // Calculations for summary
  const stats = routines.map((r) => ({ r, s: statRoutine(r, period) }));
  const totalSc = stats.reduce((acc, curr) => acc + curr.s.sc, 0);
  const totalDn = stats.reduce((acc, curr) => acc + curr.s.dn, 0);
  const totalPct = totalSc > 0 ? Math.round((totalDn / totalSc) * 100) : null;

  const filteredStats = stats.filter(({ r }) => {
    if (!search.trim()) return true;
    return r.name.toLowerCase().includes(search.trim().toLowerCase());
  });

  return (
    <div id="pR">
      <div
        className="addbar"
        onClick={() => setIsAddOpen(!isAddOpen)}
        role="button"
        tabIndex={0}
      >
        <button
          type="button"
          className={`plus ${isAddOpen ? 'on' : ''}`}
          aria-expanded={isAddOpen}
          aria-label={t('إضافة روتين', lang)}
        >
          <Icon name="i:plus" size="24px" />
        </button>
        <span>{t('إضافة روتين', lang)}</span>
      </div>

      <div className={`collapsible-drawer ${isAddOpen ? 'open' : ''}`}>
        <div className="collapsible-drawer-inner">
          <form className="add open" onSubmit={handleAdd}>
            <div className="row">
              <IconPicker
                selectedIcon={icon}
                onSelectIcon={setIcon}
                lang={lang}
              />
              <input
                className="name"
                placeholder={t('اسم الروتين (مثلًا: رياضة)', lang)}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="chips">
                <div className={`seg ${mode === 'M' ? 'm' : ''}`}>
                  <span className="ind" />
                  <button
                    type="button"
                    className={`chip ${mode === 'W' ? 'on' : ''}`}
                    onClick={() => setMode('W')}
                  >
                    {t('كل أسبوع', lang)}
                  </button>
                  <button
                    type="button"
                    className={`chip ${mode === 'M' ? 'on' : ''}`}
                    onClick={() => setMode('M')}
                  >
                    {t('كل شهر', lang)}
                  </button>
                </div>
                <div className="pane in" style={{ flex: '1 1 100%' }}>
                  {mode === 'W' ? (
                    <div className="dgrid g4">
                      <button
                        type="button"
                        className={`chip ${selDays.length === 7 ? 'on' : ''}`}
                        onClick={toggleAllDays}
                      >
                        {t('كل يوم', lang)}
                      </button>
                      {ORDER.map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`chip ${selDays.includes(d) ? 'on' : ''}`}
                          onClick={() => toggleDay(d)}
                        >
                          {getDayName(d, lang)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="dgrid g7">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={`chip ${selMD.includes(n) ? 'on' : ''}`}
                          onClick={() => toggleMonthDay(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" id="rAdd">
                <Icon name="i:check" size="16px" />
                <span>{t('إضافة روتين', lang)}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <input
        id="qR"
        type="search"
        autoComplete="off"
        placeholder={t('بحث في الروتينات…', lang)}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', margin: '0 0 12px' }}
      />

      <div className="tabs main">
        <button
          type="button"
          id="sW"
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
          id="sM"
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

      <div className="task" id="sumBox" style={{ display: 'block' }}>
        <div className="sub">
          {t('نسبة إنجازك', lang)}{' '}
          {period === 'M'
            ? t('خلال الشهر', lang)
            : t('خلال الأسبوع', lang)}
        </div>
        <div className="big" style={{ color: col(totalPct) }}>
          {totalPct === null ? '—' : `${totalPct}%`}
        </div>
        <div className="bar">
          <div
            className="fill"
            style={{
              width: `${totalPct || 0}%`,
              background: col(totalPct),
            }}
          />
        </div>
        <div className="sub">
          {totalDn} {t('من', lang)} {totalSc} {t('مرة تم إنجازها', lang)}
        </div>
      </div>

      <div id="rList">
        {routines.length > 0 && (
          <div
            className="head"
            style={{ margin: '4px 2px 8px', justifyContent: 'space-between' }}
          >
            <b>{t('جميع الروتينات', lang)}</b>
            <button
              type="button"
              className="del"
              style={{ fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setIsReorderMode(!isReorderMode)}
            >
              <Icon name={isReorderMode ? 'i:check' : 'i:swap'} size="14px" />
              <span>{isReorderMode ? t('تم', lang) : t('ترتيب', lang)}</span>
            </button>
          </div>
        )}

        {search && filteredStats.length === 0 ? (
          <div className="empty">{t('لا توجد نتائج مطابقة', lang)}</div>
        ) : (
          filteredStats.map(({ r, s }, index) => {
            const daysLabel = schedTxt(r, lang);
            return (
              <div key={r.id} className="task">
                <div className="head">
                  <span
                    className="name-t"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Icon name={r.icon || 'i:repeat'} />
                    <span>{r.name}</span>
                  </span>
                  <span>
                    {isReorderMode ? (
                      <span style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="del"
                          style={{ padding: '2px 8px' }}
                          disabled={index === 0}
                          onClick={() => moveRoutine(index, -1)}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="del"
                          style={{ padding: '2px 8px' }}
                          disabled={index === routines.length - 1}
                          onClick={() => moveRoutine(index, 1)}
                        >
                          ↓
                        </button>
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="del dots"
                          onClick={() => onOpenEdit(r)}
                          aria-label={t('تعديل', lang)}
                        >
                          <Icon name="i:dots" size="20px" />
                        </button>
                        <button
                          type="button"
                          className="del"
                          onClick={() => onDeleteRoutine(r)}
                          aria-label={t('حذف', lang)}
                        >
                          <Icon name="i:x" />
                        </button>
                      </>
                    )}
                  </span>
                </div>

                <div className="sub">{daysLabel}</div>

                <div className="wk">
                  {ORDER.map((dw, i) => {
                    const d = wkStart();
                    d.setDate(d.getDate() + i);
                    const kk = key(d);
                    const isDueOnDay = due(r, d);
                    const isLogged = !!r.log[kk];
                    return (
                      <button
                        key={dw}
                        type="button"
                        className={`sq ${isLogged ? 'on' : ''} ${
                          isDueOnDay ? '' : 'off'
                        } ${kk === kToday ? 'tdy' : ''}`}
                        disabled={!isDueOnDay}
                        onClick={() => {
                          if (isDueOnDay) onTickDate(r.id, kk);
                        }}
                        aria-label={getDayName(dw, lang)}
                      >
                        <span>{getDayName(dw, lang)}</span>
                        <b>{isLogged ? <Icon name="i:check" size="14px" /> : d.getDate()}</b>
                      </button>
                    );
                  })}
                </div>

                <div className="bar">
                  <div
                    className="fill"
                    style={{
                      width: `${s.p || 0}%`,
                      background: col(s.p),
                    }}
                  />
                </div>

                <div className="meta">
                  <span>
                    {s.dn} / {s.sc}
                  </span>
                  <span style={{ color: col(s.p), fontWeight: 600 }}>
                    {s.p === null ? '—' : `${s.p}%`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
