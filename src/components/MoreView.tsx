import React, { useState } from 'react';
import {
  UserProfile,
  FontConfig,
  ThemeType,
  TabPosType,
  PbStyleType,
  ToneType,
  AccountLinks,
} from '../types';
import { t } from '../translations';
import { Icon } from '../icons';
import { playTone } from '../audio';
import {
  signInWithGoogle,
  logOutFromGoogle,
  signInWithFacebook,
  logOutFromFacebook,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordReset,
} from '../firebase';

interface MoreViewProps {
  tasksCount: number;
  routinesCount: number;
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  fontConfig: FontConfig;
  onUpdateFont: (f: FontConfig) => void;
  theme: ThemeType;
  onChangeTheme: (th: ThemeType) => void;
  accentColor: string;
  onChangeAccentColor: (c: string) => void;
  pbStyle: PbStyleType;
  onChangePbStyle: (s: PbStyleType) => void;
  tabPos: TabPosType;
  onChangeTabPos: (p: TabPosType) => void;
  notifEnabled: boolean;
  onToggleNotif: () => void;
  tones: { n: ToneType; t: ToneType; r: ToneType };
  onChangeTone: (type: 'n' | 't' | 'r', tone: ToneType) => void;
  accountLinks: AccountLinks;
  onUpdateLinks: (links: AccountLinks) => void;
  lang: 'ar' | 'en';
  onChangeLang: (l: 'ar' | 'en') => void;
  onReplayTour: () => void;
  onAskWipe: () => void;
}

export const ACCENT_PALETTE: [string, string][] = [
  ['#7c3aed', 'بنفسجي'],
  ['#2563eb', 'أزرق'],
  ['#0d9488', 'تركواز'],
  ['#16a34a', 'أخضر'],
  ['#c2410c', 'برتقالي'],
  ['#dc2626', 'أحمر'],
  ['#db2777', 'وردي'],
  ['#475569', 'رمادي'],
];

export const PB_STYLES: [PbStyleType, string][] = [
  ['gauge', 'مقياس دائري'],
  ['ring', 'دائرة كاملة'],
  ['half', 'نصف دائرة'],
  ['bar', 'شريط أفقي'],
  ['segments', 'شرائح'],
];

export const TAB_POSITIONS: [TabPosType, string][] = [
  ['bottom', 'أسفل الشاشة'],
  ['top', 'أعلى الشاشة'],
];

export const TONES_LIST: [ToneType, string][] = [
  ['chime', 'رنين'],
  ['bell', 'جرس'],
  ['pop', 'فقاعة'],
  ['melody', 'لحن'],
  ['beep', 'تنبيه'],
  ['off', 'بدون'],
];

export const FONT_GROUPS: [string, string[]][] = [
  [
    'خطوط عربية',
    [
      'Cairo',
      'Tajawal',
      'Almarai',
      'Noto Naskh Arabic',
      'Noto Kufi Arabic',
      'Noto Sans Arabic',
      'IBM Plex Sans Arabic',
      'Amiri',
      'Changa',
      'El Messiri',
      'Harmattan',
      'Lateef',
      'Markazi Text',
      'Mada',
      'Mirza',
      'Reem Kufi',
      'Scheherazade New',
      'Aref Ruqaa',
      'Rakkas',
      'Lalezar',
      'Katibeh',
      'Jomhuria',
      'Readex Pro',
      'Baloo Bhaijaan 2',
      'Lemonada',
      'Kufam',
      'Alexandria',
      'Zain',
      'Vazirmatn',
      'Rubik',
      'Marhey',
      'Vibes',
      'Gulzar',
      'Playpen Sans Arabic',
    ],
  ],
  [
    'خطوط لاتينية',
    [
      'Inter',
      'Roboto',
      'Open Sans',
      'Lato',
      'Poppins',
      'Montserrat',
      'Nunito',
      'Source Sans 3',
      'Ubuntu',
      'Raleway',
      'Fira Sans',
      'Quicksand',
      'Work Sans',
      'DM Sans',
      'Noto Sans',
      'Comfortaa',
      'Merriweather',
      'Playfair Display',
      'Lora',
      'Noto Serif',
      'Oswald',
      'Caveat',
      'Pacifico',
    ],
  ],
];

export const FONT_SIZES: [number, string][] = [
  [0.8, 'صغير جدًا'],
  [0.9, 'صغير'],
  [1.0, 'متوسط'],
  [1.15, 'كبير'],
  [1.3, 'كبير جدًا'],
  [1.5, 'ضخم'],
];

type SubPage =
  | 'font'
  | 'theme'
  | 'notif'
  | 'link'
  | 'linkG'
  | 'linkF'
  | 'lang'
  | null;

export const MoreView: React.FC<MoreViewProps> = ({
  tasksCount,
  routinesCount,
  profile,
  onUpdateProfile,
  fontConfig,
  onUpdateFont,
  theme,
  onChangeTheme,
  accentColor,
  onChangeAccentColor,
  pbStyle,
  onChangePbStyle,
  tabPos,
  onChangeTabPos,
  notifEnabled,
  onToggleNotif,
  tones,
  onChangeTone,
  accountLinks,
  onUpdateLinks,
  lang,
  onChangeLang,
  onReplayTour,
  onAskWipe,
}) => {
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [googleEmailInput, setGoogleEmailInput] = useState(accountLinks.g || '');
  const [facebookNameInput, setFacebookNameInput] = useState(
    accountLinks.f || ''
  );
  const [linkError, setLinkError] = useState('');
  const [connectingFacebook, setConnectingFacebook] = useState(false);
  const [facebookLinkError, setFacebookLinkError] = useState('');
  const [showFbGuide, setShowFbGuide] = useState(false);
  const [showFbManual, setShowFbManual] = useState(false);

  const [authMode, setAuthMode] = useState<'in' | 'up'>('in');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [authErr, setAuthErr] = useState('');
  const [authInfo, setAuthInfo] = useState('');

  const getAuthErrorMsg = (code?: string, rawErr?: any) => {
    const m: Record<string, string> = {
      'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
      'auth/wrong-password': 'كلمة المرور غير صحيحة.',
      'auth/user-not-found': 'لا يوجد حساب مسجّل بهذا البريد. اضغط على "حساب جديد" لإنشائه.',
      'auth/email-already-in-use':
        'هذا البريد مسجّل بالفعل، اضغط على "تسجيل الدخول" بدلًا من ذلك.',
      'auth/weak-password': 'كلمة المرور ضعيفة (يجب ألا تقل عن 6 أحرف أو أرقام).',
      'auth/invalid-email': 'اكتب بريدًا إلكترونيًا صحيحًا.',
      'auth/network-request-failed': 'تعذر الاتصال بالإنترنت، يرجى التحقق من اتصال هاتفك.',
      'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول قبل إتمامها.',
      'auth/popup-blocked': 'تم حظر النافذة المنبثقة من قبل المتصفح أو التطبيق.',
      'auth/too-many-requests': 'محاولات كثيرة خاطئة، يرجى الانتظار دقيقة والمحاولة ثانية.',
      'auth/operation-not-allowed':
        'تسجيل الدخول بالبريد الإلكتروني غير مفعّل في لوحة Firebase Console (Authentication > Sign-in method > Email/Password > Enable).',
      'auth/unauthorized-domain':
        'هذا النطاق غير مصرح به في Firebase Console (Authentication > Settings > Authorized domains).',
      'auth/disallowed_useragent':
        'تسجيل الدخول بجوجل عبر النوافذ المنبثقة غير مدعوم داخل المتصفح الداخلي. يرجى إنشاء حساب بالبريد الإلكتروني أو التأكد من إعداد Google Services للتطبيق.',
      '10':
        'فشل تسجيل الدخول بجوجل (كود 10 Developer Error): يرجى التأكد من إضافة بصمة SHA-1 واسم الحزمة com.enjazati.app في لوحة تحكم Firebase.',
      '12500':
        'فشل تسجيل الدخول بجوجل (كود 12500): يرجى التأكد من إضافة تطبيق أندرويد وبصمة SHA-1 في Firebase.',
    };
    if (code && m[code]) {
      return t(m[code], lang);
    }
    if (rawErr?.message && typeof rawErr.message === 'string') {
      if (rawErr.message.includes('disallowed_useragent')) {
        return t(m['auth/disallowed_useragent'], lang);
      }
      if (rawErr.message.includes('10:') || rawErr.message.includes('DEVELOPER_ERROR')) {
        return t(m['10'], lang);
      }
    }
    const fallback = t('تعذر إتمام العملية. حاول مرة أخرى.', lang);
    return code ? `${fallback} (${code})` : (rawErr?.message ? `${fallback} - ${rawErr.message}` : fallback);
  };

  const handleAuthSubmit = async () => {
    if (authBusy) return;
    const e = authEmail.trim();
    const p = authPassword;
    if (!/^\S+@\S+\.\S+$/.test(e)) {
      setAuthErr(t('اكتب بريدًا إلكترونيًا صحيحًا.', lang));
      return;
    }
    if (p.length < 6) {
      setAuthErr(t('كلمة المرور 6 أحرف على الأقل.', lang));
      return;
    }
    setAuthBusy(true);
    setAuthErr('');
    setAuthInfo('');
    try {
      let user;
      if (authMode === 'up') {
        user = await signUpWithEmail(e, p, authName.trim());
      } else {
        user = await signInWithEmail(e, p);
      }
      if (user) {
        onUpdateLinks({ ...accountLinks, g: user.email || e });
        if (user.displayName && (!profile.name || profile.name === 'اسمك')) {
          onUpdateProfile({ ...profile, name: user.displayName });
        }
        setAuthPassword('');
      }
    } catch (err: any) {
      setAuthErr(getAuthErrorMsg(err?.code, err));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (authBusy) return;
    setAuthBusy(true);
    setAuthErr('');
    setAuthInfo('');
    try {
      const user = await signInWithGoogle();
      if (user && user.email) {
        onUpdateLinks({ ...accountLinks, g: user.email });
        if (user.displayName && (!profile.name || profile.name === 'اسمك')) {
          onUpdateProfile({ ...profile, name: user.displayName });
        }
      }
    } catch (err: any) {
      if (
        err.code !== 'auth/popup-closed-by-user' &&
        err.code !== 'auth/cancelled-popup-request'
      ) {
        setAuthErr(getAuthErrorMsg(err?.code, err));
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleResetPassword = async () => {
    const e = authEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(e)) {
      setAuthErr(t('اكتب بريدًا إلكترونيًا صحيحًا.', lang));
      return;
    }
    try {
      await sendPasswordReset(e);
      setAuthErr('');
      setAuthInfo(t('أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك.', lang));
    } catch (err: any) {
      setAuthErr(getAuthErrorMsg(err?.code));
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const arrowAngle = lang === 'en' ? -90 : 90;

  // Subpage header
  if (subPage) {
    const titles: Record<string, string> = {
      font: 'الخط',
      theme: 'المظهر',
      notif: 'الإشعارات',
      link: 'ربط',
      linkG: 'ربط الحساب بجوجل',
      linkF: 'ربط الحساب بفيسبوك',
      lang: 'اللغة',
    };

    const handleBack = () => {
      if (subPage === 'linkG' || subPage === 'linkF') {
        setSubPage('link');
      } else {
        setSubPage(null);
      }
    };

    return (
      <div id="pH" className="sfw">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 0 12px',
          }}
        >
          <button
            type="button"
            className="del"
            onClick={handleBack}
            aria-label={t('رجوع', lang)}
          >
            <span
              style={{
                display: 'inline-flex',
                transform: `rotate(${-arrowAngle}deg)`,
              }}
            >
              <Icon name="i:chevdown" size="16px" />
            </span>
          </button>
          <b style={{ fontSize: '18px' }}>{t(titles[subPage] || '', lang)}</b>
        </div>

        {subPage === 'font' && (
          <div className="task" id="fontCard">
            <div className="sub" style={{ margin: '0 0 8px' }}>
              {t('شكل الخط', lang)}
            </div>
            <button
              type="button"
              className="fdd"
              onClick={() => toggleDropdown('fontFamily')}
            >
              <span
                style={
                  fontConfig.f
                    ? { fontFamily: `'${fontConfig.f}', sans-serif` }
                    : undefined
                }
              >
                {fontConfig.f || t('الافتراضي', lang)}
              </span>
              <Icon
                name="i:chevdown"
                size="14px"
                style={{
                  transform: openDropdown === 'fontFamily' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.25s ease',
                }}
              />
            </button>
            <div className={`dropdown-drawer ${openDropdown === 'fontFamily' ? 'open' : ''}`}>
              <div className="dropdown-drawer-inner">
                <div className="fpanel">
                  <button
                    type="button"
                    className={`fi ${!fontConfig.f ? 'on' : ''}`}
                    onClick={() => {
                      onUpdateFont({ ...fontConfig, f: '' });
                      setOpenDropdown(null);
                    }}
                  >
                    <span>{t('الافتراضي', lang)}</span>
                  </button>
                  {FONT_GROUPS.map(([groupName, fonts], gi) => (
                    <React.Fragment key={groupName}>
                      <div className="fg">{t(groupName, lang)}</div>
                      {fonts.map((fName) => (
                        <button
                          key={fName}
                          type="button"
                          className={`fi ${fontConfig.f === fName ? 'on' : ''}`}
                          style={{ fontFamily: `'${fName}', sans-serif` }}
                          onClick={() => {
                            onUpdateFont({ ...fontConfig, f: fName });
                            setOpenDropdown(null);
                          }}
                        >
                          <span>{fName}</span>
                          {gi === 0 && <span dir="rtl">أبجد هوز</span>}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="sub" style={{ margin: '12px 0 8px' }}>
              {t('حجم الخط', lang)}
            </div>
            <button
              type="button"
              className="fdd"
              onClick={() => toggleDropdown('fontSize')}
            >
              <span>
                {t(
                  (FONT_SIZES.find((x) => x[0] === fontConfig.s) ||
                    FONT_SIZES[2])[1],
                  lang
                )}{' '}
                · {Math.round(fontConfig.s * 100)}%
              </span>
              <Icon
                name="i:chevdown"
                size="14px"
                style={{
                  transform: openDropdown === 'fontSize' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.25s ease',
                }}
              />
            </button>
            <div className={`dropdown-drawer ${openDropdown === 'fontSize' ? 'open' : ''}`}>
              <div className="dropdown-drawer-inner">
                <div className="fpanel">
                  {FONT_SIZES.map(([sizeVal, sizeLabel]) => (
                    <button
                      key={sizeVal}
                      type="button"
                      className={`fi ${fontConfig.s === sizeVal ? 'on' : ''}`}
                      onClick={() => {
                        onUpdateFont({ ...fontConfig, s: sizeVal });
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{t(sizeLabel, lang)}</span>
                      <span>{Math.round(sizeVal * 100)}%</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {subPage === 'theme' && (
          <>
            <div className="task">
              <div style={{ display: 'flex', gap: '6px' }}>
                {(
                  [
                    ['auto', 'تلقائي'],
                    ['light', 'فاتح'],
                    ['dark', 'داكن'],
                  ] as [ThemeType, string][]
                ).map(([thVal, thLbl]) => (
                  <button
                    key={thVal}
                    type="button"
                    className={`chip ${theme === thVal ? 'on' : ''}`}
                    style={{ flex: 1 }}
                    onClick={() => onChangeTheme(thVal)}
                  >
                    {t(thLbl, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color picker */}
            <div className="task">
              <b>{t('لون البرنامج', lang)}</b>
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="fdd"
                  onClick={() => toggleDropdown('accent')}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: accentColor,
                        flex: 'none',
                        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.3)',
                      }}
                    />
                    {t(
                      (ACCENT_PALETTE.find((x) => x[0] === accentColor) ||
                        ACCENT_PALETTE[0])[1],
                      lang
                    )}
                  </span>
                  <Icon
                    name="i:chevdown"
                    size="14px"
                    style={{
                      transform: openDropdown === 'accent' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </button>
                <div className={`dropdown-drawer ${openDropdown === 'accent' ? 'open' : ''}`}>
                  <div className="dropdown-drawer-inner">
                    <div className="fpanel">
                      {ACCENT_PALETTE.map(([cVal, cLbl]) => (
                        <button
                          key={cVal}
                          type="button"
                          className={`fi ${accentColor === cVal ? 'on' : ''}`}
                          onClick={() => {
                            onChangeAccentColor(cVal);
                            setOpenDropdown(null);
                          }}
                        >
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <span
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: cVal,
                                flex: 'none',
                              }}
                            />
                            {t(cLbl, lang)}
                          </span>
                          {accentColor === cVal && (
                            <Icon name="i:check" size="16px" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar Style */}
            <div className="task">
              <b>{t('شكل شريط التقدم في صفحة اليوم', lang)}</b>
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="fdd"
                  onClick={() => toggleDropdown('pbStyle')}
                >
                  <span>
                    {t(
                      (PB_STYLES.find((x) => x[0] === pbStyle) ||
                        PB_STYLES[0])[1],
                      lang
                    )}
                  </span>
                  <Icon
                    name="i:chevdown"
                    size="14px"
                    style={{
                      transform: openDropdown === 'pbStyle' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </button>
                <div className={`dropdown-drawer ${openDropdown === 'pbStyle' ? 'open' : ''}`}>
                  <div className="dropdown-drawer-inner">
                    <div className="fpanel">
                      {PB_STYLES.map(([sVal, sLbl]) => (
                        <button
                          key={sVal}
                          type="button"
                          className={`fi ${pbStyle === sVal ? 'on' : ''}`}
                          onClick={() => {
                            onChangePbStyle(sVal);
                            setOpenDropdown(null);
                          }}
                        >
                          <span>{t(sLbl, lang)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Position */}
            <div className="task">
              <b>{t('مكان التبويبات', lang)}</b>
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="fdd"
                  onClick={() => toggleDropdown('tabPos')}
                >
                  <span>
                    {t(
                      (TAB_POSITIONS.find((x) => x[0] === tabPos) ||
                        TAB_POSITIONS[0])[1],
                      lang
                    )}
                  </span>
                  <Icon
                    name="i:chevdown"
                    size="14px"
                    style={{
                      transform: openDropdown === 'tabPos' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </button>
                <div className={`dropdown-drawer ${openDropdown === 'tabPos' ? 'open' : ''}`}>
                  <div className="dropdown-drawer-inner">
                    <div className="fpanel">
                      {TAB_POSITIONS.map(([posVal, posLbl]) => (
                        <button
                          key={posVal}
                          type="button"
                          className={`fi ${tabPos === posVal ? 'on' : ''}`}
                          onClick={() => {
                            onChangeTabPos(posVal);
                            setOpenDropdown(null);
                          }}
                        >
                          <span>{t(posLbl, lang)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {subPage === 'notif' && (
          <>
            <div className="task">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <b>{t('إظهار الإشعارات على الجهاز', lang)}</b>
                <button
                  type="button"
                  className={`swt ${notifEnabled ? 'on' : ''}`}
                  role="switch"
                  aria-checked={notifEnabled}
                  onClick={onToggleNotif}
                >
                  <i />
                </button>
              </div>
            </div>

            {(
              [
                ['n', 'صوت نغمة الإشعارات'],
                ['t', 'نغمة إتمام المهام'],
                ['r', 'نغمة إتمام الروتين'],
              ] as ['n' | 't' | 'r', string][]
            ).map(([typeKey, labelKey]) => (
              <div key={typeKey} className="task">
                <b>{t(labelKey, lang)}</b>
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    className="fdd"
                    onClick={() => toggleDropdown(`tone_${typeKey}`)}
                  >
                    <span>
                      {t(
                        (TONES_LIST.find((x) => x[0] === tones[typeKey]) ||
                          TONES_LIST[0])[1],
                        lang
                      )}
                    </span>
                    <Icon
                      name="i:chevdown"
                      size="14px"
                      style={{
                        transform: openDropdown === `tone_${typeKey}` ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.25s ease',
                      }}
                    />
                  </button>
                  <div className={`dropdown-drawer ${openDropdown === `tone_${typeKey}` ? 'open' : ''}`}>
                    <div className="dropdown-drawer-inner">
                      <div className="fpanel">
                        {TONES_LIST.map(([toneVal, toneLbl]) => (
                          <button
                            key={toneVal}
                            type="button"
                            className={`fi ${tones[typeKey] === toneVal ? 'on' : ''}`}
                            onClick={() => {
                              onChangeTone(typeKey, toneVal);
                              playTone(toneVal);
                              setOpenDropdown(null);
                            }}
                          >
                            <span>{t(toneLbl, lang)}</span>
                            {tones[typeKey] === toneVal && (
                              <Icon name="i:check" size="16px" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ghost"
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      opacity: tones[typeKey] === 'off' ? 0.5 : 1,
                      pointerEvents: tones[typeKey] === 'off' ? 'none' : 'auto',
                    }}
                    onClick={() => playTone(tones[typeKey])}
                  >
                    {t('تجربة الصوت', lang)}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {subPage === 'link' && (
          <div className="task">
            {accountLinks.g ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#fff',
                      color: '#4285f4',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '22px',
                    }}
                  >
                    G
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700 }} dir="auto">
                      {accountLinks.g}
                    </div>
                    <div
                      style={{
                        color: '#16a34a',
                        fontSize: '13px',
                        marginTop: '2px',
                        fontWeight: 600,
                      }}
                    >
                      {t('مرتبط', lang)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="ghost"
                  style={{ width: '100%', marginTop: '14px', color: '#d33' }}
                  onClick={async () => {
                    try {
                      await logOutFromGoogle();
                    } catch (e) {}
                    const copy = { ...accountLinks };
                    delete copy.g;
                    onUpdateLinks(copy);
                  }}
                >
                  {t('تسجيل الخروج', lang)}
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    background: 'var(--card-bg, rgba(0,0,0,0.03))',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '12px',
                    fontSize: '12.5px',
                    lineHeight: '1.5',
                    color: 'var(--mute)',
                  }}
                >
                  💡 {t('التطبيق يعمل بشكل كامل وتلقائي بدون إنترنت ويحفظ كل مهامك وروتيناتك على جهازك. تسجيل الدخول مطلوب فقط لمزامنة البيانات سحابياً.', lang)}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`chip ${authMode === 'in' ? 'on' : ''}`}
                    style={{ flex: 1 }}
                    onClick={() => {
                      setAuthMode('in');
                      setAuthErr('');
                      setAuthInfo('');
                    }}
                  >
                    {t('تسجيل الدخول', lang)}
                  </button>
                  <button
                    type="button"
                    className={`chip ${authMode === 'up' ? 'on' : ''}`}
                    style={{ flex: 1 }}
                    onClick={() => {
                      setAuthMode('up');
                      setAuthErr('');
                      setAuthInfo('');
                    }}
                  >
                    {t('حساب جديد', lang)}
                  </button>
                </div>

                {authMode === 'up' && (
                  <input
                    type="text"
                    dir="auto"
                    autoComplete="name"
                    style={{ width: '100%', marginTop: '10px' }}
                    placeholder={t('الاسم (اختياري)', lang)}
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                )}

                <input
                  type="email"
                  dir="auto"
                  autoComplete="email"
                  style={{ width: '100%', marginTop: '10px' }}
                  placeholder={t('البريد الإلكتروني', lang)}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />

                <input
                  type="password"
                  dir="auto"
                  autoComplete={
                    authMode === 'up' ? 'new-password' : 'current-password'
                  }
                  style={{ width: '100%', marginTop: '10px' }}
                  placeholder={t('كلمة المرور', lang)}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />

                {authErr && (
                  <div
                    style={{
                      color: '#d33',
                      fontSize: '13px',
                      marginTop: '8px',
                      lineHeight: '1.4',
                    }}
                  >
                    {authErr}
                  </div>
                )}

                {authInfo && (
                  <div
                    style={{
                      color: '#16a34a',
                      fontSize: '13px',
                      marginTop: '8px',
                      lineHeight: '1.4',
                    }}
                  >
                    {authInfo}
                  </div>
                )}

                <button
                  type="button"
                  style={{ width: '100%', marginTop: '12px' }}
                  disabled={authBusy}
                  onClick={handleAuthSubmit}
                >
                  {t(
                    authMode === 'up' ? 'إنشاء الحساب' : 'تسجيل الدخول',
                    lang
                  )}
                </button>

                {authMode === 'in' && (
                  <button
                    type="button"
                    className="del"
                    style={{
                      width: '100%',
                      marginTop: '6px',
                      fontSize: '14px',
                    }}
                    onClick={handleResetPassword}
                  >
                    {t('نسيت كلمة المرور؟', lang)}
                  </button>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '12px 0',
                    color: 'var(--mute)',
                    fontSize: '13px',
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      height: '1px',
                      background: 'var(--line)',
                    }}
                  />
                  {t('أو', lang)}
                  <span
                    style={{
                      flex: 1,
                      height: '1px',
                      background: 'var(--line)',
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="ghost"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                  disabled={authBusy}
                  onClick={handleGoogleAuth}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fff',
                      color: '#4285f4',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                    }}
                  >
                    G
                  </span>
                  <span>{t('المتابعة مع جوجل', lang)}</span>
                </button>

                <div className="sub" style={{ marginTop: '10px', fontSize: '12px', lineHeight: '1.4' }}>
                  {t(
                    'ملاحظة: في تطبيق أندرويد المنزّل، يُنصح بإنشاء حساب بالبريد الإلكتروني وكلمة المرور، لأن جوجل تحظر تسجيل الدخول بالنوافذ المنبثقة داخل التطبيقات المستقلة.',
                    lang
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {subPage === 'lang' && (
          <div className="task">
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className={`chip ${lang === 'ar' ? 'on' : ''}`}
                style={{ flex: 1 }}
                onClick={() => onChangeLang('ar')}
              >
                العربية
              </button>
              <button
                type="button"
                className={`chip ${lang === 'en' ? 'on' : ''}`}
                style={{ flex: 1 }}
                onClick={() => onChangeLang('en')}
              >
                English
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main More Page view
  const avatarLetter = (profile.name || '').trim()
    ? Array.from(profile.name.trim())[0]
    : null;

  const linkedList = [accountLinks.g, accountLinks.f].filter(Boolean);

  const row = (
    keyVal: SubPage,
    iconName: string,
    label: string,
    valText: string = ''
  ) => (
    <button
      key={keyVal}
      type="button"
      className="ghost"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        marginTop: '8px',
        padding: '12px 14px',
      }}
      onClick={() => setSubPage(keyVal)}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Icon name={iconName} size="20px" />
        <span>{t(label, lang)}</span>
      </span>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--mute)',
          fontSize: '14px',
        }}
      >
        {valText}
        <span
          style={{
            display: 'inline-flex',
            transform: `rotate(${arrowAngle}deg)`,
          }}
        >
          <Icon name="i:chevdown" size="16px" />
        </span>
      </span>
    </button>
  );

  return (
    <div id="pH">
      {/* Profile Card */}
      <div className="task">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            id="avN"
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'var(--accbg)',
              color: 'var(--acc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 700,
              flex: 'none',
            }}
          >
            {avatarLetter ? (
              avatarLetter
            ) : (
              <Icon name="i:user" size="26px" />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {profile.name.trim() && (
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  marginBottom: '6px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('أهلاً', lang)}
                {lang === 'en' ? ', ' : '، '}
                <span style={{ color: 'var(--acc)' }} dir="auto">
                  {profile.name}
                </span>
              </div>
            )}
            <div
              className="sub"
              style={{ marginBottom: '4px', overflowWrap: 'anywhere' }}
            >
              {t('الحساب', lang)}
              {linkedList.length > 0 && (
                <>
                  :{' '}
                  <span dir="auto" style={{ color: 'var(--text)' }}>
                    {linkedList.join(' • ')}
                  </span>
                </>
              )}
            </div>
            <input
              style={{ width: '100%' }}
              placeholder={t('اسمك', lang)}
              value={profile.name}
              onChange={(e) =>
                onUpdateProfile({ ...profile, name: e.target.value })
              }
            />
          </div>
        </div>
        <div className="sub" style={{ marginTop: '10px' }}>
          {tasksCount} {t('مهمة', lang)} • {routinesCount} {t('روتين', lang)} &mdash;{' '}
          {t('بياناتك محفوظة على جهازك فقط.', lang)}
        </div>
      </div>

      {/* Settings list */}
      <div className="task">
        <b>{t('الإعدادات', lang)}</b>
        {row('font', 'i:pen', 'الخط')}
        {row('theme', 'i:palette', 'المظهر')}
        {row('notif', 'i:bell', 'الإشعارات')}
        {row('link', 'i:link', 'ربط')}
        {row('lang', 'i:globe', 'اللغة', lang === 'en' ? 'English' : 'العربية')}

        <div style={{ marginTop: '14px' }}>
          <button
            type="button"
            className="ghost"
            style={{ width: '100%' }}
            onClick={onReplayTour}
          >
            {t('إعادة الجولة التعريفية', lang)}
          </button>
        </div>
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            className="ghost"
            style={{ width: '100%', color: '#d33' }}
            onClick={onAskWipe}
          >
            {t('مسح جميع البيانات', lang)}
          </button>
        </div>
      </div>

      {/* Hadith Card */}
      <div className="task" style={{ textAlign: 'center' }}>
        <div className="sub" style={{ marginBottom: '8px' }}>
          {t('قال رسول الله صلى الله عليه وسلم', lang)}
        </div>
        <div
          style={{
            fontSize: '19px',
            fontWeight: 700,
            lineHeight: 1.7,
            color: 'var(--acc)',
          }}
        >
          &laquo;{t('أحب الأعمال إلى الله أدومها وإن قل', lang)}&raquo;
        </div>
        <div className="sub" style={{ marginTop: '10px' }}>
          {t('متفق عليه', lang)}
        </div>
      </div>

      {/* About Card */}
      <div className="task">
        <b>{t('عن التطبيق', lang)}</b>
        <div className="sub" style={{ marginTop: '8px' }}>
          {t('إنجازاتي', lang)} &mdash;{' '}
          {t(
            'تطبيق بسيط لتنظيم المهام والروتين اليومي ومتابعة إنجازك.',
            lang
          )}
        </div>
        <div className="sub" style={{ marginTop: '4px' }}>
          {t('الإصدار', lang)} 1.0
        </div>
      </div>
    </div>
  );
};
