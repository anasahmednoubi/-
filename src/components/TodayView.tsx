import React, { useId } from 'react';
import { Task, Routine, PbStyleType, TabType } from '../types';
import { t } from '../translations';
import { Icon } from '../icons';
import { key, today, due, pct, col } from '../utils';

interface TodayViewProps {
  tasks: Task[];
  routines: Routine[];
  pbStyle: PbStyleType;
  onSelectTab: (tab: TabType) => void;
  onTickRoutine: (id: number) => void;
  onDoneTask: (task: Task) => void;
  onOpenEditTask: (task: Task) => void;
  onOpenEditRoutine: (routine: Routine) => void;
  lang: 'ar' | 'en';
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  routines,
  pbStyle,
  onSelectTab,
  onTickRoutine,
  onDoneTask,
  onOpenEditTask,
  onOpenEditRoutine,
  lang,
}) => {
  const k = key(today());
  const rs = routines.filter((r) => due(r, today()));
  const ts = tasks.filter((task) => !task.finished || task.fin === k);
  const left =
    rs.filter((r) => !r.log[k]).length +
    ts.filter((task) => !(task.finished || task.dk === k)).length;
  const total = rs.length + ts.length;
  const isAllEmpty = tasks.length === 0 && routines.length === 0;

  return (
    <div id="pD">
      <div className="task" id="dSum">
        {isAllEmpty ? (
          <div style={{ textAlign: 'center', padding: '18px 8px 8px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                margin: '0 auto 14px',
                borderRadius: '50%',
                background: 'var(--accbg)',
                color: 'var(--acc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
                <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
              </svg>
            </div>
            <b style={{ fontSize: '20px', display: 'block' }}>
              {t('ابدأ رحلة إنجازاتك اليوم', lang)}
            </b>
            <div
              className="sub"
              style={{
                margin: '10px auto 0',
                maxWidth: '320px',
                lineHeight: 1.8,
              }}
            >
              {t(
                'الخطوات الصغيرة كل يوم تصنع الفرق الكبير. أضف أول مهمة أو روتين وابدأ تتبّع تقدمك.',
                lang
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                style={{ flex: 1 }}
                onClick={() => onSelectTab('T')}
              >
                {t('إضافة مهمة', lang)}
              </button>
              <button
                type="button"
                className="ghost"
                style={{ flex: 1 }}
                onClick={() => onSelectTab('R')}
              >
                {t('إضافة روتين', lang)}
              </button>
            </div>
          </div>
        ) : total === 0 ? (
          <div className="sub">
            {t('لا شيء مطلوب اليوم. أضف مهامًا أو روتينًا.', lang)}
          </div>
        ) : (
          <TodayProgressCard
            left={left}
            total={total}
            pbStyle={pbStyle}
            lang={lang}
          />
        )}
      </div>

      {!isAllEmpty && (
        <>
          <div className="task" id="dR">
            <div className="head" style={{ marginBottom: '8px' }}>
              <b>{t('روتين اليوم', lang)}</b>
            </div>
            {rs.length === 0 ? (
              <div className="sub" style={{ marginTop: '8px' }}>
                {t('لا يوجد روتين اليوم.', lang)}
              </div>
            ) : (
              rs.map((r) => {
                const isChecked = !!r.log[k];
                return (
                  <div key={r.id} className="chk">
                    <button
                      type="button"
                      className={`ck ${isChecked ? 'on' : ''}`}
                      onClick={() => onTickRoutine(r.id)}
                      aria-label={t('تم', lang)}
                    >
                      {isChecked && <Icon name="i:check" size="16px" />}
                    </button>
                    <span className={isChecked ? 'str' : ''} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name={r.icon || 'i:repeat'} />
                      <span>{r.name}</span>
                    </span>
                    <button
                      type="button"
                      className="del dots"
                      style={{ marginInlineStart: 'auto' }}
                      onClick={() => onOpenEditRoutine(r)}
                      aria-label={t('تعديل', lang)}
                    >
                      <Icon name="i:dots" size="20px" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="task" id="dT">
            <b>{t('المهام', lang)}</b>
            {ts.length === 0 ? (
              <div className="sub" style={{ marginTop: '8px' }}>
                {t('لا توجد مهام معلقة.', lang)}
              </div>
            ) : (
              ts.map((task) => {
                const p = pct(task);
                const isTaskDone = task.finished || task.dk === k;
                return (
                  <div key={task.id} style={{ marginTop: '12px' }}>
                    <div className="head">
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <button
                          type="button"
                          className={`ck ${isTaskDone ? 'on' : ''}`}
                          onClick={() => onDoneTask(task)}
                          aria-label={t('تم', lang)}
                        >
                          {isTaskDone && <Icon name="i:check" size="16px" />}
                        </button>
                        <span
                          className={isTaskDone ? 'str' : ''}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <Icon name={task.icon || 'i:pin'} />
                          <span>{task.name}</span>
                        </span>
                        <button
                          type="button"
                          className="del dots"
                          onClick={() => onOpenEditTask(task)}
                          aria-label={t('تعديل', lang)}
                        >
                          <Icon name="i:dots" size="20px" />
                        </button>
                      </span>
                      <span style={{ color: col(p), fontWeight: 600 }}>
                        {p}%
                      </span>
                    </div>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${p}%`,
                          background: col(p),
                        }}
                      />
                    </div>
                    <div className="sub">
                      {t('أنجزت', lang)} {task.done} {t('من', lang)} {task.target}{' '}
                      {task.unit}
                      {task.dk === k && ` (+${task.dadd} ${t('اليوم', lang)})`}
                    </div>
                    {task.dk === k && (
                      <div className="result" style={{ marginTop: '8px' }}>
                        {t('النسبة النهائية بعد إنجاز اليوم:', lang)} {p}%
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

const TodayProgressCard: React.FC<{
  left: number;
  total: number;
  pbStyle: PbStyleType;
  lang: 'ar' | 'en';
}> = ({ left, total, pbStyle, lang }) => {
  const gradientId = useId().replace(/:/g, '_');
  const done = total - left;
  const pcf = total > 0 ? (done / total) * 100 : 0;
  const pc = Math.round(pcf);
  const H = Math.round(pcf * 1.25);
  const fin = left === 0;

  const c1 = `hsl(${H}, 82%, 60%)`;
  const c2 = `hsl(${H}, 74%, 42%)`;
  const glow = `hsla(${H}, 80%, 50%, 0.38)`;
  const tint = `hsla(${H}, 80%, 50%, 0.15)`;

  const C = 2 * Math.PI * 62;

  const mid = fin ? (
    <>
      <div style={{ fontSize: '30px', lineHeight: 1, color: c2 }}>
        <Icon name="i:sparkles" size="30px" />
      </div>
      <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '6px' }}>
        {t('أنجزت كل شيء', lang)}
      </div>
    </>
  ) : (
    <>
      <div
        style={{
          fontSize: '46px',
          fontWeight: 800,
          lineHeight: 1,
          color: c2,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {left}
      </div>
      <div className="sub" style={{ fontSize: '12px', marginTop: '2px' }}>
        {t('المتبقي من', lang)} {total}
      </div>
    </>
  );

  const big = (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}
    >
      {fin ? (
        <span
          style={{
            fontWeight: 700,
            color: c2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Icon name="i:sparkles" size="18px" /> {t('أنجزت كل شيء', lang)}
        </span>
      ) : (
        <>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 800,
              lineHeight: 1,
              color: c2,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {left}
          </span>
          <span className="sub">
            {t('المتبقي من', lang)} {total}
          </span>
        </>
      )}
    </div>
  );

  let inner = null;
  if (pbStyle === 'gauge' || pbStyle === 'ring') {
    const isGauge = pbStyle === 'gauge';
    const L = isGauge ? C * 0.75 : C;
    const pl = (L * pcf) / 100;
    inner = (
      <div
        style={{
          position: 'relative',
          width: '168px',
          height: isGauge ? '148px' : '168px',
          margin: '0 auto',
        }}
      >
        <svg
          width="168"
          height="168"
          viewBox="0 0 150 150"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `rotate(${isGauge ? 135 : -90}deg)`,
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={c1} />
              <stop offset="1" stopColor={c2} />
            </linearGradient>
          </defs>
          <circle
            cx="75"
            cy="75"
            r="62"
            fill="none"
            stroke="var(--track)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${L} ${C}`}
          />
          <circle
            cx="75"
            cy="75"
            r="62"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="13"
            strokeLinecap={pc > 0 ? 'round' : 'butt'}
            strokeDasharray={`${pl} ${C}`}
            style={{
              transition: 'stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 5px ${glow})`,
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '168px',
            height: '168px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mid}
        </div>
      </div>
    );
  } else if (pbStyle === 'half') {
    const Hh = Math.PI * 72;
    const pl = (Hh * pcf) / 100;
    inner = (
      <div
        style={{
          position: 'relative',
          width: '190px',
          height: '112px',
          margin: '0 auto',
        }}
      >
        <svg
          width="190"
          height="112"
          viewBox="0 0 170 100"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={c1} />
              <stop offset="1" stopColor={c2} />
            </linearGradient>
          </defs>
          <path
            d="M13 88A72 72 0 0 1 157 88"
            fill="none"
            stroke="var(--track)"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M13 88A72 72 0 0 1 157 88"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="13"
            strokeLinecap={pc > 0 ? 'round' : 'butt'}
            strokeDasharray={`${pl} ${Hh}`}
            style={{
              transition: 'stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 5px ${glow})`,
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {mid}
        </div>
      </div>
    );
  } else if (pbStyle === 'bar') {
    inner = (
      <>
        {big}
        <div
          style={{
            height: '14px',
            borderRadius: '99px',
            background: 'var(--track)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pcf.toFixed(2)}%`,
              background: `linear-gradient(90deg, ${c1}, ${c2})`,
              borderRadius: '99px',
              boxShadow: `0 0 10px ${glow}`,
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      </>
    );
  } else {
    // segments
    const count = Math.min(total, 24);
    const pf = (pcf / 100) * count;
    inner = (
      <>
        {big}
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: count }, (_, i) => {
            const w = Math.max(0, Math.min(1, pf - i));
            return (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: '14px',
                  borderRadius: '5px',
                  background: 'var(--track)',
                  overflow: 'hidden',
                  display: 'block',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: `${(w * 100).toFixed(1)}%`,
                    height: '100%',
                    borderRadius: '5px',
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                  }}
                />
              </span>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: 0,
          }}
        >
          <span
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--accbg)',
              color: 'var(--acc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon name="i:activity" size="18px" />
          </span>
          <b style={{ fontSize: '15px' }}>{t('إنجازك اليوم', lang)}</b>
        </div>
        <span
          style={{
            flex: 'none',
            padding: '5px 12px',
            borderRadius: '999px',
            background: tint,
            color: c2,
            fontWeight: 700,
            fontSize: '14px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {pc}%
        </span>
      </div>

      {inner}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: c2,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {done}
          </div>
          <div className="sub" style={{ fontSize: '12px', marginTop: '2px' }}>
            {t('المنجز', lang)}
          </div>
        </div>
        <span
          style={{
            width: '1px',
            height: '28px',
            background: 'var(--line)',
            flex: 'none',
          }}
        />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {left}
          </div>
          <div className="sub" style={{ fontSize: '12px', marginTop: '2px' }}>
            {t('المتبقي', lang)}
          </div>
        </div>
        <span
          style={{
            width: '1px',
            height: '28px',
            background: 'var(--line)',
            flex: 'none',
          }}
        />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {total}
          </div>
          <div className="sub" style={{ fontSize: '12px', marginTop: '2px' }}>
            {t('الإجمالي', lang)}
          </div>
        </div>
      </div>
    </div>
  );
};
