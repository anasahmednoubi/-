import React, { useState } from 'react';
import { TabType } from '../types';
import { t } from '../translations';
import { Icon } from '../icons';

interface TourModalProps {
  currentTab: TabType;
  lang: 'ar' | 'en';
  onGotIt: () => void;
  onSkip: () => void;
}

const TA: Record<string, [string, string, string, string[]]> = {
  D: [
    'i:calendar',
    'تبويب اليوم',
    'يومك كله في مكان واحد.',
    [
      'دائرة تبيّن المتبقي لك اليوم ونسبة إنجازك',
      'روتين اليوم: علّم على كل عادة بمجرد إنجازها',
      'مهام اليوم: سجّل كمية ما أنجزته من كل مهمة',
      'اسحب يمينًا أو يسارًا للتنقل بين التبويبات',
    ],
  ],
  T: [
    'i:check',
    'تبويب المهام',
    'للأهداف التي لها كمية، مثل مذاكرة 20 صفحة.',
    [
      'اضغط زر + لإضافة مهمة: اختر أيقونة ثم اكتب الاسم والكمية والوحدة',
      'سجّل ما أنجزته كل يوم وتابع شريط التقدم والنسبة',
      'أنهِ المهمة عند اكتمالها، أو عدّلها أو احذفها من زر النقاط الثلاث',
      'زر ترتيب يتيح لك سحب المهام لإعادة ترتيبها',
    ],
  ],
  R: [
    'i:repeat',
    'تبويب الروتين',
    'للعادات المتكررة، مثل الرياضة كل يوم.',
    [
      'أضف روتينًا واختر أيامه: أيام الأسبوع أو أيام محددة من الشهر',
      'علّم كل يوم في جدول الأسبوع عند إنجازه',
      'بدّل بين عرض الأسبوع والشهر لمتابعة التزامك',
    ],
  ],
  S: [
    'i:chart',
    'تبويب الإحصائيات',
    'تابع تقدمك مع الوقت.',
    [
      'نسبة إنجازك الكلي خلال الأسبوع أو الشهر',
      'رسم بياني يومي لنشاطك',
      'تفاصيل المهام: المغلقة وما عملت عليه ومتوسط الإنجاز',
      'تفاصيل كل روتين مع الأفضل والأضعف، واضغط على أي روتين لتشاهد تقويمه',
    ],
  ],
  H: [
    'i:dots',
    'زر المزيد',
    'الدائرة في أسفل الشاشة تفتح حسابك وإعداداتك.',
    [
      'اسمك وملخص بياناتك',
      'الخط وحجمه',
      'المظهر (فاتح أو داكن أو تلقائي) واللغة',
      'مسح البيانات، وإعادة هذه الجولة في أي وقت',
    ],
  ],
};

const TE: Record<string, [string, string, string[]]> = {
  D: [
    'Today tab',
    'Your whole day in one place.',
    [
      "A ring showing what's left for today and your completion rate",
      'Today\'s routine: tick each habit as you finish it',
      'Today\'s tasks: log how much you did on each task',
      'Swipe left or right to switch between tabs',
    ],
  ],
  T: [
    'Tasks tab',
    'For goals with an amount, like studying 20 pages.',
    [
      'Tap + to add a task: pick an icon, then enter the name, quantity and unit',
      'Log what you did each day and follow the progress bar and percentage',
      'Finish a task when it\'s complete, or edit or delete it from the three-dot button',
      'The Reorder button lets you drag tasks into your preferred order',
    ],
  ],
  R: [
    'Routine tab',
    'For repeating habits, like exercising every day.',
    [
      'Add a routine and choose its days: weekdays or specific days of the month',
      'Tick each day on the weekly grid when you complete it',
      'Switch between week and month views to track your consistency',
    ],
  ],
  S: [
    'Stats tab',
    'Follow your progress over time.',
    [
      'Your overall completion rate for the week or month',
      'A daily chart of your activity',
      'Task details: closed tasks, tasks you worked on and average completion',
      'Details for each routine with best and weakest; tap any routine to see its calendar',
    ],
  ],
  H: [
    'Home button',
    'The round button at the bottom opens your account and settings.',
    [
      'Your name and data summary',
      'Font and font size',
      'Appearance (light, dark, auto) and language',
      'Erase data, and replay this tutorial any time',
    ],
  ],
};

export const TourModal: React.FC<TourModalProps> = ({
  currentTab,
  lang,
  onGotIt,
  onSkip,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const arabic = TA[currentTab];
  const english = TE[currentTab];
  if (!arabic) return null;

  const isEn = lang === 'en';
  const icon = arabic[0];
  const title = isEn ? english[0] : arabic[1];
  const subtitle = isEn ? english[1] : arabic[2];
  const points = isEn ? english[2] : arabic[3];

  const handleGotIt = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onGotIt();
      setIsExiting(false);
    }, 240);
  };

  const handleSkip = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onSkip();
      setIsExiting(false);
    }, 240);
  };

  return (
    <div
      id="tour"
      className={isExiting ? 'tour-exit' : 'tour-enter'}
      style={{
        position: 'fixed',
        zIndex: 90,
        left: '12px',
        right: '12px',
        margin: '0 auto',
        maxWidth: '536px',
        bottom: 'calc(84px + env(safe-area-inset-bottom, 0px))',
        maxHeight: '60%',
        overflowY: 'auto',
        background: 'var(--card)',
        color: 'var(--text)',
        border: '1.5px solid var(--acc)',
        borderRadius: '18px',
        padding: '14px 16px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--accbg)',
            color: 'var(--acc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon name={icon} size="20px" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '17px', fontWeight: 700 }}>{title}</div>
          <div className="sub">{subtitle}</div>
        </div>
      </div>
      <div>
        {points.map((pt, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              marginTop: '8px',
              fontSize: '14px',
            }}
          >
            <span
              style={{
                color: 'var(--acc)',
                flex: 'none',
                marginTop: '2px',
                display: 'inline-flex',
              }}
            >
              <Icon name="i:check" size="15px" />
            </span>
            <span>{pt}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginTop: '12px',
        }}
      >
        <button type="button" className="ghost" onClick={handleSkip}>
          {t('تخطي الجولة', lang)}
        </button>
        <span style={{ flex: 1 }} />
        <button type="button" onClick={handleGotIt}>
          {t('فهمت', lang)}
        </button>
      </div>
    </div>
  );
};
